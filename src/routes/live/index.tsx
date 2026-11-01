import { createFileRoute, Link } from "@tanstack/react-router";
import { getSalons } from "../../backend/functions/salons";
import { useEffect, useState } from "react";
import {
  Search, MapPin, Zap, CheckCircle2, Clock, X, Smartphone, Sparkles, ArrowRight, ShieldCheck, Armchair
} from "lucide-react";
import { SneprWordmark } from "@/components/SneprWordmark";
import { cn } from "@/lib/utils";
import { DockNavbar } from "@/components/layout/DockNavbar";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";
import { useLocation } from "@/hooks/useLocation";
import { toast } from "sonner";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { loginWithGoogleServer } from "@/backend/functions/auth";

export const Route = createFileRoute("/live/")({
  head: () => ({
    meta: [
      { title: "Live Salons in Bhubaneswar | Snepr" },
      { name: "description", content: "See live wait times and chair availability at verified Bhubaneswar salons. Join the queue from your phone and walk straight in." },
    ],
    links: [{ rel: "canonical", href: "https://snepr.in/live" }],
  }),
  component: LiveDashboard,
});

type QueueStatus = "available" | "finishing" | "busy";
type FilterOption = "all" | "available" | "shortest";

interface Salon {
  id: number;
  name: string;
  slug?: string;
  address: string | null;
  category: string | null;
  rating: string | null;
  reviewCount: number | null;
  queueStatus: QueueStatus;
  waitTime: number;
  waitingCount?: number;
  totalChairs?: number;
  availableChairs?: number;
  areaId?: number;
  areaName?: string;
  verificationStatus?: "verified" | "unverified";
}

function LiveDashboard() {
  const { location, setLocality, areas } = useLocation();
  const selectedLocalityLabel = location.formattedLabel || "Patia, Bhubaneswar";
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [activeQueue, setActiveQueue] = useState<any | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("snepr_session");
      if (data) setSession(JSON.parse(data));
    } catch {}
  }, []);

  const loadSalons = async () => {
    try {
      const result = await getSalons({
        data: {
          areaId: location.areaId,
          category: activeCategory !== "All" ? activeCategory : undefined,
          search: search.trim() || undefined,
        },
      });
      if (result && Array.isArray(result)) {
        setSalons(result);
      }
    } catch (err) {
      console.error("Failed to load salons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalons();
    const interval = setInterval(loadSalons, 10000);
    return () => clearInterval(interval);
  }, [location.areaId, activeCategory]);

  const categories = [
    { id: "All", name: "All Neighborhood Salons" },
    { id: "Beauty", name: "Beauty & Unisex" },
    { id: "Men", name: "Men's Grooming" },
    { id: "Spa", name: "Hair Spa & Wellness" },
    { id: "Luxury", name: "Luxury Salons" },
  ];

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = result.user ? await result.user.getIdToken() : null;
      if (!idToken) {
        toast.error("Could not retrieve Google ID token.");
        setAuthLoading(false);
        return;
      }

      const res = await loginWithGoogleServer({ data: { idToken } });
      try {
        localStorage.setItem("snepr_session", JSON.stringify(res));
      } catch {}
      setSession(res);
      toast.success("Successfully logged in!");
      setShowAuthModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Google sign-in failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleJoinQueue = (salon: Salon) => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    setActiveQueue({
      salonName: salon.name,
      position: (salon.waitingCount || 0) + 1,
      waitTime: (salon.waitingCount || 0) * 15 + 5,
    });
    setSelectedSalon(null);
    toast.success(`Joined queue at ${salon.name}!`);
  };

  const filteredSalons = salons.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.address && s.address.toLowerCase().includes(q)) ||
        (s.areaName && s.areaName.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    if (activeFilter === "available") {
      return (s.availableChairs ?? 0) > 0 || s.queueStatus === "available";
    }
    if (activeFilter === "shortest") {
      return s.waitTime <= 15;
    }
    return true;
  });

  filteredSalons.sort((a, b) => {
    if (activeFilter === "shortest") return a.waitTime - b.waitTime;
    return (b.availableChairs || 0) - (a.availableChairs || 0) || a.waitTime - b.waitTime;
  });

  const availableNowSalons = salons.filter((s) => s.waitTime === 0 || (s.availableChairs && s.availableChairs > 0)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] font-sans pb-24">
      {/* ─── Top Brand Navbar ─── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D7] px-4 py-3 sm:px-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <SneprWordmark height={32} className="text-[#1B1410]" />
          </Link>

          {/* Locality Selector Pill */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-[#FAF2EA] border border-[#E8E1D7] px-4 py-1.5 rounded-full text-xs font-bold text-[#1B1410] shadow-xs cursor-pointer transition-all hover:border-[#7A4B29]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#7A4B29]" />
            <span className="truncate max-w-[140px] sm:max-w-[220px]">{selectedLocalityLabel}</span>
            <span className="text-[10px] text-[#7A4B29] bg-[#7A4B29]/10 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              Change
            </span>
          </button>

          <div className="flex items-center gap-3">
            {session ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E8E1D7] bg-white text-xs font-bold text-[#7A4B29]">
                👤 {session.name || "Customer"}
              </span>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-xs font-black uppercase tracking-wider text-[#7A4B29] hover:underline cursor-pointer px-3 py-1.5"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 space-y-8">
        {/* Locality Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E8E1D7]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A4B29]/10 text-[#7A4B29] text-[11px] font-bold tracking-wide uppercase mb-1">
              <Sparkles className="w-3 h-3 text-[#C8993E]" />
              Bhubaneswar Live Queues
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B1410] tracking-tight">
              Salons in {location.areaName || "Patia"}
            </h1>
            <p className="text-xs text-[#6B5E55] mt-1">
              Real-time chair occupancy and queue tokens. Know wait times before stepping out.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "all"
                  ? "bg-[#7A4B29] text-white shadow-xs"
                  : "bg-white text-[#1B1410] border border-[#E8E1D7] hover:border-[#7A4B29]"
              }`}
            >
              All ({salons.length})
            </button>
            <button
              onClick={() => setActiveFilter("available")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "available"
                  ? "bg-[#2E7D4F] text-white shadow-xs"
                  : "bg-white text-[#1B1410] border border-[#E8E1D7] hover:border-[#2E7D4F]"
              }`}
            >
              0-Wait / Free Chair
            </button>
            <button
              onClick={() => setActiveFilter("shortest")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "shortest"
                  ? "bg-[#C8993E] text-white shadow-xs"
                  : "bg-white text-[#1B1410] border border-[#E8E1D7] hover:border-[#C8993E]"
              }`}
            >
              Under 15 Mins
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9086]" />
          <input
            type="text"
            placeholder={`Search salons, stylists, or grooming services in ${location.areaName}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white rounded-2xl border border-[#E8E1D7] text-sm text-[#1B1410] placeholder-[#9C9086] focus:outline-none focus:ring-2 focus:ring-[#7A4B29] shadow-xs"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#1B1410] text-white shadow-xs"
                  : "bg-white text-[#6B5E55] border border-[#E8E1D7] hover:border-[#1B1410] hover:text-[#1B1410]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ─── Section: ZERO WAIT / READY NOW CHAIRS ─── */}
        {availableNowSalons.length > 0 && !search && activeFilter === "all" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-wider text-[#2E7D4F]">
                  Ready Now in {location.areaName} (Walk Right In)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableNowSalons.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-[#E8E1D7] shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:border-[#2E7D4F]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#7A4B29] font-black flex items-center justify-center text-xs">
                        {item.name[0]}
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#2E7D4F]/10 text-[#2E7D4F] flex items-center gap-1">
                        <Armchair className="w-3 h-3" />
                        {item.availableChairs ?? 1} Free Chair{(item.availableChairs ?? 1) > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="text-2xl font-black text-[#2E7D4F] leading-none mb-1">
                      0 <span className="text-xs font-bold text-[#6B5E55]">min wait</span>
                    </div>
                    <div className="text-[11px] text-[#8F8177] mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#7A4B29]" />
                      {item.areaName || location.areaName}, Bhubaneswar
                    </div>

                    <h3 className="text-sm font-extrabold text-[#1B1410] truncate mb-1" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="text-xs text-[#6B5E55] mb-3">
                      ⭐ {item.rating || "4.8"} • {item.category || "Unisex Salon"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinQueue(item)}
                    className="w-full py-2 bg-[#2E7D4F] hover:bg-[#23603c] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
                  >
                    WALK IN / JOIN
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Section: ALL SALONS IN SELECTED LOCALITY ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#7A4B29]">
              Verified Salons in {location.areaName} ({filteredSalons.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#8F8177]">Loading salons in {location.areaName}...</div>
          ) : filteredSalons.length === 0 ? (
            <div className="py-20 text-center text-[#8F8177] bg-white rounded-3xl border border-[#E8E1D7] p-8">
              <p className="font-bold text-[#1B1410]">No salons match your search in {location.areaName}.</p>
              <p className="text-xs text-[#8F8177] mt-1">Try switching to another Bhubaneswar neighborhood like KIIT Road or Saheed Nagar.</p>
              <button
                onClick={() => setShowLocationModal(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold"
              >
                Change Locality
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSalons.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-[#E8E1D7] shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:border-[#7A4B29]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#7A4B29] font-black flex items-center justify-center text-base shrink-0 border border-[#E8E1D7]">
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-[#1B1410] leading-snug">{item.name}</h3>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4F]" />
                          </div>
                          <p className="text-xs text-[#8F8177] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#7A4B29]" />
                            {item.areaName || location.areaName} • {item.category || "Salon"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#7A4B29] bg-[#FAF2EA] px-2.5 py-1 rounded-full shrink-0">
                        ⭐ {item.rating || "4.8"}
                      </span>
                    </div>

                    {/* Chair & Queue Status Box */}
                    <div className="flex items-center justify-between bg-[#FAF7F2] p-3 rounded-xl mb-4 border border-[#E8E1D7]">
                      <div>
                        <div className="text-[10px] font-bold text-[#8F8177] uppercase">Est. Wait</div>
                        <div className="text-lg font-black text-[#1B1410]">{item.waitTime} mins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-[#8F8177] uppercase">Chairs</div>
                        <div className="text-xs font-black text-[#2E7D4F]">
                          {item.availableChairs ?? 1}/{item.totalChairs ?? 4} Free
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#8F8177] uppercase">Live Queue</div>
                        <div className="text-sm font-extrabold text-[#7A4B29]">{item.waitingCount || 0} in line</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSalon(item)}
                      className="flex-1 py-2.5 border border-[#E8E1D7] hover:bg-[#FAF7F2] text-[#1B1410] font-bold text-xs rounded-xl transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleJoinQueue(item)}
                      className="flex-1 py-2.5 bg-[#7A4B29] hover:bg-[#5C371D] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
                    >
                      Join Queue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ─── Persistent Active Queue Bar ─── */}
      {activeQueue && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 bg-[#1B1410] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 z-50 border border-[#E8E1D7]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A4B29] flex items-center justify-center text-lg">
              ⏱️
            </div>
            <div>
              <div className="font-extrabold text-xs text-[#C8993E]">Live Token Active</div>
              <div className="font-bold text-sm truncate max-w-[180px]">{activeQueue.salonName}</div>
              <div className="text-[11px] text-white/70">Pos #{activeQueue.position} • ~{activeQueue.waitTime} mins left</div>
            </div>
          </div>
          <button
            onClick={() => setActiveQueue(null)}
            className="text-xs font-bold text-white/60 hover:text-white px-2.5 py-1 rounded-lg bg-white/10"
          >
            Close
          </button>
        </div>
      )}

      {/* ─── Detail Modal ─── */}
      {selectedSalon && (
        <div className="fixed inset-0 z-50 bg-[#1B1410]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-[#E8E1D7]">
            <button
              onClick={() => setSelectedSalon(null)}
              className="absolute top-4 right-4 p-2 text-[#8F8177] hover:text-[#1B1410]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#7A4B29]/10 text-[#7A4B29] font-black text-xl flex items-center justify-center mb-3">
              {selectedSalon.name[0]}
            </div>

            <h3 className="text-xl font-extrabold text-[#1B1410]">{selectedSalon.name}</h3>
            <p className="text-xs text-[#8F8177] mt-1 mb-4">{selectedSalon.address || `${location.areaName}, Bhubaneswar`}</p>

            <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-2xl mb-6 text-center border border-[#E8E1D7]">
              <div>
                <div className="text-[10px] font-bold text-[#8F8177]">Est. Wait</div>
                <div className="text-base font-black text-[#1B1410]">{selectedSalon.waitTime} min</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#8F8177]">Chairs Free</div>
                <div className="text-base font-black text-[#2E7D4F]">{selectedSalon.availableChairs ?? 1}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#8F8177]">In Queue</div>
                <div className="text-base font-black text-[#7A4B29]">{selectedSalon.waitingCount || 0}</div>
              </div>
            </div>

            <button
              onClick={() => handleJoinQueue(selectedSalon)}
              className="w-full py-3.5 bg-[#7A4B29] hover:bg-[#5C371D] text-white font-extrabold text-sm rounded-2xl transition-all shadow-md"
            >
              Join Live Queue Now
            </button>
          </div>
        </div>
      )}

      {/* Locality Selector Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={location}
        selectedAreaId={location.areaId}
        onSelectArea={(area) => setLocality(area)}
      />

      {/* Customer Login Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1B1410]/60 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#E8E1D7] bg-[#FAF7F2] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-[#8F8177] hover:text-[#1B1410]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7A4B29]/20 bg-[#7A4B29]/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-[#7A4B29] uppercase">
                Customer Verification
              </div>
              <SneprWordmark height={30} className="text-[#1B1410]" />
              <h2 className="text-2xl font-serif font-bold text-[#1B1410] tracking-tight mt-2">
                Join Salon Live Queue
              </h2>
              <p className="text-xs text-[#6B5E55] leading-relaxed max-w-sm">
                Sign in to secure your live token and track queue position in real-time.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 h-14 bg-[#7A4B29] hover:bg-[#60391F] text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-[#7A4B29]/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#FFFFFF"
                    d="M21.35 11.1H12v2.7h5.38c-.24 1.28-.96 2.37-2.05 3.1l3.12 2.42c1.82-1.68 2.87-4.15 2.87-7.07 0-.73-.07-1.42-.17-2.15z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 21c2.43 0 4.47-.8 5.96-2.2l-3.12-2.42c-.86.58-1.97.92-3.12.92-2.4 0-4.43-1.62-5.15-3.8L3.33 15.3c1.48 2.94 4.53 5.7 8.67 5.7z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M6.85 13.5c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72L3.33 7.8A8.99 8.99 0 0 0 2 12c0 1.57.41 3.05 1.13 4.34l3.72-2.84z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 5.7c1.3 0 2.47.45 3.39 1.33l2.54-2.54C16.4 3.09 14.39 2.3 12 2.3c-4.14 0-7.19 2.76-8.67 5.7l3.52 2.7c.72-2.18 2.75-3.8 5.15-3.8z"
                  />
                </svg>
                {authLoading ? "Connecting..." : "Sign In with Google"}
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E1D7]" />
                </div>
                <span className="relative px-3 bg-[#FAF7F2] text-[9px] font-bold text-[#8F8177] uppercase tracking-widest">
                  Or use Mobile App
                </span>
              </div>

              <a
                href="/Snepr-v1.0.4.aab"
                download
                className="w-full flex items-center justify-center gap-3 h-14 bg-white hover:bg-[#FAF7F2] text-[#1B1410] font-bold text-xs uppercase tracking-widest rounded-2xl border border-[#E8E1D7] transition-all shadow-xs"
              >
                <Smartphone className="w-5 h-5 text-[#7A4B29]" />
                Download Android App
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Dock navigation */}
      <div className="h-24" />
      <DockNavbar activeTab="explore" />
    </div>
  );
}

export default LiveDashboard;
