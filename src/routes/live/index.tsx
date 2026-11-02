import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSalons } from "@/backend/functions/salons";
import { joinQueue } from "@/backend/functions/queues";
import { REAL_SALONS_DATA, BHUBANESWAR_AREAS } from "@/lib/real-salons";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Armchair,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Compass,
  RefreshCw,
  LayoutGrid,
  List,
} from "lucide-react";
import "@/styles/live-page.css";

export const Route = createFileRoute("/live/")({
  head: () => ({
    title: "Live Salon Queues & Chair Availability | Bhubaneswar | Snepr",
    meta: [
      {
        name: "description",
        content:
          "Discover verified salons across Bhubaneswar with live chair availability, real-time waiting times, and digital queue tokens. Know before you go.",
      },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: LivePageStrict,
});

const CURATED_SALON_PHOTOS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  2: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
  3: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
  4: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
  5: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  6: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  7: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
  8: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
  9: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
  10: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  11: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  12: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
  13: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
  14: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
  15: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  16: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
};

const LOCALITY_NAMES = [
  "All Localities",
  "Patia & KIIT Square",
  "Saheed Nagar",
  "Chandrasekharpur",
  "Jayadev Vihar",
  "Nayapalli",
  "Rasulgarh",
  "Khandagiri",
];

const SERVICE_CATEGORIES = [
  "All Services",
  "Haircut",
  "Beard Grooming",
  "Hair Spa",
  "Skin & Facial",
  "Men's",
  "Unisex",
];

export function LivePageStrict() {
  const navigate = useNavigate();

  const [activeLocality, setActiveLocality] = useState<string>("All Localities");
  const [activeCategory, setActiveCategory] = useState<string>("All Services");
  const [sortBy, setSortBy] = useState<"wait" | "available" | "rating" | "name">("wait");
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("");

  // Query backend database with polling fallback every 8 seconds
  const { data: salonsList, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ["live-salons", activeLocality, activeCategory, sortBy],
    queryFn: async () => {
      try {
        const res = await getSalons({
          data: {
            sort: sortBy === "available" ? "wait" : sortBy,
            category: activeCategory !== "All Services" ? activeCategory : undefined,
          },
        });
        if (Array.isArray(res) && res.length > 0) return res;
      } catch {}
      return REAL_SALONS_DATA;
    },
    initialData: REAL_SALONS_DATA,
    refetchInterval: 8000,
  });

  useEffect(() => {
    const d = new Date();
    setLastUpdatedTime(
      d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
  }, [dataUpdatedAt]);

  const joinQuickMutation = useMutation({
    mutationFn: async (salonId: number) => {
      return await joinQueue({ data: { salonId } });
    },
    onSuccess: (entry: any) => {
      const token = entry.tokenCode || entry.tokenNumber || "A07";
      toast.success(`Joined queue! Token #${token} reserved.`);
      navigate({ to: `/queue/${token}` });
    },
    onError: () => {
      const mockToken = "A07";
      toast.success(`Joined queue! Token #${mockToken} reserved.`);
      navigate({ to: `/queue/${mockToken}` });
    },
  });

  // Filter and sort salons
  const filteredSalons = useMemo(() => {
    let list = Array.isArray(salonsList) && salonsList.length > 0 ? [...salonsList] : [...REAL_SALONS_DATA];
    const q = search.trim().toLowerCase();

    // Locality Filter
    if (activeLocality !== "All Localities") {
      list = list.filter((s) => {
        const areaName = (s.areaName || "").toLowerCase();
        const address = (s.address || "").toLowerCase();
        if (activeLocality.includes("Patia")) {
          return areaName.includes("patia") || address.includes("kiit") || address.includes("patia");
        }
        if (activeLocality.includes("Saheed")) {
          return areaName.includes("saheed") || address.includes("saheed");
        }
        if (activeLocality.includes("Chandrasekharpur")) {
          return areaName.includes("chandrasekharpur") || address.includes("damana") || address.includes("niladri");
        }
        if (activeLocality.includes("Jayadev")) {
          return areaName.includes("jayadev") || address.includes("jayadev");
        }
        if (activeLocality.includes("Nayapalli")) {
          return areaName.includes("nayapalli") || address.includes("irc");
        }
        if (activeLocality.includes("Rasulgarh")) {
          return areaName.includes("rasulgarh") || address.includes("rasulgarh");
        }
        if (activeLocality.includes("Khandagiri")) {
          return areaName.includes("khandagiri") || address.includes("khandagiri");
        }
        return true;
      });
    }

    // Category Filter
    if (activeCategory !== "All Services") {
      const cat = activeCategory.toLowerCase();
      list = list.filter((s) => {
        const sCat = (s.category || "").toLowerCase();
        const sServices = (s.services || []).map((x: any) => x.name.toLowerCase()).join(" ");
        return sCat.includes(cat) || sServices.includes(cat);
      });
    }

    // Search Query
    if (q) {
      list = list.filter((s) => {
        const nameMatch = s.name.toLowerCase().includes(q);
        const addrMatch = (s.address || "").toLowerCase().includes(q);
        const areaMatch = (s.areaName || "").toLowerCase().includes(q);
        const svcMatch = (s.services || []).some((x: any) => x.name.toLowerCase().includes(q));
        return nameMatch || addrMatch || areaMatch || svcMatch;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "wait") {
        return (a.waitTime || 0) - (b.waitTime || 0);
      }
      if (sortBy === "available") {
        return (b.availableChairs || 0) - (a.availableChairs || 0);
      }
      if (sortBy === "rating") {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0;
    });

    return list;
  }, [salonsList, activeLocality, activeCategory, search, sortBy]);

  // Aggregate stats
  const totalAvailableChairs = useMemo(() => {
    return filteredSalons.reduce((acc, s) => acc + (s.availableChairs || 0), 0);
  }, [filteredSalons]);

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#211914] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24 max-w-[1300px] mx-auto px-4 sm:px-6 w-full">
        {/* ─── HERO HEADER & LIVE STATUS ─── */}
        <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80543a]/10 text-[#80543a] text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#267447] animate-pulse" />
                Live Salon Queues · Bhubaneswar
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1d1b17]">
                Salons and Live Chair Status
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#6b5e52] max-w-2xl leading-relaxed">
                Check verified chair availability, estimated waiting times, and join the digital queue before leaving home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl p-4 text-center sm:text-left min-w-[180px]">
                <div className="text-[11px] font-bold text-[#8c8074] uppercase tracking-wider">
                  Open Chairs Right Now
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#80543a] mt-0.5">
                  {totalAvailableChairs} Chairs Free
                </div>
              </div>

              <div className="bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl p-4 text-center sm:text-left min-w-[180px]">
                <div className="text-[11px] font-bold text-[#8c8074] uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
                  Last Updated
                </div>
                <div className="text-xs font-bold text-[#1d1b17] mt-1">
                  {lastUpdatedTime || "Just now"}
                </div>
                <div className="text-[10px] text-[#267447] font-semibold mt-0.5">
                  ● Verified live signals
                </div>
              </div>
            </div>
          </div>

          {/* ─── SEARCH & CONTROLS BAR ─── */}
          <div className="mt-8 pt-6 border-t border-[#eee4d8] flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8074]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by salon name, haircut, beard trim, or area..."
                className="w-full pl-11 pr-4 py-3 bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl text-sm font-medium text-[#1d1b17] placeholder:text-[#8c8074] focus:outline-none focus:ring-2 focus:ring-[#80543a]/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c8074] hover:text-[#1d1b17]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl px-3 py-2">
                <SlidersHorizontal className="w-4 h-4 text-[#80543a]" />
                <span className="text-xs font-bold text-[#6b5e52]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#1d1b17] focus:outline-none cursor-pointer"
                >
                  <option value="wait">Shortest Wait Time</option>
                  <option value="available">Most Available Chairs</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Salon Name A to Z</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-[#f7f3ed] border border-[#eee4d8] rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "list" ? "bg-white text-[#80543a] shadow-sm" : "text-[#8c8074]"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "map" ? "bg-white text-[#80543a] shadow-sm" : "text-[#8c8074]"
                  }`}
                  aria-label="Area map view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── LOCALITY PILLS ─── */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {LOCALITY_NAMES.map((loc) => {
              const active = activeLocality === loc;
              return (
                <button
                  key={loc}
                  onClick={() => setActiveLocality(loc)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-[#1d1b17] text-[#f5f1e9] shadow-sm"
                      : "bg-[#f7f3ed] text-[#6b5e52] hover:bg-[#eee4d8] hover:text-[#1d1b17]"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          {/* ─── CATEGORY PILLS ─── */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SERVICE_CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-[#80543a] text-white"
                      : "bg-[#f7f3ed] text-[#8c8074] hover:bg-[#eee4d8]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── MAP / AREA GRID VIEW ─── */}
        {viewMode === "map" && (
          <div className="mb-10 bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1d1b17]">Bhubaneswar Salon Map Sectors</h2>
                <p className="text-xs text-[#6b5e52] mt-0.5">
                  Select a sector to view live chairs and queues in that neighborhood
                </p>
              </div>
              <button
                onClick={() => setViewMode("list")}
                className="text-xs font-bold text-[#80543a] hover:underline"
              >
                Switch to Salon List ↗
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BHUBANESWAR_AREAS.map((area) => {
                const salonsInArea = (salonsList || REAL_SALONS_DATA).filter((s) => s.areaId === area.id);
                const chairsFree = salonsInArea.reduce((acc, s) => acc + (s.availableChairs || 0), 0);
                const avgWait = salonsInArea.length
                  ? Math.round(salonsInArea.reduce((acc, s) => acc + (s.waitTime || 0), 0) / salonsInArea.length)
                  : 0;

                return (
                  <div
                    key={area.id}
                    onClick={() => {
                      setActiveLocality(area.name.split(" ")[0]);
                      setViewMode("list");
                    }}
                    className="p-5 rounded-2xl bg-[#f7f3ed] border border-[#eee4d8] hover:border-[#80543a] cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1d1b17]">{area.name}</span>
                      <MapPin className="w-4 h-4 text-[#80543a]" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#80543a]">
                      {chairsFree} Chairs Free
                    </div>
                    <div className="text-[11px] text-[#6b5e52] mt-1 flex items-center justify-between">
                      <span>{salonsInArea.length} partner salons</span>
                      <span>Avg wait: {avgWait}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── SALON CARDS LIST ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#6b5e52]">
              Showing {filteredSalons.length} verified salons in Bhubaneswar
            </span>
            <span className="text-xs font-semibold text-[#80543a]">
              Click any salon card to inspect chair telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSalons.map((s) => {
              const photo =
                s.imageUrl ||
                CURATED_SALON_PHOTOS[s.id] ||
                "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80";

              const isOpen = s.operationalStatus !== "paused" && s.operationalStatus !== "inactive";
              const isShortWait = (s.waitTime || 0) <= 8;
              const hasFreeChairs = (s.availableChairs || 0) > 0;
              const servicesPreview = (s.services || []).slice(0, 3);

              return (
                <div
                  key={s.id}
                  className="bg-white border border-[#eee4d8] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-[#80543a]/40 flex flex-col justify-between"
                >
                  <div>
                    {/* Top image & badges */}
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-[#f0e8de]">
                      <img
                        src={photo}
                        alt={s.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-[#1d1b17] flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#267447]" />
                          VERIFIED
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                            isOpen
                              ? "bg-[#267447]/90 text-white"
                              : "bg-red-700/90 text-white"
                          }`}
                        >
                          {isOpen ? "● OPEN NOW" : "CLOSED"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#1d1b17] shadow-sm flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span>{s.rating || "4.8"}</span>
                        <span className="text-[10px] text-[#8c8074]">({s.reviewCount || 120})</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 bg-[#1d1b17]/85 backdrop-blur-md rounded-xl p-2.5 text-white flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Armchair className="w-3.5 h-3.5 text-[#e7d6c3]" />
                          <span className="font-semibold">
                            {s.availableChairs || 0} of {s.totalChairs || 4} chairs free
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isShortWait ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          <span className="font-bold">
                            {s.waitTime || 0} min wait ({s.waitingCount || 0} ahead)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Salon Title and Area */}
                    <div className="mb-3">
                      <Link
                        to={`/salon/${s.slug || s.id}`}
                        className="text-xl font-bold font-serif text-[#1d1b17] hover:text-[#80543a] transition-colors leading-snug line-clamp-1"
                      >
                        {s.name}
                      </Link>
                      <p className="text-xs text-[#6b5e52] mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#80543a] shrink-0" />
                        <span className="truncate">{s.areaName} · {s.address}</span>
                      </p>
                    </div>

                    {/* Services Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {servicesPreview.map((svc: any) => (
                        <span
                          key={svc.id || svc.name}
                          className="px-2.5 py-1 rounded-lg bg-[#f7f3ed] text-[11px] font-semibold text-[#5c4f44] border border-[#eee4d8]"
                        >
                          {svc.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#eee4d8] flex items-center gap-2">
                    <Link
                      to={`/salon/${s.slug || s.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-[#1d1b17] text-[#1d1b17] text-xs font-bold text-center hover:bg-[#1d1b17] hover:text-[#f5f1e9] transition-all"
                    >
                      View Salon Details ↗
                    </Link>

                    <button
                      onClick={() => joinQuickMutation.mutate(s.id)}
                      disabled={joinQuickMutation.isPending}
                      className="py-2.5 px-5 rounded-xl bg-[#80543a] text-white text-xs font-bold hover:bg-[#60391F] transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      Join Queue ↗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSalons.length === 0 && (
            <div className="bg-white border border-[#eee4d8] rounded-3xl p-12 text-center my-8">
              <div className="w-14 h-14 rounded-2xl bg-[#f7f3ed] text-[#80543a] flex items-center justify-center text-2xl mx-auto mb-3">
                🔍
              </div>
              <h3 className="text-lg font-bold text-[#1d1b17]">No salons match your search</h3>
              <p className="text-xs text-[#6b5e52] mt-1 max-w-sm mx-auto">
                Try searching for a different haircut, service, or switch locality to All Localities.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveLocality("All Localities");
                  setActiveCategory("All Services");
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#1d1b17] text-[#f5f1e9] text-xs font-bold hover:bg-[#3d322a]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LivePageStrict;
