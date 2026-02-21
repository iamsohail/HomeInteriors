"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/providers/auth-provider";
import {
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
  sendPasswordResetEmail,
  setAuthPersistence,
} from "@/lib/firebase/auth";
import { toast } from "sonner";

type AuthMode = "signin" | "signup" | "reset";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [busy, setBusy] = useState<false | "google" | "apple" | "email">(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSocial = async (provider: "google" | "apple") => {
    setBusy(provider);
    try {
      await setAuthPersistence(rememberMe);
      if (provider === "google") await signInWithGoogle();
      else await signInWithApple();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Sign in failed";
      if (!msg.includes("popup-closed")) toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setBusy("email");
    try {
      await setAuthPersistence(rememberMe);
      if (mode === "reset") {
        await sendPasswordResetEmail(email);
        toast.success("Password reset email sent. Check your inbox.");
        setMode("signin");
        setBusy(false);
        return;
      }
      if (mode === "signup") {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setBusy(false);
          return;
        }
        await signUpWithEmail(email, password, name || email.split("@")[0]);
      } else {
        await signInWithEmail(email, password);
      }
      // useEffect handles navigation when user state updates
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Authentication failed";
      if (msg.includes("user-not-found") || msg.includes("invalid-credential")) {
        toast.error("Invalid email or password");
      } else if (msg.includes("email-already-in-use")) {
        toast.error("An account with this email already exists. Try signing in.");
      } else if (msg.includes("weak-password")) {
        toast.error("Password is too weak. Use at least 6 characters.");
      } else if (msg.includes("invalid-email")) {
        toast.error("Please enter a valid email address");
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-black">
        <div className="size-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

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

      {/* Right-aligned dark frosted glass card */}
      <div className="relative z-10 ml-auto flex min-h-svh w-full items-center justify-center px-6 py-8 lg:w-[520px] lg:px-0 lg:pr-14 xl:w-[540px] xl:pr-20">
        <div
          className="w-full max-w-md rounded-2xl border border-white/20 bg-black/60 p-10 shadow-2xl shadow-black/30 backdrop-blur-2xl"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}
        >

          {/* Branding */}
          <div className="mb-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Home Base"
              width={110}
              height={110}
              className="mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to Home Base</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Plan, Track, and Manage your Home Interior Project from Start to Finish.
            </p>
            <p className="mt-1.5 text-xs font-medium text-white/65">
              Collaborate Seamlessly with Family & Contractors
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleSocial("google")}
              disabled={!!busy}
              variant="outline"
              className="h-11 flex-1 border-white/25 bg-white/15 text-sm font-medium text-white hover:bg-white/25 hover:text-white"
            >
              {busy === "google" ? <Spinner /> : (
                <>
                  <svg className="mr-2 size-[18px]" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </>
              )}
            </Button>
            <Button
              onClick={() => handleSocial("apple")}
              disabled={!!busy}
              variant="outline"
              className="h-11 flex-1 border-white/25 bg-white/15 text-sm font-medium text-white hover:bg-white/25 hover:text-white"
            >
              {busy === "apple" ? <Spinner /> : (
                <>
                  <svg className="mr-2 size-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Apple
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs text-white/60">or continue with email</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === "signup" && (
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-white/25 bg-white/15 text-sm text-white placeholder:text-white/55 focus-visible:ring-white/40"
                disabled={!!busy}
              />
            )}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 border-white/25 bg-white/15 text-sm text-white placeholder:text-white/50 focus-visible:ring-white/30"
              disabled={!!busy}
            />
            {mode !== "reset" && (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 border-white/20 bg-white/15 pr-11 text-sm text-white placeholder:text-white/50 focus-visible:ring-white/30"
                  disabled={!!busy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white/80"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            )}
            {mode !== "reset" && (
              <label className="flex items-center gap-2 py-0.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 rounded border-white/30 bg-white/15 accent-white"
                />
                <span className="text-xs text-white/60">Remember me</span>
              </label>
            )}
            <Button
              type="submit"
              disabled={!!busy}
              className="h-11 w-full text-sm font-semibold text-neutral-900 shadow-lg"
              style={{ background: "linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)", boxShadow: "0 4px 14px rgba(255,255,255,0.15)" }}
            >
              {busy === "email" ? (
                <Spinner />
              ) : mode === "reset" ? (
                "Send Reset Link"
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Mode switchers */}
          <div className="mt-5 flex items-center justify-center gap-4 text-xs">
            {mode === "signin" && (
              <>
                <button type="button" onClick={() => setMode("reset")} className="text-white/55 transition hover:text-white/80">
                  Forgot password?
                </button>
                <span className="size-1 rounded-full bg-white/20" />
                <button type="button" onClick={() => setMode("signup")} className="font-medium text-white/80 hover:text-white">
                  Create account
                </button>
              </>
            )}
            {mode === "signup" && (
              <button type="button" onClick={() => setMode("signin")} className="mx-auto font-medium text-white/80 hover:text-white">
                Already have an account? Sign in
              </button>
            )}
            {mode === "reset" && (
              <button type="button" onClick={() => setMode("signin")} className="mx-auto font-medium text-white/80 hover:text-white">
                Back to sign in
              </button>
            )}
          </div>

          {/* Value props */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="grid grid-cols-3 gap-4 text-center text-[11px] leading-snug text-white/70">
              <span>Track Every Expense with Clarity</span>
              <span>Plan Your Project Phase by Phase</span>
              <span>Visualize Progress Room by Room</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

function EyeIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
