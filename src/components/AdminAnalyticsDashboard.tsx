"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Layers,
  Users,
  RefreshCw,
  CheckCircle2,
  BarChart2,
  LineChart,
  Package,
  Calendar,
} from "lucide-react";

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  bg: string;
  sidebarBg: string;
  cardBg: string;
  tableBg: string;
  tableHeaderBg: string;
  border: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
}

interface AdminAnalyticsDashboardProps {
  theme: ThemeConfig;
  onNavigateTab?: (tabId: string) => void;
}

type Timeframe = "7D" | "30D" | "90D" | "1Y";
type MetricType = "revenue" | "visitors" | "quotes" | "bookings";

export default function AdminAnalyticsDashboard({
  theme,
  onNavigateTab,
}: AdminAnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("30D");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("revenue");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState<"all" | "signed" | "booked" | "proposal">("all");

  // Dynamic Data by Timeframe
  const timeSeriesData: Record<
    Timeframe,
    {
      labels: string[];
      revenue: number[];
      visitors: number[];
      quotes: number[];
      bookings: number[];
    }
  > = {
    "7D": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: [46200, 46500, 47100, 47400, 47900, 48100, 48250],
      visitors: [3200, 3450, 3620, 3810, 4120, 3100, 3380],
      quotes: [42, 48, 55, 61, 74, 38, 44],
      bookings: [3, 2, 4, 3, 5, 1, 2],
    },
    "30D": {
      labels: ["Oct 01", "Oct 05", "Oct 09", "Oct 13", "Oct 17", "Oct 21", "Oct 25", "Oct 29", "Oct 31"],
      revenue: [38500, 39800, 41200, 42400, 43900, 45100, 46800, 47700, 48250],
      visitors: [2400, 2750, 2980, 3140, 3420, 3680, 3950, 4200, 4380],
      quotes: [28, 34, 42, 46, 54, 62, 71, 79, 86],
      bookings: [3, 4, 5, 4, 6, 5, 7, 6, 8],
    },
    "90D": {
      labels: ["Aug W1", "Aug W3", "Sep W1", "Sep W3", "Oct W1", "Oct W3", "Oct W4"],
      revenue: [31200, 34800, 38100, 41500, 44200, 46900, 48250],
      visitors: [18200, 19800, 21400, 22900, 24100, 25800, 27200],
      quotes: [210, 245, 280, 318, 362, 410, 452],
      bookings: [24, 28, 33, 37, 41, 46, 52],
    },
    "1Y": {
      labels: ["Nov", "Jan", "Mar", "May", "Jul", "Sep", "Oct"],
      revenue: [18200, 23500, 29800, 35400, 41200, 46000, 48250],
      visitors: [84000, 96000, 112000, 128000, 149000, 172000, 198000],
      quotes: [620, 840, 1150, 1480, 1820, 2240, 2680],
      bookings: [84, 112, 148, 192, 238, 284, 320],
    },
  };

  const currentDataset = timeSeriesData[timeframe];
  const activeSeries = currentDataset[selectedMetric];
  const maxVal = Math.max(...activeSeries);
  const minVal = Math.min(...activeSeries);

  // SVG Area / Line Chart Dimensions (Edge-to-edge 100% full width)
  const chartWidth = 1000;
  const chartHeight = 220;
  const paddingY = 24;
  const usableHeight = chartHeight - paddingY * 2;

  const points = activeSeries.map((val, idx) => {
    const x = (idx / (activeSeries.length - 1)) * chartWidth;
    const y =
      chartHeight -
      paddingY -
      ((val - minVal) / (maxVal === minVal ? 1 : maxVal - minVal)) *
        usableHeight;
    return { x, y, val, label: currentDataset.labels[idx] };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Live Pipeline Deals
  const livePipeline = [
    {
      id: "LEAD-1094",
      client: "Apex Orthodontics & Dental",
      contact: "Dr. Julian Vance",
      packageTier: "Turnkey Department (6 Services)",
      monthlyValue: "$2,890 / month",
      status: "signed",
      statusLabel: "Signed & Active",
      date: "Today, 10:14 AM",
    },
    {
      id: "LEAD-1093",
      client: "HyperScale Software",
      contact: "Elena Rostova",
      packageTier: "Custom Apps & AI Suite",
      monthlyValue: "$3,450 / month",
      status: "proposal",
      statusLabel: "Reviewing Agreement",
      date: "Yesterday",
    },
    {
      id: "LEAD-1092",
      client: "Vanguard Wealth Partners",
      contact: "Marcus Sterling",
      packageTier: "Scale Package (4 Services)",
      monthlyValue: "$2,140 / month",
      status: "booked",
      statusLabel: "Call Today",
      date: "Oct 11, 2026",
    },
    {
      id: "LEAD-1091",
      client: "Velocita Athletic Club",
      contact: "Coach Samantha Roy",
      packageTier: "Growth Package (3 Services)",
      monthlyValue: "$1,480 / month",
      status: "booked",
      statusLabel: "Call Scheduled",
      date: "Oct 10, 2026",
    },
    {
      id: "LEAD-1090",
      client: "Elysian Architecture",
      contact: "Christian Bauer",
      packageTier: "Growth (Web + Ads + Social)",
      monthlyValue: "$1,790 / month",
      status: "proposal",
      statusLabel: "Proposal Sent",
      date: "Oct 09, 2026",
    },
  ];

  const filteredPipeline =
    pipelineFilter === "all"
      ? livePipeline
      : livePipeline.filter((deal) => deal.status === pipelineFilter);

  return (
    <div className="w-full space-y-8 select-none pb-12">
      {/* 0. DASHBOARD HEADER & TIMEFRAME SELECTOR */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: theme.border }}
      >
        <div>
          <h2
            style={{ color: theme.textPrimary }}
            className="font-heading font-black text-2xl sm:text-3xl tracking-tight"
          >
            ReLaunch Business & Revenue Overview
          </h2>
          <p style={{ color: theme.textSecondary }} className="text-xs sm:text-sm mt-1">
            Track your monthly income, active clients, and package sales in one place.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Timeframe Filter Tabs (Simple labels) */}
          <div
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            className="p-1 rounded-xl border flex items-center shadow-xs"
          >
            {(
              [
                { id: "7D", label: "7 Days" },
                { id: "30D", label: "30 Days" },
                { id: "90D", label: "3 Months" },
                { id: "1Y", label: "1 Year" },
              ] as const
            ).map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                style={{
                  backgroundColor: timeframe === tf.id ? "#FF6700" : "transparent",
                  color: timeframe === tf.id ? "#FFFFFF" : theme.textMuted,
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf.id ? "shadow-xs" : "hover:text-[#FF6700]"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleRefresh}
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.textSecondary,
            }}
            className="px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 hover:text-[#FF6700] transition-colors cursor-pointer"
            title="Update Numbers"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isRefreshing ? "animate-spin text-[#FF6700]" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 1: ALL ORANGE (#FF6700) - KEY NUMBERS OVERVIEW        */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6700]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6700]">
            Key Business Numbers
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Monthly Income */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
            className="p-5 rounded-2xl border shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase font-bold text-[#FF6700]">
                Monthly Income
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                style={{ color: theme.textPrimary }}
                className="font-heading font-black text-2xl sm:text-3xl tracking-tight"
              >
                $48,250
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF6700]/15 text-[#FF6700] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +22.4%
              </span>
            </div>
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] font-mono"
              style={{ borderColor: theme.border }}
            >
              <span style={{ color: theme.textMuted }}>Goal: $60,000 / mo</span>
              <span className="font-bold text-[#FF6700]">80% of goal reached</span>
            </div>
          </div>

          {/* Card 2: Active Clients */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
            className="p-5 rounded-2xl border shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase font-bold text-[#FF6700]">
                Active Clients
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                style={{ color: theme.textPrimary }}
                className="font-heading font-black text-2xl sm:text-3xl tracking-tight"
              >
                28
              </span>
              <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                Paying Clients
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF6700]/15 text-[#FF6700] ml-auto">
                +4 this month
              </span>
            </div>
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] font-mono"
              style={{ borderColor: theme.border }}
            >
              <span style={{ color: theme.textMuted }}>Average spend / client</span>
              <span className="font-bold text-[#FF6700]">$1,723 / month</span>
            </div>
          </div>

          {/* Card 3: Website Visitors */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
            className="p-5 rounded-2xl border shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase font-bold text-[#FF6700]">
                Website Visitors
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                style={{ color: theme.textPrimary }}
                className="font-heading font-black text-2xl sm:text-3xl tracking-tight"
              >
                24,680
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF6700]/15 text-[#FF6700] flex items-center gap-0.5 ml-auto">
                <TrendingUp className="w-3 h-3" />
                +16.8%
              </span>
            </div>
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] font-mono"
              style={{ borderColor: theme.border }}
            >
              <span style={{ color: theme.textMuted }}>From Google & Direct</span>
              <span className="font-bold text-[#FF6700]">74% of all traffic</span>
            </div>
          </div>

          {/* Card 4: Consultations Booked */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
            className="p-5 rounded-2xl border shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase font-bold text-[#FF6700]">
                Calls Booked
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                style={{ color: theme.textPrimary }}
                className="font-heading font-black text-2xl sm:text-3xl tracking-tight"
              >
                42
              </span>
              <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                Strategy Calls
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF6700]/15 text-[#FF6700] ml-auto">
                +18% more
              </span>
            </div>
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] font-mono"
              style={{ borderColor: theme.border }}
            >
              <span style={{ color: theme.textMuted }}>Visitors who book a call</span>
              <span className="font-bold text-[#FF6700]">3.8% of visitors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 2: ALL PURPLE (#7F48ED) - 50/50 SAME WIDTH ANALYTICS  */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7F48ED]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7F48ED]">
            Sales Trends & Live Visitors
          </h3>
        </div>

        {/* 2 Analytics Cards: EXACT SAME WIDTH (50% / 50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Time-Series Line Chart (50% Width) */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
            className="p-6 rounded-2xl border shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-[#7F48ED]" />
                    <h4
                      style={{ color: theme.textPrimary }}
                      className="font-heading font-black text-base tracking-tight"
                    >
                      Sales & Visitor Growth
                    </h4>
                  </div>
                  <p style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                    Click buttons to see revenue, visitors, or bookings over time
                  </p>
                </div>

                {/* Metric Selector Tabs */}
                <div
                  style={{ backgroundColor: `${theme.textPrimary}08` }}
                  className="p-1 rounded-xl flex items-center gap-1 flex-wrap"
                >
                  {(
                    [
                      { id: "revenue", label: "Income" },
                      { id: "visitors", label: "Visitors" },
                      { id: "quotes", label: "Quotes" },
                      { id: "bookings", label: "Calls" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMetric(m.id)}
                      style={{
                        backgroundColor:
                          selectedMetric === m.id ? "#7F48ED" : "transparent",
                        color:
                          selectedMetric === m.id ? "#FFFFFF" : theme.textMuted,
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat Summary */}
              <div
                className="flex items-center gap-6 py-2 border-b text-xs font-mono"
                style={{ borderColor: theme.border }}
              >
                <div>
                  <span style={{ color: theme.textMuted }}>Highest in this period: </span>
                  <span className="font-bold text-[#7F48ED]">
                    {selectedMetric === "revenue"
                      ? `$${maxVal.toLocaleString()}`
                      : maxVal.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.textMuted }}>Lowest in this period: </span>
                  <span className="font-bold text-[#7F48ED]">
                    {selectedMetric === "revenue"
                      ? `$${minVal.toLocaleString()}`
                      : minVal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Line / Area Graph (EDGE-TO-EDGE 100% FULL WIDTH) */}
            <div className="relative w-full my-4">
              <div className="relative w-full h-[200px]">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="w-full border-b border-dashed" style={{ borderColor: theme.border }} />
                  <div className="w-full border-b border-dashed" style={{ borderColor: theme.border }} />
                  <div className="w-full border-b border-dashed" style={{ borderColor: theme.border }} />
                  <div className="w-full border-b" style={{ borderColor: theme.border }} />
                </div>

                {/* Stretched SVG with preserveAspectRatio="none" */}
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full block"
                >
                  {/* Solid Purple Fill Area */}
                  <path d={areaD} fill="#7F48ED" fillOpacity="0.10" />

                  {/* Solid Purple Smooth Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#7F48ED"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Percentage Placed HTML Dots (Always Circular, Exactly on Line, Edge-to-Edge) */}
                {activeSeries.map((val, idx) => {
                  const leftPct = (idx / (activeSeries.length - 1)) * 100;
                  const normalized = (val - minVal) / (maxVal === minVal ? 1 : maxVal - minVal);
                  const topPct = ((chartHeight - paddingY - normalized * usableHeight) / chartHeight) * 100;

                  return (
                    <div
                      key={idx}
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      <div
                        className={`rounded-full bg-[#7F48ED] border-2 border-white transition-all shadow-xs ${
                          hoveredPointIndex === idx
                            ? "w-4 h-4 scale-125 ring-4 ring-[#7F48ED]/20"
                            : "w-2.5 h-2.5 hover:scale-125"
                        }`}
                      />
                    </div>
                  );
                })}

                {/* Dynamic Tooltip on Hover */}
                {hoveredPointIndex !== null && (
                  <div
                    style={{
                      left: `${(hoveredPointIndex / (activeSeries.length - 1)) * 100}%`,
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    className="absolute top-2 -translate-x-1/2 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-md pointer-events-none z-20 whitespace-nowrap"
                  >
                    <div className="text-[10px] text-[#7F48ED] font-bold">
                      {currentDataset.labels[hoveredPointIndex]}
                    </div>
                    <div className="font-bold text-sm">
                      {selectedMetric === "revenue"
                        ? `$${activeSeries[hoveredPointIndex].toLocaleString()}`
                        : activeSeries[hoveredPointIndex].toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* X-Axis Date Labels: Full-Width Justified */}
              <div
                className="w-full flex justify-between text-[11px] font-mono pt-3 border-t mt-1"
                style={{ borderColor: theme.border, color: theme.textMuted }}
              >
                {currentDataset.labels.map((label, idx) => (
                  <span key={idx} className="text-center">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="pt-2 border-t flex items-center justify-between text-xs font-mono"
              style={{ borderColor: theme.border, color: theme.textMuted }}
            >
              <span>Client Retention Rate:</span>
              <span className="font-bold text-[#7F48ED]">96.4% stay every month</span>
            </div>
          </div>

          {/* Card 2: Real-Time Traffic Panel (50% Width) */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
            className="p-6 rounded-2xl border shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#7F48ED]">
                  Live On Your Website Right Now
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7F48ED]/15 text-[#7F48ED] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED] animate-ping" />
                  Live Now
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <div className="text-4xl font-heading font-black tracking-tight text-[#7F48ED]">
                  38
                </div>
                <div className="text-xs font-mono" style={{ color: theme.textMuted }}>
                  People browsing your website in the last 30 minutes
                </div>
              </div>

              {/* 30-Minute Real-Time Sparkline (Full Width) */}
              <div className="h-12 flex items-end gap-1 mb-5 w-full">
                {[12, 18, 14, 22, 28, 20, 25, 30, 24, 29, 35, 32, 28, 34, 38, 31, 26, 33, 36, 30, 27, 32, 38, 35, 29, 34, 37, 33, 36, 38].map(
                  (h, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${(h / 40) * 100}%`,
                        backgroundColor: "#7F48ED",
                      }}
                      className="flex-1 rounded-t-xs opacity-85 hover:opacity-100 transition-opacity"
                    />
                  )
                )}
              </div>

              {/* Top Active Pages List */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-[#7F48ED] mb-1">
                  What pages they are reading right now:
                </div>
                {[
                  { path: "/pricing", label: "Pricing & Package Calculator", count: 17, pct: "45% of visitors" },
                  { path: "/services", label: "Our Services List", count: 10, pct: "26% of visitors" },
                  { path: "/", label: "Main Home Page", count: 7, pct: "18% of visitors" },
                  { path: "/work", label: "Client Case Studies & Portfolio", count: 4, pct: "11% of visitors" },
                ].map((pg) => (
                  <div
                    key={pg.path}
                    className="p-2 rounded-xl flex items-center justify-between text-xs font-mono"
                    style={{ backgroundColor: `${theme.textPrimary}05` }}
                  >
                    <div>
                      <div className="font-bold text-[#7F48ED]">{pg.label}</div>
                      <div className="text-[10px]" style={{ color: theme.textMuted }}>
                        {pg.path}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: theme.textPrimary }}>
                        {pg.count} online
                      </div>
                      <div className="text-[10px] text-[#7F48ED]">{pg.pct}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-4 pt-2 border-t text-[10px] font-mono flex items-center justify-between"
              style={{ borderColor: theme.border, color: theme.textMuted }}
            >
              <span>Average visit time:</span>
              <span className="font-bold text-[#7F48ED]">3 minutes 42 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 3: ALL ORANGE (#FF6700) - HOW VISITORS BECOME CLIENTS  */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6700]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6700]">
            How Visitors Become Paying Clients
          </h3>
        </div>

        {/* Clean Neutral Border Card */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
          className="p-6 rounded-2xl border shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#FF6700]" />
                <h4
                  style={{ color: theme.textPrimary }}
                  className="font-heading font-black text-base tracking-tight"
                >
                  Step-by-Step Customer Journey
                </h4>
              </div>
              <p style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                See how website visitors move from first visit to signing a monthly contract
              </p>
            </div>

            <span className="text-[11px] font-mono font-bold text-[#FF6700]">
              Close Rate: 30% of scheduled calls hire us
            </span>
          </div>

          {/* 5 Funnel Steps in a Clean Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: "1. Visited Website", count: "24,680", rate: "100%", width: "100%", desc: "Found your website" },
              { step: "2. Looked at Pricing", count: "9,840", rate: "39.9%", width: "80%", desc: "Read service plans" },
              { step: "3. Picked a Package", count: "3,410", rate: "13.8%", width: "55%", desc: "Customized a bundle" },
              { step: "4. Booked a Call", count: "94", rate: "2.8%", width: "35%", desc: "Scheduled consultation" },
              { step: "5. Hired Us", count: "28", rate: "0.8%", width: "20%", desc: "Paying monthly clients" },
            ].map((f) => (
              <div
                key={f.step}
                className="p-4 rounded-xl flex flex-col justify-between"
                style={{ backgroundColor: `${theme.textPrimary}04` }}
              >
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-[#FF6700]">
                    {f.step}
                  </div>
                  <div className="text-xl font-heading font-black tracking-tight mt-1" style={{ color: theme.textPrimary }}>
                    {f.count}
                  </div>
                </div>

                <div className="mt-3">
                  {/* Solid Orange Step Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
                    <div
                      style={{ width: f.width, backgroundColor: "#FF6700" }}
                      className="h-full rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: theme.textMuted }}>
                    <span>{f.desc}</span>
                    <span className="font-bold text-[#FF6700]">{f.rate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 4: ALL PURPLE (#7F48ED) - PACKAGES & PRICING PLANS     */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7F48ED]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7F48ED]">
            Packages & Pricing Plans
          </h3>
        </div>

        {/* 4 Neutral Border Cards with Purple Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              id: "turnkey-department",
              name: "Turnkey Department (All-in-One Team)",
              clients: 8,
              revenue: "$19,780 / mo",
              share: "41% of total income",
              discount: "Save 20%",
              desc: "Full turnkey growth department with 6+ integrated services.",
            },
            {
              id: "scale",
              name: "Scale Package (4 to 5 Services)",
              clients: 9,
              revenue: "$14,950 / mo",
              share: "31% of total income",
              discount: "Save 15%",
              desc: "Marketing, website, ads, and automations working together.",
            },
            {
              id: "growth",
              name: "Growth Package (2 to 3 Services)",
              clients: 7,
              revenue: "$9,640 / mo",
              share: "20% of total income",
              discount: "Save 10%",
              desc: "Popular starting package pairing website design and marketing.",
            },
            {
              id: "starter",
              name: "Starter Plan (1 Dedicated Service)",
              clients: 4,
              revenue: "$3,880 / mo",
              share: "8% of total income",
              discount: "Standard Rate",
              desc: "Single service such as social media or digital advertising.",
            },
          ].map((tier) => (
            <div
              key={tier.id}
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
              }}
              className="p-5 rounded-2xl border shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7F48ED]/15 text-[#7F48ED]">
                    {tier.discount}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#7F48ED]">
                    {tier.clients} Clients
                  </span>
                </div>

                <h4
                  style={{ color: theme.textPrimary }}
                  className="font-bold text-sm tracking-tight mb-1"
                >
                  {tier.name}
                </h4>
                <p style={{ color: theme.textMuted }} className="text-xs leading-relaxed line-clamp-2">
                  {tier.desc}
                </p>
              </div>

              <div className="pt-3">
                <div className="text-2xl font-heading font-black tracking-tight text-[#7F48ED]">
                  {tier.revenue}
                </div>
                <div
                  className="mt-2 pt-2 border-t flex items-center justify-between text-[11px] font-mono"
                  style={{ borderColor: theme.border }}
                >
                  <span style={{ color: theme.textMuted }}>Income share</span>
                  <span className="font-bold text-[#7F48ED]">{tier.share}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 5: ALL ORANGE (#FF6700) - RECENT CLIENT INQUIRIES       */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6700]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6700]">
            Recent Inquiries & Potential Clients
          </h3>
        </div>

        <div
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
          className="p-6 rounded-2xl border shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FF6700]" />
                <h4
                  style={{ color: theme.textPrimary }}
                  className="font-heading font-black text-base tracking-tight"
                >
                  People Who Contacted Us Recently
                </h4>
              </div>
              <p style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                New business owners who picked a package or booked a strategy call
              </p>
            </div>

            {/* Filter Tabs (Simple labels) */}
            <div
              style={{ backgroundColor: `${theme.textPrimary}08` }}
              className="p-1 rounded-xl flex items-center gap-1 text-xs font-mono"
            >
              {(
                [
                  { id: "all", label: "All Inquiries" },
                  { id: "signed", label: "Signed Clients" },
                  { id: "booked", label: "Calls Scheduled" },
                  { id: "proposal", label: "Proposals Sent" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPipelineFilter(f.id)}
                  style={{
                    backgroundColor:
                      pipelineFilter === f.id ? "#FF6700" : "transparent",
                    color:
                      pipelineFilter === f.id ? "#FFFFFF" : theme.textMuted,
                  }}
                  className="px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table with Clean Dividers */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  style={{
                    backgroundColor: theme.tableHeaderBg,
                    color: theme.textMuted,
                    borderColor: theme.border,
                  }}
                  className="border-b font-mono uppercase text-[10px] tracking-wider"
                >
                  <th className="py-3 px-3 rounded-l-xl">Company</th>
                  <th className="py-3 px-3">Contact Person</th>
                  <th className="py-3 px-3">Package Selected</th>
                  <th className="py-3 px-3">Monthly Budget</th>
                  <th className="py-3 px-3">Current Step</th>
                  <th className="py-3 px-3 rounded-r-xl text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                {filteredPipeline.map((deal) => (
                  <tr
                    key={deal.id}
                    className="hover:bg-orange-500/5 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold" style={{ color: theme.textPrimary }}>
                        {deal.client}
                      </div>
                      <div className="text-[10px] font-mono text-[#FF6700]">
                        {deal.id}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium" style={{ color: theme.textSecondary }}>
                      {deal.contact}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#FF6700]/15 text-[#FF6700] inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                        {deal.packageTier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold" style={{ color: theme.textPrimary }}>
                      {deal.monthlyValue}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6700]/15 text-[#FF6700] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#FF6700]" />
                        {deal.statusLabel}
                      </span>
                    </td>
                    <td
                      className="py-3 px-3 text-right font-mono text-[10px]"
                      style={{ color: theme.textMuted }}
                    >
                      {deal.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
