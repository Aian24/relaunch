"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  LogOut,
  Users,
  Calendar,
  AlertCircle,
  RefreshCw,
  Palette,
  Type,
  Image as ImageIcon,
  FileText,
  Cpu,
  Settings,
  LayoutDashboard,
  Inbox,
  Shield,
} from "lucide-react";

// Pre-defined Custom Themes
interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  bg: string;
  sidebarBg: string;
  cardBg: string;
  tableBg: string;
  tableHeaderBg: string;
  border: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
}

const themePresets: Record<string, ThemeConfig> = {
  phoenixLight: {
    name: "Phoenix Pure Light (Default)",
    primary: "#C0622A",
    secondary: "#D97706",
    bg: "#F8FAFC",
    sidebarBg: "#FFFFFF",
    cardBg: "#FFFFFF",
    tableBg: "#FFFFFF",
    tableHeaderBg: "#FFF7ED",
    border: "#E2E8F0",
    cardBorder: "#E2E8F0",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#64748B",
    accent: "#10B981",
  },
  warmIvory: {
    name: "Warm Ivory & Amber",
    primary: "#C0622A",
    secondary: "#EA580C",
    bg: "#FAF8F5",
    sidebarBg: "#FFFFFF",
    cardBg: "#FFFFFF",
    tableBg: "#FFFDF9",
    tableHeaderBg: "#FEF3C7",
    border: "#FED7AA",
    cardBorder: "#FDBA74",
    textPrimary: "#1C1917",
    textSecondary: "#57534E",
    textMuted: "#78716C",
    accent: "#10B981",
  },
  phoenixDark: {
    name: "Phoenix Obsidian Dark",
    primary: "#C0622A",
    secondary: "#E88C52",
    bg: "#07090E",
    sidebarBg: "#0A0D14",
    cardBg: "#0E121B",
    tableBg: "#090C12",
    tableHeaderBg: "#121722",
    border: "#1E2638",
    cardBorder: "#252E42",
    textPrimary: "#FFFFFF",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    accent: "#10B981",
  },
  slateLight: {
    name: "Nordic Clean Slate",
    primary: "#2563EB",
    secondary: "#3B82F6",
    bg: "#F1F5F9",
    sidebarBg: "#FFFFFF",
    cardBg: "#FFFFFF",
    tableBg: "#FFFFFF",
    tableHeaderBg: "#E2E8F0",
    border: "#CBD5E1",
    cardBorder: "#CBD5E1",
    textPrimary: "#0F172A",
    textSecondary: "#334155",
    textMuted: "#64748B",
    accent: "#0EA5E9",
  },
};

type AdminTabId =
  | "dashboard"
  | "bookings"
  | "inbox"
  | "inquiries"
  | "colors"
  | "fonts"
  | "media"
  | "pages"
  | "ai-engine"
  | "settings";

interface UnderDevPageInfo {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const underDevPages: Record<AdminTabId, UnderDevPageInfo> = {
  dashboard: {
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Analytics overview, studio performance metrics, and pipeline insights are currently under development.",
  },
  bookings: {
    title: "Bookings & Calendar",
    icon: Calendar,
    description: "Calendar scheduler, strategy consultations, and automated meeting integrations are currently under development.",
  },
  inbox: {
    title: "Email Inbox",
    icon: Inbox,
    description: "Client email communication hub, quick dispatchers, and automated inquiry threads are currently under development.",
  },
  inquiries: {
    title: "All Client Leads",
    icon: Users,
    description: "Client leads database, CRM pipeline, and contact inquiries are currently under development.",
  },
  colors: {
    title: "Colors & Theme",
    icon: Palette,
    description: "Theme customizer, visual design tokens, and studio color presets are currently under development.",
  },
  fonts: {
    title: "Fonts & Typography",
    icon: Type,
    description: "Typography engine, font pairings, and responsive typography scales are currently under development.",
  },
  media: {
    title: "Media & Assets",
    icon: ImageIcon,
    description: "Asset library, media CDN uploaders, and video optimization tools are currently under development.",
  },
  pages: {
    title: "Pages & Content",
    icon: FileText,
    description: "Website route editor, page metadata studio, and dynamic content managers are currently under development.",
  },
  "ai-engine": {
    title: "AI Engine Settings",
    icon: Cpu,
    description: "Autonomous intake AI workflows, webhook integrations, and GEO citation dispatchers are currently under development.",
  },
  settings: {
    title: "Studio Settings",
    icon: Settings,
    description: "Studio organization profile, security controls, and operational parameters are currently under development.",
  },
};

export default function AdminPortal() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTabId>("dashboard");

  // Fully customizable Theme State (Default: White with Touch of Phoenix Orange)
  const [theme, setTheme] = useState<ThemeConfig>(themePresets.phoenixLight);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Check saved session & theme on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("relaunch_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    const savedTheme = localStorage.getItem("relaunch_admin_theme");
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.bg === "#07090E" || parsed.bg === "#090C12" || !parsed.name) {
          setTheme(themePresets.phoenixLight);
          localStorage.setItem("relaunch_admin_theme", JSON.stringify(themePresets.phoenixLight));
        } else {
          setTheme(parsed);
        }
      } catch {
        setTheme(themePresets.phoenixLight);
      }
    } else {
      setTheme(themePresets.phoenixLight);
    }

    setAuthLoading(false);
  }, []);

  // Save Theme
  const saveThemeConfig = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
    localStorage.setItem("relaunch_admin_theme", JSON.stringify(newTheme));
  };

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanEmail === "admin@relaunch.us" && cleanPass === "relaunch2026") {
        setIsAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem("relaunch_admin_auth", "true");
        }
        triggerToast("✓ Studio Security Session Verified. Welcome, Admin.");
      } else {
        setLoginError("Invalid credentials. Enter admin@relaunch.us and relaunch2026");
      }
      setIsLoggingIn(false);
    }, 450);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("relaunch_admin_auth");
    triggerToast("Logged out of Studio Console.");
  };

  // Quick Demo Autofill
  const fillDemoCredentials = () => {
    setEmail("admin@relaunch.us");
    setPassword("relaunch2026");
    setLoginError("");
  };

  // Sidebar link items
  const sidebarLinks: { id: AdminTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings & Calendar", icon: Calendar, badge: "5" },
    { id: "inbox", label: "Email Inbox", icon: Inbox, badge: "2" },
    { id: "inquiries", label: "All Client Leads", icon: Users },
    { id: "colors", label: "Colors & Theme", icon: Palette },
    { id: "fonts", label: "Fonts & Typography", icon: Type },
    { id: "media", label: "Media & Assets", icon: ImageIcon },
    { id: "pages", label: "Pages & Content", icon: FileText },
    { id: "ai-engine", label: "AI Engine Settings", icon: Cpu },
    { id: "settings", label: "Studio Settings", icon: Settings },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-white font-mono text-xs">
        <RefreshCw className="w-5 h-5 text-[#C0622A] animate-spin mr-2" />
        <span>AUTHENTICATING COMMAND SESSION...</span>
      </div>
    );
  }

  // 1. UNAUTHENTICATED: LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between relative overflow-hidden select-none px-4 py-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#C0622A]/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[350px] bg-[#E88C52]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Minimal Security Brand Bar */}
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
          <div className="relative h-8 w-36 flex items-center">
            <Image
              src="/logos/logo-compact-dark.png"
              alt="ReLaunch Logo"
              width={160}
              height={32}
              priority
              className="object-contain object-left h-7 w-auto brightness-110"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <Lock className="w-3 h-3 text-[#C0622A]" />
            <span>Studio Portal · Encrypted</span>
          </div>
        </div>

        {/* Center Glassmorphic Login Box */}
        <div className="max-w-md w-full mx-auto z-10 my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C0622A] to-transparent" />

            <div className="text-center mb-8">
              <div className="relative h-9 w-40 mx-auto mb-4 flex items-center justify-center">
                <Image
                  src="/logos/logo-compact-dark.png"
                  alt="ReLaunch Logo"
                  width={180}
                  height={36}
                  priority
                  className="object-contain h-8 w-auto brightness-110"
                />
              </div>
              <h1 className="font-heading font-black text-2xl text-white tracking-tight">Studio Administration</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Manage studio modules, pages, bookings &amp; theme settings.
              </p>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@relaunch.us"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/[0.12] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C0622A] focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-white/[0.06] border border-white/[0.12] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C0622A] focus:bg-white/[0.08] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-[#C0622A] focus:ring-0 focus:ring-offset-0 accent-[#C0622A]"
                  />
                  <span>Remember Session</span>
                </label>

                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[#E88C52] hover:text-[#C0622A] text-[11px] font-mono uppercase tracking-wider underline cursor-pointer"
                >
                  Fill Demo Access
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C0622A] to-[#E88C52] hover:from-[#a84f1d] hover:to-[#C0622A] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(192,98,42,0.4)] transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Security...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Studio Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="max-w-md mx-auto text-center text-slate-500 text-[11px] z-10 space-y-1">
          <p>256-Bit SSL Encrypted Console · Phoenix, Arizona</p>
          <p className="text-slate-600 text-[10px]">Restricted to authorized ReLaunch studio administrators.</p>
        </div>
      </main>
    );
  }

  // Active tab info
  const currentPage = underDevPages[activeTab];
  const ActiveIcon = currentPage.icon;

  // 2. AUTHENTICATED: DYNAMIC THEME ADMIN PORTAL
  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
      }}
      className="min-h-screen flex selection:bg-[#C0622A] selection:text-white transition-colors duration-300 font-sans"
    >
      {/* GLOBAL TOAST POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.primary,
              color: theme.textPrimary,
            }}
            className="fixed top-5 right-5 z-[100] px-4 py-3 rounded-2xl border text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl"
          >
            <Sparkles style={{ color: theme.secondary }} className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          backgroundColor: theme.sidebarBg,
          borderColor: theme.border,
        }}
        className="w-64 border-r flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen z-30 transition-colors duration-300"
      >
        <div className="p-5 overflow-y-auto scrollbar-none">
          {/* Official Logo */}
          <div className="relative h-8 w-36 mb-6 flex items-center">
            <Image
              src={theme.bg.startsWith("#0") || theme.bg.startsWith("#1") ? "/logos/logo-compact-dark.png" : "/logos/logo-compact.png"}
              alt="ReLaunch Logo"
              width={160}
              height={32}
              priority
              className="object-contain object-left h-7 w-auto"
            />
          </div>

          <div
            style={{ color: theme.textMuted }}
            className="text-[10px] font-mono uppercase tracking-widest font-bold mb-3 px-3"
          >
            Mission Control
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    backgroundColor: isActive ? theme.primary : "transparent",
                    color: isActive ? "#FFFFFF" : theme.textSecondary,
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    !isActive ? "hover:bg-slate-500/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        backgroundColor: isActive ? "rgba(255,255,255,0.25)" : `${theme.primary}25`,
                        color: isActive ? "#FFFFFF" : theme.secondary,
                      }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div
          style={{ borderColor: theme.border }}
          className="p-4 border-t flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: `${theme.primary}20`,
                borderColor: `${theme.primary}40`,
                color: theme.secondary,
              }}
              className="w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold font-mono"
            >
              AD
            </div>
            <div>
              <div style={{ color: theme.textPrimary }} className="text-xs font-bold leading-tight">
                Studio Admin
              </div>
              <div style={{ color: theme.textMuted }} className="text-[10px] font-mono">
                {theme.name.split(" ")[0]} Mode
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{ borderColor: theme.border, color: theme.textMuted }}
            className="p-1.5 rounded-lg border hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header
          style={{
            backgroundColor: `${theme.bg}E6`,
            borderColor: theme.border,
          }}
          className="sticky top-0 z-20 backdrop-blur-xl border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="md:hidden relative h-7 w-28 flex items-center">
              <Image
                src={theme.bg.startsWith("#0") || theme.bg.startsWith("#1") ? "/logos/logo-compact-dark.png" : "/logos/logo-compact.png"}
                alt="ReLaunch Logo"
                width={140}
                height={28}
                priority
                className="object-contain object-left h-6 w-auto"
              />
            </div>

            <h1 style={{ color: theme.textPrimary }} className="font-heading font-black text-lg tracking-tight hidden sm:block">
              {currentPage.title}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span
              style={{
                backgroundColor: `${theme.accent}15`,
                borderColor: `${theme.accent}30`,
                color: theme.accent,
              }}
              className="h-9 px-3.5 rounded-xl border text-xs font-mono font-bold uppercase inline-flex items-center gap-2"
            >
              <span style={{ backgroundColor: theme.accent }} className="w-2 h-2 rounded-full animate-pulse" />
              Live Sync
            </span>
          </div>
        </header>

        {/* Mobile Horizontal Subnav */}
        <div
          style={{
            backgroundColor: theme.sidebarBg,
            borderColor: theme.border,
          }}
          className="md:hidden flex items-center gap-1 p-2 border-b overflow-x-auto scrollbar-none"
        >
          {sidebarLinks.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  backgroundColor: isActive ? theme.primary : "transparent",
                  color: isActive ? "#FFFFFF" : theme.textSecondary,
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0"
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-white/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT: UNDER DEVELOPMENT DISPLAY */}
        <div className="p-4 sm:p-8 space-y-6 flex-1 flex items-center justify-center">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
            className="p-12 sm:p-16 rounded-3xl border text-center space-y-4 max-w-xl w-full mx-auto my-8 shadow-sm"
          >
            <div
              style={{
                backgroundColor: `${theme.primary}15`,
                borderColor: `${theme.primary}30`,
                color: theme.primary,
              }}
              className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto shadow-inner"
            >
              <ActiveIcon className="w-7 h-7" />
            </div>

            <div
              style={{
                backgroundColor: `${theme.primary}15`,
                borderColor: `${theme.primary}30`,
                color: theme.primary,
              }}
              className="h-7 px-3 rounded-lg border text-[10px] font-mono uppercase font-bold inline-flex items-center justify-center gap-1.5"
            >
              <span style={{ backgroundColor: theme.primary }} className="w-1.5 h-1.5 rounded-full animate-pulse" />
              Under Development
            </div>

            <h2 style={{ color: theme.textPrimary }} className="font-heading font-black text-2xl tracking-tight">
              {currentPage.title}
            </h2>

            <p style={{ color: theme.textSecondary }} className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {currentPage.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
