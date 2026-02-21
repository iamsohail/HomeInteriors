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
import type { Room } from "@/lib/types/room";

export function useRooms() {
  const { projectId } = useProject();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !projectId) {
      setRooms([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "projects", projectId, "rooms"),
      orderBy("name", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Room[];
        setRooms(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [projectId]);

  const addRoom = useCallback(
    async (data: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
      if (!db || !projectId) return;
      await addDoc(collection(db, "projects", projectId, "rooms"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const updateRoom = useCallback(
    async (id: string, data: Partial<Room>) => {
      if (!db || !projectId) return;
      await updateDoc(doc(db, "projects", projectId, "rooms", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const deleteRoom = useCallback(
    async (id: string) => {
      if (!db || !projectId) return;
      await deleteDoc(doc(db, "projects", projectId, "rooms", id));
    },
    [projectId]
  );

  return { rooms, loading, addRoom, updateRoom, deleteRoom };
}
