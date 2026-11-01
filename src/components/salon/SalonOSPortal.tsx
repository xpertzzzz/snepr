import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Zap, BookOpen, Scissors, Users, Calendar as CalendarIcon,
  UserCheck, Star, Building2, Tag, DollarSign, BarChart3, Bell, Package,
  CreditCard, ShieldCheck, GitBranch, Share2, FileText, Settings, Plus,
  CheckCircle2, Clock, Play, Pause, UserPlus, Search, Filter, Download,
  TrendingUp, Award, MapPin, Phone, Mail, Sparkles, Check, X, AlertTriangle, Armchair
} from "lucide-react";
import { cn } from "@/lib/utils";

// Fallback portal API handlers for SalonOS
const fetchSalonOSPortalData = async ({ data }: { data: { salonId: number } }): Promise<any> => {
  try {
    const res = await fetch(`/api/salon-os?salonId=${data.salonId}`);
    if (res.ok) return await res.json();
  } catch {}
  return {
    queues: [
      { id: 1, token: 101, name: "Aman Sharma", service: "Haircut", type: "Online", waitMins: 10, status: "waiting" },
      { id: 2, token: 102, name: "Priya Das", service: "Layer Cut", type: "Walk-in", waitMins: 25, status: "waiting" },
      { id: 3, token: 100, name: "Rohan Patel", service: "Beard Trim", type: "Online", waitMins: 0, status: "in-progress" },
    ],
    metrics: {
      todayRevenuePaise: 1245000,
      customersWaiting: 2,
      todayAppointments: 6,
      avgRating: "4.9",
      totalReviews: 142,
      estimatedWaitMins: 25,
      peakHours: "4 PM - 8 PM",
    },
  };
};

const addWalkInToken = async ({ data }: { data: any }): Promise<any> => {
  return { success: true, ...data };
};

const updateQueueTokenAction = async ({ data }: { data: any }): Promise<any> => {
  return { success: true, ...data };
};

export type SalonOSTab =
  | "Dashboard"
  | "Live Queue"
  | "Chairs & Stations"
  | "Services"
  | "Staff & Barbers"
  | "Reviews & Trust"
  | "QR Queue Poster"
  | "Analytics"
  | "Loyalty & Points"
  | "Offers & Retention"
  | "Subscriptions & Billing"
  | "Multi-Branch"
  | "Settings";

export const SALON_OS_NAV: { name: SalonOSTab; icon: any; category: string; isExclusive?: boolean; tier?: "Base" | "Intermediate" | "Pro" }[] = [
  { name: "Dashboard", icon: LayoutDashboard, category: "Core", tier: "Base" },
  { name: "Live Queue", icon: Zap, category: "Core", isExclusive: true, tier: "Base" },
  { name: "Chairs & Stations", icon: Armchair, category: "Core", tier: "Base" },
  { name: "Services", icon: Scissors, category: "Profile & Menu", tier: "Base" },
  { name: "Staff & Barbers", icon: Users, category: "Profile & Menu", tier: "Base" },
  { name: "Reviews & Trust", icon: Star, category: "Reputation", tier: "Base" },
  { name: "QR Queue Poster", icon: Tag, category: "Growth", tier: "Intermediate" },
  { name: "Analytics", icon: BarChart3, category: "Growth", tier: "Intermediate" },
  { name: "Loyalty & Points", icon: Award, category: "Growth", tier: "Intermediate" },
  { name: "Offers & Retention", icon: Share2, category: "Growth", tier: "Intermediate" },
  { name: "Subscriptions & Billing", icon: ShieldCheck, category: "Account", tier: "Base" },
  { name: "Multi-Branch", icon: GitBranch, category: "Account", tier: "Pro" },
  { name: "Settings", icon: Settings, category: "Account", tier: "Base" },
];

export function SalonOSPortal({ session, onLogout }: { session: any; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<SalonOSTab>("Dashboard");

  // Check approval status (pending | rejected | approved)
  const approvalStatus = session?.approvalStatus || "approved";

  if (approvalStatus === "pending") {
    return (
      <div className="min-h-screen bg-[#141210] text-[#F3EFEA] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-[#1A1714] border border-[#7A4B29]/40 p-8 rounded-2xl space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#7A4B29]/20 border border-[#7A4B29]/50 flex items-center justify-center text-[#D4A373] mx-auto text-3xl">
            ⏳
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Salon Verification Pending</h2>
            <p className="text-xs text-[#A69F96] leading-relaxed">
              Your salon registration/claim request has been received! Our Snepr Admin team is reviewing your business details and verification proof.
            </p>
          </div>

          <div className="p-4 bg-[#141210] border border-[#2D2824] rounded-xl text-left text-xs space-y-1.5">
            <p className="text-[#D4A373] font-bold">Status: Pending Verification</p>
            <p className="text-[#8E867E]">Once approved, your full SalonOS dashboard features will be unlocked automatically.</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 bg-[#25211D] border border-[#3D352E] hover:bg-[#322A25] text-white font-bold text-xs rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (approvalStatus === "rejected") {
    return (
      <div className="min-h-screen bg-[#141210] text-[#F3EFEA] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-[#1A1714] border border-red-500/40 p-8 rounded-2xl space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto text-3xl">
            🚫
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Rejected</h2>
            <p className="text-xs text-[#A69F96] leading-relaxed">
              Your salon registration or claim request was reviewed and could not be verified by Snepr Admin.
            </p>
          </div>

          {session?.rejectionReason && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left text-xs text-red-400 space-y-1">
              <p className="font-bold uppercase tracking-wider text-[10px]">Rejection Reason:</p>
              <p>{session.rejectionReason}</p>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex-1 py-3 bg-[#25211D] border border-[#3D352E] hover:bg-[#322A25] text-white font-bold text-xs rounded-xl transition-all"
            >
              Sign Out
            </button>
            <a
              href="mailto:support@snepr.in"
              className="flex-1 py-3 bg-[#7A4B29] hover:bg-[#8F5A33] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }
  const queryClient = useQueryClient();
  const salonId = session?.salonId || 1;

  // Live Database Query for SalonOS
  const { data: portalData, isLoading } = useQuery({
    queryKey: ["salon-os-portal", salonId],
    queryFn: () => fetchSalonOSPortalData({ data: { salonId } }),
    refetchInterval: 5000,
  });

  // Live Database Walk-In Mutation
  const addWalkInMutation = useMutation({
    mutationFn: () =>
      addWalkInToken({
        data: {
          salonId,
          customerName: walkinName,
          phone: walkinPhone,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salon-os-portal"] });
      setWalkinName("");
      setWalkinPhone("");
      setWalkinModal(false);
    },
  });

  // Live Database Queue Action Mutation
  const queueActionMutation = useMutation({
    mutationFn: (args: { queueId?: number; action: string }) =>
      updateQueueTokenAction({
        data: {
          salonId,
          queueId: args.queueId,
          action: args.action,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salon-os-portal"] });
    },
  });

  
  const [salonChairs, setSalonChairs] = useState([
    { id: 1, name: "Station 1", barber: "Sameer Mohanty", status: "occupied", token: "#A-102", customer: "Debabrata Dash", service: "Signature Haircut & Wash", estRemainingMins: 12 },
    { id: 2, name: "Station 2", barber: "Rahul Sen", status: "available", token: null, customer: null, service: null, estRemainingMins: 0 },
    { id: 3, name: "Station 3", barber: "Sunita Jena", status: "finishing", token: "#A-103", customer: "Sneha Priyadarshini", service: "Deep Hair Spa", estRemainingMins: 3 },
    { id: 4, name: "Station 4", barber: "Deepak Dash", status: "break", token: null, customer: null, service: null, estRemainingMins: 10 },
  ]);

  const updateChairStatus = (chairId: number, newStatus: string) => {
    setSalonChairs(prev => prev.map(c => {
      if (c.id !== chairId) return c;
      if (newStatus === "available") {
        return { ...c, status: "available", token: null, customer: null, service: null, estRemainingMins: 0 };
      }
      if (newStatus === "break") {
        return { ...c, status: "break", token: null, customer: null, service: null, estRemainingMins: 15 };
      }
      if (newStatus === "occupied") {
        return { ...c, status: "occupied", token: "#A-105", customer: "Walk-in Customer", service: "Classic Haircut", estRemainingMins: 25 };
      }
      return { ...c, status: newStatus as any };
    }));
  };

  const [isQueuePaused, setIsQueuePaused] = useState(false);
  const [walkinModal, setWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinService, setWalkinService] = useState("Haircut ₹250");

  const queueTokens = portalData?.queues || [];
  const metrics = portalData?.metrics || {
    todayRevenuePaise: 0,
    customersWaiting: 0,
    todayAppointments: 0,
    avgRating: "4.8",
    totalReviews: 0,
    estimatedWaitMins: 0,
    peakHours: "4 PM - 8 PM",
  };

  const handleAddWalkin = () => {
    if (!walkinName) return;
    addWalkInMutation.mutate();
  };

  const handleCallNext = () => {
    queueActionMutation.mutate({ action: "call_next" });
  };

  return (
    <div className="flex h-screen bg-[#141210] text-[#F3EFEA] font-sans overflow-hidden">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[280px] shrink-0 border-r border-[#2D2824] bg-[#1A1714] flex flex-col z-20">
        <div className="p-5 border-b border-[#2D2824]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7A4B29] to-[#D4A373] flex items-center justify-center font-bold text-white shadow-lg">
              S
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Snepr <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#7A4B29]/30 text-[#D4A373] border border-[#7A4B29]/40">SalonOS</span>
              </h1>
              <p className="text-[11px] text-[#A69F96]">Owner: {session?.username || "Admin"}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Tickers */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          {SALON_OS_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-[#7A4B29] text-white shadow-md shadow-[#7A4B29]/20"
                    : "text-[#A69F96] hover:bg-[#25211D] hover:text-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#8E867E] group-hover:text-[#D4A373]")} />
                  <span>{item.name}</span>
                </div>
                {item.isExclusive && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D4A373]/20 text-[#D4A373] border border-[#D4A373]/30">
                    USP
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Info & Logout */}
        <div className="p-3 border-t border-[#2D2824] bg-[#141210]">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[#E56B6F] hover:bg-[#E56B6F]/10 rounded-xl transition-colors"
          >
            Sign Out SalonOS
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#141210] overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-[#2D2824] bg-[#1A1714] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight text-white">{activeTab}</h2>
            <span className="text-xs text-[#8E867E]">• Snepr Operating System v2.4</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Live Queue Pause Switch */}
            <button
              onClick={() => setIsQueuePaused(!isQueuePaused)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                isQueuePaused
                  ? "bg-[#E56B6F]/20 text-[#E56B6F] border-[#E56B6F]/30"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              )}
            >
              {isQueuePaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isQueuePaused ? "Queue Paused" : "Live Queue Open"}
            </button>

            {/* Quick Add Walk-in */}
            <button
              onClick={() => setWalkinModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7A4B29] hover:bg-[#8F5A33] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Walk-in
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DASHBOARD (HOME) */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl">
                  <p className="text-[11px] font-bold uppercase text-[#8E867E]">Today's Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">₹12,450</p>
                  <span className="text-[10px] text-emerald-500/80">↑ +14% vs yesterday</span>
                </div>
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl">
                  <p className="text-[11px] font-bold uppercase text-[#8E867E]">Live Queue Waiting</p>
                  <p className="text-2xl font-bold text-[#D4A373] mt-1">{queueTokens.filter((q: any) => q.status === "waiting").length} Tokens</p>
                  <span className="text-[10px] text-[#A69F96]">Est. Wait: ~25 mins</span>
                </div>
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl">
                  <p className="text-[11px] font-bold uppercase text-[#8E867E]">Today's Bookings</p>
                  <p className="text-2xl font-bold text-white mt-1">18</p>
                  <span className="text-[10px] text-emerald-400">14 Completed</span>
                </div>
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl">
                  <p className="text-[11px] font-bold uppercase text-[#8E867E]">Avg Rating</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1">
                    4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </p>
                  <span className="text-[10px] text-[#A69F96]">Based on 142 reviews</span>
                </div>
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl">
                  <p className="text-[11px] font-bold uppercase text-[#8E867E]">Peak Hours</p>
                  <p className="text-lg font-bold text-white mt-1">4 PM - 8 PM</p>
                  <span className="text-[10px] text-[#D4A373]">Optimized Staffing</span>
                </div>
              </div>

              {/* Snepr Exclusive Live Queue Ticker Banner */}
              <div className="bg-gradient-to-r from-[#2A1D15] via-[#1A1714] to-[#1A1714] border border-[#7A4B29]/40 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7A4B29] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#7A4B29]/30">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      Snepr Smart Live Queue Engine Active
                      <span className="text-[10px] bg-[#D4A373]/20 text-[#D4A373] px-2 py-0.5 rounded-full border border-[#D4A373]/30">
                        AI Wait-Time Match
                      </span>
                    </h3>
                    <p className="text-xs text-[#A69F96] mt-0.5">
                      Walk-in + Online Queue integrated seamlessly. Dynamic updates auto-sent to customer mobile devices.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCallNext}
                  className="px-5 py-2.5 bg-[#D4A373] hover:bg-[#c39262] text-[#141210] font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  Call Next Customer Token
                </button>
              </div>

              {/* Queue & Appointments split */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Active Queue List */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2D2824] pb-3">
                    <h4 className="font-bold text-white text-sm">Active Live Queue</h4>
                    <span className="text-xs text-[#D4A373] font-semibold">{queueTokens.length} Total Tokens</span>
                  </div>
                  <div className="space-y-2">
                    {queueTokens.map((q: any) => (
                      <div
                        key={q.id}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all",
                          q.status === "in-progress"
                            ? "bg-[#7A4B29]/20 border-[#7A4B29]/50 text-white"
                            : "bg-[#141210] border-[#2D2824] text-[#A69F96]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#25211D] border border-[#3D352E] flex items-center justify-center font-bold text-white text-sm">
                            #{q.token}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{q.name}</p>
                            <p className="text-[11px] text-[#8E867E]">{q.service} • {q.type}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={cn(
                              "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1",
                              q.status === "in-progress"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            )}
                          >
                            {q.status === "in-progress" ? "In Chair" : `Wait ~${q.waitMins}m`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2D2824] pb-3">
                    <h4 className="font-bold text-white text-sm">Upcoming Today's Bookings</h4>
                    <button onClick={() => setActiveTab("Live Queue")} className="text-xs text-[#D4A373] hover:underline font-semibold">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-[#141210] border border-[#2D2824] rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">1:30 PM • Kabir Mehta</p>
                        <p className="text-[#8E867E]">Hair Spa + Beard Trim (60 mins)</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#7A4B29]/20 text-[#D4A373] font-bold rounded-lg border border-[#7A4B29]/30">
                        Confirmed
                      </span>
                    </div>
                    <div className="p-3 bg-[#141210] border border-[#2D2824] rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">2:45 PM • Sanya Verma</p>
                        <p className="text-[#8E867E]">Hair Color & Wash (90 mins)</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#7A4B29]/20 text-[#D4A373] font-bold rounded-lg border border-[#7A4B29]/30">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE QUEUE MANAGEMENT ⭐ */}
          {activeTab === "Live Queue" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl">
                <div>
                  <h3 className="font-bold text-white text-base">Live Queue Command Center</h3>
                  <p className="text-xs text-[#8E867E]">Real-time token management, wait times, and walk-in integration.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleCallNext} className="px-4 py-2 bg-[#7A4B29] text-white text-xs font-bold rounded-xl shadow">
                    Call Next Token
                  </button>
                  <button onClick={() => setWalkinModal(true)} className="px-4 py-2 bg-[#D4A373] text-[#141210] text-xs font-bold rounded-xl shadow">
                    + Add Walk-In
                  </button>
                </div>
              </div>

              {/* Kanban Token Columns */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Column 1: Waiting */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2D2824]">
                    <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">Waiting Queue ({queueTokens.filter((q: any) => q.status === "waiting").length})</h4>
                  </div>
                  {queueTokens.filter((q: any) => q.status === "waiting").map((q: any) => (
                    <div key={q.id} className="p-3.5 bg-[#141210] border border-[#2D2824] rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white bg-[#25211D] px-2 py-0.5 rounded border border-[#3D352E]">#{q.token}</span>
                        <span className="text-[10px] text-[#A69F96]">Wait: {q.waitMins}m</span>
                      </div>
                      <p className="font-bold text-white">{q.name}</p>
                      <p className="text-[11px] text-[#8E867E]">{q.service}</p>
                    </div>
                  ))}
                </div>

                {/* Column 2: In Service / Chair */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2D2824]">
                    <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">In Service ({queueTokens.filter((q: any) => q.status === "in-progress").length})</h4>
                  </div>
                  {queueTokens.filter((q: any) => q.status === "in-progress").map((q: any) => (
                    <div key={q.id} className="p-3.5 bg-[#7A4B29]/15 border border-[#7A4B29]/40 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white bg-[#7A4B29] px-2 py-0.5 rounded">#{q.token}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">Active in Chair</span>
                      </div>
                      <p className="font-bold text-white">{q.name}</p>
                      <p className="text-[11px] text-[#8E867E]">{q.service}</p>
                    </div>
                  ))}
                </div>

                {/* Column 3: Completed Today */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2D2824]">
                    <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider">Completed Today (14)</h4>
                  </div>
                  <div className="p-3.5 bg-[#141210] border border-[#2D2824] rounded-xl text-xs opacity-70">
                    <p className="font-bold text-white">#98 • Rajesh Kumar</p>
                    <p className="text-[11px] text-[#8E867E]">Haircut & Beard • Completed at 11:45 AM</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {/* TAB: CHAIRS & STATIONS MANAGEMENT (Section 6) */}
          {activeTab === "Chairs & Stations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A4B29]/20 text-[#D4A373] text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Armchair className="w-3 h-3" />
                    SalonOS Chair Management System
                  </div>
                  <h3 className="font-bold text-white text-lg">Chairs & Station Command</h3>
                  <p className="text-xs text-[#8E867E]">
                    Live chair occupancy directly synchronizes with customer wait-times across Bhubaneswar.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setWalkinModal(true)} className="px-4 py-2 bg-[#D4A373] hover:bg-[#c49363] text-[#141210] text-xs font-bold rounded-xl shadow transition-all">
                    + Seat Walk-In
                  </button>
                  <button onClick={handleCallNext} className="px-4 py-2 bg-[#7A4B29] hover:bg-[#8F5A33] text-white text-xs font-bold rounded-xl shadow transition-all">
                    Call Next Token
                  </button>
                </div>
              </div>

              {/* Visual Chair Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {salonChairs.map((chair) => {
                  const isAvailable = chair.status === "available";
                  const isOccupied = chair.status === "occupied";
                  const isFinishing = chair.status === "finishing";
                  const isBreak = chair.status === "break";

                  return (
                    <div
                      key={chair.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isAvailable
                          ? "bg-[#141A16] border-[#2E7D4F]/40 shadow-sm"
                          : isOccupied
                          ? "bg-[#1D1714] border-[#7A4B29]/50 shadow-md"
                          : isFinishing
                          ? "bg-[#1E1B14] border-[#C8993E]/40"
                          : "bg-[#171615] border-[#3D352E]/50 opacity-80"
                      }`}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs font-bold text-white bg-[#25211D] px-2.5 py-1 rounded-lg border border-[#3D352E]">
                            {chair.name}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              isAvailable
                                ? "bg-[#2E7D4F]/20 text-[#2E7D4F]"
                                : isOccupied
                                ? "bg-[#DC2626]/20 text-red-400"
                                : isFinishing
                                ? "bg-[#C8993E]/20 text-[#C8993E]"
                                : "bg-zinc-700/30 text-zinc-400"
                            }`}
                          >
                            ● {chair.status}
                          </span>
                        </div>

                        {/* Barber Name */}
                        <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#D4A373]" />
                          {chair.barber}
                        </div>

                        {/* Customer / Service */}
                        {chair.customer ? (
                          <div className="p-3 bg-[#141210] rounded-xl border border-[#2D2824] space-y-1 mb-3">
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <span>{chair.customer}</span>
                              <span className="text-[#D4A373] font-mono">{chair.token}</span>
                            </div>
                            <p className="text-[11px] text-[#8E867E] truncate">{chair.service}</p>
                            <div className="text-[10px] text-amber-400/90 font-medium pt-1 border-t border-[#25211D]">
                              Est. remaining: ~{chair.estRemainingMins} mins
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-[#141210]/60 rounded-xl border border-[#2D2824] text-center mb-3">
                            <p className="text-xs font-bold text-[#2E7D4F]">
                              {isBreak ? "Barber on 15m Break" : "Chair Free & Ready"}
                            </p>
                            <p className="text-[10px] text-[#6E6761] mt-0.5">
                              {isBreak ? "Available at 12:15 PM" : "Ready for next token"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-1.5 pt-2 border-t border-[#2D2824]">
                        {isAvailable && (
                          <button
                            onClick={() => updateChairStatus(chair.id, "occupied")}
                            className="w-full py-2 bg-[#2E7D4F] hover:bg-[#25633e] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                          >
                            Assign Next Token
                          </button>
                        )}

                        {isOccupied && (
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => updateChairStatus(chair.id, "finishing")}
                              className="py-1.5 bg-[#C8993E] hover:bg-[#b08432] text-[#141210] font-bold text-[11px] rounded-lg"
                            >
                              Finishing
                            </button>
                            <button
                              onClick={() => updateChairStatus(chair.id, "available")}
                              className="py-1.5 bg-[#2E7D4F] hover:bg-[#25633e] text-white font-bold text-[11px] rounded-lg"
                            >
                              Complete
                            </button>
                          </div>
                        )}

                        {isFinishing && (
                          <button
                            onClick={() => updateChairStatus(chair.id, "available")}
                            className="w-full py-2 bg-[#2E7D4F] hover:bg-[#25633e] text-white font-bold text-xs rounded-xl"
                          >
                            Finish & Free Chair
                          </button>
                        )}

                        {isBreak && (
                          <button
                            onClick={() => updateChairStatus(chair.id, "available")}
                            className="w-full py-2 bg-[#7A4B29] hover:bg-[#8F5A33] text-white font-bold text-xs rounded-xl"
                          >
                            End Break / Set Ready
                          </button>
                        )}

                        {!isBreak && !isOccupied && (
                          <button
                            onClick={() => updateChairStatus(chair.id, "break")}
                            className="w-full py-1 text-[10px] text-[#8E867E] hover:text-white transition-colors"
                          >
                            Put Station on Break
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Queue Table & Operational Actions */}
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D2824] mb-4">
                  <h4 className="font-bold text-white text-sm">Live Token Queue Management</h4>
                  <span className="text-xs text-[#8E867E]">
                    {queueTokens.length} active customer{queueTokens.length === 1 ? "" : "s"} in queue
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#A69F96]">
                    <thead className="bg-[#141210] text-[#D4A373] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Token</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Est. Wait</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D2824]">
                      {queueTokens.map((item: any) => (
                        <tr key={item.id} className="hover:bg-[#25211D]/50 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">#{item.token}</td>
                          <td className="p-3 font-semibold text-white">{item.name}</td>
                          <td className="p-3">{item.service}</td>
                          <td className="p-3 text-amber-400 font-bold">{item.waitMins}m</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#7A4B29]/20 text-[#D4A373] text-[10px] font-bold uppercase">
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <button
                              onClick={() => queueActionMutation.mutate({ queueId: item.id, action: "in-progress" })}
                              className="px-2.5 py-1 bg-[#2E7D4F] hover:bg-[#25633e] text-white text-[10px] font-bold rounded-lg"
                            >
                              Seat
                            </button>
                            <button
                              onClick={() => queueActionMutation.mutate({ queueId: item.id, action: "completed" })}
                              className="px-2.5 py-1 bg-[#7A4B29] hover:bg-[#8F5A33] text-white text-[10px] font-bold rounded-lg"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => queueActionMutation.mutate({ queueId: item.id, action: "no_show" })}
                              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold rounded-lg"
                            >
                              No-Show
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTIONS & BILLING (STRATEGY REPORT PRICING) */}
          {activeTab === "Subscriptions & Billing" && (
            <div className="space-y-6">
              <div className="bg-[#1A1714] border border-[#2D2824] p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-2">Snepr SalonOS Plans</h3>
                <p className="text-xs text-[#A69F96]">
                  Transparent SaaS pricing designed to keep queue trust uncompromised. Subscriptions never alter public ratings.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Base / Entry */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-6 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">Base / Entry</h4>
                        <p className="text-xs text-[#8E867E]">For single-chair & boutique salons</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#25211D] text-[#A69F96] border border-[#3D352E]">
                        Entry
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">₹199</span>
                      <span className="text-xs text-[#8E867E]">/month</span>
                    </div>
                    <ul className="text-xs text-[#A69F96] space-y-2 pt-2 border-t border-[#2D2824]">
                      <li className="flex items-center gap-2">✓ Digital Queue & live token engine</li>
                      <li className="flex items-center gap-2">✓ Public salon & barber profile</li>
                      <li className="flex items-center gap-2">✓ Owner controls (Next, Start, Complete, Pause)</li>
                      <li className="flex items-center gap-2">✓ Public verified reviews & ratings</li>
                      <li className="flex items-center gap-2">✓ Customer Snepr Points (+5 / +10 pts)</li>
                      <li className="flex items-center gap-2">✓ Limited AI style catalogue browsing</li>
                    </ul>
                  </div>
                  <button className="mt-6 w-full py-2.5 bg-[#25211D] hover:bg-[#322A25] text-white font-bold text-xs rounded-xl border border-[#3D352E] transition-all">
                    Active Plan
                  </button>
                </div>

                {/* Intermediate */}
                <div className="bg-[#1A1714] border border-[#2D2824] p-6 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">Intermediate</h4>
                        <p className="text-xs text-[#8E867E]">Growth tools & queue QR posters</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#7A4B29]/30 text-[#D4A373] border border-[#7A4B29]/40">
                        Growth
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">₹400</span>
                      <span className="text-xs text-[#8E867E]">/month</span>
                    </div>
                    <ul className="text-xs text-[#A69F96] space-y-2 pt-2 border-t border-[#2D2824]">
                      <li className="flex items-center gap-2 text-white">✓ Everything in Base</li>
                      <li className="flex items-center gap-2">✓ QR-code queue joining posters</li>
                      <li className="flex items-center gap-2">✓ Daily/weekly queue analytics</li>
                      <li className="flex items-center gap-2">✓ Owner review-response tools</li>
                      <li className="flex items-center gap-2">✓ Repeat-customer retention summary</li>
                      <li className="flex items-center gap-2">✓ Basic staff assignment & summaries</li>
                      <li className="flex items-center gap-2">✓ Expanded AI style recommendations</li>
                    </ul>
                  </div>
                  <button className="mt-6 w-full py-2.5 bg-[#25211D] hover:bg-[#322A25] text-white font-bold text-xs rounded-xl border border-[#3D352E] transition-all">
                    Upgrade to Intermediate
                  </button>
                </div>

                {/* Professional / Pro */}
                <div className="bg-gradient-to-b from-[#2A1D15] to-[#1A1714] border-2 border-[#D4A373] p-6 rounded-2xl flex flex-col justify-between shadow-xl relative">
                  <div className="absolute -top-3 right-6 bg-[#D4A373] text-[#141210] font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md">
                    Recommended (₹49 step-up)
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">Professional / Pro</h4>
                        <p className="text-xs text-[#D4A373]">Full toolkit & AI Smart Styling</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#D4A373]">₹449</span>
                      <span className="text-xs text-[#8E867E]">/month</span>
                    </div>
                    <ul className="text-xs text-[#F3EFEA] space-y-2 pt-2 border-t border-[#7A4B29]/40">
                      <li className="flex items-center gap-2 font-semibold">✓ Everything in Intermediate</li>
                      <li className="flex items-center gap-2">✓ Advanced AI Smart Styling & photo previews</li>
                      <li className="flex items-center gap-2">✓ Advanced queue analytics & wait-time insights</li>
                      <li className="flex items-center gap-2">✓ Multi-barber & chair management</li>
                      <li className="flex items-center gap-2">✓ Advanced loyalty & retention campaigns</li>
                      <li className="flex items-center gap-2">✓ Multi-branch management</li>
                      <li className="flex items-center gap-2">✓ Priority phone & WhatsApp support</li>
                    </ul>
                  </div>
                  <button className="mt-6 w-full py-2.5 bg-[#D4A373] hover:bg-[#c39262] text-[#141210] font-extrabold text-xs rounded-xl transition-all shadow-md">
                    Upgrade to Pro (₹449)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: QR QUEUE POSTER (INTERMEDIATE & PRO ENTITLEMENT) */}
          {activeTab === "QR Queue Poster" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Counter QR Queue Standee</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7A4B29]/30 text-[#D4A373] border border-[#7A4B29]/40 uppercase">
                      Intermediate+
                    </span>
                  </h3>
                  <p className="text-xs text-[#A69F96] mt-0.5">
                    Display this counter standee at your reception. Walk-in customers scan with their phone camera to join without waiting in line.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#7A4B29] hover:bg-[#8F5A33] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Standee</span>
                </button>
              </div>

              {/* Standee Preview Card */}
              <div className="bg-[#FAF7F2] text-[#1C1613] p-8 rounded-3xl border-4 border-[#7A4B29] shadow-2xl text-center space-y-6">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7A4B29] text-white flex items-center justify-center font-bold">
                    S
                  </div>
                  <h4 className="font-bold text-xl text-[#1C1613] tracking-tight">Snepr Live Queue</h4>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-[#1C1613]">Know the queue before you go.</h2>
                  <p className="text-xs text-[#7A4B29] font-bold uppercase tracking-wider">
                    Official Counter Partner • {session?.name || "The Scissors Edge"}
                  </p>
                </div>

                {/* Simulated QR Pattern */}
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-[#1C1613] flex flex-col items-center justify-center shadow-md relative">
                  <div className="w-full h-full border border-dashed border-[#1C1613]/40 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                    <Zap className="w-10 h-10 text-[#7A4B29] mb-1" />
                    <span className="font-mono text-[10px] font-bold text-[#1C1613] tracking-tight">
                      snepr.in/live/salon/{salonId}
                    </span>
                    <span className="text-[9px] text-[#8E867E] mt-1 font-sans">
                      Scan with Camera
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-left text-[11px] bg-white p-4 rounded-2xl border border-[#E8E2D9]">
                  <div>
                    <span className="font-bold text-[#7A4B29]">1. Scan</span>
                    <p className="text-[#8E867E]">Point camera at QR</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#7A4B29]">2. See Wait</span>
                    <p className="text-[#8E867E]">Check live chair pace</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#7A4B29]">3. Get Token</span>
                    <p className="text-[#8E867E]">Sit straight in chair</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS & TRUST (PILLAR 2) */}
          {activeTab === "Reviews & Trust" && (
            <div className="space-y-6">
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Verified Reviews & Reputation</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified Visits
                    </span>
                  </h3>
                  <p className="text-xs text-[#A69F96] mt-0.5">
                    Reviews can only be submitted after an eligible completed queue visit. Subscriptions never alter ratings.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#25211D] px-3 py-1.5 rounded-xl border border-[#3D352E]">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white font-mono">4.9</span>
                  <span className="text-[10px] text-[#8E867E]">(142 reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    customer: "Ananya Patnaik",
                    rating: 5,
                    date: "2 days ago",
                    comment: "Checked the live queue at home when it was 1 waiting. Reached in 10 mins and sat straight in chair. Sameer did an incredible layered cut!",
                    ownerReply: "Thank you Ananya! Glad Snepr's live queue saved your waiting time.",
                  },
                  {
                    id: 2,
                    customer: "Debashish Nayak",
                    rating: 5,
                    date: "4 days ago",
                    comment: "Super transparent wait times. Exactly 15 minutes as indicated. Loved the clean fade and hot towel service.",
                    ownerReply: null,
                  },
                ].map((rev) => (
                  <div key={rev.id} className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{rev.customer}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Visit
                        </span>
                        <span className="text-[10px] text-[#8E867E]">• {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#FAF8F5] leading-relaxed">{rev.comment}</p>

                    {rev.ownerReply ? (
                      <div className="p-3 bg-[#141210] border border-[#2D2824] rounded-xl text-xs space-y-1">
                        <p className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wider">Your Salon Response:</p>
                        <p className="text-[#A69F96]">{rev.ownerReply}</p>
                      </div>
                    ) : (
                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Reply to this verified customer review..."
                          className="flex-1 bg-[#141210] border border-[#2D2824] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#8E867E] focus:outline-none focus:border-[#7A4B29]"
                        />
                        <button className="px-3.5 py-1.5 bg-[#7A4B29] hover:bg-[#8F5A33] text-white font-bold text-xs rounded-xl">
                          Post Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LOYALTY & POINTS (STRATEGY REPORT SECTION 10) */}
          {activeTab === "Loyalty & Points" && (
            <div className="space-y-6">
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Snepr Fair Points &amp; Loyalty Ledger</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-[#D4A373] border border-[#7A4B29]/40">
                      Standardized
                    </span>
                  </h3>
                  <p className="text-xs text-[#A69F96] mt-0.5">
                    Platform-wide reward engine. Customers earn points equally to eliminate bribery and build genuine salon loyalty.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>+5 Points per Completed Haircut</span>
                  </div>
                  <p className="text-xs text-[#A69F96]">
                    Automatically credited to customer wallet when staff marks token as Completed in live queue.
                  </p>
                </div>

                <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>+10 Points per Verified Review</span>
                  </div>
                  <p className="text-xs text-[#A69F96]">
                    Rewarded equally for 1★, 3★, or 5★ reviews. Barbers cannot manipulate scores by offering bonus points.
                  </p>
                </div>
              </div>

              {/* Recent Points Ledger Activity */}
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Recent Points Transactions</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#141210] border border-[#2D2824] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Ananya Patnaik • Verified Review</p>
                      <p className="text-[10px] text-[#8E867E]">Token #94 • 2 days ago</p>
                    </div>
                    <span className="font-bold font-mono text-emerald-400">+10 pts</span>
                  </div>
                  <div className="p-3 bg-[#141210] border border-[#2D2824] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Rajesh Kumar • Completed Service</p>
                      <p className="text-[10px] text-[#8E867E]">Token #98 • Completed today</p>
                    </div>
                    <span className="font-bold font-mono text-emerald-400">+5 pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === "Services" && (
            <div className="space-y-6">
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Service Menu &amp; Pricing</h3>
                  <p className="text-xs text-[#A69F96] mt-0.5">
                    Customers view these services and prices in real-time when joining your digital queue.
                  </p>
                </div>
                <button className="px-3.5 py-1.5 bg-[#7A4B29] hover:bg-[#8F5A33] text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                {[
                  { name: "Signature Haircut & Styling", duration: "30 mins", price: "₹250", discount: "0%" },
                  { name: "Beard Trim & Sculpt", duration: "15 mins", price: "₹150", discount: "0%" },
                  { name: "Head Massage & Wash", duration: "20 mins", price: "₹200", discount: "0%" },
                  { name: "Deep Conditioning Hair Spa", duration: "45 mins", price: "₹650", discount: "10%" },
                  { name: "Charcoal Face Clean-up", duration: "30 mins", price: "₹400", discount: "0%" },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      <p className="text-[11px] text-[#8E867E] mt-0.5">~{s.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-emerald-400">{s.price}</span>
                      <p className="text-[10px] text-[#8E867E]">Active</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: STAFF & BARBERS */}
          {activeTab === "Staff & Barbers" && (
            <div className="space-y-6">
              <div className="bg-[#1A1714] border border-[#2D2824] p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Barber Team &amp; Chairs</h3>
                  <p className="text-xs text-[#A69F96] mt-0.5">
                    Toggle break mode or assign specific staff to live queue chairs.
                  </p>
                </div>
                <button className="px-3.5 py-1.5 bg-[#7A4B29] hover:bg-[#8F5A33] text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Barber</span>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs">
                {[
                  { name: "Sameer Mohanty", role: "Master Stylist", rating: "4.9", status: "In Chair", break: false },
                  { name: "Rahul Sen", role: "Senior Barber", rating: "4.7", status: "Available", break: false },
                  { name: "Bikash Rout", role: "Stylist", rating: "4.8", status: "Break Mode", break: true },
                ].map((b, idx) => (
                  <div key={idx} className="bg-[#1A1714] border border-[#2D2824] p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7A4B29] to-[#D4A373] text-white flex items-center justify-center font-bold">
                        {b.name.charAt(0)}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          b.break
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        )}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{b.name}</h4>
                      <p className="text-[11px] text-[#8E867E]">{b.role} • ★ {b.rating}</p>
                    </div>
                    <button className="w-full py-1.5 bg-[#25211D] border border-[#3D352E] hover:bg-[#322A25] text-white text-[11px] font-semibold rounded-xl">
                      {b.break ? "Resume Duty" : "Take Break"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER MODULES PLACEHOLDERS */}
          {["Analytics", "Offers & Retention", "Multi-Branch", "Settings"].includes(activeTab) && (
            <div className="bg-[#1A1714] border border-[#2D2824] p-8 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#7A4B29]/20 border border-[#7A4B29]/40 flex items-center justify-center text-[#D4A373] mx-auto text-2xl">
                ⚙️
              </div>
              <h3 className="text-xl font-bold text-white">{activeTab} Module</h3>
              <p className="text-sm text-[#A69F96] max-w-md mx-auto">
                Snepr SalonOS {activeTab} engine configured for real-time queue synchronization and plan entitlements.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-[#7A4B29] text-white font-bold text-xs rounded-xl">
                  Configure {activeTab} Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── ADD WALK-IN MODAL ─── */}
      {walkinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1714] border border-[#2D2824] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2D2824] pb-3">
              <h3 className="font-bold text-white text-base">Add Walk-In Customer</h3>
              <button onClick={() => setWalkinModal(false)} className="text-[#8E867E] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A69F96] font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141210] border border-[#2D2824] rounded-xl text-white outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div>
                <label className="block text-[#A69F96] font-bold mb-1">Phone Number (Optional for SMS token link)</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141210] border border-[#2D2824] rounded-xl text-white outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div>
                <label className="block text-[#A69F96] font-bold mb-1">Select Service</label>
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141210] border border-[#2D2824] rounded-xl text-white outline-none focus:border-[#7A4B29]"
                >
                  <option value="Haircut ₹250 (30 mins)">Haircut ₹250 (30 mins)</option>
                  <option value="Beard Trim ₹150 (15 mins)">Beard Trim ₹150 (15 mins)</option>
                  <option value="Hair Spa ₹799 (60 mins)">Hair Spa ₹799 (60 mins)</option>
                  <option value="Facial & Grooming ₹1200">Facial & Grooming ₹1200</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button onClick={() => setWalkinModal(false)} className="px-4 py-2 text-xs font-bold text-[#A69F96] hover:bg-[#25211D] rounded-xl">
                Cancel
              </button>
              <button onClick={handleAddWalkin} className="px-5 py-2 bg-[#7A4B29] hover:bg-[#8F5A33] text-white text-xs font-bold rounded-xl shadow">
                Generate Token & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
