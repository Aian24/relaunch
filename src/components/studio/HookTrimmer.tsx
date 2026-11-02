"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Scissors, Volume2, VolumeX, CheckCircle2, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import type { CreatorClipAsset } from "@/data/creatorAssets";

interface HookTrimmerProps {
  clip: CreatorClipAsset;
  trimStart: number;
  trimEnd: number;
  onTrimChange: (start: number, end: number) => void;
}

export default function HookTrimmer({
  clip,
  trimStart,
  trimEnd,
  onTrimChange,
}: HookTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(trimStart);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const duration = Math.max(clip.durationSeconds || 10, 1);
  const hookDuration = Math.max(0.5, trimEnd - trimStart);

  // Sync video time to trimStart whenever clip changes
  useEffect(() => {
    setVideoLoaded(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = trimStart;
      setCurrentTime(trimStart);
    }
  }, [clip.id]);

  const handleLoadedMetadata = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart;
      setCurrentTime(trimStart);
    }
  };

  // Auto-rewind and pause at trimEnd
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    if (t >= trimEnd) {
      videoRef.current.pause();
      videoRef.current.currentTime = trimStart;
      setIsPlaying(false);
      setCurrentTime(trimStart);
    }
  };

  const togglePlayTrimmed = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;

    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
      return;
    }

    // If near or past trimEnd, rewind to trimStart first
    if (v.currentTime >= trimEnd - 0.1 || v.currentTime < trimStart - 0.5) {
      v.currentTime = trimStart;
    }

    v.muted = isMuted;

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("[HookTrimmer] Unmuted play blocked by browser, falling back to muted:", err);
          // Browser audio policy fallback: play muted so video ALWAYS plays
          v.muted = true;
          setIsMuted(true);
          v.play()
            .then(() => setIsPlaying(true))
            .catch((finalErr) => {
              console.error("[HookTrimmer] Video playback failed:", finalErr);
            });
        });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const next = !isMuted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  };

  const handleStartChange = (val: number) => {
    const newStart = Math.max(0, Math.min(val, duration - 1.5));
    let newEnd = trimEnd;
    if (newEnd - newStart < 1.5) {
      newEnd = Math.min(duration, newStart + 3.3);
    } else if (newEnd - newStart > 5.5) {
      newEnd = newStart + 3.5;
    }
    const finalStart = Number(newStart.toFixed(1));
    const finalEnd = Number(newEnd.toFixed(1));
    onTrimChange(finalStart, finalEnd);
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = finalStart;
      setCurrentTime(finalStart);
    }
  };

  const handleEndChange = (val: number) => {
    const newEnd = Math.min(duration, Math.max(val, trimStart + 1.5));
    let newStart = trimStart;
    if (newEnd - newStart > 5.5) {
      newStart = Math.max(0, newEnd - 3.5);
    }
    const finalStart = Number(newStart.toFixed(1));
    const finalEnd = Number(newEnd.toFixed(1));
    onTrimChange(finalStart, finalEnd);
  };

  const nudgeStart = (delta: number) => {
    handleStartChange(trimStart + delta);
  };

  const nudgeEnd = (delta: number) => {
    handleEndChange(trimEnd + delta);
  };

  const handleResetRecommended = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrimChange(clip.recommendedTrim.start, clip.recommendedTrim.end);
    if (videoRef.current) {
      videoRef.current.currentTime = clip.recommendedTrim.start;
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(clip.recommendedTrim.start);
    }
  };

  const startPercent = Math.min(100, Math.max(0, (trimStart / duration) * 100));
  const endPercent = Math.min(100, Math.max(0, (trimEnd / duration) * 100));
  const widthPercent = Math.max(2, endPercent - startPercent);

  return (
    <div className="bg-white border border-purple-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3 transition">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#7F48ED] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Scissors className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-zinc-900">Hook Trimmer</span>
              <span className="text-[10px] font-mono font-bold text-[#7F48ED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {hookDuration.toFixed(1)}s Take
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleResetRecommended}
            className="text-[10px] font-mono font-bold text-zinc-700 hover:text-[#7F48ED] bg-zinc-50 hover:bg-purple-50 px-2 py-1 rounded-lg border border-zinc-200 transition flex items-center gap-1 cursor-pointer"
            title="Reset to recommended clean take"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Recommended:</span> {clip.recommendedTrim.start}s–{clip.recommendedTrim.end}s
          </button>
          <div className="p-1 text-zinc-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          {/* Spoken Target Take Line (Compact single line) */}
          {clip.spokenText && (
            <div className="bg-purple-50/60 border border-purple-200/50 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#7F48ED] font-bold shrink-0">
                Target Line:
              </span>
              <p className="italic font-bold text-zinc-800 truncate">
                &ldquo;{clip.spokenText}&rdquo;
              </p>
            </div>
          )}

          {/* Full-Width Video Stage with In-Video Overlays */}
          <div
            onClick={togglePlayTrimmed}
            className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-md group cursor-pointer select-none"
          >
            <video
              ref={videoRef}
              src={clip.src}
              playsInline
              // @ts-ignore
              webkit-playsinline="true"
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />

            {/* Top Overlay Badges */}
            <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white font-mono text-[10px] font-bold pointer-events-auto shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED]" />
                <span>{hookDuration.toFixed(1)}s Duration</span>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-1 bg-black/60 backdrop-blur-md hover:bg-black/80 px-2.5 py-1 rounded-full border border-white/20 text-white font-mono text-[10px] pointer-events-auto transition cursor-pointer shadow-sm"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3 h-3 text-red-400" />
                    <span className="text-zinc-300">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Audio 100%</span>
                  </>
                )}
              </button>
            </div>

            {/* Center Tap-To-Play / Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-14 h-14 rounded-full bg-black/55 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl transition-all duration-200 transform ${
                  isPlaying
                    ? "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                    : "opacity-100 scale-100 group-hover:scale-105"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white text-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                )}
              </div>
            </div>

            {/* Bottom Overlay Gradient & Timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-1.5">
              {/* Visual Timeline Scrubber Bar */}
              <div className="relative h-2.5 bg-white/20 backdrop-blur-xs rounded-full overflow-hidden border border-white/10">
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[#7F48ED] via-[#FF6700] to-[#FFE600] rounded-full shadow"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg rounded-full"
                  style={{
                    left: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`,
                  }}
                />
              </div>

              {/* Exact Requested Labels: 0.0s (Raw) | Playhead: X.Xs | XX.Xs */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 font-semibold px-0.5">
                <span className="text-zinc-400">0.0s (Raw)</span>
                <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/15 text-[#FFE600] font-bold">
                  Playhead: {currentTime.toFixed(1)}s
                </span>
                <span className="text-zinc-400">{duration.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Steppers & Dual Controls matching user's Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 items-stretch">
            {/* In Point (Start Take) */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-zinc-800 text-xs sm:text-[13px] whitespace-nowrap">
                  In Point (Start Take)
                </span>
                <span className="font-mono font-bold text-purple-600 bg-purple-50/80 px-2 py-0.5 rounded-lg border border-purple-200 text-xs shrink-0">
                  {trimStart.toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, duration - 1.5)}
                step={0.1}
                value={trimStart}
                onChange={(e) => handleStartChange(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-zinc-100 rounded-lg"
              />
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => nudgeStart(-0.2)}
                  className="px-3 py-1 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg text-xs font-mono font-bold text-zinc-700 flex items-center justify-center cursor-pointer whitespace-nowrap shadow-xs hover:border-zinc-300 transition"
                >
                  — 0.2s
                </button>
                <span className="text-xs font-medium text-zinc-400 whitespace-nowrap select-none">
                  Fine Tune
                </span>
                <button
                  type="button"
                  onClick={() => nudgeStart(0.2)}
                  className="px-3 py-1 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg text-xs font-mono font-bold text-zinc-700 flex items-center justify-center cursor-pointer whitespace-nowrap shadow-xs hover:border-zinc-300 transition"
                >
                  + 0.2s
                </button>
              </div>
            </div>

            {/* Out Point (Cut To Ad) */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-zinc-800 text-xs sm:text-[13px] whitespace-nowrap">
                  Out Point (Cut To Ad)
                </span>
                <span className="font-mono font-bold text-[#FF6700] bg-orange-50/80 px-2 py-0.5 rounded-lg border border-orange-200 text-xs shrink-0">
                  {trimEnd.toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min={Math.min(duration, trimStart + 1.5)}
                max={duration}
                step={0.1}
                value={trimEnd}
                onChange={(e) => handleEndChange(parseFloat(e.target.value))}
                className="w-full accent-[#FF6700] cursor-pointer h-2 bg-zinc-100 rounded-lg"
              />
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => nudgeEnd(-0.2)}
                  className="px-3 py-1 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg text-xs font-mono font-bold text-zinc-700 flex items-center justify-center cursor-pointer whitespace-nowrap shadow-xs hover:border-zinc-300 transition"
                >
                  — 0.2s
                </button>
                <span className="text-xs font-medium text-zinc-400 whitespace-nowrap select-none">
                  Fine Tune
                </span>
                <button
                  type="button"
                  onClick={() => nudgeEnd(0.2)}
                  className="px-3 py-1 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg text-xs font-mono font-bold text-zinc-700 flex items-center justify-center cursor-pointer whitespace-nowrap shadow-xs hover:border-zinc-300 transition"
                >
                  + 0.2s
                </button>
              </div>
            </div>
          </div>

          {/* Authenticity Guarantee Callout */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Haley&apos;s real voice in this {hookDuration.toFixed(1)}s segment is preserved at 100% volume. ElevenLabs voiceover begins smoothly at {hookDuration.toFixed(1)}s.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
