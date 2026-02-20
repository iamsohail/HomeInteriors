import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not initialized");
  return signInWithPopup(auth, googleProvider);
}

export async function signOut() {
  if (!auth) throw new Error("Firebase not initialized");
  return firebaseSignOut(auth);
}
