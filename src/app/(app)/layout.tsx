"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CreateProjectDialog } from "@/components/shared/create-project-dialog";
import { PlacesAutocomplete, type PlaceResult } from "@/components/shared/places-autocomplete";
import { useAuth } from "@/lib/providers/auth-provider";
import { ProjectProvider, useProject, type CreateProjectInput } from "@/lib/providers/project-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BHK_TYPES, CITIES } from "@/lib/constants/apartment-types";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { toast } from "sonner";

// Map Google Places city names to our CITIES list
const CITY_ALIASES: Record<string, string> = {
  "Bengaluru": "Bangalore",
  "Bangalore": "Bangalore",
  "Mumbai": "Mumbai",
  "New Delhi": "Delhi NCR",
  "Delhi": "Delhi NCR",
  "Noida": "Delhi NCR",
  "Gurgaon": "Delhi NCR",
  "Gurugram": "Delhi NCR",
  "Ghaziabad": "Delhi NCR",
  "Faridabad": "Delhi NCR",
  "Hyderabad": "Hyderabad",
  "Chennai": "Chennai",
  "Pune": "Pune",
  "Kolkata": "Kolkata",
  "Ahmedabad": "Ahmedabad",
};

function matchCity(googleCity: string): string {
  return CITY_ALIASES[googleCity] || "Other";
}

const onboardingSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  city: z.string().min(1, "City is required"),
  bhkType: z.string().min(1, "Apartment type is required"),
  address: z.string(),
  expectedBudget: z.number().min(0).optional(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

function OnboardingPage() {
  const { createProject } = useProject();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [showWaiting, setShowWaiting] = useState(false);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", city: "", bhkType: "", address: "", expectedBudget: undefined },
  });

  const handlePlaceSelect = useCallback(
    (place: PlaceResult) => {
      form.setValue("address", place.address);
      if (place.city) {
        const mapped = matchCity(place.city);
        form.setValue("city", mapped);
        setSelectedCity(mapped);
      }
    },
    [form]
  );

  const handleSubmit = async (values: OnboardingValues) => {
    setCreating(true);
    try {
      await createProject(values as CreateProjectInput);
      toast.success("Project created! Let's get started.");
    } catch {
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative flex min-h-svh">
      {/* Full-screen hero image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-interior.png"
          alt="Modern luxury home interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Centered glassmorphism card */}
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center px-6 py-8">
        <div
          className="w-full max-w-md rounded-2xl border border-white/20 bg-black/60 p-10 shadow-2xl shadow-black/30 backdrop-blur-2xl"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Home Base"
              width={110}
              height={110}
              className="mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold tracking-tight text-white">Create Your Project</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Set up your home interior project to start tracking expenses, timelines, and more.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Project Name</label>
              <Input
                placeholder="My 3BHK Interiors"
                {...form.register("name")}
                className="h-11 border-white/25 bg-white/15 text-sm text-white placeholder:text-white/45 focus-visible:ring-white/40"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Apartment Type</label>
              <Select onValueChange={(v) => form.setValue("bhkType", v)}>
                <SelectTrigger className="h-11 border-white/25 bg-white/15 text-sm text-white data-[placeholder]:text-white/45 data-[state=open]:ring-white/40">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {BHK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.bhkType && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.bhkType.message}</p>
              )}
            </div>


            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                Expected Budget <span className="text-white/40">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/50">{getCurrencySymbol(selectedCity)}</span>
                <Input
                  type="number"
                  placeholder="e.g. 15,00,000"
                  {...form.register("expectedBudget", { valueAsNumber: true })}
                  className="h-11 border-white/25 bg-white/15 pl-7 text-sm text-white placeholder:text-white/45 focus-visible:ring-white/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                Address <span className="text-white/40">(optional)</span>
              </label>
              <PlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search your building or area..."
                className="h-11 border-white/25 bg-white/15 text-sm text-white placeholder:text-white/45 focus-visible:ring-white/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">City</label>
              <Select
                value={selectedCity}
                onValueChange={(v) => {
                  form.setValue("city", v);
                  setSelectedCity(v);
                }}
              >
                <SelectTrigger className="h-11 border-white/25 bg-white/15 text-sm text-white data-[placeholder]:text-white/45 data-[state=open]:ring-white/40">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.city && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.city.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={creating}
              className="mt-2 h-11 w-full text-sm font-semibold text-neutral-900 shadow-lg"
              style={{ background: "linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)", boxShadow: "0 4px 14px rgba(255,255,255,0.15)" }}
            >
              {creating ? (
                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Create Project"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowWaiting(true)}
              className="text-xs text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors"
            >
              Were you invited by a family member?
            </button>
          </div>

          {showWaiting && (
            <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-4 text-center space-y-2">
              <p className="text-sm text-white/80">
                Signed in as <span className="font-medium text-white">{user?.email}</span>
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Ask the project owner to invite this email from
                <span className="font-medium text-white/70"> Settings &rarr; Members &rarr; Invite</span>.
                Once invited, refresh this page and you&apos;ll be added automatically.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2 border-white/20 bg-white/10 text-white text-xs hover:bg-white/20"
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { projects, project, loading } = useProject();
  const [showCreate, setShowCreate] = useState(false);

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

  // No project — show onboarding with option to wait for invite
  if (!project || projects.length === 0) {
    return <OnboardingPage />;
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
