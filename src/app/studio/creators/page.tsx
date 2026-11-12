"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Video,
  Scissors,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
  CheckCircle2,
  Sparkles,
  FolderOpen,
  Eye,
  Sliders,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Plus,
  RefreshCw,
} from "lucide-react";
import { CREATOR_ROSTER, CreatorProfile } from "@/data/creatorRoster";
import { CREATOR_ASSETS, CreatorClipAsset } from "@/data/creatorAssets";

export default function CreatorIntakeAndTrimmerPage() {
  const [roster, setRoster] = useState<CreatorProfile[]>(CREATOR_ROSTER);
  const [assets, setAssets] = useState<CreatorClipAsset[]>(CREATOR_ASSETS);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("tyler");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("tyler-hook-01");
  const [customVideoUrl, setCustomVideoUrl] = useState<string>("");

  // Video player & Trimmer State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [trimStart, setTrimStart] = useState(0.2);
  const [trimEnd, setTrimEnd] = useState(3.8);
  const [isLoopingTrim, setIsLoopingTrim] = useState(true);

  // Form Metadata
  const [clipType, setClipType] = useState<"hook" | "broll">("hook");
  const [clipAngle, setClipAngle] = useState<string>("problem");
  const [spokenText, setSpokenText] = useState("If your website takes more than 3 seconds to load, you're losing customers.");
  const [clipLabel, setClipLabel] = useState("Hook 1: 3 Seconds to Load");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial combined assets from API
  useEffect(() => {
    fetch("/api/studio/creators")
      .then((res) => res.json())
      .then((data) => {
        if (data.roster) setRoster(data.roster);
        if (data.assets) setAssets(data.assets);
      })
      .catch((err) => console.warn("Failed to fetch creator assets", err));
  }, []);

  const activeCreator = roster.find((c) => c.actorPresetId === selectedCreatorId) || roster[0];
  const creatorClips = assets.filter((a) => a.creatorId === selectedCreatorId);
  const selectedClip = assets.find((a) => a.id === selectedAssetId) || creatorClips[0];

  // Sync active clip into trimmer controls
  useEffect(() => {
    if (selectedClip) {
      setTrimStart(selectedClip.recommendedTrim?.start ?? 0);
      setTrimEnd(selectedClip.recommendedTrim?.end ?? Math.min(3.8, selectedClip.durationSeconds || 4));
      setSpokenText(selectedClip.spokenText || "");
      setClipLabel(selectedClip.label || "");
      setClipAngle(selectedClip.angle || "general");
      setClipType(selectedClip.type || "hook");
      if (videoRef.current) {
        videoRef.current.currentTime = selectedClip.recommendedTrim?.start ?? 0;
      }
    }
  }, [selectedClip?.id]);

  const activeVideoSrc = customVideoUrl.trim() || selectedClip?.src || "/creators/haley/hooks/haley-hook-01.mp4";

  // Reload video element cleanly whenever active take changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.currentTime = trimStart;
      setIsPlaying(false);
    }
  }, [activeVideoSrc]);

  // Handle trim loop boundary
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    if (isLoopingTrim && cur >= trimEnd) {
      videoRef.current.currentTime = trimStart;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 10;
    setDuration(dur);
    if (trimEnd > dur) {
      setTrimEnd(Math.min(dur, 3.8));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime < trimStart || videoRef.current.currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const playTrimLoop = () => {
    if (!videoRef.current) return;
    setIsLoopingTrim(true);
    videoRef.current.currentTime = trimStart;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAsset = async () => {
    setIsSaving(true);
    try {
      const payload = {
        id: selectedClip ? selectedClip.id : `${selectedCreatorId}-${clipType}-${Date.now().toString().slice(-4)}`,
        creatorId: selectedCreatorId,
        creatorName: activeCreator.name,
        handle: activeCreator.handle,
        type: clipType,
        angle: clipAngle,
        label: clipLabel,
        spokenText,
        src: activeVideoSrc,
        thumbnail: activeVideoSrc.replace(/\.mp4$/, ".jpg"),
        startTrim: trimStart,
        endTrim: trimEnd,
        durationSeconds: duration,
      };

      const res = await fetch("/api/studio/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to save creator take");
        setIsSaving(false);
        return;
      }

      showToast("✓ Creator take registered! Available in Studio Generator.");
      // Refresh local assets
      setAssets((prev) => {
        const idx = prev.findIndex((a) => a.id === data.asset.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data.asset;
          return next;
        }
        return [data.asset, ...prev];
      });
    } catch {
      showToast("Failed to save asset. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const trimLength = Math.max(0, trimEnd - trimStart).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#090D16] flex flex-col font-sans selection:bg-[#7F48ED]/20 selection:text-[#7F48ED]">
      {/* 1. Top Header Bar */}
      <header className="h-14 sm:h-16 border-b border-zinc-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#7F48ED] transition-colors shrink-0"
            title="Back to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back to Studio</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black tracking-tight text-[#090D16] uppercase whitespace-nowrap truncate">
              <span className="hidden xs:inline">ReLaunch Studio </span>
              <span className="text-[#7F48ED]">Creators</span>
              <span className="text-[#FF6700] hidden sm:inline"> &amp; Trimmer</span>
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/studio/generate"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition border border-zinc-200 cursor-pointer shrink-0"
            title="Open Studio Generator"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6700]" />
            <span className="hidden sm:inline">Generator</span>
          </Link>

          <Link
            href="/studio/review"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition border border-zinc-200 cursor-pointer shrink-0"
            title="Open Review Room"
          >
            <Eye className="w-3.5 h-3.5 text-[#7F48ED]" />
            <span className="hidden sm:inline">Review</span>
          </Link>

          <Link
            href="/studio/assets"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition border border-zinc-200 cursor-pointer shrink-0"
            title="Open Brand Media & Product Footage Intake"
          >
            <Video className="w-3.5 h-3.5 text-[#FF6700]" />
            <span className="hidden sm:inline">Brand Media</span>
          </Link>

          <Link
            href="/studio/approved"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition border border-zinc-200 cursor-pointer shrink-0"
            title="Open Approved Vault"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Vault</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Workstation Container — Full Width Matching Vault and Review */}
      <main className="flex-1 w-full p-3 sm:p-4 lg:p-5 space-y-4 sm:space-y-5">
        {/* Banner: UGC Creator Model Overview */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7F48ED]/10 text-[#7F48ED] border border-[#7F48ED]/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#7F48ED]" />
                Human Creator Roster &amp; Hook Trimmer
              </span>
              <span className="text-zinc-300 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-zinc-500">
                Top Tier UGC + AI Fulfillment Model
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
              UGC Creator Footage Intake &amp; Precision Trimmer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Real creators film authentic 3–5 second hooks and reaction b-rolls. Use this visual trimmer to set exact in/out cut points, verify the loop rhythm, and catalog takes directly into the Studio Generator.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/studio/creators/new"
              className="px-3.5 py-2.5 rounded-xl bg-[#FF6700] hover:bg-[#ea5e00] text-white text-xs font-bold transition shadow-sm shadow-[#FF6700]/25 flex items-center gap-1.5 cursor-pointer"
              title="Add a new UGC creator and provision folders on disk"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add UGC Creator</span>
            </Link>

            <Link
              href={`/studio/generate?actor=${selectedCreatorId}`}
              className="px-4 py-2.5 rounded-xl bg-[#7F48ED] hover:bg-[#6b35d6] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use in Generator</span>
            </Link>
          </div>
        </div>

        {/* Creator Roster Carousel / Full Width 8-Column Card Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span>Active Creator Roster ({roster.length} Creators)</span>
            </h2>
            <Link
              href="/studio/creators/new"
              className="text-xs font-bold text-[#FF6700] hover:text-[#ea5e00] flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Onboard New Creator</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-3">
            {roster.map((creator) => {
              const isSelected = selectedCreatorId === creator.actorPresetId;
              const clipCount = assets.filter((a) => a.creatorId === creator.actorPresetId).length;
              return (
                <div
                  key={creator.id}
                  onClick={() => {
                    setSelectedCreatorId(creator.actorPresetId);
                    const defaultClip = assets.find((a) => a.creatorId === creator.actorPresetId);
                    if (defaultClip) setSelectedAssetId(defaultClip.id);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-white border-[#7F48ED] ring-2 ring-[#7F48ED]/20 shadow-md"
                      : "bg-white hover:bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? "bg-[#7F48ED] text-white" : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {creator.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-xs text-zinc-900 truncate">{creator.name}</h3>
                        <span className="text-[10px] text-zinc-400 font-mono truncate block">{creator.handle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500 font-mono">{creator.followersCount}</span>
                    {creator.hasVideoTakes ? (
                      <span className="font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {clipCount} Takes
                      </span>
                    ) : (
                      <span className="font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-600 line-clamp-1 leading-snug">
                    {creator.niche}
                  </p>
                </div>
              );
            })}

            {/* Add New Creator Card */}
            <Link
              href="/studio/creators/new"
              className="p-3 rounded-2xl border-2 border-dashed border-[#FF6700]/30 hover:border-[#FF6700] bg-orange-50/20 hover:bg-[#FF6700]/10 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group min-h-[110px]"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-[#FF6700]/30 group-hover:border-[#FF6700] flex items-center justify-center text-[#FF6700] transition shadow-xs">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-zinc-800 group-hover:text-[#FF6700] transition">
                Add UGC Creator
              </span>
              <span className="text-[9px] text-zinc-400 font-medium">New Creator</span>
            </Link>
          </div>
        </div>

        {/* 3. Interactive Visual Trimmer Studio — Full Width 12-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5 items-start">
          {/* Left Column: Video Scrubber & Trimmer Viewport (7-8 cols) */}
          <div className="xl:col-span-7 2xl:col-span-8 bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#FF6700]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Visual Hook Trimmer Studio
                </h3>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#7F48ED]/10 text-[#7F48ED] border border-[#7F48ED]/20">
                Trim Length: {trimLength}s
              </span>
            </div>

            {/* Video Viewport */}
            <div className="relative bg-[#090D16] rounded-2xl overflow-hidden border border-zinc-300 h-[440px] sm:h-[500px] xl:h-[540px] aspect-[9/16] w-auto max-w-full mx-auto flex items-center justify-center select-none group shadow-lg">
              <video
                ref={videoRef}
                key={activeVideoSrc}
                src={activeVideoSrc}
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => {
                  console.warn("Could not load video source:", activeVideoSrc);
                }}
                className="w-full h-full object-cover"
              />

              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer z-10"
                >
                  <div className="w-14 h-14 rounded-full bg-[#7F48ED] text-white flex items-center justify-center shadow-xl shadow-[#7F48ED]/50 transform hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Floating Controls */}
              <div className="absolute top-3 left-3 z-20 bg-white/95 text-zinc-900 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-zinc-200 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Current: {currentTime.toFixed(2)}s / {duration.toFixed(1)}s</span>
              </div>

              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-7 h-7 rounded-full bg-white/95 text-zinc-900 border border-zinc-200 flex items-center justify-center shadow-xs hover:scale-105 transition cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FF6700]" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            </div>

            {/* Playback & Trim Scrubber Controls */}
            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              {/* Play / Test Loop Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl border border-zinc-200 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play Full Take"}</span>
                </button>

                <button
                  type="button"
                  onClick={playTrimLoop}
                  className="px-4 py-2 bg-[#7F48ED] hover:bg-[#6b35d6] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Loop only between the start and end trim points"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Test Trim Loop ({trimLength}s)</span>
                </button>
              </div>

              {/* Start Trim Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <span>Start Trim (Hook In-Point)</span>
                  <div className="flex items-center gap-1 font-mono">
                    <button
                      type="button"
                      onClick={() => setTrimStart((s) => Math.max(0, +(s - 0.1).toFixed(2)))}
                      className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    >
                      -0.1s
                    </button>
                    <span className="px-2 font-bold text-zinc-900">{trimStart.toFixed(2)}s</span>
                    <button
                      type="button"
                      onClick={() => setTrimStart((s) => Math.min(trimEnd - 0.5, +(s + 0.1).toFixed(2)))}
                      className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    >
                      +0.1s
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={trimStart}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < trimEnd) setTrimStart(val);
                  }}
                  className="w-full accent-[#7F48ED] cursor-pointer"
                />
              </div>

              {/* End Trim Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <span>End Trim (Hook Out-Point)</span>
                  <div className="flex items-center gap-1 font-mono">
                    <button
                      type="button"
                      onClick={() => setTrimEnd((e) => Math.max(trimStart + 0.5, +(e - 0.1).toFixed(2)))}
                      className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    >
                      -0.1s
                    </button>
                    <span className="px-2 font-bold text-zinc-900">{trimEnd.toFixed(2)}s</span>
                    <button
                      type="button"
                      onClick={() => setTrimEnd((e) => Math.min(duration, +(e + 0.1).toFixed(2)))}
                      className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    >
                      +0.1s
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={trimEnd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > trimStart) setTrimEnd(val);
                  }}
                  className="w-full accent-[#FF6700] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Asset Selection & Catalog Registration Form (4-5 cols) */}
          <div className="xl:col-span-5 2xl:col-span-4 space-y-4">
            {/* Take Library Selector */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#7F48ED]" />
                <span>Select Creator Take to Trim</span>
              </h3>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {creatorClips.map((clip) => {
                  const isSelected = selectedAssetId === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => {
                        setSelectedAssetId(clip.id);
                        setCustomVideoUrl("");
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "bg-[#7F48ED]/10 border-[#7F48ED] text-[#7F48ED] font-bold"
                          : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate">{clip.label}</span>
                        <span className="text-[10px] text-zinc-400 font-normal truncate block">
                          &ldquo;{clip.spokenText}&rdquo;
                        </span>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 ml-2">
                        {clip.durationSeconds}s
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Or Custom Raw Take URL */}
              <div className="pt-2 border-t border-zinc-100 space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Or Paste New Raw Video URL / Storage Path:
                </label>
                <input
                  type="text"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  placeholder="/creators/tyler/hooks/tyler-hook-01.mp4"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 focus:outline-none focus:border-[#7F48ED]"
                />
              </div>
            </div>

            {/* Catalog Registration Form */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Register Take to Creator Roster</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {/* Hook Angle */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Creative Hook Angle
                  </label>
                  <select
                    value={clipAngle}
                    onChange={(e) => setClipAngle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#7F48ED]"
                  >
                    <option value="problem">Problem / Agitation (Stop Scrolling)</option>
                    <option value="ugc">Authentic Review / Skeptic</option>
                    <option value="comparison">Direct Contrast / Before You Buy</option>
                    <option value="hack">Curiosity / Secret Hack</option>
                    <option value="listicle">3 Reasons / Listicle</option>
                    <option value="founder">Founder Story / BTS</option>
                    <option value="fomo">Urgency / Direct FOMO</option>
                    <option value="general">Hero Direct-to-Camera</option>
                  </select>
                </div>

                {/* Spoken Text transcription */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Spoken Hook Text (Exact Words Spoken)
                  </label>
                  <textarea
                    rows={3}
                    value={spokenText}
                    onChange={(e) => setSpokenText(e.target.value)}
                    placeholder="Enter what the creator says in this hook..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>

                {/* Clip Label */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Clip Label
                  </label>
                  <input
                    type="text"
                    value={clipLabel}
                    onChange={(e) => setClipLabel(e.target.value)}
                    placeholder="e.g. Hook 1: 3 Seconds to Load"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#7F48ED]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveAsset}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7F48ED] to-indigo-600 hover:from-[#713be2] hover:to-indigo-700 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSaving ? "Saving..." : "Save & Register Take to Generator"}</span>
                </button>

                <Link
                  href={`/studio/generate?actor=${selectedCreatorId}&hook=${encodeURIComponent(spokenText)}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6700]" />
                  <span>Open in Generator with this Hook</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white border border-[#7F48ED] font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#7F48ED] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
