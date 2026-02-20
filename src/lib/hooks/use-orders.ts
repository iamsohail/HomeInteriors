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
import type { Order } from "@/lib/types/emi";

export function useOrders() {
  const { projectId } = useProject();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !projectId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "projects", projectId, "orders"),
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
  }, [projectId]);

  const addOrder = useCallback(
    async (data: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      if (!db || !projectId) return;
      await addDoc(collection(db, "projects", projectId, "orders"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const updateOrder = useCallback(
    async (id: string, data: Partial<Order>) => {
      if (!db || !projectId) return;
      await updateDoc(doc(db, "projects", projectId, "orders", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [projectId]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      if (!db || !projectId) return;
      await deleteDoc(doc(db, "projects", projectId, "orders", id));
    },
    [projectId]
  );

  const batchImportOrders = useCallback(
    async (items: Omit<Order, "id" | "createdAt" | "updatedAt">[]) => {
      if (!db || !projectId) return;
      const batch = writeBatch(db);
      const colRef = collection(db, "projects", projectId, "orders");
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
    [projectId]
  );

  return { orders, loading, addOrder, updateOrder, deleteOrder, batchImportOrders };
}
