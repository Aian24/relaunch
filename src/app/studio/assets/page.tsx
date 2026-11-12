"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Video,
  Upload,
  FolderPlus,
  CheckCircle2,
  Sparkles,
  Scissors,
  Check,
  Folder,
  Eye,
  FolderOpen,
  Play,
  Pause,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { BrandMediaAsset } from "@/app/api/studio/assets/route";

export default function BrandAssetsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<BrandMediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [uploadBrandName, setUploadBrandName] = useState("ReLaunch");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<BrandMediaAsset["category"]>("product-demo");
  const [uploadTargetScene, setUploadTargetScene] = useState<2 | 3>(2);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/studio/assets");
      const data = await res.json();
      if (data.assets) {
        setAssets(data.assets);
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

  const uniqueBrands = Array.from(new Set(assets.map((a) => a.brandName)));
  const filteredAssets = selectedBrandFilter === "all"
    ? assets
    : assets.filter((a) => a.brandName.toLowerCase() === selectedBrandFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0E121B] text-white">
      {/* Top Banner Navigation */}
      <header className="border-b border-zinc-800 bg-[#121824]/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-3 shrink-0">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF6700] hover:bg-[#e55c00] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Product Footage</span>
            </button>
            <Link
              href="/studio/generate"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span className="hidden sm:inline">Use in Generator</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Stage — Full Width Workstation */}
      <main className="w-full p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 flex-1">
        {/* Info & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141B2B] p-4 rounded-2xl border border-zinc-800 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7F48ED]" />
              <span>Client Product Footage Library</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Real product demonstrations &amp; dynamic b-roll automatically populate Scene 2 and Scene 3 in the timeline.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            <button
              type="button"
              onClick={() => setSelectedBrandFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedBrandFilter === "all"
                  ? "bg-[#7F48ED] text-white"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              All Brands ({assets.length})
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
            <h3 className="text-sm font-bold text-zinc-300">No Product Footage Uploaded Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Upload client product demonstrations or b-roll to replace generic footage with authentic client assets.
            </p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#FF6700] hover:bg-[#e55c00] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer mx-auto shadow-md shadow-[#FF6700]/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload First Product Clip</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredAssets.map((asset) => {
              const isPlaying = playingVideoId === asset.id;
              return (
                <div
                  key={asset.id}
                  className="bg-[#141B2B] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-sm hover:border-zinc-700 transition flex flex-col group"
                >
                  {/* Video Stage */}
                  <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
                    <video
                      src={asset.src}
                      playsInline
                      muted
                      loop
                      autoPlay={isPlaying}
                      className="w-full h-full object-cover"
                    />

                    {/* Top Scene Target Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow ${
                          asset.targetScene === 2
                            ? "bg-blue-600 text-white"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        {asset.targetScene === 2 ? "Scene 2: Product Demo" : "Scene 3: B-Roll Cut"}
                      </span>
                      {asset.fileSizeMb && (
                        <span className="text-[9px] font-mono text-zinc-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {asset.fileSizeMb}MB
                        </span>
                      )}
                    </div>

                    {/* Center Play Button Overlay */}
                    <button
                      type="button"
                      onClick={() => setPlayingVideoId(isPlaying ? null : asset.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </div>
                    </button>
                  </div>

                  {/* Card Content & Meta */}
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
                      <Link
                        href={`/studio/generate?brand=${encodeURIComponent(asset.brandName)}`}
                        className="text-[10px] font-bold text-[#7F48ED] hover:text-[#6b35d6] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Select</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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
              {/* Brand Name */}
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

              {/* Clip Title */}
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

              {/* Target Scene & Category */}
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

              {/* File Selector */}
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

              {/* Action Buttons */}
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

