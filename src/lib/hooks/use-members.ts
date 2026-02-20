"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProject } from "@/lib/providers/project-provider";
import { useAuth } from "@/lib/providers/auth-provider";
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
    async (email: string, role: "editor" | "viewer") => {
      if (!db || !projectId || !user) return;

      // Add to invites subcollection
      await addDoc(collection(db, "projects", projectId, "invites"), {
        email: email.toLowerCase().trim(),
        role,
        invitedBy: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Add email to project's pendingInvites array
      await updateDoc(doc(db, "projects", projectId), {
        pendingInvites: arrayUnion(email.toLowerCase().trim()),
      });
    },
    [projectId, user]
  );

  const cancelInvite = useCallback(
    async (inviteId: string) => {
      if (!db || !projectId) return;
      const invite = invites.find((i) => i.id === inviteId);
      await deleteDoc(doc(db, "projects", projectId, "invites", inviteId));

      if (invite) {
        await updateDoc(doc(db, "projects", projectId), {
          pendingInvites: arrayRemove(invite.email),
        });
      }
    },
    [projectId, invites]
  );

  const removeMember = useCallback(
    async (uid: string) => {
      if (!db || !projectId) return;
      await updateDoc(doc(db, "projects", projectId), {
        memberUids: arrayRemove(uid),
      });
    },
    [projectId]
  );

  const updateRole = useCallback(
    async (inviteId: string, role: "editor" | "viewer") => {
      if (!db || !projectId) return;
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
