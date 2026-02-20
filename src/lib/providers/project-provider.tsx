"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./auth-provider";
import type { Project } from "@/lib/types/project";

interface ProjectContextType {
  project: Project | null;
  projectId: string | null;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  projectId: null,
  loading: true,
});

const DEFAULT_PROJECT_ID = "vario-b1502";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setProject(null);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "projects", DEFAULT_PROJECT_ID),
      (snap) => {
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() } as Project);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsub;
  }, [user]);

  return (
    <ProjectContext.Provider value={{ project, projectId: DEFAULT_PROJECT_ID, loading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
