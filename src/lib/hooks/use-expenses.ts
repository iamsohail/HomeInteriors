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
import type { Expense } from "@/lib/types/expense";

const PROJECT_ID = "vario-b1502";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "projects", PROJECT_ID, "expenses"),
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
  }, []);

  const addExpense = useCallback(
    async (data: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
      if (!db) return;
      await addDoc(collection(db, "projects", PROJECT_ID, "expenses"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    []
  );

  const updateExpense = useCallback(
    async (id: string, data: Partial<Expense>) => {
      if (!db) return;
      await updateDoc(doc(db, "projects", PROJECT_ID, "expenses", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    []
  );

  const deleteExpense = useCallback(async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "projects", PROJECT_ID, "expenses", id));
  }, []);

  const batchImport = useCallback(
    async (items: Omit<Expense, "id" | "createdAt" | "updatedAt">[]) => {
      if (!db) return;
      const batch = writeBatch(db);
      const colRef = collection(db, "projects", PROJECT_ID, "expenses");
      for (const item of items) {
        const docRef = doc(colRef);
        batch.set(docRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    },
    []
  );

  return { expenses, loading, addExpense, updateExpense, deleteExpense, batchImport };
}
