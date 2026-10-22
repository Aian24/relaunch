"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Square,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Send,
  Eye,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface VariantItem {
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
  status: "needs_review" | "approved" | "rejected";
  disclosureApplied: boolean;
  audioLufs: number;
  scriptBody: string;
  ctaText: string;
  forbiddenClaims: string[];
  createdAt: string;
}

export default function StudioReviewPortal() {
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "4:5">("9:16");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [filterClient, setFilterClient] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mandatory 60-Second Human QA Checklist State
  const [checklist, setChecklist] = useState({
    briefMatch: false,
    syncClean: false,
    disclosureVisible: false,
    audioNormalized: false,
    noArtifacts: false,
  });

  const [recutModalOpen, setRecutModalOpen] = useState(false);
  const [recutNotes, setRecutNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Fetch variants from API
  useEffect(() => {
    fetch("/api/studio/review")
      .then((res) => res.json())
      .then((data) => {
        if (data.variants && data.variants.length > 0) {
          setVariants(data.variants);
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch((err) => console.error("Failed to load review variants", err));
  }, []);

  // Reset checklist when switching variants
  useEffect(() => {
    setChecklist({
      briefMatch: false,
      syncClean: false,
      disclosureVisible: false,
      audioNormalized: false,
      noArtifacts: false,
    });
    setIsPlaying(true);
  }, [selectedVariant?.id]);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDecision = async (decision: "approve" | "reject" | "recut") => {
    if (!selectedVariant) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/studio/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          decision,
          reviewerName: "Client Reviewer",
          notes: decision === "recut" ? recutNotes : undefined,
          checklist,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        // Update local state
        setVariants((prev) =>
          prev.map((v) =>
            v.id === selectedVariant.id ? { ...v, status: data.updatedStatus } : v
          )
        );
        setSelectedVariant((prev) => (prev ? { ...prev, status: data.updatedStatus } : null));

        if (decision === "approve") {
          showToast(`✓ Ad approved! Your video is ready to publish.`);
        } else if (decision === "reject") {
          showToast(`✕ Ad marked as declined.`);
        } else if (decision === "recut") {
          showToast(`✓ Change request received! Revision in progress.`);
          setRecutModalOpen(false);
          setRecutNotes("");
        }
      }
    } catch {
      showToast("Error recording response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVariants = variants.filter((v) => {
    if (filterClient === "all") return true;
    return v.clientName.toLowerCase().includes(filterClient.toLowerCase());
  });

  const pendingCount = variants.filter((v) => v.status === "needs_review").length;

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0E1017]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/studio"
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">ReLaunch Studio</span>
            <span className="bg-[#7F48ED]/20 text-[#A78BFA] border border-[#7F48ED]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Ad Review Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Counter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF6700] animate-pulse" />
            <span className="text-gray-300 font-medium">
              <strong className="text-white">{pendingCount}</strong> {pendingCount === 1 ? "Ad" : "Ads"} to Review
            </span>
          </div>
        </div>
      </header>

      {/* Main Review Workplace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Queue of Variants */}
        <aside className="w-80 border-r border-white/10 bg-[#0E1017]/60 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 block">
              Select Business
            </label>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full bg-[#181A24] border border-white/10 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-[#7F48ED]"
            >
              <option value="all">All Ads ({variants.length})</option>
              <option value="Chicago Dog">Chicago Dog House</option>
              <option value="Dance Fusion">Dance Fusion AZ</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredVariants.map((item) => {
              const isSelected = selectedVariant?.id === item.id;
              const isApproved = item.status === "approved";
              const isRejected = item.status === "rejected";

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedVariant(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? "bg-[#7F48ED]/20 border-[#7F48ED] shadow-lg shadow-[#7F48ED]/15"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {item.clientName}
                    </span>
                    {isApproved ? (
                      <span className="bg-[#7F48ED]/25 text-[#C4B5FD] border border-[#7F48ED]/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ✓ APPROVED
                      </span>
                    ) : isRejected ? (
                      <span className="bg-white/10 text-gray-300 border border-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ✕ DECLINED
                      </span>
                    ) : (
                      <span className="bg-[#FF6700]/20 text-[#FF8533] border border-[#FF6700]/40 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                        Ready for Review
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    &ldquo;{item.hookText}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                    <span>{item.angle.split("/")[0]}</span>
                    <span className="text-[#A78BFA] font-medium">All Formats Ready</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: Multi-Ratio Synchronized Video Player */}
        <main className="flex-1 bg-black/40 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
          {/* Ratio Selector Tabs + Full Screen Quick Button */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-[#12141D] p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === "9:16"
                    ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Story &amp; Reel (9:16)</span>
              </button>

              <button
                onClick={() => setAspectRatio("1:1")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === "1:1"
                    ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Square Feed (1:1)</span>
              </button>

              <button
                onClick={() => setAspectRatio("4:5")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === "4:5"
                    ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-mono font-bold">4:5</span>
                <span>Portrait Feed (4:5)</span>
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-all border border-white/10 cursor-pointer"
              title="Toggle Full Screen (or double-click video)"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#FF6700]" />
                  <span>Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#FF6700]" />
                  <span>Full Screen</span>
                </>
              )}
            </button>
          </div>

          {/* Active Video Player Viewport */}
          <div className="relative flex items-center justify-center w-full flex-1 min-h-[500px]">
            {selectedVariant ? (
              <div
                ref={videoContainerRef}
                onDoubleClick={toggleFullscreen}
                className={`relative bg-black rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-all duration-300 flex items-center justify-center ${
                  aspectRatio === "9:16"
                    ? "h-[620px] max-h-[74vh] aspect-[9/16] w-auto"
                    : aspectRatio === "1:1"
                    ? "h-[540px] max-h-[70vh] aspect-square w-auto"
                    : "h-[600px] max-h-[72vh] aspect-[4/5] w-auto"
                }`}
              >
                <video
                  ref={videoRef}
                  src={
                    aspectRatio === "9:16"
                      ? selectedVariant.video9x16
                      : aspectRatio === "1:1"
                      ? selectedVariant.video1x1
                      : selectedVariant.video4x5
                  }
                  loop
                  autoPlay
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Baked Watermark Indicator */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold text-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg select-none">
                  <Sparkles className="w-3 h-3 text-[#FF6700]" />
                  <span>AI-Generated Media Disclosure</span>
                </div>

                {/* Floating Player Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) videoRef.current.pause();
                        else videoRef.current.play();
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    title={isPlaying ? "Pause" : "Play"}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#7F48ED] hover:border-[#7F48ED] transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? "Unmute" : "Mute"}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#7F48ED] hover:border-[#7F48ED] transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#FF6700] hover:border-[#FF6700] transition-all cursor-pointer"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Select an ad from the left to preview</div>
            )}
          </div>

          {/* Compliance & Audio Specs Bar — Plain English */}
          {selectedVariant && (
            <div className="mt-3 flex items-center gap-4 sm:gap-6 text-xs text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="text-[#A78BFA] font-bold">✓ 1080p HD</span> Quality
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#FF6700] font-bold">✓ Balanced</span> Clear Audio
              </span>
              <span>•</span>
              <span>20s Duration</span>
            </div>
          )}
        </main>

        {/* Right Sidebar: Context & Client Review */}
        <aside className="w-96 border-l border-white/10 bg-[#0E1017]/90 p-5 flex flex-col justify-between overflow-y-auto">
          {selectedVariant ? (
            <div className="space-y-5">
              {/* Creative Brief Context */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Campaign Concept
                </span>
                <h3 className="font-bold text-sm text-white">{selectedVariant.angle}</h3>
                <p className="text-xs text-gray-400 mt-1">Target Audience: {selectedVariant.targetPersona}</p>
              </div>

              {/* Script Context */}
              <div className="bg-[#12141D] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Opening Hook (First 3s):</span>
                  <p className="text-white font-medium">&ldquo;{selectedVariant.hookText}&rdquo;</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Voiceover Script:</span>
                  <p className="text-gray-300">{selectedVariant.scriptBody}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Ending Offer:</span>
                  <p className="text-[#FF6700] font-semibold">{selectedVariant.ctaText}</p>
                </div>
              </div>

              {/* Forbidden Claims Screening */}
              <div className="bg-[#FF6700]/10 border border-[#FF6700]/25 p-3 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 text-[#FF8533] font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Ad Guidelines Verified</span>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5 text-[11px]">
                  {selectedVariant.forbiddenClaims.map((claim, idx) => (
                    <li key={idx}>{claim}</li>
                  ))}
                  <li>AI disclosure label is readable</li>
                </ul>
              </div>

              {/* Mandatory Approval Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Quick Approval Checklist
                  </span>
                  <span className="text-[11px] text-[#A78BFA] font-mono font-bold">
                    {Object.values(checklist).filter(Boolean).length}/5 Checked
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <label className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${checklist.briefMatch ? "bg-[#7F48ED]/10 border-[#7F48ED]/40" : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"}`}>
                    <input
                      type="checkbox"
                      checked={checklist.briefMatch}
                      onChange={() => toggleCheck("briefMatch")}
                      className="mt-0.5 w-4 h-4 accent-[#FF6700] rounded cursor-pointer"
                    />
                    <span className="text-gray-200">Matches your brand style &amp; offer</span>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${checklist.syncClean ? "bg-[#7F48ED]/10 border-[#7F48ED]/40" : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"}`}>
                    <input
                      type="checkbox"
                      checked={checklist.syncClean}
                      onChange={() => toggleCheck("syncClean")}
                      className="mt-0.5 w-4 h-4 accent-[#FF6700] rounded cursor-pointer"
                    />
                    <span className="text-gray-200">Captions and speech are synchronized</span>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${checklist.disclosureVisible ? "bg-[#7F48ED]/10 border-[#7F48ED]/40" : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"}`}>
                    <input
                      type="checkbox"
                      checked={checklist.disclosureVisible}
                      onChange={() => toggleCheck("disclosureVisible")}
                      className="mt-0.5 w-4 h-4 accent-[#FF6700] rounded cursor-pointer"
                    />
                    <span className="text-gray-200">AI disclosure label is visible</span>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${checklist.audioNormalized ? "bg-[#7F48ED]/10 border-[#7F48ED]/40" : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"}`}>
                    <input
                      type="checkbox"
                      checked={checklist.audioNormalized}
                      onChange={() => toggleCheck("audioNormalized")}
                      className="mt-0.5 w-4 h-4 accent-[#FF6700] rounded cursor-pointer"
                    />
                    <span className="text-gray-200">Audio sounds clear with balanced volume</span>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${checklist.noArtifacts ? "bg-[#7F48ED]/10 border-[#7F48ED]/40" : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"}`}>
                    <input
                      type="checkbox"
                      checked={checklist.noArtifacts}
                      onChange={() => toggleCheck("noArtifacts")}
                      className="mt-0.5 w-4 h-4 accent-[#FF6700] rounded cursor-pointer"
                    />
                    <span className="text-gray-200">No visual glitches or video artifacts</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xs">No ad selected</div>
          )}

          {/* Action Decision Buttons — Purple & Orange Themed */}
          <div className="pt-4 border-t border-white/10 space-y-2 mt-4">
            <button
              disabled={!allChecked || isSubmitting}
              onClick={() => handleDecision("approve")}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                allChecked
                  ? "bg-gradient-to-r from-[#7F48ED] to-[#FF6700] hover:brightness-115 text-white shadow-lg shadow-[#7F48ED]/30 cursor-pointer active:scale-98"
                  : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Ad (Ready to Publish)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isSubmitting}
                onClick={() => setRecutModalOpen(true)}
                className="py-2 px-3 rounded-lg bg-[#FF6700]/15 hover:bg-[#FF6700]/25 border border-[#FF6700]/40 text-[#FF8533] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Request Changes</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleDecision("reject")}
                className="py-2 px-3 rounded-lg bg-[#7F48ED]/15 hover:bg-[#7F48ED]/25 border border-[#7F48ED]/30 text-[#C4B5FD] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Decline Ad</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Change Request Notes Modal */}
      {recutModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-[#7F48ED]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Request Changes on this Ad</h3>
              <button onClick={() => setRecutModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400">
              What would you like adjusted? (e.g., change the opening text, adjust music volume, or update the call to action).
            </p>

            <textarea
              rows={4}
              value={recutNotes}
              onChange={(e) => setRecutNotes(e.target.value)}
              placeholder="Describe your requested adjustments here..."
              className="w-full bg-[#181A24] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6700]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRecutModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!recutNotes.trim() || isSubmitting}
                onClick={() => handleDecision("recut")}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#7F48ED] hover:bg-[#6e3cd4] text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                Send Change Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification — Purple & Orange Themed */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#7F48ED] text-white border border-[#FF6700]/50 font-bold text-xs px-4 py-2.5 rounded-lg shadow-2xl animate-fade-in flex items-center gap-2 z-50">
          <Check className="w-4 h-4 text-[#FF6700] stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
