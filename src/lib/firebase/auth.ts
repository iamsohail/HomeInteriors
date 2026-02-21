import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signOut as firebaseSignOut,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not initialized");
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithApple() {
  if (!auth) throw new Error("Firebase not initialized");
  return signInWithPopup(auth, appleProvider);
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) throw new Error("Firebase not initialized");
  return firebaseSignInWithEmail(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  if (!auth) throw new Error("Firebase not initialized");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result;
}

export async function sendPasswordResetEmail(email: string) {
  if (!auth) throw new Error("Firebase not initialized");
  return firebaseSendPasswordResetEmail(auth, email);
}

export async function signOut() {
  if (!auth) throw new Error("Firebase not initialized");
  return firebaseSignOut(auth);
}

export async function setAuthPersistence(rememberMe: boolean) {
  if (!auth) throw new Error("Firebase not initialized");
  return setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence
  );
}
