"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  UserCheck,
  Film,
  Video,
  PackageCheck,
  Link2,
  Save,
  Upload,
  Plus,
  X,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  CheckCircle2,
  FolderDown,
  FlaskConical,
  ShieldAlert,
  Users,
  Search,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Eye,
  Share2,
} from "lucide-react";
import type {
  ApprovedDeliverableRecord,
  ClientApprovedCreator,
  ClientClip,
  ClientMediaAsset,
  ClientRawFootage,
  ClientRecord,
  ClientStatus,
  ReviewLinkRecord,
} from "@/types/client";
import type { AdJob } from "@/lib/adJob";
import { BRAND_COLOR_PRESETS, LICENSED_MUSIC_LIBRARY, TRUST_BADGE_PRESETS } from "@/data/timelineAssets";
import { CREATOR_ROSTER, type CreatorProfile } from "@/data/creatorRoster";
import ClientFootageTab from "@/components/studio/ClientFootageTab";

type WorkspaceTab = "profile" | "footage" | "ads" | "deliverables" | "review-links";

export default function ClientWorkspacePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = params?.id || "";

  const initialTab = (searchParams?.get("tab") as WorkspaceTab) || "profile";
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(
    ["profile", "footage", "ads", "deliverables", "review-links"].includes(initialTab)
      ? initialTab
      : "profile"
  );

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [approvedCreators, setApprovedCreators] = useState<ClientApprovedCreator[]>([]);
  const [rawFootage, setRawFootage] = useState<ClientRawFootage[]>([]);
  const [clips, setClips] = useState<ClientClip[]>([]);
  const [mediaAssets, setMediaAssets] = useState<ClientMediaAsset[]>([]);
  const [adJobs, setAdJobs] = useState<AdJob[]>([]);
  const [deliverables, setDeliverables] = useState<ApprovedDeliverableRecord[]>([]);
  const [reviewLinks, setReviewLinks] = useState<ReviewLinkRecord[]>([]);
  const [allCreators, setAllCreators] = useState<CreatorProfile[]>(CREATOR_ROSTER);
  const [toast, setToast] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("active");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [offerPromo, setOfferPromo] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [brandColor, setBrandColor] = useState("#FF6700");
  const [defaultMusicTrackId, setDefaultMusicTrackId] = useState("trendy-upbeat-ugc");
  const [defaultVisualPrompt, setDefaultVisualPrompt] = useState("");
  const [doNotSay, setDoNotSay] = useState<string[]>([]);
  const [doNotSayInput, setDoNotSayInput] = useState("");
  const [approvedClaims, setApprovedClaims] = useState<string[]>([]);
  const [claimInput, setClaimInput] = useState("");
  const [selectedTrustBadgeIds, setSelectedTrustBadgeIds] = useState<string[]>([]);
  const [selectedCreatorSlugs, setSelectedCreatorSlugs] = useState<string[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Review Links creation & interactive state
  const [newLinkAdId, setNewLinkAdId] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [linkStatusFilter, setLinkStatusFilter] = useState<"all" | "active" | "revoked">("all");
  const [linkSearch, setLinkSearch] = useState("");
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [previewingLinkId, setPreviewingLinkId] = useState<string | null>(null);

  // Interactive Ads Pipeline Tab state
  const [adsStageFilter, setAdsStageFilter] = useState<"all" | "draft" | "generating" | "in_review" | "approved" | "delivered">("all");
  const [adsSearch, setAdsSearch] = useState("");
  const [playingAdId, setPlayingAdId] = useState<string | null>(null);
  const [adAspectMap, setAdAspectMap] = useState<Record<string, "9:16" | "1:1" | "4:5">>({});
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null);
  const [sharingAdId, setSharingAdId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadWorkspace = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const [wsRes, creatorsRes] = await Promise.all([
        fetch(`/api/studio/clients/${clientId}`),
        fetch("/api/studio/creators").catch(() => null),
      ]);
      const ws = await wsRes.json();
      if (ws?.ok && ws.client) {
        const c: ClientRecord = ws.client;
        setClient(c);
        setApprovedCreators(ws.approvedCreators || []);
        setRawFootage(ws.rawFootage || []);
        setClips(ws.clips || []);
        setMediaAssets(ws.mediaAssets || []);
        setAdJobs(ws.adJobs || []);
        setDeliverables(ws.deliverables || []);
        setReviewLinks(ws.reviewLinks || []);

        setName(c.name);
        setStatus(c.status);
        setContactName(c.contactName || "");
        setContactEmail(c.contactEmail || "");
        setContactPhone(c.contactPhone || "");
        setWebsite(c.website || c.brandProfile?.website || "");
        setCategory(c.brandProfile?.category || "");
        setOfferPromo(c.brandProfile?.offerPromo || "");
        setTargetAudience(c.brandProfile?.targetAudience || "");
        setBrandVoice(c.brandProfile?.brandVoice || "");
        setBrandColor(c.brandProfile?.brandColor || "#FF6700");
        setDefaultMusicTrackId(c.brandProfile?.defaultMusicTrackId || "trendy-upbeat-ugc");
        setDefaultVisualPrompt(c.brandProfile?.defaultVisualPrompt || "");
        setDoNotSay(c.brandProfile?.doNotSay || []);
        setApprovedClaims(c.brandProfile?.approvedClaims || []);
        setSelectedTrustBadgeIds((c.brandProfile?.trustBadges || []).map((b) => b.id));
        setSelectedCreatorSlugs(
          (ws.approvedCreators || [])
            .filter((ac: ClientApprovedCreator) => ac.isApproved)
            .map((ac: ClientApprovedCreator) => ac.creatorSlug)
        );
        if ((ws.adJobs || []).length > 0 && !newLinkAdId) {
          setNewLinkAdId(ws.adJobs[0].id);
        }
      }

      if (creatorsRes && creatorsRes.ok) {
        const crData = await creatorsRes.json();
        if (Array.isArray(crData?.roster)) setAllCreators(crData.roster);
      }
    } catch (err) {
      console.error("Failed loading client workspace:", err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const switchTab = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    router.replace(`/studio/clients/${clientId}?tab=${tab}`, { scroll: false });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setIsSavingProfile(true);
    try {
      const trustBadges = selectedTrustBadgeIds
        .map((id) => TRUST_BADGE_PRESETS.find((b) => b.id === id))
        .filter(Boolean)
        .map((b) => ({ id: b!.id, label: b!.label, subtext: b!.subtext || "" }));

      const res = await fetch(`/api/studio/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          status,
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          website: website.trim(),
          approvedCreatorSlugs: selectedCreatorSlugs,
          brandProfile: {
            category: category.trim(),
            offerPromo: offerPromo.trim(),
            targetAudience: targetAudience.trim(),
            brandVoice: brandVoice.trim(),
            brandColor,
            defaultMusicTrackId,
            defaultVisualPrompt: defaultVisualPrompt.trim(),
            doNotSay,
            approvedClaims,
            trustBadges,
            website: website.trim(),
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setClient(data.client);
        setApprovedCreators(data.approvedCreators || []);
        showToast("Brand profile & creator preferences saved!");
      } else {
        showToast(data.error || "Failed to save brand profile");
      }
    } catch {
      showToast("Error saving brand profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !client) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/studio/clients/${client.id}/logo`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setClient(data.client);
      showToast("Client logo updated!");
    } else {
      showToast(data.error || "Logo upload failed");
    }
  };

  const handleCreateReviewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !newLinkAdId) return;
    setIsCreatingLink(true);
    try {
      const res = await fetch(`/api/studio/clients/${client.id}/review-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: newLinkAdId, label: newLinkLabel.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setReviewLinks((prev) => [data.link, ...prev]);
        setNewLinkLabel("");
        showToast("Client review link generated!");
      } else {
        showToast(data.error || "Failed to create review link");
      }
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleRevokeReviewLink = async (linkId: string) => {
    if (!client) return;
    const res = await fetch(`/api/studio/clients/${client.id}/review-links?linkId=${linkId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setReviewLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, revokedAt: new Date().toISOString() } : l))
      );
      showToast("Review link revoked.");
    }
  };

  const buildShareUrl = (link: ReviewLinkRecord) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/studio/review?variantId=${encodeURIComponent(
      link.adId
    )}&clientView=true&shareToken=${encodeURIComponent(link.shareToken)}`;
  };

  if (loading && !client) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-6">
        <div className="max-w-7xl mx-auto h-64 bg-white rounded-2xl border border-zinc-200 animate-pulse" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3 max-w-md">
          <h2 className="text-base font-black text-zinc-900">Client Not Found</h2>
          <Link
            href="/studio/clients"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Clients</span>
          </Link>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: WorkspaceTab; label: string; icon: React.ReactNode; count?: number }> = [
    { id: "profile", label: "Brand Profile", icon: <UserCheck className="w-3.5 h-3.5" /> },
    {
      id: "footage",
      label: "Footage",
      icon: <Film className="w-3.5 h-3.5" />,
      count: clips.length + mediaAssets.length,
    },
    { id: "ads", label: "Ads", icon: <Video className="w-3.5 h-3.5" />, count: adJobs.length },
    {
      id: "deliverables",
      label: "Deliverables",
      icon: <PackageCheck className="w-3.5 h-3.5" />,
      count: client.isSample ? 0 : adJobs.filter((j) => j.status === "approved").length,
    },
    {
      id: "review-links",
      label: "Review Links",
      icon: <Link2 className="w-3.5 h-3.5" />,
      count: reviewLinks.filter((l) => !l.revokedAt).length,
    },
  ];

  const approvedJobs = adJobs.filter((j) => j.status === "approved" && !client.isSample);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#090D16] flex flex-col">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#7F48ED] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl border border-purple-400">
          {toast}
        </div>
      )}

      {/* Workspace Sticky Header (Full Width) */}
      <header className="bg-white border-b border-zinc-200 px-3 sm:px-6 pt-4 pb-0 sticky top-14 z-30">
        <div className="w-full space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/studio/clients"
                className="p-2 rounded-xl border border-zinc-200 hover:border-[#FF6700] text-zinc-600 hover:text-[#FF6700] transition shrink-0"
                title="All Clients"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="w-11 h-11 rounded-xl border border-[#7F48ED]/30 bg-[#7F48ED] flex items-center justify-center shrink-0 overflow-hidden text-white font-black text-sm">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl === "/logos/logo-compact-dark.png" ? "/logos/logo-mark.png" : client.logoUrl}
                    alt={client.name}
                    className="w-full h-full object-contain p-1.5 bg-white"
                  />
                ) : (
                  client.name.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 truncate">
                    {client.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold uppercase text-zinc-700">
                    {client.status}
                  </span>
                  {client.isSample && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-bold uppercase text-[#7F48ED] inline-flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" />
                      Sample Concept
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">
                  {client.brandProfile?.category || "General"} ·{" "}
                  {client.brandProfile?.offerPromo || "No offer configured yet"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={loadWorkspace}
                className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 cursor-pointer"
                title="Refresh Workspace"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                href={`/studio/generate?clientId=${client.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7F48ED] hover:bg-[#6D38D9] text-white text-xs font-bold shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF6700]" />
                <span>Generate Ad for {client.name}</span>
              </Link>
            </div>
          </div>

          {/* 5 Workspace Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "border-[#FF6700] text-zinc-900"
                      : "border-transparent text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 text-zinc-700 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Active Tab Content (Full Width) */}
      <main className="w-full flex-1 px-3 sm:px-6 py-5">
        {/* TAB 1: BRAND PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Client Identity &amp; Offer
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Client / Brand Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ClientStatus)}
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2 bg-white font-medium"
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Offer / Promo
                    </label>
                    <input
                      type="text"
                      value={offerPromo}
                      onChange={(e) => setOfferPromo(e.target.value)}
                      placeholder="e.g. Free AI Visibility Audit"
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Category / Niche
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Brand Voice
                    </label>
                    <input
                      type="text"
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                      placeholder="e.g. Direct, warm, UGC conversational"
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Default Visual Direction / Style Notes
                  </label>
                  <textarea
                    rows={3}
                    value={defaultVisualPrompt}
                    onChange={(e) => setDefaultVisualPrompt(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* Compliance: Do-Not-Say + Approved Claims + Trust Badges */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs text-xs">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#FF6700]" />
                  <span>Compliance Guardrails &amp; Trust Badges</span>
                </h2>

                {/* Do-Not-Say List */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block">
                    Do-Not-Say List (Flagged in Generator &amp; Review Gate)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={doNotSayInput}
                      onChange={(e) => setDoNotSayInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const v = doNotSayInput.trim();
                          if (v && !doNotSay.includes(v)) {
                            setDoNotSay([...doNotSay, v]);
                            setDoNotSayInput("");
                          }
                        }
                      }}
                      placeholder="Type banned phrase and press Add..."
                      className="flex-1 border border-zinc-200 rounded-xl px-3 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = doNotSayInput.trim();
                        if (v && !doNotSay.includes(v)) {
                          setDoNotSay([...doNotSay, v]);
                          setDoNotSayInput("");
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doNotSay.map((phrase) => (
                      <span
                        key={phrase}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-medium"
                      >
                        <span>{phrase}</span>
                        <button
                          type="button"
                          onClick={() => setDoNotSay(doNotSay.filter((p) => p !== phrase))}
                          className="hover:text-red-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Approved Claims */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block">
                    Approved Substantiated Claims
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={claimInput}
                      onChange={(e) => setClaimInput(e.target.value)}
                      placeholder="Add verified claim..."
                      className="flex-1 border border-zinc-200 rounded-xl px-3 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = claimInput.trim();
                        if (v && !approvedClaims.includes(v)) {
                          setApprovedClaims([...approvedClaims, v]);
                          setClaimInput("");
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#7F48ED] text-white font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {approvedClaims.map((claim) => (
                      <span
                        key={claim}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                      >
                        <span>{claim}</span>
                        <button
                          type="button"
                          onClick={() => setApprovedClaims(approvedClaims.filter((c) => c !== claim))}
                          className="cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block">
                    Approved Trust Badges
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TRUST_BADGE_PRESETS.map((badge) => {
                      const checked = selectedTrustBadgeIds.includes(badge.id);
                      return (
                        <label
                          key={badge.id}
                          className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                            checked
                              ? "bg-purple-50/70 border-[#7F48ED]"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedTrustBadgeIds((prev) =>
                                prev.includes(badge.id)
                                  ? prev.filter((id) => id !== badge.id)
                                  : [...prev, badge.id]
                              )
                            }
                            className="mt-0.5 accent-[#7F48ED]"
                          />
                          <div>
                            <div className="font-bold text-zinc-900">{badge.label}</div>
                            <div className="text-[10px] text-zinc-500">{badge.subtext}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Logo, Contact, Brand Style, Approved Creators */}
            <div className="lg:col-span-4 space-y-5 text-xs">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Logo, Style &amp; Contact
                </h2>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#7F48ED] border border-[#7F48ED]/30 flex items-center justify-center overflow-hidden text-white font-black">
                    {client.logoUrl ? (
                      <img
                        src={client.logoUrl === "/logos/logo-compact-dark.png" ? "/logos/logo-mark.png" : client.logoUrl}
                        alt={client.name}
                        className="w-full h-full object-contain p-1.5 bg-white"
                      />
                    ) : (
                      client.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <label className="px-3 py-2 rounded-xl border border-zinc-200 hover:border-[#7F48ED] bg-zinc-50 font-bold cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#7F48ED]" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-zinc-500">
                      Brand Color (Scene 4 CTA &amp; Button)
                    </label>
                    <span className="font-mono text-[10px] font-bold text-zinc-600">{brandColor}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {BRAND_COLOR_PRESETS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setBrandColor(c.hex)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer transition ${
                          brandColor === c.hex
                            ? "ring-2 ring-[#7F48ED] ring-offset-2 border-white scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-7 h-7 rounded-full border border-zinc-200 cursor-pointer p-0 bg-transparent"
                      title="Pick custom brand color"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-zinc-500">CTA End-Card Preview:</span>
                    <span
                      className="px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-xs truncate max-w-[160px]"
                      style={{ backgroundColor: brandColor }}
                    >
                      {offerPromo || "Claim Offer"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Default Music Track
                  </label>
                  <select
                    value={defaultMusicTrackId}
                    onChange={(e) => setDefaultMusicTrackId(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 bg-white"
                  >
                    {LICENSED_MUSIC_LIBRARY.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.genre})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Name"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-1.5"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Contact Email"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-1.5"
                  />
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Contact Phone"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-1.5"
                  />
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website URL"
                    className="w-full border border-zinc-200 rounded-xl px-3 py-1.5"
                  />
                </div>
              </div>

              {/* Approved Creators from Global Library */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#7F48ED]" />
                    <span>Approved Creators</span>
                  </h2>
                  <span className="text-[10px] text-zinc-400">Global Library</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Selected creators appear first in the Generator for {client.name}.
                </p>

                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="space-y-1.5 max-h-72 overflow-y-auto overscroll-contain pr-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#7F48ED]/40 [&::-webkit-scrollbar-track]:bg-zinc-100"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {allCreators.map((creator) => {
                    const slug = creator.actorPresetId;
                    const isChecked = selectedCreatorSlugs.includes(slug);
                    const usage = approvedCreators.find((a) => a.creatorSlug === slug);
                    return (
                      <label
                        key={creator.id}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl border cursor-pointer ${
                          isChecked
                            ? "bg-purple-50 border-[#7F48ED]"
                            : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setSelectedCreatorSlugs((prev) =>
                                prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
                              )
                            }
                            className="accent-[#7F48ED]"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-zinc-900 truncate">{creator.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{creator.handle}</div>
                          </div>
                        </div>
                        {usage && usage.timesUsed > 0 && (
                          <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-600 shrink-0">
                            {usage.timesUsed}x used
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? "Saving Profile..." : "Save Brand Profile"}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: FOOTAGE (Raw Upload + Transcode + Virtual Clip Trimmer + Clip Library) */}
        {activeTab === "footage" && (
          <ClientFootageTab
            clientId={client.id}
            clientName={client.name}
            initialRawFootage={rawFootage}
            initialClips={clips}
            initialMediaAssets={mediaAssets}
            onRefreshParent={loadWorkspace}
          />
        )}

        {/* TAB 3: INTERACTIVE ADS PIPELINE */}
        {activeTab === "ads" && (() => {
          const resolveStage = (job: AdJob): "draft" | "generating" | "in_review" | "approved" | "delivered" => {
            if (job.status === "delivered" || (job.status === "approved" && (job.delivery?.status === "delivered" || job.deliveredAt))) {
              return "delivered";
            }
            if (job.status === "approved") return "approved";
            if (job.status === "queued" || job.status === "rendering") return "generating";
            if (job.status === "draft") return "draft";
            return "in_review";
          };

          const stageCounts = {
            all: adJobs.length,
            draft: adJobs.filter((j) => resolveStage(j) === "draft").length,
            generating: adJobs.filter((j) => resolveStage(j) === "generating").length,
            in_review: adJobs.filter((j) => resolveStage(j) === "in_review").length,
            approved: adJobs.filter((j) => resolveStage(j) === "approved").length,
            delivered: adJobs.filter((j) => resolveStage(j) === "delivered").length,
          };

          const filteredAds = adJobs.filter((job) => {
            const st = resolveStage(job);
            if (adsStageFilter !== "all" && st !== adsStageFilter) return false;
            if (adsSearch.trim()) {
              const q = adsSearch.trim().toLowerCase();
              return (
                job.hookText.toLowerCase().includes(q) ||
                job.creativeAngle.toLowerCase().includes(q) ||
                job.id.toLowerCase().includes(q) ||
                (job.creator?.name || "").toLowerCase().includes(q)
              );
            }
            return true;
          });

          const stageTabs: Array<{ id: typeof adsStageFilter; label: string; count: number }> = [
            { id: "all", label: "All", count: stageCounts.all },
            { id: "draft", label: "Draft", count: stageCounts.draft },
            { id: "generating", label: "Generating", count: stageCounts.generating },
            { id: "in_review", label: "In-Review", count: stageCounts.in_review },
            { id: "approved", label: "Approved", count: stageCounts.approved },
            { id: "delivered", label: "Delivered", count: stageCounts.delivered },
          ];

          const pipelineSteps = ["Draft", "Generating", "In-Review", "Approved", "Delivered"];
          const stageIndexMap: Record<ReturnType<typeof resolveStage>, number> = {
            draft: 0,
            generating: 1,
            in_review: 2,
            approved: 3,
            delivered: 4,
          };

          const handleQuickShareLink = async (job: AdJob) => {
            if (!client) return;
            setSharingAdId(job.id);
            try {
              const res = await fetch(`/api/studio/clients/${client.id}/review-links`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adId: job.id, label: `${client.name} — ${job.creativeAngle}` }),
              });
              const data = await res.json();
              if (res.ok && data.ok && data.link) {
                setReviewLinks((prev) => [data.link, ...prev]);
                const url = buildShareUrl(data.link);
                navigator.clipboard?.writeText(url);
                showToast("White-label review link created & copied!");
              }
            } finally {
              setSharingAdId(null);
            }
          };

          return (
            <div className="space-y-4">
              {/* Compact Interactive Stage Filter + Search Bar */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-3.5 sm:p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {stageTabs.map((st) => {
                    const active = adsStageFilter === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setAdsStageFilter(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                          active
                            ? "bg-[#7F48ED] text-white border-[#7F48ED] shadow-xs"
                            : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-[#7F48ED]/50 hover:text-[#7F48ED]"
                        }`}
                      >
                        <span>{st.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            active ? "bg-white text-[#7F48ED]" : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {st.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#7F48ED] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adsSearch}
                      onChange={(e) => setAdsSearch(e.target.value)}
                      placeholder="Search hook, angle, creator, or ID..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#7F48ED]"
                    />
                  </div>
                  <Link
                    href={`/studio/generate?clientId=${client.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Generate Ad</span>
                  </Link>
                </div>
              </div>

              {/* Interactive Ad Cards Grid */}
              {filteredAds.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#7F48ED]/30 p-10 text-center space-y-2 text-xs text-zinc-500">
                  <Video className="w-8 h-8 text-[#7F48ED] mx-auto" />
                  <div className="font-bold text-zinc-800">No ads in this stage</div>
                  <Link
                    href={`/studio/generate?clientId=${client.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7F48ED] text-white font-bold mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Ad</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAds.map((job) => {
                    const stage = resolveStage(job);
                    const stageIdx = stageIndexMap[stage];
                    const ratio = adAspectMap[job.id] || "9:16";
                    const videoSrc =
                      ratio === "1:1"
                        ? job.variants?.v1x1 || job.variants?.v9x16
                        : ratio === "4:5"
                        ? job.variants?.v4x5 || job.variants?.v9x16
                        : job.variants?.v9x16;
                    const isPlaying = playingAdId === job.id;
                    const isExpanded = expandedAdId === job.id;

                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl border border-zinc-200 hover:border-[#7F48ED] hover:shadow-md transition overflow-hidden flex flex-col justify-between text-xs"
                      >
                        {/* Top Bar + Video Stage */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                stage === "approved" || stage === "delivered"
                                  ? "bg-[#7F48ED] text-white"
                                  : "bg-[#FF6700] text-white"
                              }`}
                            >
                              {job.status.replace("_", " ")}
                            </span>

                            {/* Ratio Switcher */}
                            <div className="inline-flex p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-[10px] font-mono font-bold">
                              {(["9:16", "1:1", "4:5"] as const).map((r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => setAdAspectMap((prev) => ({ ...prev, [job.id]: r }))}
                                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                                    ratio === r
                                      ? "bg-[#7F48ED] text-white"
                                      : "text-zinc-500 hover:text-[#7F48ED]"
                                  }`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Click-to-Play Inline Video Preview */}
                          <div className="flex gap-3">
                            <div
                              onClick={() => setPlayingAdId(isPlaying ? null : job.id)}
                              className="relative w-24 h-40 rounded-xl overflow-hidden bg-purple-950/10 border border-zinc-200 shrink-0 cursor-pointer group"
                            >
                              {isPlaying && videoSrc ? (
                                <video
                                  src={videoSrc}
                                  autoPlay
                                  controls
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <>
                                  <img
                                    src={job.variants?.thumbnail || "/images/howitworksstudio.jpg"}
                                    alt={job.hookText}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-[#7F48ED]/25 group-hover:bg-[#7F48ED]/40 transition flex items-center justify-center">
                                    <div className="w-9 h-9 rounded-full bg-[#FF6700] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                                      <Play className="w-4 h-4 fill-white ml-0.5" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold uppercase text-[#7F48ED] truncate">
                                  {job.creativeAngle}
                                </div>
                                <h3 className="font-black text-zinc-900 line-clamp-2 leading-snug">
                                  {job.hookText}
                                </h3>
                                <div className="text-[11px] text-zinc-500 truncate">
                                  {job.creator?.name}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-400">
                                  {job.id}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setExpandedAdId(isExpanded ? null : job.id)}
                                className="self-start text-[11px] font-bold text-[#7F48ED] hover:text-[#FF6700] inline-flex items-center gap-1 cursor-pointer mt-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{isExpanded ? "Hide Script & Checks" : "Inspect Script & Checks"}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          {/* 5-Step Visual Pipeline Stepper */}
                          <div className="pt-1">
                            <div className="grid grid-cols-5 gap-1">
                              {pipelineSteps.map((stepLabel, idx) => {
                                const done = idx <= stageIdx;
                                const isCurrent = idx === stageIdx;
                                return (
                                  <div key={stepLabel} className="space-y-1 text-center">
                                    <div
                                      className={`h-1.5 rounded-full transition ${
                                        isCurrent
                                          ? "bg-[#FF6700]"
                                          : done
                                          ? "bg-[#7F48ED]"
                                          : "bg-zinc-200"
                                      }`}
                                    />
                                    <div
                                      className={`text-[9px] font-bold truncate ${
                                        isCurrent
                                          ? "text-[#FF6700]"
                                          : done
                                          ? "text-[#7F48ED]"
                                          : "text-zinc-400"
                                      }`}
                                    >
                                      {stepLabel}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Expandable Script & Compliance Drawer */}
                          {isExpanded && (
                            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2 text-[11px]">
                              <div>
                                <span className="font-bold text-[#7F48ED] uppercase text-[9px] block">
                                  Voiceover Script
                                </span>
                                <p className="text-zinc-700 leading-relaxed mt-0.5">
                                  {job.script?.body}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    job.complianceChecks?.creatorVerification
                                      ? "bg-purple-100 text-[#7F48ED]"
                                      : "bg-orange-100 text-[#FF6700]"
                                  }`}
                                >
                                  Creator Hook {job.complianceChecks?.creatorVerification ? "OK" : "Pending"}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    job.complianceChecks?.scriptClaims
                                      ? "bg-purple-100 text-[#7F48ED]"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  Claims {job.complianceChecks?.scriptClaims ? "OK" : "Flagged"}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    job.complianceChecks?.creativeDirectorSignOff
                                      ? "bg-purple-100 text-[#7F48ED]"
                                      : "bg-orange-100 text-[#FF6700]"
                                  }`}
                                >
                                  CD Sign-Off {job.complianceChecks?.creativeDirectorSignOff ? "OK" : "Needed"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive Card Action Bar */}
                        <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={sharingAdId === job.id}
                              onClick={() => handleQuickShareLink(job)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#7F48ED] text-[#7F48ED] font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Create & copy white-label review link"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>{sharingAdId === job.id ? "Copying..." : "Share Link"}</span>
                            </button>

                            <Link
                              href={`/studio/generate?clientId=${client.id}&revisionId=${job.id}&brand=${encodeURIComponent(
                                client.name
                              )}&angle=${encodeURIComponent(job.creativeAngle)}&hook=${encodeURIComponent(
                                job.hookText
                              )}&script=${encodeURIComponent(job.script?.body || "")}`}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#FF6700] text-zinc-700 hover:text-[#FF6700] font-bold inline-flex items-center gap-1"
                              title="Open in Generator to recut or make variation"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Recut</span>
                            </Link>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {job.status === "approved" && !client.isSample && (
                              <a
                                href={`/api/studio/deliveries/${job.id}/zip`}
                                className="px-2.5 py-1.5 rounded-lg bg-[#7F48ED] hover:bg-[#6D38D9] text-white font-bold inline-flex items-center gap-1"
                                title="Download Campaign Kit ZIP"
                              >
                                <FolderDown className="w-3 h-3" />
                                <span>ZIP</span>
                              </a>
                            )}
                            <Link
                              href={`/studio/review?clientId=${client.id}&variantId=${job.id}`}
                              className="px-3 py-1.5 rounded-lg bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Review Gate</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 4: DELIVERABLES */}
        {activeTab === "deliverables" && (
          <div className="space-y-4">
            {client.isSample ? (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-xs text-purple-900">
                <strong>Samples / Concept Space:</strong> Fictional sample brands are never promoted to Approved Client Deliverables or synced to client Google Drive folders.
              </div>
            ) : approvedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-10 text-center text-xs text-zinc-500">
                No approved deliverables yet. Approve ads in the{" "}
                <Link href={`/studio/review?clientId=${client.id}`} className="text-[#FF6700] font-bold underline">
                  Review Queue
                </Link>{" "}
                to unlock download kits and Drive delivery.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">{job.id}</span>
                    </div>
                    <video
                      src={job.variants?.v9x16}
                      controls
                      preload="metadata"
                      className="w-full aspect-[9/16] max-h-72 bg-black rounded-xl object-cover"
                    />
                    <div className="font-bold text-zinc-900 line-clamp-2">{job.hookText}</div>
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                      <a
                        href={`/api/studio/deliveries/${job.id}/zip`}
                        className="flex-1 py-2 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold text-center inline-flex items-center justify-center gap-1.5"
                      >
                        <FolderDown className="w-3.5 h-3.5" />
                        <span>Download Kit ZIP</span>
                      </a>
                      <Link
                        href={`/studio/approved?clientId=${client.id}`}
                        className="px-3 py-2 rounded-xl bg-[#7F48ED] hover:bg-[#6D38D9] text-white font-bold"
                      >
                        Vault
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INTERACTIVE REVIEW LINKS */}
        {activeTab === "review-links" && (() => {
          const activeLinksCount = reviewLinks.filter((l) => !l.revokedAt).length;
          const revokedLinksCount = reviewLinks.filter((l) => Boolean(l.revokedAt)).length;
          const filteredLinks = reviewLinks.filter((l) => {
            const isRev = Boolean(l.revokedAt);
            if (linkStatusFilter === "active" && isRev) return false;
            if (linkStatusFilter === "revoked" && !isRev) return false;
            if (linkSearch.trim()) {
              const q = linkSearch.trim().toLowerCase();
              const job = adJobs.find((j) => j.id === l.adId);
              return (
                (l.label || "").toLowerCase().includes(q) ||
                l.adId.toLowerCase().includes(q) ||
                (job?.hookText || "").toLowerCase().includes(q)
              );
            }
            return true;
          });

          const copyShareLink = (link: ReviewLinkRecord) => {
            const url = buildShareUrl(link);
            navigator.clipboard?.writeText(url);
            setCopiedLinkId(link.id);
            showToast("White-label review link copied!");
            setTimeout(() => {
              setCopiedLinkId((prev) => (prev === link.id ? null : prev));
            }, 2500);
          };

          const reissueLink = async (adId: string, label: string) => {
            if (!client) return;
            const res = await fetch(`/api/studio/clients/${client.id}/review-links`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adId, label }),
            });
            const data = await res.json();
            if (res.ok && data.ok && data.link) {
              setReviewLinks((prev) => [data.link, ...prev]);
              copyShareLink(data.link);
            }
          };

          return (
            <div className="space-y-4">
              {/* Top Create Link Bar + Filter Controls */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3.5 shadow-2xs">
                <form
                  onSubmit={handleCreateReviewLink}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end text-xs"
                >
                  <div className="lg:col-span-5">
                    <label className="text-[10px] font-bold uppercase text-[#7F48ED] block mb-1">
                      Select Ad Asset
                    </label>
                    <select
                      value={newLinkAdId}
                      onChange={(e) => setNewLinkAdId(e.target.value)}
                      className="w-full border border-zinc-200 focus:border-[#7F48ED] rounded-xl px-3 py-2 bg-zinc-50 font-medium focus:outline-none"
                    >
                      {adJobs.length === 0 && <option value="">No ads generated yet</option>}
                      {adJobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.id} — {j.hookText.slice(0, 55)} ({j.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-4">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      White-Label Link Label
                    </label>
                    <input
                      type="text"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                      placeholder="e.g. Week 1 Client Sign-Off"
                      className="w-full border border-zinc-200 focus:border-[#7F48ED] rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <button
                      type="submit"
                      disabled={isCreatingLink || !newLinkAdId}
                      className="w-full py-2 px-4 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>{isCreatingLink ? "Generating..." : "Create White-Label Link"}</span>
                    </button>
                  </div>
                </form>

                {/* Filter & Search Row */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(
                      [
                        { id: "all", label: "All Links", count: reviewLinks.length },
                        { id: "active", label: "Active", count: activeLinksCount },
                        { id: "revoked", label: "Revoked", count: revokedLinksCount },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setLinkStatusFilter(f.id)}
                        className={`px-3 py-1 rounded-xl font-bold border inline-flex items-center gap-1.5 cursor-pointer transition ${
                          linkStatusFilter === f.id
                            ? "bg-[#7F48ED] text-white border-[#7F48ED]"
                            : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-[#7F48ED]/50"
                        }`}
                      >
                        <span>{f.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            linkStatusFilter === f.id ? "bg-white text-[#7F48ED]" : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#7F48ED] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={linkSearch}
                      onChange={(e) => setLinkSearch(e.target.value)}
                      placeholder="Search label, ad ID, or hook..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#7F48ED]"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Review Links Cards */}
              {filteredLinks.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#7F48ED]/30 p-10 text-center space-y-2 text-xs text-zinc-500">
                  <Link2 className="w-8 h-8 text-[#7F48ED] mx-auto" />
                  <div className="font-bold text-zinc-800">No review links match this filter</div>
                  <div>Select an ad above and click Create White-Label Link to send a read-only sign-off URL to {client.name}.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredLinks.map((link) => {
                    const shareUrl = buildShareUrl(link);
                    const isRevoked = Boolean(link.revokedAt);
                    const linkedJob = adJobs.find((j) => j.id === link.adId);
                    const isPreviewOpen = previewingLinkId === link.id;
                    const isCopied = copiedLinkId === link.id;

                    return (
                      <div
                        key={link.id}
                        className={`bg-white rounded-2xl border transition p-4 space-y-3 text-xs ${
                          isRevoked
                            ? "border-red-200/80 opacity-80"
                            : "border-zinc-200 hover:border-[#7F48ED] hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={linkedJob?.variants?.thumbnail || "/images/howitworksstudio.jpg"}
                            alt={link.label || link.adId}
                            className="w-14 h-20 rounded-xl object-cover border border-zinc-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-black text-zinc-900 truncate">
                                {link.label || link.adId}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                                  isRevoked
                                    ? "bg-red-50 text-red-600 border border-red-200"
                                    : "bg-[#7F48ED] text-white"
                                }`}
                              >
                                {isRevoked ? "Revoked" : "Active Link"}
                              </span>
                            </div>

                            {linkedJob && (
                              <div className="text-[11px] text-zinc-600 line-clamp-1">
                                {linkedJob.hookText}
                              </div>
                            )}

                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-zinc-400 font-mono">
                              <span className="text-[#FF6700] font-bold">{link.adId}</span>
                              {linkedJob && <span>· {linkedJob.status}</span>}
                              <span>· Created {new Date(link.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Click-to-copy Share URL pill */}
                            <div
                              onClick={() => !isRevoked && copyShareLink(link)}
                              className={`mt-1 px-2.5 py-1.5 rounded-lg bg-purple-50/70 border border-purple-100 font-mono text-[10px] text-[#7F48ED] truncate ${
                                !isRevoked ? "cursor-pointer hover:bg-purple-100/70" : ""
                              }`}
                              title={isRevoked ? "Link revoked" : "Click to copy share URL"}
                            >
                              {shareUrl}
                            </div>
                          </div>
                        </div>

                        {/* Optional Inline Video Preview Drawer */}
                        {isPreviewOpen && linkedJob?.variants?.v9x16 && (
                          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row gap-3 items-center">
                            <video
                              src={linkedJob.variants.v9x16}
                              controls
                              autoPlay
                              playsInline
                              className="w-32 aspect-[9/16] rounded-lg object-cover bg-purple-950/20 shrink-0"
                            />
                            <div className="space-y-1.5 text-[11px] min-w-0">
                              <div className="font-bold text-[#7F48ED] uppercase text-[10px]">
                                Client Sees This Ad ({linkedJob.creativeAngle})
                              </div>
                              <div className="font-bold text-zinc-900">{linkedJob.hookText}</div>
                              <p className="text-zinc-600 line-clamp-3">{linkedJob.script?.body}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            {linkedJob?.variants?.v9x16 && (
                              <button
                                type="button"
                                onClick={() => setPreviewingLinkId(isPreviewOpen ? null : link.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:border-[#7F48ED] text-zinc-700 hover:text-[#7F48ED] font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{isPreviewOpen ? "Hide Preview" : "Preview Ad"}</span>
                              </button>
                            )}
                            {isRevoked && (
                              <button
                                type="button"
                                onClick={() => reissueLink(link.adId, link.label)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#7F48ED] hover:bg-[#6D38D9] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Re-Issue Active Link</span>
                              </button>
                            )}
                          </div>

                          {!isRevoked && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => copyShareLink(link)}
                                className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer transition ${
                                  isCopied
                                    ? "bg-[#7F48ED] text-white"
                                    : "bg-purple-50 text-[#7F48ED] border border-[#7F48ED]/30 hover:bg-[#7F48ED] hover:text-white"
                                }`}
                              >
                                <Copy className="w-3 h-3" />
                                <span>{isCopied ? "Copied" : "Copy Link"}</span>
                              </button>
                              <a
                                href={shareUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Open Client View</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRevokeReviewLink(link.id)}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Revoke Link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </main>
    </div>
  );
}
