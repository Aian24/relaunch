"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Scissors,
  Volume2,
  VolumeX,
  RotateCcw,
  Repeat,
  Save,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { ClientClip, ClientRawFootage, SceneRole } from "@/types/client";

export const SCENE_ROLE_OPTIONS: Array<{ value: SceneRole; label: string; hint: string }> = [
  { value: "product", label: "Product Demo", hint: "Default for Scene 2" },
  { value: "broll", label: "B-Roll", hint: "Default for Scene 3" },
  { value: "detail", label: "Detail / Close-Up", hint: "Works in Scene 2 or 3" },
  { value: "hook_alt", label: "Alt Hook", hint: "Opening / Scene 3 punch" },
  { value: "cta", label: "CTA / Closing", hint: "End card backdrop" },
];

interface ClientFootageTrimmerProps {
  clientId: string;
  rawFootage: ClientRawFootage;
  editingClip?: ClientClip | null;
  existingClipsFromRaw: ClientClip[];
  onClipSaved: (clip: ClientClip, isEdit: boolean) => void;
  onCancelEdit?: () => void;
  onClose?: () => void;
}

export default function ClientFootageTrimmer({
  clientId,
  rawFootage,
  editingClip,
  existingClipsFromRaw,
  onClipSaved,
  onCancelEdit,
  onClose,
}: ClientFootageTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSrc = rawFootage.playableUrl || rawFootage.storageUrl;

  const [duration, setDuration] = useState<number>(Math.max(rawFootage.duration || 10, 1));
  const [inPoint, setInPoint] = useState<number>(editingClip?.inPoint ?? 0.0);
  const [outPoint, setOutPoint] = useState<number>(
    editingClip?.outPoint ?? Math.min(Math.max(rawFootage.duration || 10, 1), 5.0)
  );
  const [currentTime, setCurrentTime] = useState<number>(editingClip?.inPoint ?? 0.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [sceneRole, setSceneRole] = useState<SceneRole>(editingClip?.sceneRole || "product");
  const [label, setLabel] = useState<string>(editingClip?.label || "");
  const [notes, setNotes] = useState<string>(editingClip?.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when switching raw file or editing clip
  useEffect(() => {
    const dur = Math.max(rawFootage.duration || 10, 1);
    setDuration(dur);
    if (editingClip) {
      setInPoint(editingClip.inPoint);
      setOutPoint(editingClip.outPoint);
      setSceneRole(editingClip.sceneRole);
      setLabel(editingClip.label);
      setNotes(editingClip.notes || "");
      setCurrentTime(editingClip.inPoint);
      if (videoRef.current) videoRef.current.currentTime = editingClip.inPoint;
    } else {
      const start = 0;
      const end = Number(Math.min(dur, 5.0).toFixed(1));
      setInPoint(start);
      setOutPoint(end);
      setLabel("");
      setNotes("");
      setCurrentTime(start);
      if (videoRef.current) videoRef.current.currentTime = start;
    }
    setIsPlaying(false);
    setErrorMsg(null);
  }, [rawFootage.id, editingClip?.id]);

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.duration && !isNaN(v.duration) && isFinite(v.duration)) {
      const realDur = Number(v.duration.toFixed(2));
      setDuration(Math.max(realDur, 0.5));
      if (!editingClip && outPoint > realDur) {
        setOutPoint(Number(Math.min(realDur, 5.0).toFixed(1)));
      }
    }
    v.currentTime = inPoint;
    setCurrentTime(inPoint);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setCurrentTime(t);

    if (isLooping && t >= outPoint) {
      v.currentTime = inPoint;
      setCurrentTime(inPoint);
      if (!v.paused) {
        v.play().catch(() => {});
      }
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
      return;
    }
    if (isLooping && (v.currentTime >= outPoint - 0.05 || v.currentTime < inPoint - 0.1)) {
      v.currentTime = inPoint;
    }
    v.muted = isMuted;
    v.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        v.muted = true;
        setIsMuted(true);
        v.play().then(() => setIsPlaying(true)).catch(() => {});
      });
  };

  const setIn = (val: number) => {
    const clamped = Number(Math.max(0, Math.min(val, duration - 0.3)).toFixed(1));
    let nextOut = outPoint;
    if (nextOut - clamped < 0.3) {
      nextOut = Number(Math.min(duration, clamped + 1.0).toFixed(1));
    }
    setInPoint(clamped);
    setOutPoint(nextOut);
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  const setOut = (val: number) => {
    const clamped = Number(Math.min(duration, Math.max(val, inPoint + 0.3)).toFixed(1));
    setOutPoint(clamped);
  };

  const seekToTime = (sec: number) => {
    const t = Math.max(0, Math.min(sec, duration));
    if (videoRef.current) {
      videoRef.current.currentTime = t;
    }
    setCurrentTime(t);
  };

  // Keyboard shortcuts I (mark in), O (mark out), Space (play/pause)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        setIn(currentTime);
      } else if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        setOut(currentTime);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleSaveClip = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (outPoint <= inPoint) {
      setErrorMsg("Out point must be greater than In point.");
      return;
    }
    const finalLabel =
      label.trim() || `${sceneRole.toUpperCase()} (${inPoint.toFixed(1)}s-${outPoint.toFixed(1)}s)`;

    setIsSaving(true);
    try {
      const isEdit = Boolean(editingClip);
      const endpoint = isEdit
        ? `/api/studio/clients/${clientId}/clips/${editingClip!.id}`
        : `/api/studio/clients/${clientId}/clips`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceRawId: rawFootage.id,
          inPoint,
          outPoint,
          sceneRole,
          label: finalLabel,
          notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Failed to save virtual clip.");
        setIsSaving(false);
        return;
      }

      onClipSaved(data.clip, isEdit);

      // Keep trimming workflow: advance window for next cut
      if (!isEdit) {
        const nextStart = Number(Math.min(Math.max(0, duration - 1.0), outPoint).toFixed(1));
        const nextEnd = Number(Math.min(duration, nextStart + 4.0).toFixed(1));
        setInPoint(nextStart);
        setOutPoint(nextEnd > nextStart ? nextEnd : duration);
        setLabel("");
        setNotes("");
        seekToTime(nextStart);
      }
    } catch {
      setErrorMsg("Network error saving virtual clip.");
    } finally {
      setIsSaving(false);
    }
  };

  const clipLen = Math.max(0.2, outPoint - inPoint);
  const startPct = Math.min(100, Math.max(0, (inPoint / duration) * 100));
  const widthPct = Math.max(1.5, Math.min(100 - startPct, ((outPoint - inPoint) / duration) * 100));
  const playheadPct = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="bg-white rounded-2xl border border-[#7F48ED]/40 shadow-lg overflow-hidden">
      {/* Trimmer Header (Solid Purple) */}
      <div className="px-5 py-3.5 bg-[#7F48ED] text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF6700] flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black truncate flex items-center gap-2">
              <span>{editingClip ? `Editing Clip: ${editingClip.label}` : `Trimming: ${rawFootage.filename}`}</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-mono text-[#FF6700]">
                {clipLen.toFixed(1)}s Virtual Cut
              </span>
            </div>
            <div className="text-[10px] text-purple-100 font-mono">
              Shortcuts: Space (Play/Pause) · I (Set In) · O (Set Out) · Lossless virtual bounds
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {editingClip && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-2.5 py-1 rounded-lg bg-[#FF6700] hover:bg-[#E55C00] text-white text-[11px] font-bold cursor-pointer"
            >
              New Cut Instead
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
              title="Close Trimmer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
        {/* Left: Video Stage + Sprite Scrubber + Precision Controls */}
        <div className="lg:col-span-7 space-y-3">
          <div
            onClick={togglePlay}
            className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border border-zinc-800 group cursor-pointer select-none"
          >
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain"
            />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLooping(!isLooping);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md flex items-center gap-1 cursor-pointer ${
                    isLooping
                      ? "bg-[#7F48ED]/90 border-purple-400 text-white"
                      : "bg-black/60 border-white/20 text-zinc-300"
                  }`}
                >
                  <Repeat className="w-3 h-3" />
                  <span>{isLooping ? "Loop In-Out" : "Full Raw"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                  }
                  setIsMuted(!isMuted);
                }}
                className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-mono pointer-events-auto flex items-center gap-1 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                <span>{isMuted ? "Muted" : "Audio"}</span>
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-14 h-14 rounded-full bg-black/60 border border-white/30 text-white flex items-center justify-center transition ${
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </div>
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-200 pointer-events-none">
              <span className="bg-black/70 px-2 py-0.5 rounded">0.0s</span>
              <span className="bg-black/80 px-2 py-0.5 rounded text-[#FFE600] font-bold">
                Playhead: {currentTime.toFixed(1)}s
              </span>
              <span className="bg-black/70 px-2 py-0.5 rounded">{duration.toFixed(1)}s</span>
            </div>
          </div>

          {/* Clickable Scrubbing Sprite Strip */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              seekToTime(ratio * duration);
            }}
            className="relative h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 cursor-crosshair select-none"
            title="Click anywhere to scrub raw video"
          >
            {rawFootage.spriteUrl ? (
              <img
                src={rawFootage.spriteUrl}
                alt="Video scrub strip"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-400">
                Click timeline to scrub ({duration.toFixed(1)}s)
              </div>
            )}
            {/* Selected range highlight */}
            <div
              className="absolute top-0 bottom-0 bg-[#7F48ED]/35 border-x-2 border-[#FF6700]"
              style={{ left: `${startPct}%`, width: `${widthPct}%` }}
            />
            {/* Playhead cursor */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#FFE600] shadow"
              style={{ left: `${playheadPct}%` }}
            />
          </div>

          {/* 0.1s Precision In / Out Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-800">
                  In: <span className="font-mono text-[#7F48ED]">{inPoint.toFixed(1)}s</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIn(inPoint - 0.1)}
                    className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[10px] font-bold cursor-pointer"
                  >
                    -0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => setIn(inPoint + 0.1)}
                    className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[10px] font-bold cursor-pointer"
                  >
                    +0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => setIn(currentTime)}
                    className="px-2 py-0.5 rounded bg-[#7F48ED] text-white font-mono text-[10px] font-bold cursor-pointer"
                  >
                    Set In
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, duration - 0.3)}
                step={0.1}
                value={inPoint}
                onChange={(e) => setIn(parseFloat(e.target.value))}
                className="w-full accent-[#7F48ED] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-800">
                  Out: <span className="font-mono text-[#FF6700]">{outPoint.toFixed(1)}s</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setOut(outPoint - 0.1)}
                    className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[10px] font-bold cursor-pointer"
                  >
                    -0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => setOut(outPoint + 0.1)}
                    className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[10px] font-bold cursor-pointer"
                  >
                    +0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => setOut(currentTime)}
                    className="px-2 py-0.5 rounded bg-[#FF6700] text-white font-mono text-[10px] font-bold cursor-pointer"
                  >
                    Set Out
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={Math.min(duration, inPoint + 0.3)}
                max={duration}
                step={0.1}
                value={outPoint}
                onChange={(e) => setOut(parseFloat(e.target.value))}
                className="w-full accent-[#FF6700] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Clip Role Tagging, Label & Save + Extracted Clips Tray */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 text-xs">
          <form onSubmit={handleSaveClip} className="space-y-3">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1.5">
                Scene Role *
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {SCENE_ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSceneRole(opt.value)}
                    className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                      sceneRole === opt.value
                        ? "bg-purple-50 border-[#7F48ED] text-zinc-900"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <div className="font-bold text-[11px]">{opt.label}</div>
                    <div className="text-[9px] text-zinc-400">{opt.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Clip Label *
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Pouring product close-up"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Editor Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes on lighting, motion, or best script line..."
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7F48ED]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>
                  {isSaving
                    ? "Saving Virtual Clip..."
                    : editingClip
                    ? "Update Clip"
                    : "Save Clip & Keep Trimming"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIn(0);
                  setOut(Math.min(duration, 5.0));
                }}
                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 cursor-pointer"
                title="Reset Trim Bounds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Clips already pulled from this raw video */}
          <div className="border-t border-zinc-100 pt-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-zinc-500">
              <span>Clips Extracted from This Video</span>
              <span className="text-[#7F48ED] font-mono">{existingClipsFromRaw.length}</span>
            </div>

            {existingClipsFromRaw.length === 0 ? (
              <div className="text-[11px] text-zinc-400 italic">
                Mark In &amp; Out points and click Save Clip to pull multiple clips from this video.
              </div>
            ) : (
              <div
                onWheel={(e) => e.stopPropagation()}
                className="space-y-1.5 max-h-44 overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#7F48ED]/40"
                style={{ scrollbarWidth: "thin" }}
              >
                {existingClipsFromRaw.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setInPoint(c.inPoint);
                      setOutPoint(c.outPoint);
                      seekToTime(c.inPoint);
                    }}
                    className="p-2 rounded-xl bg-zinc-50 hover:bg-purple-50/50 border border-zinc-200 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-800 truncate flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{c.label}</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {c.sceneRole} · {c.inPoint.toFixed(1)}s–{c.outPoint.toFixed(1)}s
                      </div>
                    </div>
                    <Sparkles className="w-3 h-3 text-[#7F48ED] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

