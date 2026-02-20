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
import type { Order } from "@/lib/types/emi";

const PROJECT_ID = "vario-b1502";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "projects", PROJECT_ID, "orders"),
      orderBy("orderDate", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];
        setOrders(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const addOrder = useCallback(
    async (data: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      if (!db) return;
      await addDoc(collection(db, "projects", PROJECT_ID, "orders"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    []
  );

  const updateOrder = useCallback(
    async (id: string, data: Partial<Order>) => {
      if (!db) return;
      await updateDoc(doc(db, "projects", PROJECT_ID, "orders", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    []
  );

  const deleteOrder = useCallback(async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "projects", PROJECT_ID, "orders", id));
  }, []);

  const batchImportOrders = useCallback(
    async (items: Omit<Order, "id" | "createdAt" | "updatedAt">[]) => {
      if (!db) return;
      const batch = writeBatch(db);
      const colRef = collection(db, "projects", PROJECT_ID, "orders");
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

  return { orders, loading, addOrder, updateOrder, deleteOrder, batchImportOrders };
}
