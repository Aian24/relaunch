"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  Trash2,
  Play,
  Volume2,
  VolumeX,
  Search,
  Eye,
  Sparkles,
  X,
  Check,
  RefreshCw,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";

interface DeletedVariant {
  id: string;
  clientName: string;
  batchName: string;
  angle: string;
  framework: string;
  targetPersona: string;
  hookText: string;
  video9x16: string;
  video1x1: string;
  video4x5: string;
  thumbnail: string;
  status: string;
  scriptBody: string;
  ctaText: string;
  createdAt: string;
  deletedAt: string;
  creatorActor?: string;
  creatorHookClip?: string;
  voiceoverUrl?: string;
}

export default function DeletedAdsRecoveryPage() {
  const [deletedAds, setDeletedAds] = useState<DeletedVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [ratios, setRatios] = useState<Record<string, "9:16" | "1:1" | "4:5">>({});
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDeletedAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/studio/deleted");
      if (res.ok) {
        const data = await res.json();
        setDeletedAds(data.variants || []);
      }
    } catch {
      showToast("Could not load deleted ads queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedAds();
  }, []);

  const brands = useMemo(() => {
    const set = new Set<string>();
    deletedAds.forEach((ad) => {
      if (ad.clientName) set.add(ad.clientName);
    });
    return Array.from(set).sort();
  }, [deletedAds]);

  const filteredAds = useMemo(() => {
    return deletedAds.filter((ad) => {
      const matchBrand = selectedBrand === "all" || ad.clientName.toLowerCase() === selectedBrand.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        ad.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.hookText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.angle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ad.scriptBody && ad.scriptBody.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBrand && matchSearch;
    });
  }, [deletedAds, selectedBrand, searchQuery]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredAds.length && filteredAds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAds.map((ad) => ad.id));
    }
  };

  const handleRestore = async (idsToRestore: string[]) => {
    if (idsToRestore.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/studio/deleted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", ids: idsToRestore }),
      });
      if (res.ok) {
        setDeletedAds((prev) => prev.filter((ad) => !idsToRestore.includes(ad.id)));
        setSelectedIds((prev) => prev.filter((id) => !idsToRestore.includes(id)));
        showToast(`✓ Restored ${idsToRestore.length} ad${idsToRestore.length > 1 ? "s" : ""} back to Review Queue!`);
      } else {
        showToast("Failed to restore ads.");
      }
    } catch {
      showToast("Error communicating with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreAll = async () => {
    if (deletedAds.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/studio/deleted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore_all" }),
      });
      if (res.ok) {
        const count = deletedAds.length;
        setDeletedAds([]);
        setSelectedIds([]);
        showToast(`✓ Restored all ${count} ads back to Review Queue!`);
      } else {
        showToast("Failed to restore all ads.");
      }
    } catch {
      showToast("Error restoring ads.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDelete = async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/studio/deleted", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (res.ok) {
        setDeletedAds((prev) => prev.filter((ad) => !idsToDelete.includes(ad.id)));
        setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
        setShowDeleteConfirmId(null);
        showToast(`Permanently purged ${idsToDelete.length} ad${idsToDelete.length > 1 ? "s" : ""}.`);
      } else {
        showToast("Failed to purge ads.");
      }
    } catch {
      showToast("Error purging ads.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmptyTrash = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/studio/deleted", {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletedAds([]);
        setSelectedIds([]);
        setShowEmptyTrashModal(false);
        showToast("Trash emptied permanently.");
      } else {
        showToast("Failed to empty trash.");
      }
    } catch {
      showToast("Error emptying trash.");
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlay = (id: string) => {
    const vid = videoRefs.current[id];
    if (!vid) return;

    if (playingId === id) {
      vid.pause();
      setPlayingId(null);
    } else {
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      vid.play().then(() => setPlayingId(id)).catch(() => {});
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[id];
    const isCurrentlyMuted = mutedMap[id] ?? true;
    const nextMuted = !isCurrentlyMuted;

    setMutedMap((prev) => ({ ...prev, [id]: nextMuted }));
    if (vid) {
      vid.muted = nextMuted;
    }
  };

  const setAdRatio = (id: string, ratio: "9:16" | "1:1" | "4:5", e: React.MouseEvent) => {
    e.stopPropagation();
    setRatios((prev) => ({ ...prev, [id]: ratio }));
  };

  const getVideoSrc = (ad: DeletedVariant) => {
    const ratio = ratios[ad.id] || "9:16";
    if (ratio === "1:1" && ad.video1x1) return ad.video1x1;
    if (ratio === "4:5" && ad.video4x5) return ad.video4x5;
    return ad.video9x16 || ad.video1x1 || "";
  };

  const formatDeletedDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#090D16] flex flex-col font-sans selection:bg-[#7F48ED]/20 selection:text-[#7F48ED]">
      {/* 1. Header Bar — Crisp Responsive Header with Portal Tabs (Matching Vault) */}
      <header className="h-14 sm:h-16 border-b border-zinc-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/studio/review"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#7F48ED] transition-colors shrink-0"
            title="Back to Review Room"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back to Review</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black tracking-tight text-[#090D16] uppercase whitespace-nowrap truncate">
              <span className="hidden xs:inline">Studio </span>
              <span className="text-red-600">Deleted</span>
              <span className="text-zinc-900 hidden sm:inline"> Trash</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <Link
            href="/studio/review"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition-all border border-zinc-200 cursor-pointer shrink-0"
            title="Open Review Queue"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF6700]" />
            <span className="hidden sm:inline">Review Queue</span>
            <span className="sm:hidden">Queue</span>
          </Link>

          <Link
            href="/studio/approved"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-zinc-100 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-800 rounded-xl text-xs font-bold transition-all border border-zinc-200 hover:border-emerald-200 cursor-pointer shrink-0"
            title="Open Approved Vault"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Vault</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200 shrink-0 shadow-xs">
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Trash ({deletedAds.length})</span>
          </div>

          <Link
            href="/studio/generate"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 bg-[#FF6700] hover:bg-[#E55C00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
            title="Create New Ad"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Ad</span>
            <span className="sm:hidden">Ad</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Content Container — Full Width Matching Approved Deliverables Vault */}
      <main className="flex-1 w-full p-3 sm:p-4 lg:p-5 space-y-4 sm:space-y-5">
        {/* Banner: Trash Stats & Global Actions */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Trash2 className="w-3 h-3 stroke-[2.5]" />
                Soft-Deleted Ad Recovery Archive
              </span>
              <span className="text-zinc-400 text-xs hidden sm:inline">|</span>
              <span className="text-xs text-zinc-500 hidden sm:inline">
                Zero data loss · Restore anytime to Review Room or permanently purge
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
              Deleted Commercial Video Ads
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Ads removed from the QA Review Queue are preserved here in full fidelity across all 3 formats (9:16, 1:1, and 4:5). You can preview videos, restore selected ads back to the review queue, or permanently empty trash.
            </p>
          </div>

          {deletedAds.length > 0 && (
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRestoreAll}
                disabled={isProcessing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7F48ED] border border-purple-200 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                title="Restore all ads back to review room"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore All ({deletedAds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEmptyTrashModal(true)}
                disabled={isProcessing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                title="Permanently empty trash"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>Empty Trash</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Search, Filter & Bulk Toolbar — Full Width */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hook, brand, angle, actor..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#7F48ED] font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand Pills & Batch Selection Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
            {/* Brand Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedBrand("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedBrand === "all"
                    ? "bg-[#7F48ED] text-white shadow-xs"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
                }`}
              >
                All ({deletedAds.length})
              </button>
              {brands.map((brand) => {
                const count = deletedAds.filter((d) => d.clientName === brand).length;
                const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-[#7F48ED] text-white shadow-xs"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
                    }`}
                  >
                    {brand} ({count})
                  </button>
                );
              })}
            </div>

            {/* Selection & Batch Actions */}
            {filteredAds.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 cursor-pointer select-none px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAds.length && filteredAds.length > 0}
                    onChange={handleToggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-zinc-300 text-[#7F48ED] focus:ring-[#7F48ED] cursor-pointer"
                  />
                  <span>Select All ({filteredAds.length})</span>
                </label>

                {selectedIds.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRestore(selectedIds)}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#7F48ED] hover:bg-[#6b35d6] text-white transition shadow-sm cursor-pointer disabled:opacity-50"
                      title="Restore selected ads to review queue"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore ({selectedIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePermanentDelete(selectedIds)}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm cursor-pointer disabled:opacity-50"
                      title="Permanently purge selected ads"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge ({selectedIds.length})</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. Deleted Ads Grid — Full Width Responsive 3-Column Grid Matching Vault */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200 shadow-sm text-zinc-500">
            <RefreshCw className="w-8 h-8 animate-spin text-[#7F48ED] mb-3" />
            <p className="text-xs font-bold text-zinc-700">Loading deleted ads queue...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          /* Empty Trash State */
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-zinc-300 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mb-3">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 mb-1">Trash is Empty</h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-4">
              {deletedAds.length === 0
                ? "No deleted ads found. Ads you remove from the QA Review Queue will safely appear here so you can restore or permanently clear them."
                : "No deleted ads matched your search query or brand filter."}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/studio/review"
                className="px-4 py-2 bg-[#7F48ED] hover:bg-[#6C34DE] text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Go to Review Room
              </Link>
              <Link
                href="/studio/generate"
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition border border-zinc-200"
              >
                Create Ad
              </Link>
            </div>
          </div>
        ) : (
          /* Deleted Ads Grid */
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredAds.map((ad) => {
              const isSelected = selectedIds.includes(ad.id);
              const ratio = ratios[ad.id] || "9:16";
              const isCurrentPlaying = playingId === ad.id;
              const isMuted = mutedMap[ad.id] ?? true;
              const videoSrc = getVideoSrc(ad);

              return (
                <div
                  key={ad.id}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                    isSelected
                      ? "border-[#7F48ED] ring-2 ring-[#7F48ED]/30"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between gap-2 bg-gradient-to-r from-zinc-50/50 to-white">
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(ad.id)}
                        className="w-4 h-4 rounded border-zinc-300 text-[#7F48ED] focus:ring-[#7F48ED] cursor-pointer shrink-0"
                        title="Select ad"
                      />
                      <div className="truncate">
                        <div className="text-xs font-black text-zinc-900 truncate">{ad.clientName}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Deleted: {formatDeletedDate(ad.deletedAt)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0">
                      In Trash
                    </span>
                  </div>

                  {/* Video Stage Preview */}
                  <div className="p-3.5 flex flex-col items-center">
                    <div
                      className={`relative bg-black rounded-xl overflow-hidden shadow-inner group transition-all ${
                        ratio === "9:16"
                          ? "w-44 aspect-[9/16]"
                          : ratio === "1:1"
                          ? "w-48 aspect-square"
                          : "w-48 aspect-[4/5]"
                      }`}
                    >
                      {videoSrc ? (
                        <video
                          ref={(el) => {
                            videoRefs.current[ad.id] = el;
                          }}
                          src={videoSrc}
                          poster={ad.thumbnail}
                          loop
                          playsInline
                          muted={isMuted}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                          No Preview
                        </div>
                      )}

                      {/* Video Play/Pause Overlay */}
                      <button
                        type="button"
                        onClick={() => togglePlay(ad.id)}
                        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer focus:outline-none"
                      >
                        {!isCurrentPlaying && (
                          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-xl transition transform hover:scale-105">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        )}
                      </button>

                      {/* Mute Toggle */}
                      {videoSrc && (
                        <button
                          type="button"
                          onClick={(e) => toggleMute(ad.id, e)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition z-20 cursor-pointer shadow"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                        </button>
                      )}
                    </div>

                    {/* Ratio Toggles */}
                    <div className="flex items-center gap-1 mt-2.5 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                      {(["9:16", "1:1", "4:5"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={(e) => setAdRatio(ad.id, r, e)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                            ratio === r ? "bg-[#7F48ED] text-white shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hook & Script Info */}
                  <div className="px-3.5 pb-2 text-left">
                    <div className="text-[11px] font-bold text-zinc-800 line-clamp-2 leading-snug mb-1">
                      &ldquo;{ad.hookText}&rdquo;
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-100">
                      <span className="truncate max-w-[150px] font-medium">{ad.angle}</span>
                      <span className="text-zinc-400 font-mono truncate">{ad.creatorActor || "AI Engine"}</span>
                    </div>
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="p-3 bg-zinc-50/80 border-t border-zinc-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestore([ad.id])}
                      disabled={isProcessing}
                      className="py-1.5 px-2.5 rounded-xl text-xs font-bold bg-[#7F48ED] hover:bg-[#6b35d6] text-white transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Restore ad back to review queue"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirmId(ad.id)}
                      disabled={isProcessing}
                      className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Permanently erase ad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal: Single Item Permanent Delete */}
      {showDeleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-900">Permanently Purge Ad?</h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  This will permanently delete this ad from the system. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete([showDeleteConfirmId])}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Purge Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Empty All Trash */}
      {showEmptyTrashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-zinc-900">Empty All Trash?</h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Are you sure you want to permanently erase all <span className="font-bold text-zinc-900">{deletedAds.length}</span> ads currently in the trash? You will not be able to recover them.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setShowEmptyTrashModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmptyTrash}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty Trash Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-white/10 animate-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
