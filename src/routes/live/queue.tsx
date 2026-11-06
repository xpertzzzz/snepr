import { createFileRoute, Link, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getTokenDetailsAtomic, cancelQueueAtomic } from "@/lib/queue-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  AlertCircle,
  MapPin,
  Navigation,
  Compass,
  Scissors,
  Armchair,
  RefreshCw,
  Phone,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/live/queue")({
  head: () => ({
    title: "Digital Queue Pass & Chair Progress | Snepr",
    meta: [
      {
        name: "description",
        content:
          "Your live digital queue pass with 5 stage progress countdown and GPS navigation to your salon.",
      },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: AppQueue,
});

export function AppQueue() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ token?: string; id?: string; $token?: string; $id?: string }>();
  const search = useSearch() as { queueId?: string | number; token?: string };

  const rawToken =
    params.token ||
    params.$token ||
    params.id ||
    params.$id ||
    search.token ||
    search.queueId ||
    "A07";

  const tokenString = String(rawToken).toUpperCase();

  // Local state initialized or hydrated from localStorage
  const [tokenData, setTokenData] = useState(() => {
    try {
      const stored = localStorage.getItem("snepr_active_queue");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.tokenCode === tokenString || String(parsed.tokenNumber) === tokenString) {
          return parsed;
        }
      }
    } catch {}

    return {
      tokenCode: tokenString.startsWith("#") ? tokenString : `#${tokenString}`,
      tokenNumber: parseInt(tokenString.replace(/\D/g, "") || "7", 10),
      salonName: "The Scissors Edge",
      address: "Plot 142, Janpath Road, Saheed Nagar, Bhubaneswar",
      serviceName: "Signature Haircut & Beard Sculpt",
      barberName: "Sameer Mohanty",
      chairAssigned: "Chair 02",
      stage: 2, // 1 to 5
      position: 2,
      peopleAhead: 1,
      waitTimeMins: 12,
      status: "waiting", // waiting | serving | completed | cancelled
      createdAt: new Date().toISOString(),
    };
  });

  const [lastSynced, setLastSynced] = useState("Just now");

  // Poll Supabase every 3 seconds for server-authoritative live status
  const { data: serverStatus, dataUpdatedAt } = useQuery({
    queryKey: ["queue-status", tokenString],
    queryFn: async () => {
      try {
        const details = await getTokenDetailsAtomic(tokenString);
        if (details && details.success) {
          return details;
        }
      } catch (err) {
        console.warn("Could not fetch remote token status:", err);
      }
      return null;
    },
    refetchInterval: 3000,
  });

  useEffect(() => {
    const d = new Date();
    setLastSynced(d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

    if (serverStatus && serverStatus.success) {
      setTokenData((prev: any) => ({
        ...prev,
        ...serverStatus,
        queueId: serverStatus.queue?.id || prev.queueId,
      }));
    }
  }, [serverStatus, dataUpdatedAt]);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const qId = tokenData.queue?.id || tokenData.queueId;
      if (qId) {
        await cancelQueueAtomic(qId, "Customer cancelled via mobile pass", "customer");
      }
    },
    onSuccess: () => {
      try {
        localStorage.removeItem("snepr_active_queue");
      } catch {}
      toast.info("You have left the queue.");
      navigate({ to: "/live" });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel queue entry.");
    },
  });

  const isCompleted = tokenData.stage === 5 || tokenData.status === "completed";
  const isInChair = tokenData.stage === 4 || tokenData.status === "serving";
  const isApproaching = tokenData.stage === 3;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    tokenData.salonName + " " + tokenData.address
  )}`;

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#211914] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24 max-w-[780px] mx-auto px-4 sm:px-6 w-full space-y-6">
        {/* ─── TOP STATUS PILL & BACK ─── */}
        <div className="flex items-center justify-between">
          <Link
            to="/live"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b5e52] hover:text-[#1d1b17] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Live Queues</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#8c8074]">
              Synced {lastSynced}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                isCompleted
                  ? "bg-[#267447]/10 text-[#267447]"
                  : isInChair
                  ? "bg-[#80543a]/15 text-[#80543a]"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isCompleted
                ? "● COMPLETED"
                : isInChair
                ? "● IN BARBER CHAIR"
                : isApproaching
                ? "● YOUR TURN SOON"
                : `● IN QUEUE (#${tokenData.position} IN LINE)`}
            </span>
          </div>
        </div>

        {/* ─── TOKEN PASS HERO CARD ─── */}
        <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#80543a] mb-1">
            {tokenData.salonName}
          </div>
          <div className="text-xs text-[#6b5e52] mb-6 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#80543a]" />
            <span>{tokenData.address}</span>
          </div>

          {/* TOKEN HERO BADGE */}
          <div className="inline-block bg-[#f7f3ed] border border-[#eee4d8] rounded-3xl p-6 sm:p-8 min-w-[240px] my-2 shadow-inner">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#8c8074]">
              YOUR DIGITAL PASS
            </div>
            <div className="text-5xl sm:text-6xl font-black font-serif tracking-tight text-[#1d1b17] my-1">
              {tokenData.tokenCode}
            </div>
            <div className="text-xs font-bold text-[#80543a] mt-1">
              {tokenData.serviceName}
            </div>
          </div>

          {/* TELEMETRY METRICS */}
          <div className="grid grid-cols-3 gap-3 my-6 max-w-lg mx-auto">
            <div className="p-3 bg-[#f7f3ed] rounded-2xl border border-[#eee4d8]">
              <div className="text-[10px] font-bold text-[#8c8074] uppercase">Position</div>
              <div className="text-lg font-serif font-bold text-[#1d1b17] mt-0.5">
                {isCompleted ? "Done" : isInChair ? "In Chair" : `#${tokenData.position}`}
              </div>
            </div>

            <div className="p-3 bg-[#f7f3ed] rounded-2xl border border-[#eee4d8]">
              <div className="text-[10px] font-bold text-[#8c8074] uppercase">Est. Wait</div>
              <div className="text-lg font-serif font-bold text-[#80543a] mt-0.5">
                {isCompleted || isInChair ? "0m" : `~${tokenData.waitTimeMins}m`}
              </div>
            </div>

            <div className="p-3 bg-[#f7f3ed] rounded-2xl border border-[#eee4d8]">
              <div className="text-[10px] font-bold text-[#8c8074] uppercase">Chair &amp; Barber</div>
              <div className="text-xs font-bold text-[#1d1b17] mt-1 truncate">
                {tokenData.chairAssigned}
              </div>
            </div>
          </div>

          {/* ─── 5 STAGE PROGRESS JOURNEY ─── */}
          <div className="pt-6 border-t border-[#eee4d8] text-left max-w-lg mx-auto">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c8074] text-center mb-4">
              5 STAGE LIVE VISIT PROGRESS
            </div>

            <div className="space-y-3">
              {[
                { stage: 1, title: "Pass Generated", desc: "Token confirmed on digital board" },
                { stage: 2, title: `In Queue (#${tokenData.position} in line)`, desc: `${tokenData.peopleAhead} customer ahead · Relax at home or nearby` },
                { stage: 3, title: "Your Turn Approaching", desc: "Depart for salon now · Assigned chair is preparing" },
                { stage: 4, title: "In Barber Chair", desc: `${tokenData.barberName} is serving your haircut & styling` },
                { stage: 5, title: "Service Completed", desc: "Loyalty rewards unlocked · Verified review (+10 Points)" },
              ].map((step) => {
                const isPassed = tokenData.stage > step.stage;
                const isCurrent = tokenData.stage === step.stage;

                return (
                  <div
                    key={step.stage}
                    className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                      isCurrent
                        ? "bg-[#f7f3ed] border border-[#80543a]/40 shadow-xs"
                        : "opacity-80"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPassed
                          ? "bg-[#267447] text-white"
                          : isCurrent
                          ? "bg-[#80543a] text-white ring-4 ring-[#80543a]/20"
                          : "bg-[#eee4d8] text-[#8c8074]"
                      }`}
                    >
                      {isPassed ? "✓" : step.stage}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-[#80543a]"
                            : isPassed
                            ? "text-[#1d1b17]"
                            : "text-[#8c8074]"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-[11px] text-[#6b5e52] mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── ACTION FOOTER ─── */}
          <div className="pt-6 mt-6 border-t border-[#eee4d8] flex items-center justify-center gap-4">
            {isCompleted ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-full bg-[#267447] text-white text-xs font-bold hover:bg-[#1f5c38] transition-all shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Claim +10 Points &amp; Write Review</span>
              </Link>
            ) : (
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="text-xs font-bold text-[#8c8074] hover:text-red-700 transition-colors cursor-pointer"
              >
                Cannot make it? Leave Queue
              </button>
            )}
          </div>
        </div>

        {/* ─── GPS ROUTE & SALON NAVIGATION CARD ─── */}
        <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eee4d8]">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#80543a]">
                GPS NAVIGATION
              </div>
              <h3 className="text-sm font-bold text-[#1d1b17]">Route to {tokenData.salonName}</h3>
            </div>
            <span className="text-xs font-bold text-[#267447] bg-[#eaf3ec] px-3 py-1 rounded-full">
              ~6 mins travel time
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#eee4d8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-[#80543a]" />
              <span className="font-semibold text-[#1d1b17]">{tokenData.address}</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#1d1b17] text-[#f5f1e9] font-bold text-xs hover:bg-[#3d322a] transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open in Google Maps ↗</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AppQueue;
