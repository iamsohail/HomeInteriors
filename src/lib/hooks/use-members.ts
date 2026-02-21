"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProject } from "@/lib/providers/project-provider";
import { useAuth } from "@/lib/providers/auth-provider";
import { generateInviteCode } from "@/lib/utils";
import type { ProjectInvite } from "@/lib/types/project";

export interface MemberInfo {
  uid: string;
  isOwner: boolean;
}

export function useMembers() {
  const { projectId, project } = useProject();
  const { user } = useAuth();
  const [invites, setInvites] = useState<ProjectInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwner = project?.ownerId === user?.uid;
  const memberUids = project?.memberUids || [];

  // Listen to invites subcollection
  useEffect(() => {
    if (!db || !projectId) {
      setInvites([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "projects", projectId, "invites"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ProjectInvite[];
        setInvites(items);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsub;
  }, [projectId]);

  const inviteMember = useCallback(
    async (role: "editor" | "viewer"): Promise<string> => {
      if (!db || !projectId || !user) throw new Error("Not ready");

      const code = generateInviteCode();

      // Write invite to project subcollection
      const inviteRef = await addDoc(collection(db, "projects", projectId, "invites"), {
        code,
        role,
        invitedBy: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Write to top-level inviteCodes collection (doc ID = code for direct lookup)
      await setDoc(doc(db, "inviteCodes", code), {
        projectId,
        inviteId: inviteRef.id,
        role,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      return code;
    },
    [projectId, user]
  );

  const cancelInvite = useCallback(
    async (inviteId: string) => {
      if (!db || !projectId) return;
      const invite = invites.find((i) => i.id === inviteId);

      // Delete invite doc
      await deleteDoc(doc(db, "projects", projectId, "invites", inviteId));

      // Delete the invite code lookup doc
      if (invite?.code) {
        await deleteDoc(doc(db, "inviteCodes", invite.code));
      }
    },
    [projectId, invites]
  );

  const removeMember = useCallback(
    async (uid: string) => {
      if (!db || !projectId) return;
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "projects", projectId), {
        memberUids: arrayRemove(uid),
      });
    },
    [projectId]
  );

  const updateRole = useCallback(
    async (inviteId: string, role: "editor" | "viewer") => {
      if (!db || !projectId) return;
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "projects", projectId, "invites", inviteId), {
        role,
      });
    },
    [projectId]
  );

  return {
    memberUids,
    invites,
    loading,
    isOwner,
    inviteMember,
    cancelInvite,
    removeMember,
    updateRole,
  };
}
