"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface PortalUser {
  email: string;
  name: string;
  role: string;
}

interface NavItem {
  label: string;
  href: string;
  badge?: number;
  badgeClass?: string;
}

export default function StudioAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isClientShareView, setIsClientShareView] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isPublicOrLogin =
    pathname === "/studio" ||
    pathname === "/studio/" ||
    pathname === "/studio/login";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const clientView = pathname === "/studio/review" && params.get("clientView") === "true";
    setIsClientShareView(clientView);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    if (isPublicOrLogin || isClientShareView) return;

    let cancelled = false;
    fetch("/api/studio/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && data.user) {
          setPortalUser(data.user);
        }
      })
      .catch(() => { });

    fetch("/api/studio/review")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok) {
          setPendingCount(data.pendingCount ?? 0);
          setApprovedCount(data.realApprovedCount ?? data.approvedCount ?? 0);
        }
      })
      .catch(() => { });

    return () => {
      cancelled = true;
    };
  }, [pathname, isPublicOrLogin, isClientShareView]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch("/api/studio/auth/logout", { method: "POST" });
    } catch { }
    router.replace("/studio/login");
    router.refresh();
  };

  if (isPublicOrLogin || isClientShareView) {
    return <>{children}</>;
  }

  const navItems: NavItem[] = [
    {
      label: "Clients",
      href: "/studio/clients",
    },
    {
      label: "Generator",
      href: "/studio/generate",
    },
    {
      label: "Review Queue",
      href: "/studio/review",
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeClass: "bg-[#FF6700] text-white",
    },
    {
      label: "Approved Vault",
      href: "/studio/approved",
      badge: approvedCount > 0 ? approvedCount : undefined,
      badgeClass: "bg-[#7F48ED] text-white",
    },
    {
      label: "Creators",
      href: "/studio/creators",
    },
    {
      label: "Master Tracks",
      href: "/studio/tracks",
    },
    {
      label: "Trash",
      href: "/studio/deleted",
    },
  ];

  const isRouteActive = (href: string) => {
    if (href === "/studio") return pathname === "/studio";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#090D16]">
      {/* Top Studio Portal Navigation Bar (Text + Underline Active State, Zero Icons) */}
      <nav className="sticky top-0 z-50 w-full h-14 bg-[#0B111E] border-b border-zinc-800 text-white px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 select-none">
        {/* Left: Official Logo + Studio Portal Tag */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-8 h-8 rounded-lg bg-[#141D30] hover:bg-[#7F48ED] border border-zinc-800 flex items-center justify-center text-white cursor-pointer"
            aria-label="Toggle portal navigation"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/studio/clients" className="flex items-center shrink-0">
            <Image
              src="/logos/logo-compact-dark.png"
              alt="ReLaunch Logo"
              width={126}
              height={24}
              priority
              className="h-5 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Clean Text-Only Horizontal Navigation Links */}
        <div className="hidden xl:flex items-center gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold whitespace-nowrap transition ${active ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight ${active ? "bg-[#FF6700] text-white" : item.badgeClass || "bg-zinc-700 text-zinc-200"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-200 ${active
                    ? "bg-[#FF6700] opacity-100 scale-x-100"
                    : "bg-[#7F48ED] opacity-0 scale-x-0 group-hover:opacity-80 group-hover:scale-x-100"
                    }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right: Public Link, User Pill & Sign Out */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/studio"
            className="hidden md:inline-flex items-center h-8 px-3 rounded-lg bg-[#141D30] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold leading-none transition whitespace-nowrap"
            title="View Public Studio Page"
          >
            <span>Public Site</span>
          </Link>

          <div className="hidden 2xl:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#11192B] border border-zinc-800 text-[11px] font-mono leading-none text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#FF6700]" />
            <span>{portalUser?.email || "admin@relaunch.us"}</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center h-8 px-3 rounded-lg bg-[#FF6700] hover:bg-[#E55C00] border border-[#FF6700] hover:border-[#E55C00] text-white text-[11px] font-bold leading-none transition cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Dropdown Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#0B111E] border-b border-zinc-800 px-3 py-3 space-y-1.5 z-40">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {navItems.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold transition border-b-2 ${active
                    ? "text-white border-b-[#FF6700]"
                    : "text-zinc-400 hover:text-white border-b-transparent"
                    }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF6700] text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/studio"
              className="flex items-center px-3 py-2 rounded-lg text-xs font-bold bg-[#141D30] text-zinc-300 hover:text-white border border-zinc-800"
            >
              <span>Public Site</span>
            </Link>
          </div>
          <div className="pt-1 text-[10px] font-mono text-zinc-400 px-1">
            Signed in as {portalUser?.email || "admin@relaunch.us"}
          </div>
        </div>
      )}

      {/* Full-Width Active Studio Workstation */}
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
