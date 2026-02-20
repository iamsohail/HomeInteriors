import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

export function projectCollection(projectId: string, subcollection: string) {
  if (!db) throw new Error("Firestore not initialized");
  return collection(db, "projects", projectId, subcollection);
}

export function projectDoc(projectId: string, subcollection: string, docId: string) {
  if (!db) throw new Error("Firestore not initialized");
  return doc(db, "projects", projectId, subcollection, docId);
}

export {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  db,
};

export type { DocumentData, QueryConstraint };
