import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if credentials exist, otherwise activate the real-time simulation sandbox
export const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app;
let auth: any;
let db: any;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Failed to initialize Firebase App. Activating sandbox engine.", error);
  }
}

export { auth, db };
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

// ==========================================
// REAL-TIME SIMULATION SANDBOX ENGINE (FALLBACK)
// ==========================================
// This mirrors Firebase's collection, addDoc, onSnapshot, onAuthStateChanged,
// and signIn hooks inside an in-memory client database so the app works instantly!
class SandboxStore {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  public data: Map<string, any[]> = new Map();

  constructor() {
    // Seed database
    this.data.set("memories", [
      {
        id: "mem-1",
        title: "Monsoon Tram Ride (1989)",
        story: "Running through the puddles of College Street... hearing the 'tring-tring' chug of the approaching tram. damp jute sparks, 20-paise ticket, absolute bliss.",
        userName: "Soumitra Chatterjee (Elder)",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
        photoUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=300",
        likesCount: 142,
        commentsCount: 18,
        createdAt: new Date().toISOString(),
        status: "approved",
      },
      {
        id: "mem-2",
        title: "Debates at Paramount Sherbets",
        story: "Discussing French New Wave cinema and Sunil Gangopadhyay's poetry at Paramount. The stuffed deer heads, the cold Dab Sherbet, pure nostalgic renaissance.",
        userName: "Ananya Sen",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
        photoUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300",
        likesCount: 98,
        commentsCount: 12,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: "approved",
      }
    ]);
    this.data.set("comments", []);
  }

  // Subscribe to real-time updates
  subscribe(collectionName: string, callback: (docs: any[]) => void) {
    if (!this.listeners.has(collectionName)) {
      this.listeners.set(collectionName, []);
    }
    this.listeners.get(collectionName)!.push(callback);
    
    // Initial emit
    callback(this.data.get(collectionName) || []);

    // Return unsubscribe function
    return () => {
      const list = this.listeners.get(collectionName) || [];
      this.listeners.set(collectionName, list.filter((cb) => cb !== callback));
    };
  }

  // Add document and notify active listeners in real-time
  async add(collectionName: string, doc: any) {
    const list = this.data.get(collectionName) || [];
    const newDoc = { id: `doc-${Date.now()}`, ...doc, createdAt: new Date().toISOString() };
    this.data.set(collectionName, [newDoc, ...list]);
    this.notify(collectionName);
    return newDoc;
  }

  // Update existing document properties (likes, approvals, rejections)
  async update(collectionName: string, docId: string, updates: any) {
    const list = this.data.get(collectionName) || [];
    this.data.set(
      collectionName,
      list.map((item) => (item.id === docId ? { ...item, ...updates } : item))
    );
    this.notify(collectionName);
  }

  public notify(collectionName: string) {
    const list = this.data.get(collectionName) || [];
    const callbacks = this.listeners.get(collectionName) || [];
    callbacks.forEach((cb) => cb(list));
  }
}

export const sandboxStore = new SandboxStore();
