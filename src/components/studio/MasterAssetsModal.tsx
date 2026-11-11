"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Volume2,
  Sparkles,
  Upload,
  Play,
  Pause,
  CheckCircle2,
  Music,
  Plus,
  Layers,
  Check,
} from "lucide-react";
import { MusicTrack, CtaTemplate } from "@/data/timelineAssets";

interface MasterAssetsModalProps {
  isOpen: boolean;
  initialTab?: "music" | "cta";
  onClose: () => void;
  musicTracks: MusicTrack[];
  ctaTemplates: CtaTemplate[];
  onTrackCreated: (track: MusicTrack) => void;
  onCtaCreated: (cta: CtaTemplate) => void;
}

export default function MasterAssetsModal({
  isOpen,
  initialTab = "music",
  onClose,
  musicTracks,
  ctaTemplates,
  onTrackCreated,
  onCtaCreated,
}: MasterAssetsModalProps) {
  const [activeTab, setActiveTab] = useState<"music" | "cta">(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Music Form State
  const [trackTitle, setTrackTitle] = useState("");
  const [trackGenre, setTrackGenre] = useState("Trendy Upbeat UGC");
  const [trackBpm, setTrackBpm] = useState(120);
  const [trackVibe, setTrackVibe] = useState("High Engagement / TikTok");
  const [trackProvider, setTrackProvider] = useState<"Epidemic Sound" | "Artlist" | "Custom Upload">("Custom Upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewAudioSrc, setPreviewAudioSrc] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // CTA Form State
  const [ctaName, setCtaName] = useState("");
  const [ctaBadge, setCtaBadge] = useState("Limited Time");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaStyleVariant, setCtaStyleVariant] = useState<"promo-stamp" | "social-proof" | "native-tag" | "luxury-card">("promo-stamp");

  // Submitting state & toast
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!trackTitle) {
        setTrackTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewAudioSrc(objectUrl);
    }
  };

  const togglePreview = () => {
    if (!previewAudioSrc) return;
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(previewAudioSrc);
      audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
    }
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play().then(() => setIsPlayingPreview(true)).catch(() => setIsPlayingPreview(false));
    }
  };

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", "music");
      formData.append("title", trackTitle.trim());
      formData.append("genre", trackGenre);
      formData.append("bpm", trackBpm.toString());
      formData.append("vibe", trackVibe);
      formData.append("provider", trackProvider);

      if (selectedFile) {
        formData.append("audioFile", selectedFile);
      }

      const res = await fetch("/api/studio/timeline-assets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.created) {
        onTrackCreated(data.created);
        setSuccessToast(`Track "${data.created.title}" added and selected!`);
        setTrackTitle("");
        setSelectedFile(null);
        setPreviewAudioSrc(null);
        setTimeout(() => {
          setSuccessToast(null);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to add track:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        type: "cta",
        name: ctaName.trim(),
        badge: ctaBadge.trim(),
        description: ctaDescription.trim() || `${ctaName.trim()} branded offer template`,
        styleVariant: ctaStyleVariant,
      };

      const res = await fetch("/api/studio/timeline-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.created) {
        onCtaCreated(data.created);
        setSuccessToast(`CTA Template "${data.created.name}" added and selected!`);
        setCtaName("");
        setTimeout(() => {
          setSuccessToast(null);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to add CTA:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7F48ED] to-[#FF6700] text-white flex items-center justify-center shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900 tracking-tight">
                Timeline &amp; Master Tracks Manager
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium">
                Add licensed music tracks, custom audio stems, and branded CTA cards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-zinc-100 border-b border-zinc-200/80 flex items-center gap-1 mx-4 sm:mx-5 mt-3 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("music")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "music"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Music className="w-3.5 h-3.5 text-[#7F48ED]" />
            <span>Music Library ({musicTracks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cta")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "cta"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6700]" />
            <span>CTA Templates ({ctaTemplates.length})</span>
          </button>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="mx-4 sm:mx-5 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === "music" ? (
            <form onSubmit={handleCreateTrack} className="space-y-3.5">
              <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-[#7F48ED] uppercase tracking-wider block">
                  Step 1: Upload Audio File (.MP3, .WAV)
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/mp3,audio/wav,audio/mpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-purple-300 hover:border-[#7F48ED] bg-white rounded-xl text-xs font-bold text-zinc-700 hover:text-[#7F48ED] flex flex-col items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-[#7F48ED]" />
                  <span>{selectedFile ? selectedFile.name : "Select MP3 Track from Computer"}</span>
                  <span className="text-[10px] font-normal text-zinc-400">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready` : "MP3 or WAV · Cleared for Commercial Ads"}
                  </span>
                </button>

                {previewAudioSrc && (
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-purple-200 mt-2">
                    <span className="text-xs font-bold text-zinc-800 truncate">Audio Preview</span>
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="px-3 py-1 bg-[#7F48ED] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingPreview ? "Pause" : "Test Playback"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Track Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Track Title
                  </label>
                  <input
                    type="text"
                    required
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="e.g. Neon Horizon Drive"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Genre / Style
                  </label>
                  <select
                    value={trackGenre}
                    onChange={(e) => setTrackGenre(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition cursor-pointer"
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    BPM (Tempo)
                  </label>
                  <input
                    type="number"
                    value={trackBpm}
                    onChange={(e) => setTrackBpm(parseInt(e.target.value, 10) || 120)}
                    placeholder="120"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Licensing Source
                  </label>
                  <select
                    value={trackProvider}
                    onChange={(e) => setTrackProvider(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#7F48ED] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Custom Upload">Custom Upload (Client License)</option>
                    <option value="Epidemic Sound">Epidemic Sound Library</option>
                    <option value="Artlist">Artlist Commercial Library</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !trackTitle.trim()}
                className="w-full mt-2 py-3 bg-[#7F48ED] hover:bg-[#6b35d6] text-white rounded-xl text-xs font-black transition shadow-lg shadow-[#7F48ED]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? "Uploading & Registering..." : "Add to Studio Music Library"}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateCta} className="space-y-3.5">
              <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-[#FF6700] uppercase tracking-wider block">
                  Design Branded Motion CTA Template
                </span>
                <p className="text-[11px] text-zinc-600">
                  Custom CTAs display during the final 15.5s – 22s ad closing card.
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={ctaName}
                    onChange={(e) => setCtaName(e.target.value)}
                    placeholder="e.g. Black Friday VIP Stamp"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                      Pill Badge Text
                    </label>
                    <input
                      type="text"
                      value={ctaBadge}
                      onChange={(e) => setCtaBadge(e.target.value)}
                      placeholder="e.g. 50% Off Today"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                      Visual Style Preset
                    </label>
                    <select
                      value={ctaStyleVariant}
                      onChange={(e) => setCtaStyleVariant(e.target.value as any)}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition cursor-pointer"
                    >
                      <option value="promo-stamp">High-Contrast Promo Stamp</option>
                      <option value="social-proof">⭐⭐⭐⭐⭐ 5-Star Social Proof</option>
                      <option value="native-tag">TikTok/IG Native Store Tag</option>
                      <option value="luxury-card">Minimalist Luxury Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Description / Use Case
                  </label>
                  <input
                    type="text"
                    value={ctaDescription}
                    onChange={(e) => setCtaDescription(e.target.value)}
                    placeholder="e.g. High urgency flash sale closing card with animated button"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#FF6700] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !ctaName.trim()}
                className="w-full mt-2 py-3 bg-[#FF6700] hover:bg-[#e55c00] text-white rounded-xl text-xs font-black transition shadow-lg shadow-[#FF6700]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? "Creating Template..." : "Save Custom CTA Template"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
