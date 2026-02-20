"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProject } from "@/lib/providers/project-provider";
import type { Pin } from "@/lib/types/pin";

export function usePins() {
  const { projectId } = useProject();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !projectId) {
      setPins([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "projects", projectId, "pins"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Pin[];
        setPins(items);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsub;
  }, [projectId]);

  const addPin = useCallback(
    async (data: Omit<Pin, "id" | "createdAt" | "updatedAt">) => {
      if (!db || !projectId) return;
      await addDoc(collection(db, "projects", projectId, "pins"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const updatePin = useCallback(
    async (id: string, data: Partial<Pin>) => {
      if (!db || !projectId) return;
      await updateDoc(doc(db, "projects", projectId, "pins", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const deletePin = useCallback(
    async (id: string) => {
      if (!db || !projectId) return;
      await deleteDoc(doc(db, "projects", projectId, "pins", id));
    },
    [projectId]
  );

  return { pins, loading, addPin, updatePin, deletePin };
}
