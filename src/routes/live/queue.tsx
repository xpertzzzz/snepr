import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getQueueStatus, cancelQueueToken } from "../../backend/functions/queues";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LiquidBottomNav } from "@/components/navigation/LiquidBottomNav";

export const Route = createFileRoute("/live/queue")({
  head: () => ({
    title: "Live Digital Queue Token & GPS Route | Snepr",
    meta: [
      {
        name: "description",
        content: "Your real-time digital queue pass with 5-stage countdown and GPS navigation to your salon.",
      },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: AppQueue,
});

export function AppQueue() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = Route.useSearch() as { queueId?: number };
  const queueId = search.queueId;

  // Local fallback queue state if no query parameter
  const [localToken, setLocalToken] = useState({
    id: 101,
    tokenNumber: 24,
    salonName: "Lakmé Salon — For Him and Her",
    address: "KIIT Road, opposite Manyavar, Patia, Bhubaneswar",
    service: "Hair styling & beard sculpt",
    stage: 2, // 1 to 5
    position: 2,
    waitTimeMins: 14,
    chairAssigned: "Station 1",
  });

  const { data: queue, isLoading } = useQuery({
    queryKey: ["queue", queueId],
    queryFn: () => getQueueStatus({ data: Number(queueId) }),
    enabled: !!queueId,
    refetchInterval: 5000,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelQueueToken({ data: { queueId: Number(queueId) } }),
    onSuccess: () => {
      toast.success("Queue token cancelled");
      queryClient.invalidateQueries({ queryKey: ["queue", queueId] });
      navigate({ to: "/live" });
    },
  });

  const tokenNum = queue?.tokenNumber || localToken.tokenNumber;
  const status = queue?.status || "WAITING";
  const isCompleted = status === "completed" || status === "COMPLETED";
  const isInChair = status === "in-progress" || status === "SERVING";
  const isCancelled = status === "cancelled" || status === "CANCELLED";

  // Compute 5-stage progress:
  // 1: Ticket Confirmed, 2: In Queue, 3: Head to Salon, 4: In Chair, 5: Completed
  const currentStage = isCompleted ? 5 : isInChair ? 4 : localToken.position <= 1 ? 3 : 2;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#211912] font-sans pb-28 selection:bg-[#EAD8BD]">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EEE5DA] px-4 py-3 sm:px-8">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/live"
              className="w-9 h-9 rounded-full bg-white border border-[#EEE5DA] flex items-center justify-center text-[#211912] hover:bg-[#F5EEE7] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#70472F]">
                LIVE TICKET
              </div>
              <h1 className="font-bold text-sm text-[#211912]">My Digital Queue Pass</h1>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isCompleted
                ? "bg-[#EAF3EC] text-[#267447] border-[#267447]/20"
                : isInChair
                ? "bg-[#F1E8DF] text-[#70472F] border-[#70472F]/20"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isCompleted ? "Completed" : isInChair ? "In Chair" : `In Queue (#${localToken.position})`}
          </span>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-5">
        {/* PASS CARD */}
        <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-sm border border-[#EEE5DA] relative overflow-hidden text-center p-6 sm:p-7">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#8C8074]">
            {localToken.salonName}
          </div>
          <div className="text-xs text-[#8C8074] mt-0.5">{localToken.address}</div>

          <div className="my-5">
            <span className="text-xs font-semibold text-[#8C8074] block">YOUR TOKEN NUMBER</span>
            <div className="text-6xl font-black font-serif tracking-tight text-[#211912] leading-none my-1">
              #{tokenNum < 100 ? `0${tokenNum}` : tokenNum}
            </div>
            <div className="text-xs font-medium text-[#70472F]">
              {isInChair
                ? "Stylist is currently cutting your hair!"
                : isCompleted
                ? "Your visit is complete"
                : `~${localToken.waitTimeMins} minutes estimated wait (${localToken.position} customer${
                    localToken.position === 1 ? "" : "s"
                  } ahead)`}
            </div>
          </div>

          {/* 5-STAGE PROGRESS INDICATOR */}
          <div className="pt-4 pb-2 border-t border-[#EEE5DA] text-left">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C8074] mb-3 text-center">
              5-STAGE VISIT STATUS
            </div>

            <div className="space-y-3">
              {[
                { stage: 1, label: "Ticket Confirmed", desc: "Pass generated and verified" },
                { stage: 2, label: `In Queue (#${localToken.position} in line)`, desc: "Position locked in live chair telemetry" },
                { stage: 3, label: "Head to Salon", desc: "Depart now to reach before your turn" },
                { stage: 4, label: "In Chair", desc: "Stylist has called your token" },
                { stage: 5, label: "Completed (+10 Points)", desc: "Service done & loyalty rewards credited" },
              ].map((step) => {
                const isDone = currentStage > step.stage;
                const isCurrent = currentStage === step.stage;

                return (
                  <div key={step.stage} className="flex items-start gap-3 text-xs">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isDone
                          ? "bg-[#477B5D] text-white"
                          : isCurrent
                          ? "bg-[#70472F] text-white ring-4 ring-[#70472F]/15"
                          : "bg-[#EEE5DA] text-[#8C8074]"
                      }`}
                    >
                      {isDone ? "✓" : step.stage}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-bold ${
                          isCurrent
                            ? "text-[#70472F]"
                            : isDone
                            ? "text-[#211912]"
                            : "text-[#8C8074]"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[11px] text-[#8C8074]">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancellation or Review action */}
          <div className="mt-5 pt-4 border-t border-[#EEE5DA]">
            {isCompleted ? (
              <Link
                to="/live/activity"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#477B5D] text-white font-bold text-xs shadow-sm hover:bg-[#38624A]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Write Review &amp; Claim +10 Points</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  toast.info("Queue token cancelled.");
                  navigate({ to: "/live" });
                }}
                className="text-xs font-semibold text-[#8C8074] hover:text-red-700 transition-colors cursor-pointer"
              >
                Cannot make it? Leave Queue
              </button>
            )}
          </div>
        </div>

        {/* GPS ROUTE & DIRECTIONS MAP CARD */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#EEE5DA] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEE5DA]">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#70472F]">
                GPS NAVIGATION
              </div>
              <h2 className="text-sm font-bold text-[#211912]">Route to Salon</h2>
            </div>
            <span className="text-[11px] font-bold text-[#477B5D] bg-[#E8F3EB] px-2.5 py-1 rounded-full">
              1.2 km · ~6 mins
            </span>
          </div>

          {/* Simulated Map View */}
          <div className="h-44 rounded-2xl bg-[#EEE7DD] border border-[#EEE5DA] relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#70472F_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#70472F] text-white flex items-center justify-center mx-auto shadow-md">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#211912]">
                Patia Square → KIIT Road (Opp. Manyavar)
              </div>
              <div className="text-[11px] text-[#8C8074]">
                Turn right at Union Bank junction. 400m straight.
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Lakme+Salon+Patia+Bhubaneswar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0E8DE] border border-[#EEE5DA] text-xs font-bold text-[#70472F] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Open GPS Directions in Google Maps</span>
          </a>
        </div>
      </main>

      {/* ─── LIQUID BOTTOM NAVIGATION ─── */}
      <LiquidBottomNav
        tabs={[
          { id: "explore", label: "Live Queues", icon: "◷" },
          { id: "queue", label: "My Queue", icon: "▱" },
          { id: "studio", label: "AI Studio", icon: "✧" },
          { id: "profile", label: "Profile", icon: "♙" },
        ]}
        activeTab="queue"
        onTabChange={(tabId) => {
          if (tabId === "explore") navigate({ to: "/live" });
          if (tabId === "queue") navigate({ to: "/live/queue" });
          if (tabId === "studio") navigate({ to: "/live/studio" });
          if (tabId === "profile") navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}

export default AppQueue;
