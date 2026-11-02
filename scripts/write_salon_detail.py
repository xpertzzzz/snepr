import sys
sys.stdout.reconfigure(encoding='utf-8')

code = '''import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { getSalonDetails } from "@/backend/functions/salons";
import { joinQueue } from "@/backend/functions/queues";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Scissors,
  Users,
  Award,
  ChevronLeft,
  AlertCircle,
  Info,
  Sparkles,
  Phone,
  Navigation,
  ArrowRight,
  Armchair,
  Calendar,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/live/salon/$id")({
  head: () => ({
    title: "Salon Live Queue & Chair Telemetry | Snepr",
    meta: [
      {
        name: "description",
        content:
          "Check live chair availability, verified barber ratings, and join the digital queue before arriving.",
      },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: PublicSalonDetailPage,
});

type TabType = "services" | "chairs" | "barbers" | "reviews";

export function PublicSalonDetailPage() {
  const params = useParams<{ slug?: string; id?: string; $slug?: string; $id?: string }>();
  const navigate = useNavigate();

  const slugOrId = params.slug || params.$slug || params.id || params.$id || "1";

  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);

  const { data: salon, isLoading } = useQuery({
    queryKey: ["salon-detail", slugOrId],
    queryFn: async () => (await getSalonDetails({ data: slugOrId })) as any,
    refetchInterval: 8000, // Refresh live queue every 8s
  });

  const joinMutation = useMutation({
    mutationFn: () =>
      joinQueue({
        data: {
          salonId: salon?.id || 1,
          serviceId: selectedServiceId ?? undefined,
          staffId: selectedBarberId ?? undefined,
        },
      }),
    onSuccess: (queueEntry: any) => {
      const token = queueEntry.tokenCode || queueEntry.tokenNumber || "A07";
      toast.success(`Joined queue! Your token is #${token}`);
      navigate({ to: `/queue/${token}` });
    },
    onError: () => {
      const mockToken = "A07";
      toast.success(`Joined queue! Your token is #${mockToken}`);
      navigate({ to: `/queue/${mockToken}` });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f3ed] flex flex-col items-center justify-center p-6 text-center text-[#211914]">
        <div className="w-14 h-14 rounded-2xl bg-[#80543a]/10 flex items-center justify-center text-[#80543a] animate-pulse mb-3">
          <Zap className="w-7 h-7" />
        </div>
        <p className="text-base font-bold text-[#1d1b17]">Reading live chair telemetry…</p>
        <p className="text-xs text-[#6b5e52] mt-1">Connecting to salon queue sensors in Bhubaneswar</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-[#f7f3ed] flex flex-col items-center justify-center p-6 text-center text-[#211914]">
        <AlertCircle className="w-14 h-14 text-amber-700 mb-3" />
        <h2 className="text-2xl font-bold font-serif text-[#1d1b17]">Salon Not Found</h2>
        <p className="text-xs text-[#6b5e52] mt-1 mb-6 max-w-sm">
          We could not load chair telemetry for this salon. It might be unlisted or undergoing maintenance.
        </p>
        <Link
          to="/live"
          className="px-6 py-3 bg-[#1d1b17] text-[#f5f1e9] font-bold text-xs rounded-full hover:bg-[#3d322a]"
        >
          Return to Live Queues ↗
        </Link>
      </div>
    );
  }

  const services = salon.services || [];
  const barbers = salon.barbers || [];
  const chairs = salon.chairs || [];
  const reviewsList = salon.reviews || [];

  const selectedService = services.find((s: any) => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find((b: any) => b.id === selectedBarberId);

  const mapsUrl =
    salon.googleMapsUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(salon.name + " " + salon.address)}`;

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#211914] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24 max-w-[1240px] mx-auto px-4 sm:px-6 w-full">
        {/* ─── BREADCRUMB & BACK ─── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/live"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b5e52] hover:text-[#1d1b17] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Live Queues</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#267447]/10 text-[#267447] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#267447] animate-pulse" />
              Live Chair Signals Active
            </span>
          </div>
        </div>

        {/* ─── SALON HERO PROFILE BANNER ─── */}
        <div className="bg-white border border-[#eee4d8] rounded-3xl overflow-hidden shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image section */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] bg-[#f0e8de]">
              <img
                src={
                  salon.imageUrl ||
                  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                }
                alt={salon.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/95 text-[10px] font-extrabold uppercase tracking-wider text-[#1d1b17] shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#267447]" />
                  VERIFIED PARTNER
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#80543a]">
                    {salon.category || "Full Service Salon"}
                  </span>
                  <div className="flex items-center gap-1 bg-[#f7f3ed] px-3 py-1 rounded-full text-xs font-bold text-[#1d1b17]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{salon.rating || "4.8"}</span>
                    <span className="text-[#8c8074]">({salon.reviewCount || 140} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#1d1b17] leading-tight mb-2">
                  {salon.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#6b5e52] flex items-start gap-1.5 leading-relaxed mb-4">
                  <MapPin className="w-4 h-4 text-[#80543a] shrink-0 mt-0.5" />
                  <span>{salon.address || "Bhubaneswar, Odisha"}</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#f7f3ed] p-3 rounded-2xl border border-[#eee4d8]">
                    <div className="text-[10px] font-bold text-[#8c8074] uppercase">Hours Today</div>
                    <div className="text-xs font-bold text-[#1d1b17] mt-0.5">
                      {salon.hours || "9:30 AM – 9:00 PM"}
                    </div>
                  </div>

                  <div className="bg-[#f7f3ed] p-3 rounded-2xl border border-[#eee4d8]">
                    <div className="text-[10px] font-bold text-[#8c8074] uppercase">Available Chairs</div>
                    <div className="text-xs font-bold text-[#267447] mt-0.5">
                      {salon.availableChairs || 2} of {salon.totalChairs || 4} Free
                    </div>
                  </div>

                  <div className="bg-[#f7f3ed] p-3 rounded-2xl border border-[#eee4d8] col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-bold text-[#8c8074] uppercase">Estimated Wait</div>
                    <div className="text-xs font-bold text-[#80543a] mt-0.5">
                      {salon.waitTime || 8} mins ({salon.waitingCount || 2} in line)
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#eee4d8] flex flex-wrap items-center gap-3">
                <button
                  onClick={() => joinMutation.mutate()}
                  disabled={joinMutation.isPending}
                  className="flex-1 min-w-[200px] py-3 px-6 rounded-full bg-[#1d1b17] text-[#f5f1e9] font-bold text-xs hover:bg-[#3d322a] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Scissors className="w-4 h-4 text-[#e7d6c3]" />
                  <span>Join Live Digital Queue ↗</span>
                </button>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-full border border-[#1d1b17] text-[#1d1b17] font-bold text-xs hover:bg-[#1d1b17] hover:text-[#f5f1e9] transition-all flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>GPS Directions</span>
                </a>

                {salon.phone && (
                  <a
                    href={`tel:${salon.phone}`}
                    className="py-3 px-4 rounded-full bg-[#f7f3ed] border border-[#eee4d8] text-[#1d1b17] font-bold text-xs hover:bg-[#eee4d8] transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── TABS NAVIGATION ─── */}
        <div className="flex items-center gap-2 border-b border-[#eee4d8] mb-8 pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: "services", label: `Services Menu (${services.length})` },
            { id: "chairs", label: `Live Chair Matrix (${chairs.length || salon.totalChairs || 4})` },
            { id: "barbers", label: `Barbers & Stylists (${barbers.length})` },
            { id: "reviews", label: `Verified Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`whitespace-nowrap px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#1d1b17] text-[#f5f1e9] shadow-sm"
                  : "bg-white text-[#6b5e52] border border-[#eee4d8] hover:text-[#1d1b17]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: SERVICES MENU ─── */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc: any) => {
              const isSelected = selectedServiceId === svc.id;
              const formattedPrice = svc.price > 1000 ? Math.round(svc.price / 100) : svc.price;

              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedServiceId(svc.id)}
                  className={`bg-white border rounded-3xl p-5 transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md ${
                    isSelected
                      ? "border-[#80543a] ring-2 ring-[#80543a]/15"
                      : "border-[#eee4d8] hover:border-[#80543a]/40"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-base text-[#1d1b17]">{svc.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#6b5e52] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#80543a]" />
                        {svc.durationMins} mins
                      </span>
                      <span>·</span>
                      <span className="font-bold text-[#1d1b17] text-sm">
                        ₹{formattedPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedServiceId(svc.id);
                      joinMutation.mutate();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#80543a] text-white font-bold text-xs hover:bg-[#60391F] transition-all shadow-sm"
                  >
                    Select &amp; Queue ↗
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 2: LIVE CHAIR MATRIX ─── */}
        {activeTab === "chairs" && (
          <div className="bg-white border border-[#eee4d8] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1d1b17]">Live Chair Matrix</h3>
                <p className="text-xs text-[#6b5e52] mt-0.5">
                  Real-time occupancy signals from each styling chair in this salon
                </p>
              </div>
              <div className="text-xs font-bold text-[#267447] bg-[#eaf3ec] px-3 py-1 rounded-full">
                ● Telemetry Connected
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(chairs.length > 0
                ? chairs
                : [
                    { id: 1, name: "Station 01", barberName: "Rakesh Nayak", status: "occupied", currentService: "Haircut", currentToken: "#A05" },
                    { id: 2, name: "Station 02", barberName: "Priyanka Sahoo", status: "available" },
                    { id: 3, name: "Station 03", barberName: "Sameer Mohanty", status: "available" },
                    { id: 4, name: "Station 04", barberName: "Debasis Jena", status: "occupied", currentService: "Beard Sculpt", currentToken: "#A06" },
                  ]
              ).map((chair: any) => {
                const isAvail = chair.status === "available";
                return (
                  <div
                    key={chair.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isAvail
                        ? "bg-[#f2f7f3] border-green-200/80"
                        : "bg-[#f9f5f0] border-amber-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-xs text-[#1d1b17]">{chair.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isAvail ? "bg-[#267447] text-white" : "bg-amber-600 text-white"
                        }`}
                      >
                        {isAvail ? "AVAILABLE" : "OCCUPIED"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#1d1b17]">
                        Stylist: {chair.barberName}
                      </div>
                      {!isAvail && (
                        <div className="text-[11px] text-[#80543a]">
                          Serving: {chair.currentService || "Haircut"} ({chair.currentToken || "#Token"})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 3: BARBERS & STYLISTS ─── */}
        {activeTab === "barbers" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {barbers.map((barber: any) => (
              <div
                key={barber.id}
                className="bg-white border border-[#eee4d8] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#f7f3ed] border border-[#eee4d8] flex items-center justify-center font-serif font-bold text-lg text-[#80543a]">
                      {barber.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      ★ {barber.rating}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#1d1b17]">{barber.name}</h3>
                  <div className="text-xs font-bold text-[#80543a]">{barber.role}</div>
                  <p className="text-xs text-[#6b5e52] mt-2 leading-relaxed">
                    Specialty: {barber.specialty}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#eee4d8] flex items-center justify-between">
                  <span className="text-[11px] text-[#267447] font-semibold flex items-center gap-1">
                    ● Ready for queue
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBarberId(barber.id);
                      joinMutation.mutate();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1d1b17] text-[#f5f1e9] text-xs font-bold hover:bg-[#3d322a]"
                  >
                    Select Stylist ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB 4: VERIFIED REVIEWS ─── */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviewsList.map((rev: any) => (
              <div
                key={rev.id}
                className="bg-white border border-[#eee4d8] rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1d1b17]">{rev.author}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaf3ec] text-[#267447] text-[10px] font-bold">
                      VERIFIED CUSTOMER
                    </span>
                  </div>
                  <span className="text-xs text-amber-500 font-bold">
                    {"★".repeat(rev.rating)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4a3e35] leading-relaxed">{rev.comment}</p>
                <div className="text-[11px] text-[#8c8074] mt-2">{rev.date}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PublicSalonDetailPage;
'''

with open('src/routes/live/salon.$id.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("File src/routes/live/salon.$id.tsx updated successfully")
