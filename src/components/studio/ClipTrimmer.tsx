"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Scissors, Volume2, VolumeX, ChevronDown, ChevronUp } from "lucide-react";

export interface ClipTrimmerProps {
  title?: string;
  badgeLabel?: string;
  videoUrl: string;
  trimStart: number;
  trimEnd: number;
  minDuration?: number;
  maxDuration?: number;
  recommendedTrim?: { start: number; end: number };
  spokenText?: string;
  noteText?: string;
  accentColor?: string; // hex, e.g. "#7F48ED" or "#2563EB" or "#10B981"
  onTrimChange: (start: number, end: number) => void;
  onClose?: () => void;
}

export default function ClipTrimmer({
  title = "Precision Trimmer",
  badgeLabel = "Subclip",
  videoUrl,
  trimStart,
  trimEnd,
  minDuration = 1.0,
  maxDuration = 7.0,
  recommendedTrim,
  spokenText,
  noteText,
  accentColor = "#7F48ED",
  onTrimChange,
  onClose,
}: ClipTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(trimStart);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [duration, setDuration] = useState(10);

  const subclipDuration = Math.max(0.2, trimEnd - trimStart);

  // Sync video time to trimStart whenever videoUrl changes
  useEffect(() => {
    setVideoLoaded(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = trimStart;
      setCurrentTime(trimStart);
    }
  }, [videoUrl]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDur = videoRef.current.duration;
      if (vidDur && !isNaN(vidDur) && isFinite(vidDur)) {
        setDuration(Math.max(vidDur, 1));
      }
      setVideoLoaded(true);
      videoRef.current.currentTime = trimStart;
      setCurrentTime(trimStart);
    }
  };

  // Auto-rewind and loop/pause at trimEnd
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

    if (v.currentTime >= trimEnd - 0.1 || v.currentTime < trimStart - 0.5) {
      v.currentTime = trimStart;
    }

    v.muted = isMuted;

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("[ClipTrimmer] Unmuted play blocked, falling back to muted:", err);
          v.muted = true;
          setIsMuted(true);
          v.play()
            .then(() => setIsPlaying(true))
            .catch((finalErr) => console.error("[ClipTrimmer] Playback failed:", finalErr));
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
    const newStart = Math.max(0, Math.min(val, duration - minDuration));
    let newEnd = trimEnd;
    if (newEnd - newStart < minDuration) {
      newEnd = Math.min(duration, newStart + minDuration);
    } else if (newEnd - newStart > maxDuration) {
      newEnd = Math.min(duration, newStart + maxDuration);
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
    const newEnd = Math.min(duration, Math.max(val, trimStart + minDuration));
    let newStart = trimStart;
    if (newEnd - newStart > maxDuration) {
      newStart = Math.max(0, newEnd - maxDuration);
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

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetStart = recommendedTrim ? recommendedTrim.start : 0;
    const targetEnd = recommendedTrim ? recommendedTrim.end : Math.min(duration, 6.0);
    onTrimChange(targetStart, targetEnd);
    if (videoRef.current) {
      videoRef.current.currentTime = targetStart;
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(targetStart);
    }
  };

  const startPercent = Math.min(100, Math.max(0, (trimStart / duration) * 100));
  const endPercent = Math.min(100, Math.max(0, (trimEnd / duration) * 100));
  const widthPercent = Math.max(2, endPercent - startPercent);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs space-y-2.5 transition">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none gap-2 py-0.5"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-5 h-5 rounded-md text-white flex items-center justify-center font-bold shrink-0 shadow-2xs"
            style={{ backgroundColor: accentColor }}
          >
            <Scissors className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap truncate">
            <span className="text-xs font-bold text-zinc-900">{title}</span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: accentColor,
                backgroundColor: `${accentColor}10`,
                borderColor: `${accentColor}30`,
              }}
            >
              {subclipDuration.toFixed(1)}s {badgeLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] font-mono font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 transition flex items-center gap-1 cursor-pointer"
            title="Reset to recommended cut bounds"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Reset:</span> {trimStart.toFixed(1)}s–{trimEnd.toFixed(1)}s
          </button>
          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700 px-1.5 py-0.5 rounded hover:bg-zinc-100 cursor-pointer"
            >
              Done
            </button>
          )}
          <div className="p-0.5 text-zinc-400">
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2.5 pt-1">
          {spokenText && (
            <div className="bg-purple-50/60 border border-purple-200/50 rounded-lg px-2.5 py-1 flex items-center gap-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#7F48ED] font-bold shrink-0">
                Audio Line:
              </span>
              <p className="italic font-bold text-zinc-800 truncate text-[11px]">
                &ldquo;{spokenText}&rdquo;
              </p>
            </div>
          )}

          {/* Full-Width Video Stage with Overlay Playhead */}
          <div
            onClick={togglePlayTrimmed}
            className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-inner group cursor-pointer select-none"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              // @ts-ignore
              webkit-playsinline="true"
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />

            {/* Top Overlay Badges */}
            <div className="absolute top-0 left-0 right-0 p-2.5 flex items-center justify-between bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-white font-mono text-[10px] font-bold pointer-events-auto shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <span>{subclipDuration.toFixed(1)}s Subclip</span>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-1 bg-black/60 backdrop-blur-md hover:bg-black/80 px-2 py-0.5 rounded-full border border-white/20 text-white font-mono text-[10px] pointer-events-auto transition cursor-pointer shadow-sm"
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
                    <span className="text-emerald-300 font-bold">Audio Active</span>
                  </>
                )}
              </button>
            </div>

            {/* Center Tap-To-Play / Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-12 h-12 rounded-full bg-black/55 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl transition-all duration-200 transform ${
                  isPlaying
                    ? "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                    : "opacity-100 scale-100 group-hover:scale-105"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                )}
              </div>
            </div>

            {/* Bottom Overlay Gradient & Timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-1">
              <div className="relative h-2 bg-white/20 backdrop-blur-xs rounded-full overflow-hidden border border-white/10">
                <div
                  className="absolute top-0 bottom-0 rounded-full shadow"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: accentColor,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg rounded-full"
                  style={{
                    left: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-300 font-semibold px-0.5">
                <span className="text-zinc-400">0.0s (Raw)</span>
                <span className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/15 text-[#FFE600] font-bold">
                  Playhead: {currentTime.toFixed(1)}s
                </span>
                <span className="text-zinc-400">{duration.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Precision Controls */}
          <div className="space-y-2 pt-0.5">
            {/* Start Cut */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-800 text-[11px]">In Point</span>
                  <span className="font-mono font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded text-[11px] min-w-[38px] text-center">
                    {trimStart.toFixed(1)}s
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeStart(-0.1)}
                    className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    -0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeStart(0.1)}
                    className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    +0.1s
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, duration - minDuration)}
                step={0.1}
                value={trimStart}
                onChange={(e) => handleStartChange(parseFloat(e.target.value))}
                className="w-full accent-[#7F48ED] cursor-pointer h-1.5 bg-zinc-100 rounded-lg"
              />
            </div>

            {/* End Cut */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-800 text-[11px]">Out Point</span>
                  <span className="font-mono font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded text-[11px] min-w-[38px] text-center">
                    {trimEnd.toFixed(1)}s
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeEnd(-0.1)}
                    className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    -0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeEnd(0.1)}
                    className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    +0.1s
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={Math.min(duration, trimStart + minDuration)}
                max={duration}
                step={0.1}
                value={trimEnd}
                onChange={(e) => handleEndChange(parseFloat(e.target.value))}
                className="w-full accent-[#FF6700] cursor-pointer h-1.5 bg-zinc-100 rounded-lg"
              />
            </div>
          </div>

          {noteText && (
            <div className="text-[10px] text-zinc-500 font-sans italic pt-0.5">
              {noteText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

