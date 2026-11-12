"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Upload,
  CheckCircle2,
  Sparkles,
  Scissors,
  Check,
  Eye,
  FolderOpen,
  Play,
  Pause,
  Layers,
  ChevronRight,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  X,
  Music,
  Users,
} from "lucide-react";
import type { BrandMediaAsset } from "@/app/api/studio/assets/route";

interface VideoCardProps {
  asset: BrandMediaAsset;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenInspect: () => void;
  onTrash: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  isTrashView?: boolean;
}

function VideoCard({
  asset,
  isPlaying,
  onTogglePlay,
  onOpenInspect,
  onTrash,
  onRestore,
  onPermanentDelete,
  isTrashView,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("[VideoCard] Play failed, retrying muted:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="bg-[#141B2B] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-sm hover:border-zinc-700 transition flex flex-col group relative">
      {/* Video Stage */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src={asset.src}
          playsInline
          muted
          loop
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow ${
              asset.targetScene === 2 ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
            }`}
          >
            {asset.targetScene === 2 ? "Scene 2: Product" : "Scene 3: B-Roll"}
          </span>
          {asset.fileSizeMb && (
            <span className="text-[9px] font-mono text-zinc-300 bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-xs">
              {asset.fileSizeMb}MB
            </span>
          )}
        </div>

        {/* Center Play Button Overlay */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition cursor-pointer z-10"
        >
          <div className="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </div>
        </button>

        {/* Hover Action Strip (Inspect + Quick Delete) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenInspect();
            }}
            className="px-2 py-1 bg-black/75 hover:bg-black text-white text-[10px] font-bold rounded-lg border border-white/20 backdrop-blur-sm flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3 h-3 text-[#FF6700]" />
            <span>Inspect</span>
          </button>

          {!isTrashView ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTrash();
              }}
              className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white rounded-lg border border-red-700/50 backdrop-blur-sm transition cursor-pointer"
              title="Move to Trash"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore && onRestore();
                }}
                className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white text-[10px] font-bold rounded-lg border border-emerald-700/50 transition cursor-pointer flex items-center gap-1"
                title="Restore to active library"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPermanentDelete && onPermanentDelete();
                }}
                className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white rounded-lg border border-red-700/50 transition cursor-pointer"
                title="Delete Permanently"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Metadata */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6700] truncate">
            {asset.brandName}
          </div>
          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
            {asset.title}
          </h4>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-400 capitalize bg-zinc-800 px-2 py-0.5 rounded">
            {asset.category.replace("-", " ")}
          </span>

          {!isTrashView ? (
            <Link
              href={`/studio/generate?brand=${encodeURIComponent(asset.brandName)}`}
              className="text-[10px] font-bold text-[#7F48ED] hover:text-[#6b35d6] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Use in Ad</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          ) : (
            <span className="text-[9px] font-mono text-zinc-500 italic">In Trash</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrandAssetsPage() {
  const [activeAssets, setActiveAssets] = useState<BrandMediaAsset[]>([]);
  const [trashedAssets, setTrashedAssets] = useState<BrandMediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"active" | "trash">("active");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [inspectAsset, setInspectAsset] = useState<BrandMediaAsset | null>(null);

  // Upload Form State
  const [uploadBrandName, setUploadBrandName] = useState("ReLaunch");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<BrandMediaAsset["category"]>("product-demo");
  const [uploadTargetScene, setUploadTargetScene] = useState<2 | 3>(2);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/studio/assets?view=all");
      const data = await res.json();
      if (data.assets) {
        const all: BrandMediaAsset[] = data.assets;
        setActiveAssets(all.filter((a) => a.status !== "deleted"));
        setTrashedAssets(all.filter((a) => a.status === "deleted"));
      }
    } catch (err) {
      console.error("Failed to load brand media assets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please choose a video file.");
      return;
    }
    if (!uploadTitle.trim()) {
      showToast("Please enter a title for this footage.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("brandName", uploadBrandName);
      formData.append("title", uploadTitle);
      formData.append("category", uploadCategory);
      formData.append("targetScene", String(uploadTargetScene));
      formData.append("file", selectedFile);

      const res = await fetch("/api/studio/assets", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to upload");

      showToast(`✓ Uploaded "${uploadTitle}" successfully!`);
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadTitle("");
      fetchAssets();
    } catch (err: any) {
      showToast(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTrashAsset = async (asset: BrandMediaAsset) => {
    try {
      const res = await fetch("/api/studio/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trash", id: asset.id }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Moved "${asset.title}" to Trash`);
        fetchAssets();
      } else {
        showToast(data.error || "Failed to trash asset");
      }
    } catch {
      showToast("Error trashing asset");
    }
  };

  const handleRestoreAsset = async (asset: BrandMediaAsset) => {
    try {
      const res = await fetch("/api/studio/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", id: asset.id }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✓ Restored "${asset.title}" to active library`);
        fetchAssets();
      } else {
        showToast(data.error || "Failed to restore asset");
      }
    } catch {
      showToast("Error restoring asset");
    }
  };

  const handlePermanentDelete = async (asset: BrandMediaAsset) => {
    if (!confirm(`Are you sure you want to permanently delete "${asset.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch("/api/studio/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_permanent", id: asset.id }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Permanently deleted "${asset.title}"`);
        fetchAssets();
      } else {
        showToast(data.error || "Failed to delete asset");
      }
    } catch {
      showToast("Error deleting asset");
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm(`Empty trash? All ${trashedAssets.length} clips will be permanently purged.`)) {
      return;
    }
    try {
      const res = await fetch("/api/studio/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "empty_trash" }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✓ Emptied trash (${data.count} clips purged)`);
        fetchAssets();
      }
    } catch {
      showToast("Error emptying trash");
    }
  };

  const displayedList = currentTab === "active" ? activeAssets : trashedAssets;
  const uniqueBrands = Array.from(new Set(displayedList.map((a) => a.brandName)));
  const filteredAssets = selectedBrandFilter === "all"
    ? displayedList
    : displayedList.filter((a) => a.brandName.toLowerCase() === selectedBrandFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0E121B] text-white flex flex-col font-sans">
      {/* Top Banner Navigation — Full Width */}
      <header className="border-b border-zinc-800 bg-[#121824]/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-3 shrink-0 shadow-xs">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/studio/generate"
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
              title="Return to Studio Generator"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6700] bg-[#FF6700]/10 px-2 py-0.5 rounded border border-[#FF6700]/30">
                  Real Footage Intake
                </span>
                <span className="text-[10px] text-zinc-400">80/20 Quality Workflow</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Brand Media &amp; Product Footage</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#FF6700] hover:bg-[#e55c00] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Product Footage</span>
            </button>

            <div className="h-4 w-px bg-zinc-800 hidden md:block mx-0.5" />

            <Link
              href="/studio/tracks"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
              title="Open Master Tracks"
            >
              <Music className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span>Master Tracks</span>
            </Link>

            <Link
              href="/studio/creators"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
              title="Open Creators"
            >
              <Users className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span>Creators</span>
            </Link>

            <Link
              href="/studio/generate"
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span className="hidden sm:inline">Use in Generator</span>
              <span className="sm:hidden">Generator</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Stage — Full Width Workstation */}
      <main className="w-full p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 flex-1">
        {/* Info, View Tabs & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141B2B] p-4 rounded-2xl border border-zinc-800 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* Active vs Trash View Switcher */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentTab("active")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    currentTab === "active" ? "bg-[#7F48ED] text-white shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Active Media ({activeAssets.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab("trash")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    currentTab === "trash" ? "bg-red-900/80 text-red-200 border border-red-700/50 shadow" : "text-zinc-400 hover:text-red-400"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Trash ({trashedAssets.length})</span>
                </button>
              </div>

              {currentTab === "trash" && trashedAssets.length > 0 && (
                <button
                  type="button"
                  onClick={handleEmptyTrash}
                  className="px-2.5 py-1 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 border border-red-900/60 rounded-lg transition cursor-pointer"
                >
                  Empty Trash
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              {currentTab === "active"
                ? "Real product footage and dynamic b-roll for Scene 2 and Scene 3."
                : "Deleted footage awaiting restoration or permanent purge."}
            </p>
          </div>

          {/* Brand Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            <button
              type="button"
              onClick={() => setSelectedBrandFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedBrandFilter === "all"
                  ? "bg-[#FF6700] text-white"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              All Brands ({displayedList.length})
            </button>
            {uniqueBrands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrandFilter(brand)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedBrandFilter === brand
                    ? "bg-[#FF6700] text-white"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#FF6700] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">Loading brand media clips...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-16 text-center bg-[#141B2B]/40 rounded-2xl border border-dashed border-zinc-800 space-y-3">
            <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300">
              {currentTab === "active" ? "No Active Product Footage" : "Trash is Empty"}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {currentTab === "active"
                ? "Upload client product demonstrations or b-roll to replace generic footage with authentic client assets."
                : "No deleted footage in the trash queue."}
            </p>
            {currentTab === "active" && (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-[#FF6700] hover:bg-[#e55c00] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer mx-auto shadow-md shadow-[#FF6700]/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Product Clip</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredAssets.map((asset) => (
              <VideoCard
                key={asset.id}
                asset={asset}
                isPlaying={playingVideoId === asset.id}
                onTogglePlay={() => setPlayingVideoId(playingVideoId === asset.id ? null : asset.id)}
                onOpenInspect={() => setInspectAsset(asset)}
                onTrash={() => handleTrashAsset(asset)}
                onRestore={() => handleRestoreAsset(asset)}
                onPermanentDelete={() => handlePermanentDelete(asset)}
                isTrashView={currentTab === "trash"}
              />
            ))}
          </div>
        )}
      </main>

      {/* Inspect / Preview Modal Player */}
      {inspectAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141B2B] rounded-2xl max-w-md w-full overflow-hidden border border-zinc-700 shadow-2xl flex flex-col">
            <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FF6700] uppercase tracking-wider block">
                  {inspectAsset.brandName}
                </span>
                <h4 className="text-xs font-bold text-white truncate max-w-[280px]">
                  {inspectAsset.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setInspectAsset(null)}
                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[9/16] max-h-[65vh] bg-black">
              <video
                src={inspectAsset.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between gap-2">
              <div className="text-[11px] text-zinc-400">
                <span>Target: </span>
                <strong className="text-white">
                  {inspectAsset.targetScene === 2 ? "Scene 2: Product Demo" : "Scene 3: B-Roll"}
                </strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    handleTrashAsset(inspectAsset);
                    setInspectAsset(null);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-900/50 rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Trash</span>
                </button>
                <Link
                  href={`/studio/generate?brand=${encodeURIComponent(inspectAsset.brandName)}`}
                  className="px-3.5 py-1 text-xs font-bold text-white bg-[#7F48ED] hover:bg-[#6b35d6] rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Use in Ad</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal Drawer */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#141B2B] rounded-2xl max-w-lg w-full p-6 border border-zinc-700 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#FF6700]" />
                  <span>Upload Client Product Footage</span>
                </h3>
                <p className="text-xs text-zinc-400">Add footage for Scene 2 (Product Demo) or Scene 3 (B-Roll)</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Brand Name</label>
                <input
                  type="text"
                  value={uploadBrandName}
                  onChange={(e) => setUploadBrandName(e.target.value)}
                  placeholder="e.g. ReLaunch, TrailLine, Frank & Patty"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Footage Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Close-up bottle application, Packaging unboxing"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Timeline Target</label>
                  <select
                    value={uploadTargetScene}
                    onChange={(e) => setUploadTargetScene(parseInt(e.target.value, 10) as 2 | 3)}
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value={2}>Scene 2: Product Feature</option>
                    <option value={3}>Scene 3: Dynamic B-Roll</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="product-demo">Product Demo</option>
                    <option value="b-roll">Lifestyle B-Roll</option>
                    <option value="unboxing">Unboxing</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Video File (MP4, MOV)</label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FF6700] file:text-white hover:file:bg-[#e55c00] file:cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#FF6700] hover:bg-[#e55c00] disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF6700]/20"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Footage</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141B2B] border border-[#FF6700] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FF6700]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
