"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Film,
  Video,
  Sparkles,
  ArrowRight,
  Clock,
  FlaskConical,
  Building2,
  X,
  CheckCircle2,
  FolderOpen,
  Link2,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import type { ClientStatus, ClientSummary } from "@/types/client";
import StudioPagination, { usePagination } from "@/components/studio/StudioPagination";

const STATUS_BADGE: Record<ClientStatus, string> = {
  active: "bg-purple-50 text-[#7F48ED] border-[#7F48ED]/30",
  prospect: "bg-orange-50 text-[#FF6700] border-[#FF6700]/30",
  paused: "bg-zinc-100 text-zinc-600 border-zinc-200",
  archived: "bg-red-50 text-red-600 border-red-200",
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function StudioClientsDashboardPage() {
  const router = useRouter();
  const [space, setSpace] = useState<"clients" | "samples">("clients");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<"all" | "raw" | "clips" | "review" | "approved">("all");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "footage" | "ads">("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Add Client Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState<ClientStatus>("active");
  const [newCategory, setNewCategory] = useState("");
  const [newOffer, setNewOffer] = useState("");
  const [newAudience, setNewAudience] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newIsSample, setNewIsSample] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        space,
        status: statusFilter,
        search: searchQuery,
      });
      const res = await fetch(`/api/studio/clients?${params.toString()}`);
      const data = await res.json();
      if (data?.ok) {
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoading(false);
    }
  }, [space, statusFilter, searchQuery]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleQuickStatusChange = async (clientId: string, nextStatus: ClientStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, status: nextStatus } : c))
    );
    try {
      const res = await fetch(`/api/studio/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(`Updated status to ${nextStatus.toUpperCase()}`);
      } else {
        loadClients();
      }
    } catch {
      loadClients();
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError("Client name is required.");
      return;
    }
    setIsCreating(true);
    setFormError(null);
    try {
      const res = await fetch("/api/studio/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          status: newStatus,
          contactName: newContactName.trim(),
          contactEmail: newContactEmail.trim(),
          website: newWebsite.trim(),
          isSample: newIsSample,
          brandProfile: {
            category: newCategory.trim() || "General",
            offerPromo: newOffer.trim(),
            targetAudience: newAudience.trim(),
            website: newWebsite.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFormError(data.error || "Could not create client");
        setIsCreating(false);
        return;
      }
      setShowAddModal(false);
      router.push(`/studio/clients/${data.client.id}`);
    } catch {
      setFormError("Network error creating client.");
      setIsCreating(false);
    }
  };

  const sortedClients = useMemo(() => {
    let arr = [...clients];
    if (quickFilter === "raw") {
      arr = arr.filter((c) => c.rawFootageCount > 0);
    } else if (quickFilter === "clips") {
      arr = arr.filter((c) => c.clipCount + c.mediaAssetCount > 0);
    } else if (quickFilter === "review") {
      arr = arr.filter((c) => c.adsCount.inReview > 0);
    } else if (quickFilter === "approved") {
      arr = arr.filter((c) => c.adsCount.approved + c.adsCount.delivered > 0);
    }

    if (sortBy === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "footage") {
      arr.sort(
        (a, b) =>
          b.clipCount + b.mediaAssetCount + b.rawFootageCount -
          (a.clipCount + a.mediaAssetCount + a.rawFootageCount)
      );
    } else if (sortBy === "ads") {
      arr.sort((a, b) => b.adsCount.total - a.adsCount.total);
    } else {
      arr.sort(
        (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      );
    }
    return arr;
  }, [clients, sortBy, quickFilter]);

  const clientsPagination = usePagination(sortedClients, 8, [8, 12, 24, 48]);

  const totals = useMemo(() => {
    return clients.reduce(
      (acc, c) => {
        acc.raw += c.rawFootageCount;
        acc.clips += c.clipCount + c.mediaAssetCount;
        acc.inReview += c.adsCount.inReview;
        acc.approved += c.adsCount.approved + c.adsCount.delivered;
        return acc;
      },
      { raw: 0, clips: 0, inReview: 0, approved: 0 }
    );
  }, [clients]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1E1B2E] flex flex-col font-sans selection:bg-[#7F48ED]/20 selection:text-[#7F48ED]">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#7F48ED] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl border border-purple-400">
          {toast}
        </div>
      )}

      {/* Full-Width Top Header Bar (Matches Creators, Review & Vault) */}
      <header className="h-14 border-b border-zinc-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-14 z-30 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs sm:text-sm font-black tracking-tight uppercase whitespace-nowrap truncate">
            <span className="hidden xs:inline text-zinc-800">ReLaunch Studio </span>
            <span className="text-[#FF6700]">Clients</span>
            <span className="text-[#7F48ED] hidden sm:inline"> &amp; Workspaces</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7F48ED] border border-[#7F48ED]/30 text-[10px] font-bold uppercase tracking-wider shrink-0">
            {clients.length} {space === "clients" ? "Clients" : "Samples"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex p-0.5 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              type="button"
              onClick={() => setSpace("clients")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                space === "clients"
                  ? "bg-[#7F48ED] text-white shadow-xs"
                  : "text-zinc-600 hover:text-[#7F48ED]"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clients</span>
            </button>
            <button
              type="button"
              onClick={() => setSpace("samples")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                space === "samples"
                  ? "bg-[#7F48ED] text-white shadow-xs"
                  : "text-zinc-600 hover:text-[#7F48ED]"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Samples / Concept</span>
              <span className="sm:hidden">Samples</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewIsSample(space === "samples");
              setFormError(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </header>

      {/* Full-Width Main Workspace */}
      <main className="flex-1 w-full p-3 sm:p-4 lg:p-5 space-y-4">
        {/* Compact Unified Header + Interactive KPI Pills + Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-3.5 sm:p-4 shadow-sm space-y-3">
          {/* Row 1: Title + Compact Single-Line Interactive KPI Pills */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
                {space === "clients" ? "Clients & Active Projects" : "Samples / Concept Sandbox"}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-[#FF6700]/30 text-[10px] font-bold uppercase tracking-wider">
                {space === "clients" ? "Client-First Hub" : "Non-Deliverable"}
              </span>
            </div>

            {/* Space-Saver Single-Line Interactive Stat Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setQuickFilter(quickFilter === "raw" ? "all" : "raw")}
                className={`h-8 px-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                  quickFilter === "raw"
                    ? "bg-[#7F48ED] text-white border-[#7F48ED]"
                    : "bg-purple-50 text-[#7F48ED] border-[#7F48ED]/25 hover:border-[#7F48ED]"
                }`}
                title="Filter clients with raw uploads"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Raw Uploads</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    quickFilter === "raw" ? "bg-white text-[#7F48ED]" : "bg-[#7F48ED] text-white"
                  }`}
                >
                  {totals.raw}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setQuickFilter(quickFilter === "clips" ? "all" : "clips")}
                className={`h-8 px-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                  quickFilter === "clips"
                    ? "bg-[#FF6700] text-white border-[#FF6700]"
                    : "bg-orange-50 text-[#FF6700] border-[#FF6700]/25 hover:border-[#FF6700]"
                }`}
                title="Filter clients with scene clips"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Scene Clips</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    quickFilter === "clips" ? "bg-white text-[#FF6700]" : "bg-[#FF6700] text-white"
                  }`}
                >
                  {totals.clips}
                </span>
              </button>

              <div className="inline-flex items-center rounded-xl border border-[#FF6700]/30 bg-orange-50 overflow-hidden h-8">
                <button
                  type="button"
                  onClick={() => setQuickFilter(quickFilter === "review" ? "all" : "review")}
                  className={`h-full px-2.5 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                    quickFilter === "review"
                      ? "bg-[#FF6700] text-white"
                      : "text-[#FF6700] hover:bg-orange-100/70"
                  }`}
                  title="Filter clients with ads in review"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>In Review</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                      quickFilter === "review" ? "bg-white text-[#FF6700]" : "bg-[#FF6700] text-white"
                    }`}
                  >
                    {totals.inReview}
                  </span>
                </button>
                <Link
                  href="/studio/review"
                  className="h-full px-2 border-l border-[#FF6700]/25 text-[#FF6700] hover:bg-[#FF6700] hover:text-white inline-flex items-center transition"
                  title="Open Review Queue"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="inline-flex items-center rounded-xl border border-[#7F48ED]/30 bg-purple-50 overflow-hidden h-8">
                <button
                  type="button"
                  onClick={() => setQuickFilter(quickFilter === "approved" ? "all" : "approved")}
                  className={`h-full px-2.5 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                    quickFilter === "approved"
                      ? "bg-[#7F48ED] text-white"
                      : "text-[#7F48ED] hover:bg-purple-100/70"
                  }`}
                  title="Filter clients with approved ads"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                      quickFilter === "approved" ? "bg-white text-[#7F48ED]" : "bg-[#7F48ED] text-white"
                    }`}
                  >
                    {totals.approved}
                  </span>
                </button>
                <Link
                  href="/studio/approved"
                  className="h-full px-2 border-l border-[#7F48ED]/25 text-[#7F48ED] hover:bg-[#7F48ED] hover:text-white inline-flex items-center transition"
                  title="Open Approved Vault"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2: Status Filter + Search + Sort + View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["all", "active", "prospect", "paused", "archived"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize border transition cursor-pointer ${
                    statusFilter === st
                      ? "bg-[#7F48ED] text-white border-[#7F48ED] shadow-xs"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-[#7F48ED]/50 hover:text-[#7F48ED]"
                  }`}
                >
                  {st}
                </button>
              ))}
              {quickFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setQuickFilter("all")}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-orange-50 text-[#FF6700] border border-[#FF6700]/30 inline-flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Clear metric filter</span>
                </button>
              )}
            </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#7F48ED] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client, offer, or category..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#7F48ED]"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6700]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-zinc-700 focus:outline-none cursor-pointer"
              >
                <option value="recent">Sort: Last Activity</option>
                <option value="name">Sort: Name A–Z</option>
                <option value="footage">Sort: Most Footage</option>
                <option value="ads">Sort: Most Ads</option>
              </select>
            </div>

            <div className="inline-flex p-0.5 bg-zinc-100 border border-zinc-200 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg cursor-pointer transition ${
                  viewMode === "cards"
                    ? "bg-[#FF6700] text-white shadow-xs"
                    : "text-zinc-500 hover:text-[#FF6700]"
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg cursor-pointer transition ${
                  viewMode === "table"
                    ? "bg-[#FF6700] text-white shadow-xs"
                    : "text-zinc-500 hover:text-[#FF6700]"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Clients Grid or Table */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
            ))}
          </div>
        ) : sortedClients.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-[#7F48ED]/30 p-12 text-center space-y-3">
            <FolderOpen className="w-10 h-10 text-[#7F48ED] mx-auto" />
            <h3 className="text-sm font-bold text-zinc-800">No clients match this filter</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Create a client workspace to onboard raw footage, define compliance rules, and produce ads.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client</span>
            </button>
          </div>
        ) : viewMode === "cards" ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {clientsPagination.pagedItems.map((client, idx) => {
              const avatarIsOrange = idx % 2 === 0;
              return (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl border border-zinc-200 hover:border-[#7F48ED] hover:shadow-lg transition-all p-5 flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Link
                          href={`/studio/clients/${client.id}`}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden text-white font-black text-sm shadow-xs ${
                            client.logoUrl
                              ? "bg-purple-50 border border-[#7F48ED]/30"
                              : avatarIsOrange
                              ? "bg-[#FF6700]"
                              : "bg-[#7F48ED]"
                          }`}
                        >
                          {client.logoUrl ? (
                            <img
                              src={
                                client.logoUrl === "/logos/logo-compact-dark.png"
                                  ? "/logos/logo-mark.png"
                                  : client.logoUrl
                              }
                              alt={client.name}
                              className="w-full h-full object-contain p-1.5"
                            />
                          ) : (
                            client.name.slice(0, 2).toUpperCase()
                          )}
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/studio/clients/${client.id}`}
                            className="text-sm font-black text-zinc-900 group-hover:text-[#7F48ED] truncate block transition"
                          >
                            {client.name}
                          </Link>
                          <div className="text-[11px] text-zinc-500 truncate">
                            {client.brandProfile?.category || "General"}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Inline Status Switcher */}
                      <select
                        value={client.status}
                        onChange={(e) =>
                          handleQuickStatusChange(client.id, e.target.value as ClientStatus)
                        }
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer focus:outline-none ${
                          STATUS_BADGE[client.status]
                        }`}
                        title="Change client status"
                      >
                        <option value="active">Active</option>
                        <option value="prospect">Prospect</option>
                        <option value="paused">Paused</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {/* Offer Pill */}
                    <div className="text-xs bg-purple-50/50 border border-purple-100 rounded-xl px-3 py-2 text-zinc-700 truncate">
                      <span className="font-bold text-[#7F48ED] mr-1">Offer:</span>
                      {client.brandProfile?.offerPromo || "No offer set yet"}
                    </div>

                    {/* Interactive Clickable Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Link
                        href={`/studio/clients/${client.id}?tab=footage`}
                        className="bg-zinc-50 hover:bg-purple-50 rounded-xl p-2 border border-zinc-200 hover:border-[#7F48ED]/40 transition"
                        title="Open Client Footage & Trimmer"
                      >
                        <div className="text-[10px] font-bold text-[#7F48ED] uppercase flex items-center justify-center gap-1">
                          <Film className="w-3 h-3" />
                          <span>Footage</span>
                        </div>
                        <div className="text-xs font-black text-zinc-900 mt-0.5">
                          {client.clipCount + client.mediaAssetCount}{" "}
                          <span className="text-[10px] font-normal text-zinc-500">
                            ({client.rawFootageCount} raw)
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={`/studio/review?clientId=${client.id}`}
                        className="bg-zinc-50 hover:bg-orange-50 rounded-xl p-2 border border-zinc-200 hover:border-[#FF6700]/40 transition"
                        title="Filter Review Queue for this Client"
                      >
                        <div className="text-[10px] font-bold text-[#FF6700] uppercase flex items-center justify-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Review</span>
                        </div>
                        <div className="text-xs font-black text-zinc-900 mt-0.5">
                          {client.adsCount.inReview}
                        </div>
                      </Link>

                      <Link
                        href={`/studio/clients/${client.id}?tab=deliverables`}
                        className="bg-zinc-50 hover:bg-purple-50 rounded-xl p-2 border border-zinc-200 hover:border-[#7F48ED]/40 transition"
                        title="Open Client Deliverables"
                      >
                        <div className="text-[10px] font-bold text-[#7F48ED] uppercase flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </div>
                        <div className="text-xs font-black text-zinc-900 mt-0.5">
                          {client.adsCount.approved + client.adsCount.delivered}
                        </div>
                      </Link>
                    </div>

                    {/* Quick Workspace Tab Shortcuts */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold flex-wrap">
                      <Link
                        href={`/studio/clients/${client.id}?tab=footage`}
                        className="px-2 py-1 rounded-lg bg-zinc-50 hover:bg-orange-50 text-zinc-600 hover:text-[#FF6700] border border-zinc-200 transition"
                      >
                        + Trim Footage
                      </Link>
                      <Link
                        href={`/studio/clients/${client.id}?tab=ads`}
                        className="px-2 py-1 rounded-lg bg-zinc-50 hover:bg-purple-50 text-zinc-600 hover:text-[#7F48ED] border border-zinc-200 transition"
                      >
                        Ads ({client.adsCount.total})
                      </Link>
                      <Link
                        href={`/studio/clients/${client.id}?tab=review-links`}
                        className="px-2 py-1 rounded-lg bg-zinc-50 hover:bg-purple-50 text-zinc-600 hover:text-[#7F48ED] border border-zinc-200 inline-flex items-center gap-1 transition"
                      >
                        <Link2 className="w-2.5 h-2.5" />
                        <span>Links</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Footer CTAs (Solid Purple & Solid Orange) */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7F48ED]" />
                      {formatRelativeTime(client.lastActivityAt)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/studio/generate?clientId=${client.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-[#7F48ED] hover:bg-[#6D38D9] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>New Ad</span>
                      </Link>
                      <Link
                        href={`/studio/clients/${client.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#FF6700] hover:bg-[#E55C00] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <StudioPagination
            page={clientsPagination.page}
            pageSize={clientsPagination.pageSize}
            totalItems={clientsPagination.totalItems}
            totalPages={clientsPagination.totalPages}
            startIndex={clientsPagination.startIndex}
            endIndex={clientsPagination.endIndex}
            onPageChange={clientsPagination.setPage}
            onPageSizeChange={clientsPagination.setPageSize}
            pageSizeOptions={clientsPagination.pageSizeOptions}
            itemLabel={space === "clients" ? "clients" : "samples"}
          />
          </>
        ) : (
          <>
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-purple-50/60 border-b border-zinc-200 text-[10px] uppercase tracking-wider text-[#7F48ED] font-bold">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Footage Assets</th>
                    <th className="py-3 px-3">Ads (Draft / Review / Approved)</th>
                    <th className="py-3 px-3">Last Activity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {clientsPagination.pagedItems.map((client) => (
                    <tr key={client.id} className="hover:bg-purple-50/30 transition">
                      <td className="py-3 px-4">
                        <Link
                          href={`/studio/clients/${client.id}`}
                          className="font-bold text-zinc-900 hover:text-[#7F48ED]"
                        >
                          {client.name}
                        </Link>
                        <div className="text-[11px] text-zinc-500">
                          {client.brandProfile?.category || "General"} · {client.brandProfile?.offerPromo || "—"}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={client.status}
                          onChange={(e) =>
                            handleQuickStatusChange(client.id, e.target.value as ClientStatus)
                          }
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase cursor-pointer ${
                            STATUS_BADGE[client.status]
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="prospect">Prospect</option>
                          <option value="paused">Paused</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-700">
                        <Link href={`/studio/clients/${client.id}?tab=footage`} className="hover:text-[#7F48ED] underline decoration-dotted">
                          {client.clipCount + client.mediaAssetCount} clips · {client.rawFootageCount} raw
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-700">
                        {client.adsCount.draft} / {client.adsCount.inReview} /{" "}
                        {client.adsCount.approved + client.adsCount.delivered}
                      </td>
                      <td className="py-3 px-3 text-zinc-500">
                        {formatRelativeTime(client.lastActivityAt)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/studio/generate?clientId=${client.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#7F48ED] hover:bg-[#6D38D9] text-white font-bold"
                        >
                          New Ad
                        </Link>
                        <Link
                          href={`/studio/clients/${client.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold"
                        >
                          Workspace
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <StudioPagination
            page={clientsPagination.page}
            pageSize={clientsPagination.pageSize}
            totalItems={clientsPagination.totalItems}
            totalPages={clientsPagination.totalPages}
            startIndex={clientsPagination.startIndex}
            endIndex={clientsPagination.endIndex}
            onPageChange={clientsPagination.setPage}
            onPageSizeChange={clientsPagination.setPageSize}
            pageSizeOptions={clientsPagination.pageSizeOptions}
            itemLabel={space === "clients" ? "clients" : "samples"}
          />
          </>
        )}
      </main>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#7F48ED]/25 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#7F48ED]/30 max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-[#7F48ED] text-white flex items-center justify-between">
              <h2 className="text-sm font-black">
                {newIsSample ? "Add Sample / Concept Brand" : "Onboard New Client"}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-5 space-y-3 text-xs">
              {formError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Client / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Apex Roofing Co"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ClientStatus)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#7F48ED]"
                  >
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Category / Industry
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Home Services"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Core Offer / Promo
                  </label>
                  <input
                    type="text"
                    value={newOffer}
                    onChange={(e) => setNewOffer(e.target.value)}
                    placeholder="e.g. Free 15-Point Roof Inspection"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="e.g. Homeowners in Phoenix metro"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="jane@client.com"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 text-zinc-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsSample}
                  onChange={(e) => setNewIsSample(e.target.checked)}
                  className="rounded border-zinc-300 accent-[#7F48ED]"
                />
                <span>Place in Samples / Concept space (never shown as Approved client deliverables)</span>
              </label>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold cursor-pointer disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create & Open Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
