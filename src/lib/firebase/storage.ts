import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export async function uploadFile(path: string, file: File): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not initialized");
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  if (!storage) throw new Error("Firebase Storage not initialized");
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export { storage };
