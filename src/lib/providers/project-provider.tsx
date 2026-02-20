"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  collection,
  collectionGroup,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./auth-provider";
import type { Project } from "@/lib/types/project";
import { DEFAULT_BUDGET_ALLOCATIONS } from "@/lib/constants/categories";
import { ROOMS_BY_BHK, BUDGET_RANGES } from "@/lib/constants/apartment-types";

interface ProjectContextType {
  projects: Project[];
  project: Project | null;
  projectId: string | null;
  loading: boolean;
  selectProject: (id: string) => void;
  createProject: (data: CreateProjectInput) => Promise<string>;
}

export interface CreateProjectInput {
  name: string;
  city: string;
  bhkType: string;
  address?: string;
  expectedBudget?: number;
  budgetMin?: number;
  budgetMax?: number;
  rooms?: string[];
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  project: null,
  projectId: null,
  loading: true,
  selectProject: () => {},
  createProject: async () => "",
});

const STORAGE_KEY = "homebase_active_project";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [invitesChecked, setInvitesChecked] = useState(false);
  const loading = !projectsLoaded || !invitesChecked;

  // Load saved project ID from localStorage
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) setActiveId(saved);
  }, []);

  // Listen to user's projects
  useEffect(() => {
    if (!user || !db) {
      setProjects([]);
      setProjectsLoaded(true);
      setInvitesChecked(true);
      return;
    }

    const q = query(
      collection(db, "projects"),
      where("memberUids", "array-contains", user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Project[];
        setProjects(items);

        // Auto-select first project if none selected or if selected one no longer exists
        if (items.length > 0) {
          const savedId = localStorage.getItem(STORAGE_KEY);
          const exists = items.find((p) => p.id === savedId);
          if (!exists) {
            setActiveId(items[0].id);
            localStorage.setItem(STORAGE_KEY, items[0].id);
          }
        }

        setProjectsLoaded(true);
      },
      () => setProjectsLoaded(true)
    );

    return unsub;
  }, [user]);

  // Auto-accept pending invites for this user's email
  useEffect(() => {
    if (!user?.email || !db) {
      setInvitesChecked(true);
      return;
    }

    const acceptInvites = async () => {
      try {
        const q = query(
          collectionGroup(db!, "invites"),
          where("email", "==", user.email!.toLowerCase()),
          where("status", "==", "pending")
        );
        const snap = await getDocs(q);

        for (const inviteDoc of snap.docs) {
          const projectRef = inviteDoc.ref.parent.parent;
          if (!projectRef) continue;

          await updateDoc(projectRef, {
            memberUids: arrayUnion(user.uid),
            pendingInvites: arrayRemove(user.email!.toLowerCase()),
          });

          await updateDoc(inviteDoc.ref, { status: "accepted" });
        }
      } catch {
        // Silently handle — will retry on next login
      } finally {
        setInvitesChecked(true);
      }
    };

    acceptInvites();
  }, [user]);

  const selectProject = useCallback((id: string) => {
    setActiveId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const createProject = useCallback(
    async (data: CreateProjectInput): Promise<string> => {
      if (!db || !user) throw new Error("Not authenticated");

      const bhk = data.bhkType || "3 BHK";
      const defaults = BUDGET_RANGES[bhk] || BUDGET_RANGES["3 BHK"];
      const rooms = data.rooms || ROOMS_BY_BHK[bhk] || ROOMS_BY_BHK["3 BHK"];

      const docRef = await addDoc(collection(db, "projects"), {
        name: data.name,
        description: `${bhk} interior project`,
        city: data.city,
        bhkType: bhk,
        address: data.address || "",
        rooms,
        expectedBudget: data.expectedBudget || 0,
        budgetMin: data.budgetMin || defaults.min,
        budgetMax: data.budgetMax || defaults.max,
        budgetAllocations: Object.entries(DEFAULT_BUDGET_ALLOCATIONS).map(
          ([category, allocated]) => ({ category, allocated, spent: 0 })
        ),
        memberUids: [user.uid],
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setActiveId(docRef.id);
      localStorage.setItem(STORAGE_KEY, docRef.id);
      return docRef.id;
    },
    [user]
  );

  const project = projects.find((p) => p.id === activeId) || null;

  return (
    <ProjectContext.Provider
      value={{
        projects,
        project,
        projectId: activeId,
        loading,
        selectProject,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
