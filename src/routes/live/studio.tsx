import { createFileRoute, Link } from "@tanstack/react-router";
import { getStudioCatalogue, findSalonsForStyle, type StudioHairstyle } from "../../backend/functions/studio";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Sparkles, Search, Filter, Scissors, Clock, MapPin, Zap, ChevronLeft,
  ShieldCheck, ArrowRight, Heart, Share2, AlertCircle, X, Camera, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DockNavbar } from "@/components/layout/DockNavbar";

export const Route = createFileRoute("/live/studio")({
  head: () => ({
    meta: [
      { title: "AI Snepr Studio | Hairstyle Discovery & Salon Matching" },
      { name: "description", content: "Explore curated hairstyle inspiration for men, women, and kids. Match any style directly to live salons near you." },
    ],
  }),
  component: AIStudioPage,
});

function AIStudioPage() {
  const [selectedGender, setSelectedGender] = useState<"men" | "women" | "kids">("men");
  const [selectedLength, setSelectedLength] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedLookIds, setSavedLookIds] = useState<string[]>([]);
  
  // Salon match modal state
  const [matchModalLook, setMatchModalLook] = useState<StudioHairstyle | null>(null);

  // Photo-assisted try-on modal state
  const [tryonModalLook, setTryonModalLook] = useState<StudioHairstyle | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);

  const { data: catalogue, isLoading } = useQuery({
    queryKey: ["studio-catalogue", selectedGender, selectedLength, selectedCategory, searchQuery],
    queryFn: () =>
      getStudioCatalogue({
        data: {
          gender: selectedGender,
          length: selectedLength !== "all" ? selectedLength : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        },
      }),
  });

  const { data: matchingSalons, isLoading: loadingSalons } = useQuery<any[]>({
    queryKey: ["matching-salons", matchModalLook?.matchedServiceName],
    queryFn: async () => {
      const res = await findSalonsForStyle({
        data: { matchedServiceName: matchModalLook?.matchedServiceName || "Haircut" },
      });
      return Array.isArray(res) ? res : [];
    },
    enabled: !!matchModalLook,
  });

  const toggleSaveLook = (id: string) => {
    setSavedLookIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast.success(
      savedLookIds.includes(id) ? "Removed from saved looks" : "Saved look to your profile"
    );
  };

  return (
    <div className="min-h-screen bg-surface-2 text-ink font-sans pb-24">
      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/live"
            className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink transition-colors active:scale-95 border border-border/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-base text-ink font-display flex items-center gap-2">
              <span>AI Snepr Studio</span>
              <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                Catalogue
              </span>
            </h1>
            <p className="text-[11px] text-ink-soft">
              Find your look • Connect to live salon queues
            </p>
          </div>
        </div>

        <Link
          to="/live"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>Live Salons</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ─── HERO BANNER ─── */}
      <section className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#2A1D15] to-[#1A1714] border border-[#7A4B29]/40 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-xl relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D4A373]/20 text-[#D4A373] border border-[#D4A373]/30">
              <Sparkles className="w-3 h-3" />
              Pillar 3: AI Style Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Know the style before you go.
            </h2>
            <p className="text-xs text-[#A69F96] leading-relaxed">
              Curated hairstyle taxonomies across Men's, Women's, and Guardian-Aware Kids' cuts.
              Select any look to instantly see verified salons in your city equipped to execute it.
            </p>
          </div>
        </div>

        {/* ─── AUDIENCE SELECTOR PILLS ─── */}
        <div className="mt-5 flex gap-2 p-1 bg-background rounded-2xl border border-border shadow-sm">
          {[
            { id: "men", label: "Men's Collection", icon: "💇‍♂️" },
            { id: "women", label: "Women's Collection", icon: "✨" },
            { id: "kids", label: "Kids (Guardian Aware)", icon: "🎒" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedGender(tab.id as any)}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                selectedGender === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-ink-soft hover:text-ink hover:bg-surface-2"
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── SEARCH & FILTER ROW ─── */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search aesthetics, cuts (e.g. Wolf Cut, Old Money, French Bob)..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Length Filter */}
            <select
              value={selectedLength}
              onChange={(e) => setSelectedLength(e.target.value)}
              className="bg-card border border-border text-ink text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="all">All Lengths</option>
              <option value="buzz">Buzz / Ultra-short</option>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-card border border-border text-ink text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="trend">Trend-Led</option>
              <option value="classic">Timeless Classics</option>
              <option value="aesthetic">Aesthetic Moods</option>
              <option value="color">Colour &amp; Highlights</option>
            </select>
          </div>
        </div>

        {/* ─── HAIRSTYLE CATALOGUE GRID ─── */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 py-12 text-center text-xs text-ink-soft font-semibold">
              Loading curated styles…
            </div>
          ) : catalogue && catalogue.length > 0 ? (
            catalogue.map((look) => {
              const isSaved = savedLookIds.includes(look.id);
              return (
                <div
                  key={look.id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {look.category}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-2 text-ink-soft border border-border">
                            {look.length} length
                          </span>
                          {look.guardianAware && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Guardian Safe
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-ink">{look.title}</h3>
                      </div>

                      <button
                        onClick={() => toggleSaveLook(look.id)}
                        className="p-2 rounded-xl text-ink-soft hover:text-red-500 hover:bg-surface-2 transition-colors"
                        aria-label="Save look"
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4",
                            isSaved ? "fill-red-500 text-red-500" : "text-ink-soft"
                          )}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-ink-soft leading-relaxed">
                      {look.description}
                    </p>

                    <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5 text-[10px] text-ink-soft">
                      <span className="font-semibold text-ink">Aesthetic:</span>
                      <span className="text-primary font-bold">{look.aesthetic}</span>
                      <span>•</span>
                      <span>Prep: {look.maintenanceTime}</span>
                      {look.beardCompatible && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-semibold">Beard Match</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border flex items-center gap-2">
                    <button
                      onClick={() => setMatchModalLook(look)}
                      className="flex-1 py-2.5 px-3 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Find Salons for This Look</span>
                    </button>

                    <button
                      onClick={() => setTryonModalLook(look)}
                      className="py-2.5 px-3 bg-surface-2 hover:bg-surface-3 text-ink font-semibold text-xs rounded-xl transition-colors border border-border flex items-center gap-1"
                      title="Photo-Assisted Try-On"
                    >
                      <Camera className="w-3.5 h-3.5 text-primary" />
                      <span>Try-On</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 py-12 text-center text-xs text-ink-soft">
              No styles found matching current filters.
            </div>
          )}
        </div>
      </section>

      {/* ─── MODAL 1: FIND SALONS MATCHING SERVICE ─── */}
      {matchModalLook && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-ink">
                  Salons for "{matchModalLook.title}"
                </h3>
                <p className="text-xs text-ink-soft">
                  Service Match: <span className="text-primary font-semibold">{matchModalLook.matchedServiceName}</span>
                </p>
              </div>
              <button
                onClick={() => setMatchModalLook(null)}
                className="w-8 h-8 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {loadingSalons ? (
                <p className="py-6 text-center text-xs text-ink-soft">Checking salon queues…</p>
              ) : matchingSalons && matchingSalons.length > 0 ? (
                matchingSalons.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl bg-surface-2 border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-ink text-sm">{s.name}</h4>
                      <p className="text-[11px] text-ink-soft mt-0.5">{s.address || "Bhubaneswar"}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-amber-500 font-bold font-mono">
                          ★ {s.rating || "4.8"}
                        </span>
                        <span>•</span>
                        <span className="text-primary font-bold font-mono">
                          ~₹{s.priceRs}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {s.waitingCount || 0} in queue (~{s.waitTimeMins || 10}m)
                      </span>
                      <Link
                        to="/live/salon/$id"
                        params={{ id: String(s.id) }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg shadow-sm hover:bg-primary-hover transition-all"
                      >
                        Join Queue
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-ink-soft">No active salons found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: RESPONSIBLE AI PHOTO TRY-ON SANDBOX (SECTION 13) ─── */}
      {tryonModalLook && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base text-ink">AI Smart Style Try-On</h3>
              </div>
              <button
                onClick={() => {
                  setTryonModalLook(null);
                  setPhotoConsent(false);
                }}
                className="w-8 h-8 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
              <p className="font-bold text-ink text-[12px]">Target Style: {tryonModalLook.title}</p>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                {tryonModalLook.description}
              </p>
            </div>

            {/* Strategy Report Section 13: Privacy, Security & Responsible AI */}
            <div className="p-3 bg-surface-2 border border-border rounded-xl space-y-2 text-[11px] text-ink-soft">
              <div className="flex items-start gap-2 text-ink font-semibold">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Responsible AI &amp; Privacy Notice</span>
              </div>
              <p>
                • AI previews are for inspiration, not a guarantee of the salon outcome.
                <br />
                • Photos uploaded are processed securely in temporary memory and can be deleted instantly by you.
                <br />
                • Facial biometric signatures are never sold or stored permanently.
              </p>
              <label className="flex items-center gap-2 pt-1 font-semibold text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={photoConsent}
                  onChange={(e) => setPhotoConsent(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span>I consent to temporary image processing for hairstyle try-on</span>
              </label>
            </div>

            <div className="border-2 border-dashed border-border/80 rounded-2xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors">
              <Camera className="w-8 h-8 text-primary mx-auto" />
              <p className="font-bold text-ink">Upload a clear front-facing portrait</p>
              <p className="text-[10px] text-ink-soft">JPEG or PNG, good lighting, neutral expression</p>
            </div>

            <button
              disabled={!photoConsent}
              onClick={() => {
                toast.success("AI Studio model loading preview for " + tryonModalLook.title);
                setTryonModalLook(null);
                setPhotoConsent(false);
              }}
              className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-foreground font-bold rounded-xl transition-all text-xs"
            >
              Generate AI Hairstyle Inspiration
            </button>
          </div>
        </div>
      )}
      {/* Dock-styled bottom navigation */}
      <div className="h-24" />
      <DockNavbar activeTab="studio" />
    </div>
  );
}


export default AIStudioPage;
