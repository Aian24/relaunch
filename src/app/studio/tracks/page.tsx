"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  Upload,
  Sparkles,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Video,
  Users,
  FolderOpen,
  ShieldCheck,
  AlertCircle,
  X,
  Sliders,
  Layers,
  Repeat,
  Download,
  Info,
  Check,
} from "lucide-react";
import { MusicTrack, CtaTemplate, BRAND_COLOR_PRESETS, TRUST_BADGE_PRESETS } from "@/data/timelineAssets";

const GENRES = [
  "all",
  "Trendy Upbeat UGC",
  "High-Energy Direct Response",
  "Tech Driving Beat",
  "Chill Lo-Fi Aesthetic",
  "Luxury Cinematic",
  "Acoustic Folk Vlog",
  "Hip Hop Beat",
];

const CTA_STYLES = [
  { id: "all", label: "All Styles" },
  { id: "promo-stamp", label: "Promo Stamp" },
  { id: "social-proof", label: "⭐⭐⭐⭐⭐ Social Proof" },
  { id: "native-tag", label: "TikTok Native Tag" },
  { id: "luxury-card", label: "Luxury Minimalist" },
];

export default function MasterTracksPage() {
  const [activeTab, setActiveTab] = useState<"music" | "cta" | "specs" | "trash">("music");
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [trashedMusic, setTrashedMusic] = useState<MusicTrack[]>([]);
  const [ctaTemplates, setCtaTemplates] = useState<CtaTemplate[]>([]);
  const [trashedCtas, setTrashedCtas] = useState<CtaTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedCtaStyle, setSelectedCtaStyle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Audio Playback Engine
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeAudioTrack, setActiveAudioTrack] = useState<MusicTrack | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals & Drawers
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showCtaModal, setShowCtaModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Track Form State
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("Trendy Upbeat UGC");
  const [newBpm, setNewBpm] = useState(120);
  const [newVibe, setNewVibe] = useState("High Engagement / TikTok");
  const [newProvider, setNewProvider] = useState<"Epidemic Sound" | "Artlist" | "Custom Upload">("Custom Upload");
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [previewAudioSrc, setPreviewAudioSrc] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New CTA Form State
  const [newCtaName, setNewCtaName] = useState("");
  const [newCtaBadge, setNewCtaBadge] = useState("50% Off Today");
  const [newCtaHeadline, setNewCtaHeadline] = useState("Claim Your Offer");
  const [newCtaButton, setNewCtaButton] = useState("Shop Now · Free Shipping");
  const [newCtaDescription, setNewCtaDescription] = useState("");
  const [newCtaStyle, setNewCtaStyle] = useState<"promo-stamp" | "social-proof" | "native-tag" | "luxury-card">("promo-stamp");
  const [newCtaColor, setNewCtaColor] = useState("#FF6700");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load assets from API
  const loadAssets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/studio/timeline-assets?view=all");
      const data = await res.json();
      if (data.success) {
        setMusicTracks(data.musicTracks || []);
        setTrashedMusic(data.trashedMusic || []);
        setCtaTemplates(data.ctaTemplates || []);
        setTrashedCtas(data.trashedCtas || []);
      }
    } catch (err) {
      console.error("Failed to fetch timeline assets:", err);
      showToast("Error loading master assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Audio Playback Management
  const togglePlayTrack = (track: MusicTrack) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.loop = isLooping;

      audioRef.current.ontimeupdate = () => {
        if (!audioRef.current) return;
        setAudioCurrentTime(audioRef.current.currentTime);
        if (audioRef.current.duration) {
          setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      audioRef.current.onloadedmetadata = () => {
        if (!audioRef.current) return;
        setAudioDuration(audioRef.current.duration || 0);
      };

      audioRef.current.onended = () => {
        if (!isLooping) {
          setPlayingTrackId(null);
          setAudioProgress(0);
        }
      };
    }

    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = track.src;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setPlayingTrackId(track.id);
          setActiveAudioTrack(track);
        })
        .catch((err) => {
          console.warn("Autoplay was blocked or audio source unavailable:", err);
          showToast(`Cannot play "${track.title}" (file source unavailable)`);
          setPlayingTrackId(null);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioProgress(val);
    if (audioRef.current && audioDuration) {
      audioRef.current.currentTime = (val / 100) * audioDuration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume > 0 ? volume : 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    if (audioRef.current) audioRef.current.loop = next;
  };

  // Trash & Restore Actions
  const handleMoveToTrash = async (item: MusicTrack | CtaTemplate, type: "music" | "cta") => {
    const itemName = "title" in item ? item.title : item.name;
    if (!confirm(`Move "${itemName}" to Trash?`)) return;

    try {
      const res = await fetch("/api/studio/timeline-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "trash",
          id: item.id,
          type,
        }),
      });

      if (res.ok) {
        showToast(`Moved "${itemName}" to Trash`);
        if (playingTrackId === item.id && audioRef.current) {
          audioRef.current.pause();
          setPlayingTrackId(null);
        }
        await loadAssets();
      } else {
        showToast("Failed to move asset to Trash");
      }
    } catch {
      showToast("Error processing request");
    }
  };

  const handleRestore = async (item: MusicTrack | CtaTemplate, type: "music" | "cta") => {
    const itemName = "title" in item ? item.title : item.name;
    try {
      const res = await fetch("/api/studio/timeline-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore",
          id: item.id,
          type,
        }),
      });

      if (res.ok) {
        showToast(`Restored "${itemName}" to active library`);
        await loadAssets();
      } else {
        showToast("Failed to restore asset");
      }
    } catch {
      showToast("Error restoring asset");
    }
  };

  const handlePermanentDelete = async (item: MusicTrack | CtaTemplate, type: "music" | "cta") => {
    const itemName = "title" in item ? item.title : item.name;
    if (!confirm(`Permanently delete "${itemName}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(
        `/api/studio/timeline-assets?id=${encodeURIComponent(item.id)}&type=${type}&permanent=true`,
        { method: "DELETE" }
      );

      if (res.ok) {
        showToast(`Permanently deleted "${itemName}"`);
        await loadAssets();
      } else {
        showToast("Failed to permanently delete asset");
      }
    } catch {
      showToast("Error deleting asset");
    }
  };

  const handleEmptyTrash = async () => {
    if (trashedMusic.length === 0 && trashedCtas.length === 0) return;
    if (!confirm(`Permanently erase all ${trashedMusic.length + trashedCtas.length} items in Trash?`)) return;

    try {
      const res = await fetch("/api/studio/timeline-assets?emptyTrash=true", {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Trash emptied completely");
        await loadAssets();
      }
    } catch {
      showToast("Error emptying trash");
    }
  };

  // Submit Upload Audio Track
  const handleUploadTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Please provide a track title");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", "music");
      formData.append("title", newTitle.trim());
      formData.append("genre", newGenre);
      formData.append("bpm", newBpm.toString());
      formData.append("vibe", newVibe);
      formData.append("provider", newProvider);

      if (selectedAudioFile) {
        formData.append("audioFile", selectedAudioFile);
      } else {
        formData.append("src", "/audio/music/trendy-upbeat-ugc.mp3");
      }

      const res = await fetch("/api/studio/timeline-assets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.created) {
        showToast(`✓ Track "${data.created.title}" added to Master Library!`);
        setNewTitle("");
        setSelectedAudioFile(null);
        setPreviewAudioSrc(null);
        setShowUploadModal(false);
        await loadAssets();
      } else {
        showToast(data.error || "Failed to add track");
      }
    } catch {
      showToast("Error uploading track");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Create CTA Template
  const handleCreateCta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCtaName.trim()) {
      showToast("Please provide a template name");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: "cta",
        name: newCtaName.trim(),
        badge: newCtaBadge.trim(),
        headline: newCtaHeadline.trim(),
        buttonText: newCtaButton.trim(),
        description: newCtaDescription.trim() || `${newCtaName.trim()} branded offer template`,
        styleVariant: newCtaStyle,
        accentColor: newCtaColor,
      };

      const res = await fetch("/api/studio/timeline-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.created) {
        showToast(`✓ CTA Template "${data.created.name}" created!`);
        setNewCtaName("");
        setShowCtaModal(false);
        await loadAssets();
      } else {
        showToast(data.error || "Failed to create CTA template");
      }
    } catch {
      showToast("Error creating CTA template");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered lists
  const filteredMusic = musicTracks.filter((track) => {
    const matchesGenre = selectedGenre === "all" || track.genre.toLowerCase() === selectedGenre.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.provider && track.provider.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  const filteredCtas = ctaTemplates.filter((cta) => {
    const matchesStyle = selectedCtaStyle === "all" || cta.styleVariant === selectedCtaStyle;
    const matchesSearch =
      !searchQuery.trim() ||
      cta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cta.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cta.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesSearch;
  });

  const totalTrashCount = trashedMusic.length + trashedCtas.length;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0E121B] text-white flex flex-col font-sans selection:bg-[#7F48ED]/30 selection:text-[#7F48ED]">
      {/* 1. Top Header Bar — Full Width Workstation */}
      <header className="border-b border-zinc-800 bg-[#121824]/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3 shrink-0 shadow-xs">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/studio/generate"
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer shrink-0"
              title="Return to Studio Generator"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7F48ED] bg-[#7F48ED]/10 px-2 py-0.5 rounded border border-[#7F48ED]/30">
                  Master Tracks &amp; Motion Assets
                </span>
                <span className="text-[10px] text-zinc-400 hidden xs:inline">80/20 Quality Finishing</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2 truncate">
                <span>Timeline &amp; Master Tracks Manager</span>
              </h1>
            </div>
          </div>

          {/* Header Action Buttons — Single Icons, No Duplicate + Signs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#7F48ED] hover:bg-[#6b35d6] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#7F48ED]/20 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Audio Track</span>
              <span className="sm:hidden">Upload</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCtaModal(true)}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#FF6700] hover:bg-[#e55c00] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Design CTA Card</span>
              <span className="sm:hidden">New CTA</span>
            </button>

            {/* Hub Navigation Links */}
            <div className="h-4 w-px bg-zinc-800 hidden md:block mx-0.5" />

            <Link
              href="/studio/generate"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
              title="Open Generator"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6700]" />
              <span>Generator</span>
            </Link>

            <Link
              href="/studio/assets"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
              title="Open Brand Media"
            >
              <Video className="w-3.5 h-3.5 text-[#FF6700]" />
              <span>Brand Media</span>
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
              href="/studio/approved"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
              title="Open Vault"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vault</span>
            </Link>

            <Link
              href="/studio/review"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
              title="Open Review"
            >
              <Eye className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span className="hidden sm:inline">Review</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 p-3 bg-zinc-900 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Workstation Container — Full Width Edge-to-Edge */}
      <main className="w-full p-3 sm:p-5 lg:p-6 space-y-5 flex-1">
        {/* Executive Banner & Tab Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141B2B] p-4 rounded-2xl border border-zinc-800 shadow-sm">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("music")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "music"
                  ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Music Library ({musicTracks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cta")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "cta"
                  ? "bg-[#FF6700] text-white shadow-md shadow-[#FF6700]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Motion CTA Templates ({ctaTemplates.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "specs"
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-zinc-300" />
              <span>Audio Specs &amp; XML</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("trash")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "trash"
                  ? "bg-red-950 text-red-200 border border-red-800/80"
                  : "text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trash ({totalTrashCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks, genre, CTA..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7F48ED] transition placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 3. DOCKED REAL-TIME AUDIO PLAYER (visible when a track is playing or selected) */}
        {activeAudioTrack && (
          <div className="sticky top-16 z-30 bg-[#121824] border border-[#7F48ED]/40 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            {/* Left: Track Meta */}
            <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => togglePlayTrack(activeAudioTrack)}
                className="w-10 h-10 rounded-xl bg-[#7F48ED] hover:bg-[#6b35d6] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#7F48ED]/25 transition cursor-pointer"
              >
                {playingTrackId === activeAudioTrack.id ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white truncate">{activeAudioTrack.title}</span>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/60">
                    {activeAudioTrack.bpm} BPM
                  </span>
                  {activeAudioTrack.provider && (
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded hidden sm:inline">
                      {activeAudioTrack.provider}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 truncate flex items-center gap-2">
                  <span>{activeAudioTrack.genre}</span>
                  <span>•</span>
                  <span>{activeAudioTrack.vibe}</span>
                </div>
              </div>
            </div>

            {/* Middle: Scrub Slider & Duration */}
            <div className="w-full md:flex-1 max-w-xl flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400 w-9 text-right shrink-0">
                {formatTime(audioCurrentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={audioProgress}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7F48ED]"
              />
              <span className="text-[11px] font-mono text-zinc-400 w-9 shrink-0">
                {audioDuration > 0 ? formatTime(audioDuration) : "--:--"}
              </span>
            </div>

            {/* Right: Volume, Loop & Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={toggleLoop}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  isLooping ? "text-[#7F48ED] bg-[#7F48ED]/10" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title={isLooping ? "Loop enabled" : "Loop disabled"}
              >
                <Repeat className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7F48ED]"
                />
              </div>

              <Link
                href={`/studio/generate?musicTrack=${encodeURIComponent(activeAudioTrack.id)}`}
                className="px-3 py-1.5 bg-[#FF6700] hover:bg-[#e55c00] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-md shadow-[#FF6700]/20 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Use in Generator</span>
              </Link>
            </div>
          </div>
        )}

        {/* 4. TAB 1: MUSIC LIBRARY */}
        {activeTab === "music" && (
          <div className="space-y-4">
            {/* Genre Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-[#7F48ED]" />
                <span>Genre:</span>
              </span>
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedGenre === g
                      ? "bg-[#7F48ED] text-white shadow-sm"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {g === "all" ? "All Genres" : g}
                </button>
              ))}
            </div>

            {/* Grid of Music Tracks */}
            {isLoading ? (
              <div className="p-12 text-center text-zinc-400">Loading master music library...</div>
            ) : filteredMusic.length === 0 ? (
              <div className="p-12 bg-[#141B2B] rounded-2xl border border-zinc-800 text-center space-y-3">
                <Music className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-300">No music tracks match your search or filter</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenre("all");
                    setSearchQuery("");
                  }}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200 transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredMusic.map((track) => {
                  const isPlaying = playingTrackId === track.id;
                  return (
                    <div
                      key={track.id}
                      className={`p-4 rounded-2xl border transition relative flex flex-col justify-between gap-3 ${
                        isPlaying
                          ? "bg-[#181D2E] border-[#7F48ED] shadow-lg shadow-[#7F48ED]/10"
                          : "bg-[#141B2B] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#161E30]"
                      }`}
                    >
                      {/* Top Row: Play button + Title */}
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => togglePlayTrack(track)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition cursor-pointer shadow-md ${
                            isPlaying
                              ? "bg-[#7F48ED] text-white animate-pulse"
                              : "bg-zinc-800 hover:bg-[#7F48ED] text-zinc-300 hover:text-white"
                          }`}
                          title={isPlaying ? "Pause track" : "Play preview"}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-white" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm text-white truncate">{track.title}</h3>
                            {track.isCustom && (
                              <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-800 px-1.5 py-0.2 rounded">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7F48ED] font-semibold truncate mt-0.5">
                            {track.genre}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Simulated Waveform Bars */}
                      <div className="flex items-center gap-1 h-6 px-2 bg-black/30 rounded-lg overflow-hidden">
                        {[40, 75, 20, 90, 60, 30, 85, 45, 100, 70, 50, 80, 35, 95, 65, 40, 85, 55, 75, 30].map(
                          (h, idx) => (
                            <div
                              key={idx}
                              style={{ height: `${isPlaying ? Math.max(15, Math.round(h * Math.random())) : h * 0.4}%` }}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isPlaying ? "bg-[#7F48ED]" : "bg-zinc-700"
                              }`}
                            />
                          )
                        )}
                      </div>

                      {/* Metadata Details */}
                      <div className="text-[11px] text-zinc-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 font-medium">Tempo:</span>
                          <span className="font-mono font-bold text-zinc-300">{track.bpm} BPM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 font-medium">Provider:</span>
                          <span className="text-zinc-300 font-medium">{track.provider || "Studio Library"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 font-medium">License:</span>
                          <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Commercial Cleared
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <Link
                          href={`/studio/generate?musicTrack=${encodeURIComponent(track.id)}`}
                          className="px-2.5 py-1.5 bg-[#FF6700] hover:bg-[#e55c00] text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Use in Generator</span>
                        </Link>

                        <div className="flex items-center gap-1">
                          {track.src && (
                            <a
                              href={track.src}
                              download
                              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                              title="Download MP3"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleMoveToTrash(track, "music")}
                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white rounded-lg border border-red-800/40 transition cursor-pointer"
                            title="Move to Trash"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 2: MOTION CTA TEMPLATES */}
        {activeTab === "cta" && (
          <div className="space-y-4">
            {/* Style Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-[#FF6700]" />
                <span>Style:</span>
              </span>
              {CTA_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedCtaStyle(st.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCtaStyle === st.id
                      ? "bg-[#FF6700] text-white shadow-sm"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Grid of CTA Cards with 9:16 Vertical Video End-Card Preview */}
            {isLoading ? (
              <div className="p-12 text-center text-zinc-400">Loading CTA templates...</div>
            ) : filteredCtas.length === 0 ? (
              <div className="p-12 bg-[#141B2B] rounded-2xl border border-zinc-800 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-300">No CTA templates found</p>
                <button
                  type="button"
                  onClick={() => setSelectedCtaStyle("all")}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200 transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredCtas.map((cta) => {
                  return (
                    <div
                      key={cta.id}
                      className="bg-[#141B2B] rounded-2xl border border-zinc-800 hover:border-zinc-700 p-3.5 flex flex-col justify-between gap-3.5 transition group"
                    >
                      {/* Interactive 9:16 Vertical Commercial Simulation Frame */}
                      <div className="relative aspect-[9/16] max-h-72 w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#1b2336] via-[#101524] to-[#0a0d17] border border-zinc-700/60 p-3 flex flex-col justify-between items-center text-center shadow-inner">
                        {/* Top Timing Indicator */}
                        <div className="w-full flex items-center justify-between text-[9px] font-mono text-zinc-400">
                          <span className="bg-black/60 px-1.5 py-0.5 rounded border border-white/10">15.5s–22s</span>
                          <span className="text-[#FF6700] font-bold">End-Card</span>
                        </div>

                        {/* Middle: Badge & Headline Preview */}
                        <div className="space-y-2 my-auto px-2">
                          <div className="inline-block px-2.5 py-1 rounded-full bg-[#FF6700]/20 border border-[#FF6700] text-[#FF6700] text-[10px] font-black uppercase tracking-wider shadow-md">
                            {cta.badge}
                          </div>

                          <div className="text-xs font-black text-white leading-tight">
                            {cta.headline || cta.name}
                          </div>

                          <div className="text-[10px] text-zinc-300 line-clamp-2">
                            {cta.description}
                          </div>
                        </div>

                        {/* Bottom: Simulated Call to Action Button */}
                        <div className="w-full space-y-1.5">
                          <div className="w-full py-2 bg-[#FF6700] text-white rounded-lg font-black text-[10px] shadow-lg shadow-[#FF6700]/30 tracking-tight">
                            {cta.buttonText || "Shop Now · Claim Offer"}
                          </div>
                          <div className="text-[8px] text-zinc-500 font-mono">
                            ReLaunch High-Conversion Preset
                          </div>
                        </div>
                      </div>

                      {/* Metadata & Controls */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white truncate">{cta.name}</h4>
                          {cta.isCustom && (
                            <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-950/80 px-1.5 py-0.2 rounded border border-orange-800">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          Style: <span className="text-zinc-200 capitalize">{cta.styleVariant || "Promo Stamp"}</span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                        <Link
                          href={`/studio/generate?ctaId=${encodeURIComponent(cta.id)}`}
                          className="px-2.5 py-1.5 bg-[#FF6700] hover:bg-[#e55c00] text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs flex-1 justify-center"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Use in Generator</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleMoveToTrash(cta, "cta")}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white rounded-lg border border-red-800/40 transition cursor-pointer"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 3: AUDIO SPECS & XML SPECIFICATION */}
        {activeTab === "specs" && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#141B2B] rounded-2xl border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#7F48ED]" />
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  DAW Stem Separation &amp; Audio Ducking Standards
                </h2>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                ReLaunch Studio follows the 80/20 Quality Rule: the generator handles ~80% of timing, cuts, and loudness balance, allowing a human creative director to finish the remaining 20% in DaVinci Resolve, Adobe Premiere Pro, or Final Cut Pro with separate audio stems.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7F48ED]" />
                      Track A1: Voice-Over (VO Stem)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">-14 LUFS</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Clean dialogue stem without background music. Word-level timing matches animated captions. Normalized to broadcast standards.
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF6700]" />
                      Track A2: Licensed BGM (Music Stem)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">-18 dB Ducking</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Fully ducked audio bed. When voice-over is speaking, BGM automatically drops by 18dB. Restores to full energy during opening hook and closing CTA.
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Track V1: Video Cuts
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">4K Master / 9:16</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    4 cuts: Scene 1 (0–3.5s UGC Hook), Scene 2 (3.5–9.5s Product Footage), Scene 3 (9.5–15.5s B-roll demo), Scene 4 (15.5–22s Motion CTA Card).
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Timeline XML Export
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">xmeml v5 / FCP7</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    1-Click DaVinci Resolve &amp; Adobe Premiere Pro project generation. Imports with all cuts and separate A1/A2 audio tracks already in place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB 4: TRASH & RECOVERY */}
        {activeTab === "trash" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#141B2B] p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-white">
                  Trash Queue ({totalTrashCount} deleted items)
                </span>
              </div>

              {totalTrashCount > 0 && (
                <button
                  type="button"
                  onClick={handleEmptyTrash}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-700/60 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Empty Trash</span>
                </button>
              )}
            </div>

            {totalTrashCount === 0 ? (
              <div className="p-12 bg-[#141B2B] rounded-2xl border border-zinc-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-zinc-300">Trash is empty</p>
                <p className="text-xs text-zinc-500">Deleted music tracks or CTA templates will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Trashed Music Tracks */}
                {trashedMusic.map((track) => (
                  <div
                    key={track.id}
                    className="p-4 bg-[#141B2B] border border-red-900/40 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="font-bold text-sm text-white truncate">{track.title}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                        {track.genre} · {track.bpm} BPM · {track.provider || "Custom"}
                      </div>
                      {track.deletedAt && (
                        <div className="text-[10px] text-zinc-500 mt-1">
                          Deleted: {new Date(track.deletedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRestore(track, "music")}
                        className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Restore to active library"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePermanentDelete(track, "music")}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 hover:text-white rounded-lg border border-red-800 transition cursor-pointer"
                        title="Permanently erase file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Trashed CTA Templates */}
                {trashedCtas.map((cta) => (
                  <div
                    key={cta.id}
                    className="p-4 bg-[#141B2B] border border-red-900/40 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="font-bold text-sm text-white truncate">{cta.name}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                        Badge: {cta.badge} · {cta.description}
                      </div>
                      {cta.deletedAt && (
                        <div className="text-[10px] text-zinc-500 mt-1">
                          Deleted: {new Date(cta.deletedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRestore(cta, "cta")}
                        className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Restore to active library"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePermanentDelete(cta, "cta")}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 hover:text-white rounded-lg border border-red-800 transition cursor-pointer"
                        title="Permanently erase template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 8. MODAL: UPLOAD AUDIO TRACK */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-[#141B2B] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#7F48ED] text-white flex items-center justify-center shadow-md">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Upload Licensed Commercial Audio Track</h3>
                  <p className="text-[11px] text-zinc-400">MP3 or WAV stems for commercial video ads</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadTrack} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* File Dropzone */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-[#7F48ED] uppercase tracking-wider block">
                  Audio File (.MP3, .WAV)
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/mp3,audio/wav,audio/mpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedAudioFile(file);
                      if (!newTitle) {
                        setNewTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
                      }
                      setPreviewAudioSrc(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-4 border-2 border-dashed border-zinc-700 hover:border-[#7F48ED] bg-zinc-900/40 rounded-xl text-xs font-bold text-zinc-300 hover:text-[#7F48ED] flex flex-col items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-[#7F48ED]" />
                  <span>{selectedAudioFile ? selectedAudioFile.name : "Select MP3 Track from Computer"}</span>
                  <span className="text-[10px] font-normal text-zinc-400">
                    {selectedAudioFile
                      ? `${(selectedAudioFile.size / (1024 * 1024)).toFixed(2)} MB · Ready`
                      : "Stereo 48kHz / 24-bit · Cleared for Commercial Ads"}
                  </span>
                </button>
              </div>

              {/* Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Track Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Neon Horizon Drive"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Genre / Style
                  </label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="Trendy Upbeat UGC">Trendy Upbeat UGC</option>
                    <option value="High-Energy Direct Response">High-Energy Direct Response</option>
                    <option value="Tech Driving Beat">Tech Driving Beat</option>
                    <option value="Chill Lo-Fi Aesthetic">Chill Lo-Fi Aesthetic</option>
                    <option value="Luxury Cinematic">Luxury Cinematic</option>
                    <option value="Acoustic Folk Vlog">Acoustic Folk Vlog</option>
                    <option value="Hip Hop Beat">Hip Hop Beat</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    BPM (Tempo)
                  </label>
                  <input
                    type="number"
                    value={newBpm}
                    onChange={(e) => setNewBpm(parseInt(e.target.value, 10) || 120)}
                    placeholder="120"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Licensing Source
                  </label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="Custom Upload">Custom Upload (Client License)</option>
                    <option value="Epidemic Sound">Epidemic Sound Library</option>
                    <option value="Artlist">Artlist Commercial Library</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Vibe &amp; Use Case
                </label>
                <input
                  type="text"
                  value={newVibe}
                  onChange={(e) => setNewVibe(e.target.value)}
                  placeholder="e.g. High Engagement / Fast Paced TikTok Hook"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim()}
                className="w-full mt-2 py-3 bg-[#7F48ED] hover:bg-[#6b35d6] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#7F48ED]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? "Uploading Track..." : "Register Track in Master Library"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: DESIGN CTA TEMPLATE */}
      {showCtaModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-[#141B2B] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF6700] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Design Branded Motion CTA Template</h3>
                  <p className="text-[11px] text-zinc-400">High-conversion ending cards (15.5s–22s scene)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCtaModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 overflow-y-auto flex-1">
              {/* Left: Input Form */}
              <form onSubmit={handleCreateCta} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCtaName}
                    onChange={(e) => setNewCtaName(e.target.value)}
                    placeholder="e.g. Flash 50% Off Stamp"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={newCtaBadge}
                    onChange={(e) => setNewCtaBadge(e.target.value)}
                    placeholder="e.g. 50% Off Today"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={newCtaHeadline}
                    onChange={(e) => setNewCtaHeadline(e.target.value)}
                    placeholder="e.g. Claim Your Special Offer"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Button Action Text
                  </label>
                  <input
                    type="text"
                    value={newCtaButton}
                    onChange={(e) => setNewCtaButton(e.target.value)}
                    placeholder="e.g. Shop Now · Free Express Delivery"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Visual Style Preset
                  </label>
                  <select
                    value={newCtaStyle}
                    onChange={(e) => setNewCtaStyle(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="promo-stamp">High-Contrast Promo Stamp</option>
                    <option value="social-proof">⭐⭐⭐⭐⭐ Social Proof Rating</option>
                    <option value="native-tag">TikTok/IG Native Store Tag</option>
                    <option value="luxury-card">Minimalist Luxury Card</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newCtaName.trim()}
                  className="w-full py-3 bg-[#FF6700] hover:bg-[#e55c00] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#FF6700]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? "Saving Template..." : "Save Custom CTA Template"}</span>
                </button>
              </form>

              {/* Right: Live Interactive 9:16 Preview */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block">
                  Live Vertical 9:16 Preview
                </span>
                <div className="relative aspect-[9/16] w-full max-w-[210px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1b2336] via-[#101524] to-[#0a0d17] border-2 border-[#FF6700]/50 p-4 flex flex-col justify-between items-center text-center shadow-2xl">
                  <div className="w-full flex items-center justify-between text-[8px] font-mono text-zinc-400">
                    <span className="bg-black/60 px-1 py-0.5 rounded">Scene 4</span>
                    <span className="text-[#FF6700] font-bold">15.5s–22s</span>
                  </div>

                  <div className="space-y-2 px-1 my-auto">
                    <div className="inline-block px-2.5 py-1 rounded-full bg-[#FF6700]/20 border border-[#FF6700] text-[#FF6700] text-[9px] font-black uppercase tracking-wider">
                      {newCtaBadge || "Special Offer"}
                    </div>

                    <div className="text-xs font-black text-white leading-tight">
                      {newCtaHeadline || newCtaName || "Your Headline Here"}
                    </div>
                  </div>

                  <div className="w-full space-y-1">
                    <div className="w-full py-2 bg-[#FF6700] text-white rounded-lg font-black text-[10px] shadow-lg shadow-[#FF6700]/30">
                      {newCtaButton || "Shop Now"}
                    </div>
                    <div className="text-[7px] text-zinc-500 font-mono">
                      ReLaunch Studio Motion Graphic
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
