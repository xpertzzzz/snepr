import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getSalonDetails } from "../../backend/functions/salons";
import { joinQueue } from "../../backend/functions/queues";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Clock, Star, MapPin, CheckCircle2, ShieldCheck, Zap, Scissors,
  Users, Award, ChevronLeft, AlertCircle, Info, Sparkles, MessageSquare,
  Check, Phone, Navigation, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/live/salon/$id")({
  head: () => ({
    meta: [
      { title: "Salon Queue & Services | Snepr" },
      { name: "description", content: "Know the queue before you go. Live wait times, verified barber ratings, and transparent prices." },
    ],
  }),
  component: PublicSalonDetailPage,
});

type TabType = "services" | "barbers" | "reviews" | "hours";

function PublicSalonDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);

  const { data: salon, isLoading } = useQuery({
    queryKey: ["salon-detail", id],
    queryFn: async () => (await getSalonDetails({ data: Number(id) })) as any,
    refetchInterval: 10000, // Refresh live queue every 10s
  });

  const joinMutation = useMutation({
    mutationFn: () =>
      joinQueue({
        data: {
          salonId: Number(id),
          serviceId: selectedServiceId ?? undefined,
          staffId: selectedBarberId ?? undefined,
        },
      }),
    onSuccess: (queueEntry) => {
      toast.success(`Joined queue! Your token is #${queueEntry.tokenNumber}`);
      navigate({ to: "/live/queue", search: { queueId: queueEntry.id } });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to join queue. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-ink">Checking live salon queue…</p>
        <p className="text-xs text-ink-soft mt-1">Connecting to salon chair sensors & tokens</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-ink">Salon Not Found</h2>
        <p className="text-xs text-ink-soft mt-1 mb-5">This salon might be temporarily closed or unlisted.</p>
        <Link to="/live" className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl">
          Return to Live Salons
        </Link>
      </div>
    );
  }

  const services = salon.services || [];
  const barbers = salon.barbers || [];
  const reviewsList = salon.reviews || [];
  const selectedService = services.find((s: any) => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find((b: any) => b.id === selectedBarberId);

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 text-ink font-sans pb-28">
      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/live"
            className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink transition-colors active:scale-95 border border-border/50"
            aria-label="Back to salons"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-bold text-base text-ink font-display truncate leading-tight">
              {salon.name}
            </h1>
            <p className="text-[11px] text-ink-soft truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0 text-primary" />
              <span>{salon.address || "Bhubaneswar, Odisha"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border",
              salon.status === "open"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                salon.status === "open" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              )}
            />
            {salon.status === "open" ? "Queue Open" : "Closed"}
          </span>
        </div>
      </header>

      {/* ─── HERO LIVE QUEUE CARD (PILLAR 1: TRUST & RELIABILITY) ─── */}
      <section className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <div className="bg-gradient-to-br from-card to-surface border border-border/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  Know Before You Go
                </span>
                <span className="text-[11px] text-ink-soft flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ink-soft" />
                  <span>Updated {salon.lastUpdatedAt || "just now"}</span>
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-ink tracking-tight">
                  {salon.waitingCount}
                </span>
                <span className="text-lg font-bold text-ink-soft">
                  {salon.waitingCount === 1 ? "customer waiting" : "customers waiting"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-ink-soft">
                <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-xl border border-border">
                  <span className="font-semibold text-ink">Est. Wait:</span>
                  <span className="font-bold text-primary font-mono">
                    ~{salon.estimatedWaitTimeMins} mins
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-xl border border-border">
                  <span className="font-semibold text-ink">Now In Chair:</span>
                  <span className="font-mono font-bold text-amber-600">
                    #{salon.currentServingToken || "101"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Rating Summary */}
            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-border/80 pt-4 sm:pt-0 sm:pl-6 flex sm:flex-col justify-between items-center sm:items-end">
              <div>
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-2xl font-mono">
                  <span>{salon.rating || "4.8"}</span>
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <p className="text-[11px] text-ink-soft mt-0.5">
                  {salon.reviewCount || 140}+ verified reviews
                </p>
              </div>

              <div className="text-[10px] text-ink-soft/80 flex items-center gap-1 sm:mt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Verified Salon</span>
              </div>
            </div>
          </div>

          {/* Uncertainty Notice (Per Strategy Report Section 8) */}
          <div className="mt-5 pt-3.5 border-t border-border/60 flex items-start gap-2 text-[11px] text-ink-soft">
            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              Wait times are dynamic estimates based on live barber pace. Tokens are issued sequentially on the backend.
            </span>
          </div>
        </div>

        {/* ─── SNEPR POINTS LOYALTY CALLOUT (STRATEGY REPORT SECTION 10) ─── */}
        <div className="mt-3.5 bg-primary/10 border border-primary/20 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-ink text-[12px]">Snepr Fair Loyalty Points</p>
              <p className="text-[11px] text-ink-soft">
                Earn <span className="font-bold text-primary">+5 Points</span> on haircut completion &amp;{" "}
                <span className="font-bold text-primary">+10 Points</span> for an honest verified review (1–5★ rewarded equally).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE NAVIGATION TABS ─── */}
      <section className="px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <div className="flex border-b border-border bg-background rounded-2xl p-1 gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab("services")}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
              activeTab === "services"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface-2"
            )}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Services &amp; Menu</span>
          </button>

          <button
            onClick={() => setActiveTab("barbers")}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
              activeTab === "barbers"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface-2"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Barbers ({barbers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
              activeTab === "reviews"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface-2"
            )}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab("hours")}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
              activeTab === "hours"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface-2"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hours &amp; Info</span>
          </button>
        </div>

        {/* ─── TAB CONTENT 1: SERVICES & MENU ─── */}
        {activeTab === "services" && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Select a Service (Optional)
              </h2>
              <span className="text-[11px] text-ink-soft">Fixed salon rates • No surge</span>
            </div>

            <div className="space-y-2.5">
              {services.map((svc: any) => {
                const isSelected = selectedServiceId === svc.id;
                const priceRs = Math.round(svc.price / 100);
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedServiceId(isSelected ? null : svc.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border hover:border-primary/40 hover:bg-surface"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-ink">{svc.name}</h3>
                        {svc.discountPercent > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {svc.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-soft flex items-center gap-2">
                        <span>~{svc.durationMins || 30} mins</span>
                        <span>•</span>
                        <span>Full salon styling</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-ink font-mono">
                        Rs. {priceRs}
                      </span>
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-border text-transparent"
                        )}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 2: BARBERS & PUBLIC REPUTATION (PILLAR 2) ─── */}
        {activeTab === "barbers" && (
          <div className="mt-4 space-y-3">
            <div className="px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Meet the Stylists
              </h2>
              <p className="text-[11px] text-ink-soft">
                Public barber profiles and real-time chair availability. Subscriptions never alter ratings.
              </p>
            </div>

            <div className="grid gap-3">
              {barbers.map((b: any) => {
                const isSelected = selectedBarberId === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBarberId(isSelected ? null : b.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border hover:border-primary/40 hover:bg-surface"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7A4B29] to-[#D4A373] text-white flex items-center justify-center font-bold text-base shadow-sm">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-ink">{b.name}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-ink-soft border border-border">
                            {b.role}
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft mt-0.5">{b.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
                            ★ {b.rating}
                          </span>
                          <span className="text-[10px] text-ink-soft">
                            ({b.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={cn(
                          "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1",
                          b.isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        )}
                      >
                        {b.isAvailable ? "Available Now" : "In Chair"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 3: VERIFIED REVIEWS & DISPUTES ─── */}
        {activeTab === "reviews" && (
          <div className="mt-4 space-y-3">
            <div className="px-1 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Verified Visit Reviews
                </h2>
                <p className="text-[11px] text-ink-soft">
                  Reviews are strictly verified from completed salon queue visits.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reviewsList.map((rev: any) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-ink">{rev.customerName}</span>
                      {rev.isVerified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Visit
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < rev.rating ? "fill-amber-500 text-amber-500" : "text-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-ink leading-relaxed">{rev.comment}</p>

                  {/* Owner response if available */}
                  {rev.ownerReply && (
                    <div className="p-3 bg-surface-2 border border-border/80 rounded-xl text-xs space-y-1 mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Salon Owner Response:
                      </p>
                      <p className="text-ink-soft text-[11px]">{rev.ownerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 4: HOURS & INFO ─── */}
        {activeTab === "hours" && (
          <div className="mt-4 space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Operating Hours</span>
              </h3>
              <div className="text-xs text-ink-soft space-y-2 divide-y divide-border/60">
                <div className="flex justify-between pt-1">
                  <span>Monday – Friday</span>
                  <span className="font-bold text-ink">9:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Saturday – Sunday</span>
                  <span className="font-bold text-ink">8:30 AM – 9:30 PM</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Location &amp; Directions</span>
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                {salon.address || "Patia / Nandankanan Road, Bhubaneswar, Odisha"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ─── STICKY BOTTOM ACTION BAR (JOIN LIVE QUEUE) ─── */}
      <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-border p-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] text-ink-soft uppercase tracking-wider font-semibold">
              {selectedService ? selectedService.name : "First Available Service"}
            </p>
            <p className="text-lg font-extrabold text-ink font-mono">
              Rs. {selectedService ? Math.round(selectedService.price / 100) : "250"}
              {selectedBarber && (
                <span className="text-xs font-normal text-ink-soft ml-2">
                  with {selectedBarber.name}
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending || salon.status !== "open"}
            className="press flex-1 max-w-xs h-13 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {joinMutation.isPending ? (
              <span>Generating Token…</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Join Live Queue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicSalonDetailPage;
