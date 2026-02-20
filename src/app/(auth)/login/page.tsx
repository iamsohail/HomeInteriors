"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/providers/auth-provider";
import { signInWithGoogle } from "@/lib/firebase/auth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      router.replace("/dashboard");
    } catch (error) {
      console.error("Sign in failed:", error);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background overflow-hidden px-4">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-orange-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex size-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/15">
            <svg viewBox="0 0 24 24" className="size-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">HomeBase</h1>
            <p className="text-muted-foreground leading-relaxed">
              Plan, Track, and Manage your Home Interior Project from Start to Finish.
            </p>
          </div>
        </div>

        {/* Sign in */}
        <div className="w-full space-y-3">
          <Button
            onClick={handleSignIn}
            disabled={signingIn}
            variant="outline"
            size="lg"
            className="w-full h-12 text-[15px] font-medium"
          >
            {signingIn ? (
              <div className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <svg className="mr-2.5 size-[18px]" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Invite family members to collaborate in real-time.
          </p>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border/50">
          {[
            { value: "Expenses", desc: "Track every cost" },
            { value: "Timeline", desc: "15-phase planner" },
            { value: "Rooms", desc: "Room-by-room view" },
          ].map((item) => (
            <div key={item.value} className="text-center">
              <p className="text-sm font-semibold">{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
