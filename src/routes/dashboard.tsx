import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserPoints, submitVerifiedReviewDirect } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveBadge } from "@/components/ui/autosave-badge";
import { DestructiveConfirmModal } from "@/components/ui/destructive-confirm-modal";
import { formatDate } from "@/lib/formatters";
import {
  Sparkles,
  Award,
  Star,
  Clock,
  CheckCircle2,
  MapPin,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Armchair,
  Heart,
  Bell,
  User,
  Settings,
  Navigation,
  RefreshCw,
  LogOut,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    title: "Customer Dashboard | Snepr",
    meta: [
      {
        name: "description",
        content: "Track your active salon queue token, visit history, loyalty points, and favorite salons across Bhubaneswar.",
      },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: CustomerDashboardPage,
});

export type CustomerTab = "overview" | "queue" | "history" | "favorites" | "points" | "reviews" | "settings";

export function CustomerDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<CustomerTab>("overview");
  const [session, setSession] = useState<any>(null);
  const [activeQueue, setActiveQueue] = useState<any>(() => {
    try {
      const stored = localStorage.getItem("snepr_active_queue");
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default active demo queue pass
    return {
      tokenCode: "#A07",
      tokenNumber: 7,
      salonName: "The Scissors Edge",
      address: "Plot 142, Janpath Road, Saheed Nagar, Bhubaneswar",
      serviceName: "Signature Haircut & Beard Sculpt",
      barberName: "Sameer Mohanty",
      chairAssigned: "Station 02",
      stage: 2,
      position: 2,
      peopleAhead: 1,
      waitTimeMins: 12,
      status: "waiting",
      createdAt: new Date().toISOString(),
    };
  });

  // Review Modal State
  const [reviewModalVisit, setReviewModalVisit] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Notification Preferences State
  const [notifSms, setNotifSms] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Autosave notification preferences
  const { status: autosaveStatus, lastSaved, retry: retryAutosave } = useAutosave({
    data: { notifSms, notifBrowser },
    delay: 400,
    onSave: async (prefs) => {
      try {
        localStorage.setItem("snepr_notif_prefs", JSON.stringify(prefs));
      } catch {}
      return prefs;
    },
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const userId = session?.id || 1;

  const { data: pointsData } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: () => fetchUserPoints(userId),
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      submitVerifiedReviewDirect({
        customerId: userId,
        salonId: reviewModalVisit?.salonId || 1,
        queueId: reviewModalVisit?.queueId || 101,
        rating: reviewRating,
        comment: reviewComment,
      }),
    onSuccess: () => {
      toast.success("Verified review submitted! Earned +15 Snepr Points.");
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      setReviewModalVisit(null);
      setReviewComment("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit review.");
    },
  });

  const handleLeaveQueue = () => {
    try {
      localStorage.removeItem("snepr_active_queue");
    } catch {}
    setActiveQueue(null);
    toast.info("You have left the queue.");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("snepr_session");
    } catch {}
    setSession(null);
    window.dispatchEvent(new Event("storage"));
    toast.info("Signed out successfully.");
    navigate({ to: "/login" });
  };

  const pastVisits = [
    {
      id: 1,
      salonId: 14,
      queueId: 101,
      salonName: "The Scissors Edge",
      address: "Plot 142, Janpath Road, Saheed Nagar, Bhubaneswar",
      service: "Signature Haircut & Beard Sculpt",
      date: "Oct 28, 2026",
      priceRs: 280,
      status: "completed",
      tokenCode: "#A05",
      hasReviewed: false,
    },
    {
      id: 2,
      salonId: 1,
      queueId: 102,
      salonName: "Lakmé Salon | For Him and Her",
      address: "KIIT Road, Patia, Bhubaneswar",
      service: "Hair Wash & Deep Conditioning",
      date: "Oct 15, 2026",
      priceRs: 250,
      status: "completed",
      tokenCode: "#L12",
      hasReviewed: true,
    },
    {
      id: 3,
      salonId: 3,
      queueId: 103,
      salonName: "Green Trends Unisex Salon | Patia",
      address: "D1 Square, Patia, Bhubaneswar",
      service: "Beard Sculpt & Shave",
      date: "Sep 30, 2026",
      priceRs: 180,
      status: "completed",
      tokenCode: "#G04",
      hasReviewed: true,
    },
  ];

  const favoriteSalons = [
    {
      id: 14,
      slug: "the-scissors-edge",
      name: "The Scissors Edge",
      area: "Saheed Nagar",
      address: "Janpath Road, opposite Rama Devi College",
      rating: 4.8,
      chairsFree: 2,
      waitTime: 8,
      photo: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 1,
      slug: "lakme-salon-patia",
      name: "Lakmé Salon | For Him and Her",
      area: "Patia & KIIT Square",
      address: "KIIT Road, opposite Manyavar",
      rating: 4.8,
      chairsFree: 2,
      waitTime: 0,
      photo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 15,
      slug: "royale-barber-club",
      name: "Royale Barber Club",
      area: "KIIT Square",
      address: "Campus 3 Road, Patia",
      rating: 4.8,
      chairsFree: 3,
      waitTime: 4,
      photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const totalPoints = pointsData?.balance ?? 150;

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#211914] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24 max-w-[1240px] mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* ─── CUSTOMER WELCOME BANNER ─── */}
        <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#80543a]/10 border border-[#80543a]/20 flex items-center justify-center font-serif font-bold text-2xl text-[#80543a]">
              {session?.name ? session.name.split(" ").map((n: string) => n[0]).join("") : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1d1b17]">
                  {session?.name || "Priya Mohapatra"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaf3ec] text-[#267447] text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-[#6b5e52] mt-0.5">
                {session?.email || "priya.m@example.com"} · {session?.phone || "+91 94370 12345"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl p-3 sm:p-4 text-center min-w-[140px]">
              <div className="text-[10px] font-bold text-[#8c8074] uppercase">Snepr Points</div>
              <div className="text-2xl font-serif font-bold text-[#80543a] mt-0.5">
                {totalPoints} pts
              </div>
              <div className="text-[10px] text-[#267447] font-semibold">
                ₹{Math.round(totalPoints * 0.5)} Discount Value
              </div>
            </div>

            <div className="bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl p-3 sm:p-4 text-center min-w-[140px]">
              <div className="text-[10px] font-bold text-[#8c8074] uppercase">Completed Visits</div>
              <div className="text-2xl font-serif font-bold text-[#1d1b17] mt-0.5">
                {pastVisits.length}
              </div>
              <div className="text-[10px] text-[#8c8074]">Bhubaneswar Salons</div>
            </div>
          </div>
        </div>

        {/* ─── MAIN ELEMENT: ACTIVE QUEUE PASS ─── */}
        {activeQueue ? (
          <div className="bg-white border-2 border-[#80543a]/40 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#eee4d8]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80543a]/10 text-[#80543a] text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#267447] animate-pulse" />
                  Active Queue Pass
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1d1b17]">
                  {activeQueue.salonName}
                </h2>
                <p className="text-xs text-[#6b5e52] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#80543a]" />
                  <span>{activeQueue.address}</span>
                </p>
              </div>

              {/* Token Number Hero Display */}
              <div className="bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl px-6 py-4 text-center min-w-[180px]">
                <div className="text-[10px] font-bold uppercase text-[#8c8074] tracking-widest">
                  YOUR TOKEN CODE
                </div>
                <div className="text-4xl sm:text-5xl font-black font-serif text-[#1d1b17] my-0.5">
                  {activeQueue.tokenCode}
                </div>
                <div className="text-xs font-bold text-[#80543a]">
                  {activeQueue.serviceName}
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="bg-[#f7f3ed] p-3.5 rounded-2xl border border-[#eee4d8]">
                <div className="text-[10px] font-bold text-[#8c8074] uppercase">Position in Line</div>
                <div className="text-xl font-serif font-bold text-[#1d1b17] mt-0.5">
                  #{activeQueue.position}
                </div>
                <div className="text-[11px] text-[#6b5e52]">{activeQueue.peopleAhead} ahead of you</div>
              </div>

              <div className="bg-[#f7f3ed] p-3.5 rounded-2xl border border-[#eee4d8]">
                <div className="text-[10px] font-bold text-[#8c8074] uppercase">Estimated Wait</div>
                <div className="text-xl font-serif font-bold text-[#80543a] mt-0.5">
                  ~{activeQueue.waitTimeMins} mins
                </div>
                <div className="text-[11px] text-[#6b5e52]">Real time chair telemetry</div>
              </div>

              <div className="bg-[#f7f3ed] p-3.5 rounded-2xl border border-[#eee4d8]">
                <div className="text-[10px] font-bold text-[#8c8074] uppercase">Assigned Chair</div>
                <div className="text-base font-bold text-[#1d1b17] mt-1 truncate">
                  {activeQueue.chairAssigned}
                </div>
                <div className="text-[11px] text-[#267447]">Chair ready on arrival</div>
              </div>

              <div className="bg-[#f7f3ed] p-3.5 rounded-2xl border border-[#eee4d8]">
                <div className="text-[10px] font-bold text-[#8c8074] uppercase">Stylist</div>
                <div className="text-base font-bold text-[#1d1b17] mt-1 truncate">
                  {activeQueue.barberName}
                </div>
                <div className="text-[11px] text-[#8c8074]">Master Barber</div>
              </div>
            </div>

            {/* 5 Stage Live Progress */}
            <div className="pt-4 border-t border-[#eee4d8] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1d1b17]">Status:</span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                  ● In Queue (#2 In Line)
                </span>
                <span className="text-xs text-[#8c8074] hidden sm:inline">
                  · Relax at home or office until your token is called
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/queue/${activeQueue.tokenCode.replace("#", "")}`}
                  className="px-5 py-2.5 rounded-xl bg-[#1d1b17] text-[#f5f1e9] text-xs font-bold hover:bg-[#3d322a] transition-all shadow-sm"
                >
                  Track Live Pass ↗
                </Link>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 transition-all cursor-pointer"
                >
                  Leave Queue
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            type="no_queue"
            title="No Active Queue Pass"
            description="You do not have any active haircut tickets right now. Check live chair availability across Bhubaneswar salons and save your spot remotely."
            actionLabel="Explore Salons & Join Queue"
            onAction={() => navigate({ to: "/salons" })}
          />
        )}

        {/* ─── DASHBOARD NAVIGATION TABS ─── */}
        <div className="flex items-center gap-2 border-b border-[#eee4d8] pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: "◷" },
            { id: "history", label: `Queue History (${pastVisits.length})`, icon: "⏱" },
            { id: "favorites", label: `Favorite Salons (${favoriteSalons.length})`, icon: "♥" },
            { id: "points", label: `Snepr Points (${totalPoints})`, icon: "✧" },
            { id: "settings", label: "Settings & Preferences", icon: "⚙" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CustomerTab)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1d1b17] text-[#f5f1e9] shadow-sm"
                  : "bg-white text-[#6b5e52] border border-[#eee4d8] hover:text-[#1d1b17]"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── TAB 1: OVERVIEW / RECENT VISITS ─── */}
        {(activeTab === "overview" || activeTab === "history") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold font-serif text-[#1d1b17]">
                Salon Visit &amp; Token History
              </h3>
              <span className="text-xs text-[#8c8074]">Verified completed salon visits</span>
            </div>

            <div className="space-y-3">
              {pastVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white border border-[#eee4d8] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#1d1b17]">{visit.salonName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-xs text-[#6b5e52] mt-0.5">{visit.address}</div>
                    <div className="flex items-center gap-3 text-xs text-[#8c8074] mt-2">
                      <span className="font-semibold text-[#1d1b17]">{visit.service}</span>
                      <span>·</span>
                      <span>{visit.date}</span>
                      <span>·</span>
                      <span className="font-bold text-[#80543a]">₹{visit.priceRs}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!visit.hasReviewed ? (
                      <button
                        onClick={() => setReviewModalVisit(visit)}
                        className="px-4 py-2 rounded-xl bg-[#80543a] text-white text-xs font-bold hover:bg-[#60391F] transition-all shadow-sm cursor-pointer"
                      >
                        Write Review (+15 pts)
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#267447] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Review Submitted (+15 pts)</span>
                      </span>
                    )}

                    <Link
                      to={`/salon/${visit.salonId === 14 ? "the-scissors-edge" : "lakme-salon-patia"}`}
                      className="px-3.5 py-2 rounded-xl border border-[#1d1b17] text-[#1d1b17] text-xs font-bold hover:bg-[#1d1b17] hover:text-[#f5f1e9] transition-all"
                    >
                      Book Again ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 2: FAVORITE SALONS ─── */}
        {activeTab === "favorites" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold font-serif text-[#1d1b17]">
                Saved &amp; Favorite Salons
              </h3>
              <span className="text-xs text-[#8c8074]">Quick access to your preferred barbers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {favoriteSalons.map((salon) => (
                <div
                  key={salon.id}
                  className="bg-white border border-[#eee4d8] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 rounded-2xl overflow-hidden mb-3 bg-[#f0e8de]">
                      <img
                        src={salon.photo}
                        alt={salon.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-[#80543a]">{salon.area}</span>
                      <span className="text-xs font-bold text-amber-600">★ {salon.rating}</span>
                    </div>
                    <h4 className="font-bold text-base text-[#1d1b17] line-clamp-1">{salon.name}</h4>
                    <p className="text-xs text-[#6b5e52] mt-0.5 line-clamp-1">{salon.address}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-[#f7f3ed] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#267447]">
                        {salon.chairsFree} chairs ready
                      </span>
                      <span className="font-bold text-[#80543a]">
                        {salon.waitTime === 0 ? "Zero wait" : `~${salon.waitTime}m wait`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eee4d8] flex items-center gap-2">
                    <Link
                      to={`/salon/${salon.slug}`}
                      className="flex-1 py-2 text-center rounded-xl bg-[#1d1b17] text-[#f5f1e9] text-xs font-bold hover:bg-[#3d322a]"
                    >
                      View Salon ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: SNEPR POINTS & REWARDS ─── */}
        {activeTab === "points" && (
          <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eee4d8]">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#80543a]">
                  LOYALTY REWARDS
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#1d1b17]">
                  Snepr Points Balance: {totalPoints} Points
                </h3>
                <p className="text-xs text-[#6b5e52] mt-0.5">
                  1 Snepr Point = ₹0.50 haircut discount. Automatically redeemable at checkout.
                </p>
              </div>

              <Link
                to="/points"
                className="px-5 py-2.5 rounded-xl bg-[#80543a] text-white text-xs font-bold hover:bg-[#60391F] self-start sm:self-auto"
              >
                Learn How to Earn More Points ↗
              </Link>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#1d1b17]">Transaction History</h4>
              <div className="divide-y divide-[#eee4d8] text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1d1b17]">Verified Haircut Visit · The Scissors Edge</div>
                    <div className="text-[11px] text-[#8c8074]">Oct 28, 2026</div>
                  </div>
                  <span className="font-bold text-[#267447] text-sm">+10 pts</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1d1b17]">Verified Review Bonus · Lakmé Salon Patia</div>
                    <div className="text-[11px] text-[#8c8074]">Oct 15, 2026</div>
                  </div>
                  <span className="font-bold text-[#267447] text-sm">+15 pts</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1d1b17]">Welcome Onboarding Bonus</div>
                    <div className="text-[11px] text-[#8c8074]">Sep 20, 2026</div>
                  </div>
                  <span className="font-bold text-[#267447] text-sm">+125 pts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: SETTINGS & PREFERENCES ─── */}
        {activeTab === "settings" && (
          <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1d1b17]">Account &amp; Notification Settings</h3>
                <p className="text-xs text-[#6b5e52] mt-0.5">Manage appointment alerts and your customer profile</p>
              </div>
              <AutosaveBadge status={autosaveStatus} lastSaved={lastSaved} onRetry={retryAutosave} />
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#eee4d8] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#1d1b17]">SMS Turn Alerts</div>
                  <div className="text-[11px] text-[#6b5e52]">Receive notification 10 minutes before your chair opens</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={(e) => setNotifSms(e.target.checked)}
                  className="w-4 h-4 accent-[#80543a] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#eee4d8] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#1d1b17]">Browser Push Notifications</div>
                  <div className="text-[11px] text-[#6b5e52]">Instant live queue countdown updates on your device</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifBrowser}
                  onChange={(e) => setNotifBrowser(e.target.checked)}
                  className="w-4 h-4 accent-[#80543a] cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-[#eee4d8] flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl border border-red-200 text-red-700 font-bold text-xs hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out of Snepr</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── REVIEW MODAL ─── */}
        {reviewModalVisit && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#fffdf9] border border-[#eee4d8] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#80543a]">
                  VERIFIED REVIEW
                </span>
                <button
                  onClick={() => setReviewModalVisit(null)}
                  className="p-1 rounded-full text-[#8c8074] hover:text-[#1d1b17]"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-xl font-bold font-serif text-[#1d1b17]">
                Review {reviewModalVisit.salonName}
              </h3>
              <p className="text-xs text-[#6b5e52]">
                Your review helps other customers find the best stylists in Bhubaneswar and earns you +15 Snepr Points!
              </p>

              <div>
                <label className="block text-xs font-bold text-[#1d1b17] mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-2xl text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {star <= reviewRating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1b17] mb-1">Comments</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the wait time, barber precision, and service cleanliness..."
                  className="w-full p-3 rounded-xl border border-[#eee4d8] bg-[#f7f3ed] text-xs text-[#1d1b17] focus:outline-none focus:border-[#80543a]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setReviewModalVisit(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8c8074] hover:text-[#1d1b17]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => reviewMutation.mutate()}
                  disabled={reviewMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#80543a] text-white text-xs font-bold hover:bg-[#60391F] disabled:opacity-50"
                >
                  {reviewMutation.isPending ? "Submitting..." : "Submit (+15 pts)"}
                </button>
              </div>
            </div>
          </div>
        )}
        <DestructiveConfirmModal
          open={showLeaveModal}
          onOpenChange={setShowLeaveModal}
          title={`Leave queue at ${activeQueue?.salonName}?`}
          description={`You will forfeit token ${activeQueue?.tokenCode} and give up your place in line.`}
          consequences={[
            "Your reserved chair countdown will be canceled immediately.",
            "You will need to take a new token if you return.",
          ]}
          confirmButtonLabel="Confirm Leave Queue"
          onConfirm={handleLeaveQueue}
        />
      </main>

      <Footer />
    </div>
  );
}

export default CustomerDashboardPage;
