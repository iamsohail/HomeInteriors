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
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProject } from "@/lib/providers/project-provider";
import type { Expense } from "@/lib/types/expense";

export function useExpenses() {
  const { projectId } = useProject();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !projectId) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "projects", projectId, "expenses"),
      orderBy("date", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Expense[];
        setExpenses(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [projectId]);

  const addExpense = useCallback(
    async (data: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
      if (!db || !projectId) return;
      await addDoc(collection(db, "projects", projectId, "expenses"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const updateExpense = useCallback(
    async (id: string, data: Partial<Expense>) => {
      if (!db || !projectId) return;
      await updateDoc(doc(db, "projects", projectId, "expenses", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!db || !projectId) return;
      await deleteDoc(doc(db, "projects", projectId, "expenses", id));
    },
    [projectId]
  );

  const batchImport = useCallback(
    async (items: Omit<Expense, "id" | "createdAt" | "updatedAt">[]) => {
      if (!db || !projectId) return;
      // Firestore batch limit is 500
      for (let i = 0; i < items.length; i += 499) {
        const batch = writeBatch(db);
        const chunk = items.slice(i, i + 499);
        const colRef = collection(db, "projects", projectId, "expenses");
        for (const item of chunk) {
          const docRef = doc(colRef);
          batch.set(docRef, {
            ...item,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        await batch.commit();
      }
    },
    [projectId]
  );

  return { expenses, loading, addExpense, updateExpense, deleteExpense, batchImport };
}
