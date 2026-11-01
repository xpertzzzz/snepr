import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getQueueStatus, cancelQueueToken } from "../../backend/functions/queues";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft, Sparkles, CheckCircle2, Clock, XCircle, Star, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DockNavbar } from "@/components/layout/DockNavbar";

export const Route = createFileRoute("/live/queue")({
  head: () => ({
    meta: [
      { title: "Live Digital Queue Token | Snepr" },
      { name: "description", content: "Your real-time digital queue pass with live estimated wait time." },
    ],
  }),
  component: AppQueue,
});

function AppQueue() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = Route.useSearch() as { queueId?: number };
  const queueId = search.queueId;

  const { data: queue, isLoading } = useQuery({
    queryKey: ["queue", queueId],
    queryFn: () => getQueueStatus({ data: Number(queueId) }),
    enabled: !!queueId,
    refetchInterval: 5000, // Refresh every 5s for live updates
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelQueueToken({ data: { queueId: Number(queueId) } }),
    onSuccess: () => {
      toast.success("Queue token cancelled");
      queryClient.invalidateQueries({ queryKey: ["queue", queueId] });
    },
  });

  if (!queueId) {
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-ink">No Active Queue Token</h2>
        <p className="text-xs text-ink-soft mt-1 mb-5">Please select a salon and join their digital queue.</p>
        <Link to="/live" className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl">
          Browse Live Salons
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse mb-3">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-ink">Verifying digital token…</p>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-12 h-12 text-ink-soft mb-3" />
        <h2 className="text-xl font-bold text-ink">Token Not Found</h2>
        <p className="text-xs text-ink-soft mt-1 mb-5">This queue pass may have been completed or cancelled.</p>
        <Link to="/live" className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl">
          Return to Salons
        </Link>
      </div>
    );
  }

  const isCompleted = queue.status === "completed";
  const isInChair = queue.status === "in-progress";
  const isCancelled = queue.status === "cancelled";

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 text-ink font-sans pb-10">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/live"
            className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink transition-colors active:scale-95 border border-border/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-base text-ink font-display">Live Digital Token</h1>
        </div>

        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
            isCompleted
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : isInChair
              ? "bg-primary/10 text-primary border-primary/20"
              : isCancelled
              ? "bg-red-500/10 text-red-600 border-red-500/20"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          )}
        >
          {queue.status}
        </span>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col items-center justify-center space-y-6">
        {/* Ticket Card */}
        <div className="w-full bg-card rounded-[32px] shadow-lg border border-border/60 relative overflow-hidden text-center">
          {/* Top Ticket Header */}
          <div className="p-8 pb-5 border-b-2 border-dashed border-border/70 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft font-bold">
              Snepr Verified Queue Pass
            </span>
            <div className="text-[76px] font-display font-black tracking-tight text-ink leading-none py-2">
              #{queue.tokenNumber}
            </div>
            <p className="text-xs text-ink-soft">
              {isInChair
                ? "You are currently in the chair!"
                : isCompleted
                ? "Your visit is complete"
                : `Est. wait ~${queue.estimatedWaitMins || 15} minutes`}
            </p>
          </div>

          {/* Ticket Body / Status */}
          <div className="p-6 bg-surface-2 space-y-3">
            {isCompleted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs space-y-2">
                <p className="font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>+5 Snepr Points Credited!</span>
                </p>
                <p className="text-ink-soft text-[11px]">
                  Write an honest verified review to claim another <span className="font-bold text-ink">+10 Snepr Points</span>.
                </p>
                <Link
                  to="/live/activity"
                  className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Write Review &amp; Claim +10 Points
                </Link>
              </div>
            ) : isCancelled ? (
              <p className="text-xs text-red-500 font-semibold">
                This token was cancelled.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-ink-soft px-1">
                  <span className={cn(queue.status === "waiting" && "font-bold text-ink")}>
                    1. Waiting in Queue
                  </span>
                  <span className={cn(isInChair && "font-bold text-primary")}>
                    2. In Chair
                  </span>
                  <span>3. Done</span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-primary transition-all duration-700 rounded-full",
                      isInChair ? "w-2/3" : "w-1/3"
                    )}
                  />
                </div>

                <p className="text-[11px] text-ink-soft leading-relaxed pt-1">
                  Keep this tab open or return to the salon before your token is called.
                </p>
              </div>
            )}
          </div>

          {/* Decorative side ticket notches */}
          <div className="absolute top-[170px] -left-3.5 w-7 h-7 bg-surface-2 rounded-full border-r border-border" />
          <div className="absolute top-[170px] -right-3.5 w-7 h-7 bg-surface-2 rounded-full border-l border-border" />
        </div>

        {/* Cancellation action if still waiting */}
        {queue.status === "waiting" && (
          <button
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="text-xs text-ink-soft hover:text-red-500 font-semibold transition-colors"
          >
            Cannot make it? Leave Queue
          </button>
        )}
      </main>

      {/* Dock-styled bottom navigation */}
      <div className="h-24" />
      <DockNavbar activeTab="pass" />
    </div>
  );
}
