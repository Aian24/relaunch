"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
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
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

export default function NewCreatorOnboardingPage() {
  const router = useRouter();

  // Creator Info State
  const [creatorName, setCreatorName] = useState("");
  const [handle, setHandle] = useState("");
  const [niche, setNiche] = useState("Tech, Modern Websites & Local Business Growth");
  const [followersCount, setFollowersCount] = useState("150K");
  const [avgEngagement, setAvgEngagement] = useState("5.6%");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Meta", "TikTok"]);

  // Video Upload & Trim State
  const [takeType, setTakeType] = useState<"hook" | "broll">("hook");
  const [hookAngle, setHookAngle] = useState("problem");
  const [spokenText, setSpokenText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [startTrim, setStartTrim] = useState(0.2);
  const [endTrim, setEndTrim] = useState(3.8);
  const [videoDuration, setVideoDuration] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);

  // Status & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name
  const creatorSlug = (creatorName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const handleNameChange = (val: string) => {
    setCreatorName(val);
    if (!handle || handle.startsWith("@")) {
      const clean = val.toLowerCase().replace(/[^a-z0-9]/g, "");
      setHandle(clean ? `@${clean}creative` : "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsPlaying(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) {
      showToast("Please enter a creator name.");
      return;
    }
    if (!creatorSlug) {
      showToast("Please provide a valid creator name to derive folder slug.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("action", "upload_take");
      formData.append("creatorName", creatorName.trim());
      formData.append("creatorSlug", creatorSlug);
      formData.append("handle", handle.trim() || `@${creatorSlug}creative`);
      formData.append("niche", niche.trim());
      formData.append("followersCount", followersCount.trim());
      formData.append("avgEngagement", avgEngagement.trim());
      formData.append("type", takeType);
      formData.append("angle", hookAngle);
      formData.append("spokenText", spokenText.trim());
      formData.append("startTrim", String(startTrim));
      formData.append("endTrim", String(endTrim));

      if (selectedFile) {
        formData.append("videoFile", selectedFile);
      }

      const res = await fetch("/api/studio/creators", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to create creator");
        setIsSubmitting(false);
        return;
      }

      setSuccessData(data);
      showToast(`✓ Creator ${creatorName} configured with dedicated folders!`);
    } catch {
      showToast("Error onboarding creator. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trimLength = Math.max(0, endTrim - startTrim).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#090D16] flex flex-col font-sans selection:bg-[#FF6700]/20 selection:text-[#FF6700]">
      {/* 1. Top Header Bar */}
      <header className="h-14 sm:h-16 border-b border-zinc-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/studio/creators"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#FF6700] transition-colors shrink-0"
            title="Back to Creators"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Creators</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black tracking-tight text-[#090D16] uppercase whitespace-nowrap truncate">
              <span className="hidden xs:inline">ReLaunch Studio </span>
              <span className="text-[#FF6700]">Onboard</span>
              <span className="text-[#090D16] hidden sm:inline"> UGC Creator</span>
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
            href="/studio/approved"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition border border-zinc-200 cursor-pointer shrink-0"
            title="Open Approved Vault"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Vault</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Container — Full Width Matching Review and Vault */}
      <main className="flex-1 w-full p-3 sm:p-4 lg:p-5 space-y-4 sm:space-y-5">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-[#FF6700]/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <FolderPlus className="w-3.5 h-3.5 text-[#FF6700]" />
                Dynamic UGC Creator Onboarding
              </span>
              <span className="text-zinc-300 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-zinc-500">
                Zero hardcoding · Automatically provisions disk folders
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
              Register New UGC Creator &amp; Upload Footage
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Enter the creator details and upload raw video takes. The system will automatically create the dedicated directory structure (<code className="text-[#FF6700] bg-orange-50 px-1 py-0.5 rounded font-bold">public/creators/[name]/hooks</code> and <code className="text-[#FF6700] bg-orange-50 px-1 py-0.5 rounded font-bold">/broll</code>) and integrate them immediately into the Generator and Review rooms.
            </p>
          </div>
        </div>

        {/* 3. Onboarding Form — Full Width 12-Column Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5 items-start">
          {/* Left Column: Creator Identity & Disk Path Preview (6 cols) */}
          <div className="xl:col-span-6 bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Users className="w-4 h-4 text-[#FF6700]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Step 1: Creator Profile &amp; Directory Setup
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Creator Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Creator First Name / Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={creatorName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Jeo"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#FF6700]"
                />
              </div>

              {/* Handle & Niche */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Social Handle
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@jeocreative"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#FF6700]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Niche / Category
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. Tech, SaaS & Business Growth"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#FF6700]"
                  />
                </div>
              </div>

              {/* Automatic Folder Provisioning Card */}
              <div className="bg-orange-50/70 border border-[#FF6700]/30 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-[#FF6700] uppercase tracking-wider flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" />
                  Auto-Provisioned Storage Folders on Disk
                </span>
                <p className="text-[11px] text-zinc-700 leading-relaxed">
                  Upon creation, the system automatically builds these directories to house raw MP4s and thumbnails:
                </p>
                <div className="space-y-1 font-mono text-[11px] bg-white/90 p-2.5 rounded-lg border border-orange-200">
                  <div className="text-zinc-800 flex items-center gap-1.5">
                    <span className="text-[#FF6700] font-bold">✓</span>
                    <span>public/creators/<strong className="text-[#FF6700]">{creatorSlug || "creator"}</strong>/hooks/</span>
                  </div>
                  <div className="text-zinc-800 flex items-center gap-1.5">
                    <span className="text-[#FF6700] font-bold">✓</span>
                    <span>public/creators/<strong className="text-[#FF6700]">{creatorSlug || "creator"}</strong>/broll/</span>
                  </div>
                </div>
              </div>

              {/* Reach & Engagement */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Follower Reach
                  </label>
                  <input
                    type="text"
                    value={followersCount}
                    onChange={(e) => setFollowersCount(e.target.value)}
                    placeholder="150K"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#FF6700]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Avg Engagement
                  </label>
                  <input
                    type="text"
                    value={avgEngagement}
                    onChange={(e) => setAvgEngagement(e.target.value)}
                    placeholder="5.6%"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#FF6700]"
                  />
                </div>
              </div>

              {/* Supported Platforms */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Supported Advertising Platforms
                </label>
                <div className="flex items-center gap-2">
                  {["Meta", "TikTok", "YouTube"].map((platform) => {
                    const isChecked = selectedPlatforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? "bg-[#FF6700] text-white shadow-xs"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{platform}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upload First Take & Trimmer Settings (6 cols) */}
          <div className="xl:col-span-6 bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#FF6700]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Step 2: Upload First Take (Hook or B-Roll)
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Optional during setup
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Type Switcher: Hook vs B-Roll */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Take Type
                </label>
                <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setTakeType("hook")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      takeType === "hook" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600"
                    }`}
                  >
                    <span>Hook Take (0–5s)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTakeType("broll")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      takeType === "broll" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600"
                    }`}
                  >
                    <span>B-Roll Cut (3–15s)</span>
                  </button>
                </div>
              </div>

              {/* Video File Drag & Drop / File Input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Raw Video Take File (.mp4 / .mov)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    selectedFile
                      ? "border-[#FF6700] bg-orange-50/40"
                      : "border-zinc-300 hover:border-[#FF6700] bg-zinc-50 hover:bg-orange-50/20"
                  }`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${selectedFile ? "text-[#FF6700]" : "text-zinc-400"}`} />
                  {selectedFile ? (
                    <div>
                      <span className="font-bold text-xs text-zinc-900 block truncate">{selectedFile.name}</span>
                      <span className="text-[10px] text-[#FF6700] font-mono font-bold">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Ready to upload
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-xs text-zinc-800 block">
                        Drag &amp; drop video file here, or click to browse
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Supports 9:16 vertical phone takes in MP4, MOV, or WebM (up to 100MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Preview if file selected */}
              {previewUrl && (
                <div className="relative bg-[#090D16] rounded-xl overflow-hidden aspect-[9/16] max-h-56 mx-auto flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Hook Angle */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Creative Hook Angle
                </label>
                <select
                  value={hookAngle}
                  onChange={(e) => setHookAngle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#FF6700]"
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

              {/* Spoken Text */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Spoken Hook Text (Exact Words Spoken in Take)
                </label>
                <textarea
                  rows={2}
                  value={spokenText}
                  onChange={(e) => setSpokenText(e.target.value)}
                  placeholder="e.g. Stop scrolling if you're trying to grow your local business in 2026."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#FF6700]"
                />
              </div>

              {/* In/Out Trim coordinates */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Start Trim (sec)
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={startTrim}
                    onChange={(e) => setStartTrim(Number(e.target.value))}
                    className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#FF6700]"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    End Trim (sec)
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={endTrim}
                    onChange={(e) => setEndTrim(Number(e.target.value))}
                    className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#FF6700]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !creatorName.trim()}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#FF6700] hover:bg-[#ea5e00] disabled:opacity-40 transition shadow-sm shadow-[#FF6700]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? "Configuring & Uploading..." : `Create ${creatorName || "Creator"} & Provision Storage`}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Success Modal */}
        {successData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6700] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">
                    UGC Creator Configured Successfully!
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Folders and creator profile have been provisioned on disk.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1.5 font-mono text-xs">
                <div><strong className="text-zinc-900">Creator:</strong> {successData.creator?.name} ({successData.creator?.handle})</div>
                <div><strong className="text-zinc-900">Preset ID:</strong> {successData.creator?.actorPresetId}</div>
                <div><strong className="text-zinc-900">Hooks Directory:</strong> {successData.foldersCreated?.hooks}</div>
                <div><strong className="text-zinc-900">B-Roll Directory:</strong> {successData.foldersCreated?.broll}</div>
                {successData.asset && (
                  <div className="text-emerald-700 font-bold pt-1 border-t border-zinc-200">
                    ✓ First take uploaded: {successData.asset.label} ({successData.asset.durationSeconds}s)
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  href={`/studio/creators`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold text-center transition"
                >
                  Open in Trimmer Studio
                </Link>
                <Link
                  href={`/studio/generate?actor=${successData.creator?.actorPresetId}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF6700] hover:bg-[#ea5e00] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-sm shadow-[#FF6700]/25"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open in Generator</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-zinc-900 text-white border border-[#FF6700] font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-3 duration-200">
            <div className="w-5 h-5 rounded-full bg-[#FF6700] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </div>
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}

