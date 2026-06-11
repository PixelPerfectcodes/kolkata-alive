import { db, isFirebaseConfigured, sandboxStore } from "./firebase";
import { mockMemories, Memory } from "./mockData";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  increment,
  writeBatch
} from "firebase/firestore";

// Helper to seed Firestore if empty
let isSeeded = false;
export async function seedFirestoreIfEmpty() {
  if (!isFirebaseConfigured || isSeeded) return;
  try {
    const memoriesRef = collection(db, "memories");
    const snapshot = await getDocs(query(memoriesRef, limit(1)));
    if (snapshot.empty) {
      console.log("Firestore memories collection is empty. Auto-seeding default heritage memoirs...");
      
      const batch = writeBatch(db);
      
      // Seed public approved memories
      mockMemories.forEach((mem) => {
        const docRef = doc(memoriesRef, mem.id);
        batch.set(docRef, {
          title: mem.title,
          story: mem.story,
          userName: mem.userName,
          userAvatar: mem.userAvatar,
          photoUrl: mem.photoUrl,
          likesCount: mem.likesCount,
          commentsCount: mem.commentsCount,
          createdAt: mem.createdAt,
          locationId: mem.locationId || "",
          status: "approved"
        });
      });

      // Seed pending memories for admin dashboard Curation moderation
      const pendingMemories = [
        {
          id: "pending-1",
          title: "My grandfather's physical box of tram tickets (1950)",
          story: "My dadaji has preserved an iron tobacco tin filled with hundreds of paper tramway tickets from the 1950s. The paper is extremely fragile and brown, but you can read the route coordinates: Esplanade, Nonapukur, Kidderpore, Kalighat. Each ticket displays the emblem of the Calcutta Tramways Company Limited. We are cataloging these tickets digitally soon.",
          userName: "Bikram Roy",
          userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          photoUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=300",
          likesCount: 0,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          locationId: "",
          status: "pending"
        },
        {
          id: "pending-2",
          title: "Monsoon tea gatherings at Paramount Sherbets",
          story: "I remember visiting Paramount at College Street back in the Naxalite era of 1971. Even with protests outside, the high wooden ceilings and stuffed deer heads inside felt like a separate sanctuary. We ordered the famous 'Dab Sherbet' (coconut milk sherbet) and debated Nabarun Bhattacharya's new poems in low whispers. Paramount was an oasis of sweetness in a burning city.",
          userName: "Keya Bose",
          userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
          photoUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300",
          likesCount: 0,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          locationId: "college-street",
          status: "pending"
        }
      ];

      pendingMemories.forEach((mem) => {
        const docRef = doc(memoriesRef, mem.id);
        batch.set(docRef, mem);
      });

      await batch.commit();
      console.log("Firestore successfully auto-seeded with default records.");
    }
    isSeeded = true;
  } catch (error) {
    console.error("Error auto-seeding Firestore:", error);
  }
}

/**
 * Subscribes to memories dynamically with filters.
 * Switches automatically between active Firestore and local memory sandbox.
 */
export function subscribeMemories(
  callback: (memories: Memory[]) => void,
  options?: { status?: "approved" | "pending" | "rejected" | "all"; locationId?: string }
) {
  const status = options?.status ?? "approved";
  const locationId = options?.locationId;

  if (isFirebaseConfigured) {
    // Trigger auto-seeding asynchronously in the background
    seedFirestoreIfEmpty();

    const memoriesRef = collection(db, "memories");
    let q = query(memoriesRef);

    if (status !== "all") {
      q = query(q, where("status", "==", status));
    }

    if (locationId) {
      q = query(q, where("locationId", "==", locationId));
    }

    q = query(q, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const memories: Memory[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          memories.push({
            id: docSnap.id,
            title: data.title || "",
            story: data.story || "",
            userName: data.userName || "",
            userAvatar: data.userAvatar || "",
            photoUrl: data.photoUrl || "",
            likesCount: data.likesCount || 0,
            commentsCount: data.commentsCount || 0,
            createdAt: data.createdAt || new Date().toISOString(),
            locationId: data.locationId || "",
            status: data.status || "approved",
          } as Memory);
        });
        callback(memories);
      },
      (error) => {
        console.error("Firestore onSnapshot subscription failed, falling back to sandbox:", error);
        fallbackSandboxSubscribe(callback, status, locationId);
      }
    );

    return unsubscribe;
  } else {
    return fallbackSandboxSubscribe(callback, status, locationId);
  }
}

function fallbackSandboxSubscribe(
  callback: (memories: Memory[]) => void,
  status: string,
  locationId?: string
) {
  return sandboxStore.subscribe("memories", (allDocs) => {
    let filtered = allDocs;
    if (status !== "all") {
      filtered = allDocs.filter((doc) => {
        const isPending = doc.id.startsWith("pending") || doc.status === "pending";
        if (status === "pending") return isPending;
        if (status === "approved") return !isPending && doc.status !== "rejected";
        if (status === "rejected") return doc.status === "rejected";
        return true;
      });
    }
    if (locationId) {
      filtered = filtered.filter((doc) => doc.locationId === locationId || (locationId === "college-street" && !doc.locationId));
    }
    callback(filtered);
  });
}

/**
 * Adds a new memoir or comment.
 */
export async function addMemory(memory: Omit<Memory, "id" | "createdAt"> & { locationId?: string; status?: "approved" | "pending" }) {
  const newMemoryData = {
    title: memory.title,
    story: memory.story,
    userName: memory.userName,
    userAvatar: memory.userAvatar,
    photoUrl: memory.photoUrl,
    likesCount: memory.likesCount || 0,
    commentsCount: memory.commentsCount || 0,
    createdAt: new Date().toISOString(),
    locationId: memory.locationId || "",
    status: memory.status || "approved",
  };

  if (isFirebaseConfigured) {
    try {
      const memoriesRef = collection(db, "memories");
      const docRef = await addDoc(memoriesRef, newMemoryData);
      return { id: docRef.id, ...newMemoryData } as Memory;
    } catch (error) {
      console.error("Failed to add memory to Firestore, falling back:", error);
      return await sandboxStore.add("memories", newMemoryData);
    }
  } else {
    return await sandboxStore.add("memories", newMemoryData);
  }
}

/**
 * Loves/Likes a memory by incrementing its count.
 */
export async function likeMemory(id: string) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, "memories", id);
      await updateDoc(docRef, {
        likesCount: increment(1)
      });
      return true;
    } catch (error) {
      console.error("Failed to like memory in Firestore, falling back:", error);
      return fallbackSandboxLike(id);
    }
  } else {
    return fallbackSandboxLike(id);
  }
}

async function fallbackSandboxLike(id: string) {
  const list = sandboxStore.data.get("memories") || [];
  const mem = list.find((m) => m.id === id);
  if (mem) {
    await sandboxStore.update("memories", id, { likesCount: (mem.likesCount || 0) + 1 });
  }
  return true;
}

/**
 * Curation updates (approving/rejecting).
 */
export async function updateMemoryStatus(id: string, status: "approved" | "rejected") {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, "memories", id);
      if (status === "rejected") {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, {
          status: "approved"
        });
      }
      return true;
    } catch (error) {
      console.error("Failed to update status in Firestore, falling back:", error);
      return fallbackSandboxUpdateStatus(id, status);
    }
  } else {
    return fallbackSandboxUpdateStatus(id, status);
  }
}

async function fallbackSandboxUpdateStatus(id: string, status: "approved" | "rejected") {
  if (status === "rejected") {
    const list = sandboxStore.data.get("memories") || [];
    sandboxStore.data.set("memories", list.filter((m) => m.id !== id));
    sandboxStore.notify("memories");
  } else {
    await sandboxStore.update("memories", id, { status: "approved" });
  }
  return true;
}

/**
 * Server-side RAG getter. Returns approved memories.
 */
export async function fetchApprovedMemories(): Promise<Memory[]> {
  if (isFirebaseConfigured) {
    try {
      await seedFirestoreIfEmpty();
      const memoriesRef = collection(db, "memories");
      const q = query(memoriesRef, where("status", "==", "approved"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const memories: Memory[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        memories.push({
          id: docSnap.id,
          title: data.title || "",
          story: data.story || "",
          userName: data.userName || "",
          userAvatar: data.userAvatar || "",
          photoUrl: data.photoUrl || "",
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          createdAt: data.createdAt || new Date().toISOString(),
          locationId: data.locationId || "",
          status: data.status || "approved",
        } as Memory);
      });
      return memories;
    } catch (error) {
      console.error("Failed to fetch memories for RAG API, falling back:", error);
      return mockMemories;
    }
  } else {
    return mockMemories;
  }
}
