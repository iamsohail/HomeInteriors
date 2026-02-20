"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CreateProjectDialog } from "@/components/shared/create-project-dialog";
import { useAuth } from "@/lib/providers/auth-provider";
import { ProjectProvider, useProject } from "@/lib/providers/project-provider";

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { projects, project, loading } = useProject();
  const [showCreate, setShowCreate] = useState(false);

  // Show create dialog automatically if user has no projects
  useEffect(() => {
    if (!loading && projects.length === 0) {
      setShowCreate(true);
    }
  }, [loading, projects.length]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading project...</span>
        </div>
      </div>
    );
  }

  // No project selected — show onboarding
  if (!project) {
    return (
      <div className="flex min-h-svh items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Plus className="size-8" />
          </div>
          <h2 className="text-xl font-semibold">Create your first project</h2>
          <p className="text-muted-foreground text-sm">
            Set up your home interior project to start tracking expenses, timelines, and more.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </button>
          <CreateProjectDialog open={showCreate} onOpenChange={setShowCreate} />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col pb-16 md:pb-0">
          {children}
        </div>
      </SidebarInset>
      <MobileNav />
      <CreateProjectDialog open={showCreate} onOpenChange={setShowCreate} />
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProjectProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </ProjectProvider>
  );
}
