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
import type { Task } from "@/lib/types/task";

export function useTasks() {
  const { projectId } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "projects", projectId, "tasks"),
      orderBy("phaseOrder", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Task[];
        setTasks(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [projectId]);

  const addTask = useCallback(
    async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (!db || !projectId) return;
      await addDoc(collection(db, "projects", projectId, "tasks"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const updateTask = useCallback(
    async (id: string, data: Partial<Task>) => {
      if (!db || !projectId) return;
      await updateDoc(doc(db, "projects", projectId, "tasks", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!db || !projectId) return;
      await deleteDoc(doc(db, "projects", projectId, "tasks", id));
    },
    [projectId]
  );

  return { tasks, loading, addTask, updateTask, deleteTask };
}
