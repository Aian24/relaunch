"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function StudioPortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@relaunch.us");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState("/studio/generate");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cb = params.get("callbackUrl");
      if (cb && cb.startsWith("/studio/") && cb !== "/studio/login") {
        setCallbackUrl(cb);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your Studio Portal email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/studio/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || "Sign-in failed. Please verify your credentials.");
        setIsSubmitting(false);
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("Network error while signing in. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090D16] text-white flex flex-col justify-between px-4 py-8">
      {/* Top Back Navigation */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6700]" />
          <span>Back to ReLaunch Studio</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12192A] border border-[#7F48ED]/40 text-[11px] font-mono text-zinc-200">
          <Lock className="w-3 h-3 text-[#FF6700]" />
          <span>Protected Studio Portal</span>
        </div>
      </div>

      {/* Centered Sign-In Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#111726] border border-zinc-800 border-t-4 border-t-[#FF6700] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <Image
                src="/logos/logo-compact-dark.png"
                alt="ReLaunch Logo"
                width={170}
                height={34}
                priority
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="pt-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#7F48ED]/20 border border-[#7F48ED]/40 text-[10px] font-mono uppercase tracking-widest text-[#C4B5FD] font-bold">
                Studio Portal
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white mt-2">
                Sign In to Studio Portal
              </h1>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Access Ad Generator, Review Queue, Brand Footage, Creators, and Master Tracks. Protected to prevent unauthorized API credit usage.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="studio-portal-email"
                className="block text-xs font-bold text-zinc-300 uppercase tracking-wider"
              >
                Portal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#FF6700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="studio-portal-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@relaunch.us"
                  className="w-full bg-[#090D16] border border-zinc-700 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="studio-portal-password"
                className="block text-xs font-bold text-zinc-300 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7F48ED] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="studio-portal-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter portal password"
                  className="w-full bg-[#090D16] border border-zinc-700 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-700 bg-[#090D16] text-[#7F48ED] focus:ring-[#7F48ED] cursor-pointer"
                />
                <span>Keep signed in (7 days)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#7F48ED] hover:bg-[#6D38D9] disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 border border-[#7F48ED] shadow-md transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Access...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF6700]" />
                  <span>Sign In to Studio Portal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Notice */}
      <div className="text-center text-[11px] text-zinc-500 font-mono">
        Rate-limited &amp; signed session security · ReLaunch Studio Portal
      </div>
    </div>
  );
}
