import { auth, googleProvider, isFirebaseConfigured } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Memory listener list for sandbox fallback
const sandboxListeners: Array<(user: AppUser | null) => void> = [];

// Helper to fetch local mock user from LocalStorage
function getLocalMockUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("kolkata_alive_mock_user");
  if (!data) return null;
  try {
    return JSON.parse(data) as AppUser;
  } catch {
    return null;
  }
}

// Helper to save local mock user to LocalStorage
function saveLocalMockUser(user: AppUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("kolkata_alive_mock_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("kolkata_alive_mock_user");
  }
  // Notify listeners of the mock changes
  sandboxListeners.forEach((cb) => cb(user));
}

/**
 * Subscribes to real-time authentication changes.
 * Automatically handles modular Firebase SDK onAuthStateChanged or LocalStorage emulation.
 */
export function subscribeAuthState(callback: (user: AppUser | null) => void) {
  if (isFirebaseConfigured) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
        });
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  } else {
    sandboxListeners.push(callback);
    // Emit current state immediately
    const user = getLocalMockUser();
    callback(user);
    // Return unsubscribe function
    return () => {
      const idx = sandboxListeners.indexOf(callback);
      if (idx !== -1) sandboxListeners.splice(idx, 1);
    };
  }
}

/**
 * Registers a new user.
 */
export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<AppUser> {
  if (isFirebaseConfigured) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: fullName,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    };
  } else {
    const mockUser: AppUser = {
      uid: `mock-user-${Date.now()}`,
      email,
      displayName: fullName,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    };
    saveLocalMockUser(mockUser);
    return mockUser;
  }
}

/**
 * Logs in a user.
 */
export async function signInWithEmail(email: string, password: string): Promise<AppUser> {
  if (isFirebaseConfigured) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split("@")[0],
      photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    };
  } else {
    const mockUser: AppUser = {
      uid: `mock-user-login`,
      email,
      displayName: email.split("@")[0],
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    };
    saveLocalMockUser(mockUser);
    return mockUser;
  }
}

/**
 * Google Authentication Sign-In.
 */
export async function signInWithGoogle(): Promise<AppUser> {
  if (isFirebaseConfigured && googleProvider) {
    const credential = await signInWithPopup(auth, googleProvider);
    const user = credential.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Google Contributor",
      photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    };
  } else {
    const mockUser: AppUser = {
      uid: "mock-google-user",
      email: "visitor@google.com",
      displayName: "Heritage Visitor",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    };
    saveLocalMockUser(mockUser);
    return mockUser;
  }
}

/**
 * Signs out the current user.
 */
export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured) {
    await signOut(auth);
  } else {
    saveLocalMockUser(null);
  }
}
