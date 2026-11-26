"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Scissors,
  Trash2,
  Film,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Play,
  Edit3,
} from "lucide-react";
import type {
  ClientClip,
  ClientMediaAsset,
  ClientRawFootage,
  SceneRole,
} from "@/types/client";
import ClientFootageTrimmer, { SCENE_ROLE_OPTIONS } from "@/components/studio/ClientFootageTrimmer";

interface ClientFootageTabProps {
  clientId: string;
  clientName: string;
  initialRawFootage: ClientRawFootage[];
  initialClips: ClientClip[];
  initialMediaAssets: ClientMediaAsset[];
  onRefreshParent?: () => void;
}

const ROLE_BADGE_CLASS: Record<SceneRole, string> = {
  product: "bg-blue-600 text-white",
  broll: "bg-purple-600 text-white",
  detail: "bg-emerald-600 text-white",
  hook_alt: "bg-amber-600 text-white",
  cta: "bg-orange-600 text-white",
};

export default function ClientFootageTab({
  clientId,
  clientName,
  initialRawFootage,
  initialClips,
  initialMediaAssets,
  onRefreshParent,
}: ClientFootageTabProps) {
  const [rawFootage, setRawFootage] = useState<ClientRawFootage[]>(initialRawFootage);
  const [clips, setClips] = useState<ClientClip[]>(initialClips);
  const [roleFilter, setRoleFilter] = useState<SceneRole | "all">("all");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [activeTrimmerRaw, setActiveTrimmerRaw] = useState<ClientRawFootage | null>(null);
  const [editingClip, setEditingClip] = useState<ClientClip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRawFootage(initialRawFootage);
  }, [initialRawFootage]);

  useEffect(() => {
    setClips(initialClips);
  }, [initialClips]);

  // Poll raw footage status while any upload is transcoding
  useEffect(() => {
    const hasPending = rawFootage.some((r) => r.status === "raw" || r.status === "processing");
    if (!hasPending) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/studio/clients/${clientId}/footage/raw`);
        const data = await res.json();
        if (data?.ok && Array.isArray(data.rawFootage)) {
          setRawFootage(data.rawFootage);
          const stillPending = data.rawFootage.some(
            (r: ClientRawFootage) => r.status === "raw" || r.status === "processing"
          );
          if (!stillPending && onRefreshParent) onRefreshParent();
        }
      } catch {}
    }, 3000);
    return () => clearInterval(timer);
  }, [rawFootage, clientId, onRefreshParent]);

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) =>
      /\.(mp4|mov|m4v|webm|mkv)$/i.test(f.name) || f.type.startsWith("video/")
    );
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadStatusMsg(`Uploading ${files.length} raw video file(s)...`);

    try {
      const formData = new FormData();
      let usedPresigned = false;

      // Try R2 presigned direct upload per file first for large phone videos
      for (const file of files) {
        const presignRes = await fetch(`/api/studio/clients/${clientId}/footage/presign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || "video/mp4",
          }),
        });
        const presign = await presignRes.json().catch(() => ({}));

        if (presign?.directUploadSupported && presign.uploadUrl) {
          const putRes = await fetch(presign.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type || "video/mp4" },
            body: file,
          });
          if (putRes.ok) {
            usedPresigned = true;
            const regRes = await fetch(`/api/studio/clients/${clientId}/footage/raw`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                rawId: presign.rawId,
                storageUrl: presign.storageUrl,
                filename: file.name,
                mime: file.type || "video/mp4",
                fileSizeBytes: file.size,
              }),
            });
            const regData = await regRes.json();
            if (regData?.ok && regData.rawFootage) {
              setRawFootage((prev) => [...regData.rawFootage, ...prev]);
            }
            continue;
          }
        }

        // Local/multipart fallback
        formData.append("files", file);
      }

      if (formData.has("files")) {
        const res = await fetch(`/api/studio/clients/${clientId}/footage/raw`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data?.ok && data.rawFootage) {
          setRawFootage((prev) => [...data.rawFootage, ...prev]);
          setUploadStatusMsg(
            `Uploaded ${data.rawFootage.length} file(s). Transcoding & generating scrub sprites...`
          );
        } else {
          setUploadStatusMsg(data?.error || "Upload failed");
        }
      } else if (usedPresigned) {
        setUploadStatusMsg("Direct upload complete. Transcoding & generating scrub sprites...");
      }
    } catch (err: any) {
      setUploadStatusMsg(err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatusMsg(null), 5000);
    }
  };

  const handleDeleteRaw = async (rawId: string) => {
    const res = await fetch(`/api/studio/clients/${clientId}/footage/raw?rawId=${rawId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRawFootage((prev) => prev.filter((r) => r.id !== rawId));
      setClips((prev) => prev.filter((c) => c.sourceRawId !== rawId));
      if (activeTrimmerRaw?.id === rawId) setActiveTrimmerRaw(null);
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    const res = await fetch(`/api/studio/clients/${clientId}/clips/${clipId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setClips((prev) => prev.filter((c) => c.id !== clipId));
    }
  };

  const handleOpenClipForRetrim = (clip: ClientClip) => {
    const raw = rawFootage.find((r) => r.id === clip.sourceRawId);
    if (!raw) return;
    setEditingClip(clip);
    setActiveTrimmerRaw(raw);
  };

  const filteredClips =
    roleFilter === "all" ? clips : clips.filter((c) => c.sceneRole === roleFilter);

  return (
    <div className="space-y-6">
      {/* 1. Raw Footage Multi-File Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) handleUploadFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-6 transition text-center space-y-2 ${
          isDragging
            ? "border-[#7F48ED] bg-purple-50/60"
            : "border-zinc-300 bg-white hover:border-[#FF6700]/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/mp4,video/quicktime,.mov,.mp4,.m4v,.webm"
          onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-[#FF6700]/30 text-[#FF6700] flex items-center justify-center mx-auto">
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        </div>
        <div className="text-sm font-black text-zinc-900">
          Drop Raw Client Footage (MP4 / MOV / HEVC)
        </div>
        <p className="text-xs text-zinc-500 max-w-xl mx-auto">
          Upload multiple long phone or camera recordings for {clientName}. HEVC and .mov files are automatically transcoded to browser-playable H.264 with scrubbing sprites.
        </p>
        <div className="pt-1">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold cursor-pointer disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Select Raw Video Files"}
          </button>
        </div>
        {uploadStatusMsg && (
          <div className="text-xs font-bold text-[#7F48ED] pt-1">{uploadStatusMsg}</div>
        )}
      </div>

      {/* 2. Raw Footage Ingest List */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
            <Film className="w-4 h-4 text-[#FF6700]" />
            <span>Raw Footage Uploads ({rawFootage.length})</span>
          </h3>
          <span className="text-[11px] text-zinc-500">
            Select any processed raw video to cut virtual clips
          </span>
        </div>

        {rawFootage.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No raw footage uploaded for {clientName} yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {rawFootage.map((raw) => {
              const clipsCount = clips.filter((c) => c.sourceRawId === raw.id).length;
              const isReady = raw.status === "processed";
              const isBusy = raw.status === "raw" || raw.status === "processing";
              return (
                <div
                  key={raw.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-11 rounded-lg bg-purple-50 border border-[#7F48ED]/30 overflow-hidden shrink-0 flex items-center justify-center">
                      {raw.thumbnailUrl ? (
                        <img src={raw.thumbnailUrl} alt={raw.filename} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-4 h-4 text-[#7F48ED]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-900 truncate">{raw.filename}</div>
                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 flex-wrap">
                        <span>{raw.duration ? `${raw.duration.toFixed(1)}s` : "Probing..."}</span>
                        {raw.codec && <span>· {raw.codec.toUpperCase()}</span>}
                        {raw.width && raw.height && <span>· {raw.width}x{raw.height}</span>}
                        <span>· {clipsCount} clip(s) pulled</span>
                      </div>
                      {raw.status === "failed" && raw.errorMessage && (
                        <div className="text-[10px] text-red-600 mt-0.5">{raw.errorMessage}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isBusy && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>{raw.status === "raw" ? "Queued" : "Transcoding..."}</span>
                      </span>
                    )}
                    {isReady && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    )}
                    {raw.status === "failed" && (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-[10px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Failed</span>
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={!isReady && !raw.storageUrl}
                      onClick={() => {
                        setEditingClip(null);
                        setActiveTrimmerRaw(raw);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#7F48ED] hover:bg-[#6D38D9] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Open Trimmer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRaw(raw.id)}
                      className="p-1.5 rounded-xl border border-zinc-200 hover:border-red-300 text-zinc-400 hover:text-red-600 cursor-pointer"
                      title="Delete Raw Footage"
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

      {/* 3. Active Client Footage Trimmer Drawer */}
      {activeTrimmerRaw && (
        <ClientFootageTrimmer
          clientId={clientId}
          rawFootage={activeTrimmerRaw}
          editingClip={editingClip}
          existingClipsFromRaw={clips.filter((c) => c.sourceRawId === activeTrimmerRaw.id)}
          onClipSaved={(saved, isEdit) => {
            setClips((prev) =>
              isEdit ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]
            );
            if (isEdit) setEditingClip(null);
            if (onRefreshParent) onRefreshParent();
          }}
          onCancelEdit={() => setEditingClip(null)}
          onClose={() => {
            setActiveTrimmerRaw(null);
            setEditingClip(null);
          }}
        />
      )}

      {/* 4. Client Clip Library (Virtual Clips, Filterable by Scene Role) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">
              Client Clip Library ({clips.length})
            </h3>
            <p className="text-[11px] text-zinc-500">
              Virtual scene-ready cuts automatically pulled into Scenes 2–3 in the Generator.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                roleFilter === "all"
                  ? "bg-[#FF6700] text-white border-[#FF6700]"
                  : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-[#FF6700]/50"
              }`}
            >
              All ({clips.length})
            </button>
            {SCENE_ROLE_OPTIONS.map((opt) => {
              const cnt = clips.filter((c) => c.sceneRole === opt.value).length;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRoleFilter(opt.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                    roleFilter === opt.value
                      ? "bg-[#7F48ED] text-white border-[#7F48ED]"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200"
                  }`}
                >
                  {opt.label} ({cnt})
                </button>
              );
            })}
          </div>
        </div>

        {filteredClips.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
            No clips in this role yet. Open a raw video in the Trimmer above to save clips.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredClips.map((clip) => {
              const dur = (clip.outPoint - clip.inPoint).toFixed(1);
              return (
                <div
                  key={clip.id}
                  className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 flex flex-col justify-between"
                >
                  <div className="relative aspect-[9/16] max-h-64 bg-black">
                    <video
                      src={clip.previewUrl || clip.sourcePlayableUrl || clip.sourceStorageUrl}
                      poster={clip.thumbnailUrl}
                      controls
                      muted
                      loop
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        ROLE_BADGE_CLASS[clip.sceneRole]
                      }`}
                    >
                      {clip.sceneRole}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white font-mono text-[9px]">
                      {dur}s ({clip.inPoint.toFixed(1)}–{clip.outPoint.toFixed(1)}s)
                    </span>
                  </div>

                  <div className="p-3 space-y-2 text-xs">
                    <div>
                      <div className="font-bold text-zinc-900 truncate">{clip.label}</div>
                      {clip.notes && (
                        <div className="text-[11px] text-zinc-500 line-clamp-1">{clip.notes}</div>
                      )}
                      {clip.sourceFilename && (
                        <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                          from {clip.sourceFilename}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-200 flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenClipForRetrim(clip)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-[#7F48ED] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-[#7F48ED]" />
                        <span>Re-Trim</span>
                      </button>

                      <Link
                        href={`/studio/generate?clientId=${clientId}&clipId=${clip.id}`}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7F48ED] text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Use</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteClip(clip.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-red-600 cursor-pointer"
                        title="Delete Clip"
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

      {/* 5. Pre-Cut Brand Media Assets (Migrated Legacy Scene Assets) */}
      {initialMediaAssets.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-[#7F48ED]" />
            <span>Pre-Cut Brand Media Assets ({initialMediaAssets.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {initialMediaAssets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 flex flex-col"
              >
                <video
                  src={asset.src}
                  controls
                  muted
                  preload="metadata"
                  className="w-full aspect-video bg-black object-cover"
                />
                <div className="p-2.5 text-xs space-y-1">
                  <div className="font-bold text-zinc-900 truncate">{asset.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Scene {asset.targetScene}</span>
                    <span>{asset.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

