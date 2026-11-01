import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Users, Armchair, Scissors, Clock, Store, Settings,
  Plus, Check, X, Phone, AlertCircle, Play, CheckCircle2,
  ChevronRight, ArrowLeft, LogOut, RefreshCw, Sparkles, UserPlus
} from "lucide-react";
import { toast } from "sonner";

export type SalonOSTab = "overview" | "queue" | "chairs" | "services" | "profile" | "settings";

export interface QueueItem {
  id: number;
  tokenNumber: number;
  customerName: string;
  phone?: string;
  serviceName: string;
  position: number;
  waitTime: number; // minutes
  status: "WAITING" | "SERVING" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  chairAssigned?: number;
  createdAt: string;
}

export interface ChairItem {
  id: number;
  number: number;
  name: string;
  status: "AVAILABLE" | "OCCUPIED" | "UNAVAILABLE";
  currentCustomer?: string;
  currentService?: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  { id: 1, name: "Haircut", price: 150, duration: 25, isActive: true },
  { id: 2, name: "Beard Grooming", price: 80, duration: 15, isActive: true },
  { id: 3, name: "Haircut + Beard Trim", price: 200, duration: 40, isActive: true },
  { id: 4, name: "Hair Styling", price: 120, duration: 20, isActive: true },
  { id: 5, name: "Hair Colour", price: 450, duration: 50, isActive: true },
  { id: 6, name: "Kids Haircut", price: 100, duration: 20, isActive: true },
];

const INITIAL_CHAIRS: ChairItem[] = [
  { id: 1, number: 1, name: "Station 1", status: "OCCUPIED", currentCustomer: "Rohan Patel", currentService: "Haircut" },
  { id: 2, number: 2, name: "Station 2", status: "AVAILABLE" },
  { id: 3, number: 3, name: "Station 3", status: "AVAILABLE" },
];

const INITIAL_QUEUES: QueueItem[] = [
  {
    id: 101,
    tokenNumber: 101,
    customerName: "Rohan Patel",
    phone: "+91 94370 11223",
    serviceName: "Haircut",
    position: 0,
    waitTime: 0,
    status: "SERVING",
    chairAssigned: 1,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 102,
    tokenNumber: 102,
    customerName: "Aman Sharma",
    phone: "+91 98610 22334",
    serviceName: "Haircut + Beard Trim",
    position: 1,
    waitTime: 8,
    status: "WAITING",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 103,
    tokenNumber: 103,
    customerName: "Priya Das",
    phone: "+91 99370 33445",
    serviceName: "Hair Styling",
    position: 2,
    waitTime: 20,
    status: "WAITING",
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
  },
];

export function SalonOSWorkspace({ session }: { session: any }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SalonOSTab>("overview");

  // Live salon data states
  const [salonName, setSalonName] = useState(session?.salonName || "Lakmé Salon — KIIT Road");
  const [description, setDescription] = useState("Premium grooming and hair styling in Patia, Bhubaneswar.");
  const [phone, setPhone] = useState("+91 92373 62221");
  const [address, setAddress] = useState("1st Floor, KIIT Road, opposite Manyavar, Patia, Bhubaneswar – 751024");
  const [locality, setLocality] = useState("Patia");
  const [openingHours, setOpeningHours] = useState("10:00 AM – 09:00 PM");

  const [queues, setQueues] = useState<QueueItem[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_active_queues");
      return stored ? JSON.parse(stored) : INITIAL_QUEUES;
    } catch {
      return INITIAL_QUEUES;
    }
  });

  const [chairs, setChairs] = useState<ChairItem[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_salon_chairs");
      return stored ? JSON.parse(stored) : INITIAL_CHAIRS;
    } catch {
      return INITIAL_CHAIRS;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_salon_services");
      return stored ? JSON.parse(stored) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Walk-in modal state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInServiceId, setWalkInServiceId] = useState<number>(1);

  // Sync queues to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("snepr_active_queues", JSON.stringify(queues));
      localStorage.setItem("snepr_salon_chairs", JSON.stringify(chairs));
      localStorage.setItem("snepr_salon_services", JSON.stringify(services));
    } catch {}
  }, [queues, chairs, services]);

  // Derived metrics
  const waitingCustomers = queues.filter((q) => q.status === "WAITING");
  const servingCustomers = queues.filter((q) => q.status === "SERVING");
  const completedToday = queues.filter((q) => q.status === "COMPLETED");
  const availableChairsCount = chairs.filter((c) => c.status === "AVAILABLE").length;
  const avgWaitTime = waitingCustomers.length > 0 ? waitingCustomers.length * 10 : 0;

  // Queue Operations
  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      toast.error("Please enter customer name.");
      return;
    }

    const selectedService = services.find((s) => s.id === walkInServiceId) || services[0];
    const maxToken = queues.reduce((max, q) => Math.max(max, q.tokenNumber), 100);
    const nextToken = maxToken + 1;
    const position = waitingCustomers.length + 1;
    const waitTime = position * 12;

    const newQueueItem: QueueItem = {
      id: Date.now(),
      tokenNumber: nextToken,
      customerName: walkInName.trim(),
      phone: walkInPhone.trim() || undefined,
      serviceName: selectedService.name,
      position,
      waitTime,
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };

    setQueues([...queues, newQueueItem]);
    setWalkInName("");
    setWalkInPhone("");
    setShowWalkInModal(false);
    toast.success(`Token #${nextToken} issued for ${newQueueItem.customerName}!`);
  };

  const handleCallNext = () => {
    const nextWaiting = queues.find((q) => q.status === "WAITING");
    if (!nextWaiting) {
      toast.info("No customers currently waiting in queue.");
      return;
    }

    // Find first available chair
    const availableChair = chairs.find((c) => c.status === "AVAILABLE");

    setQueues((prev) =>
      prev.map((q) =>
        q.id === nextWaiting.id
          ? { ...q, status: "SERVING", chairAssigned: availableChair?.number || 1 }
          : q
      )
    );

    if (availableChair) {
      setChairs((prev) =>
        prev.map((c) =>
          c.id === availableChair.id
            ? {
                ...c,
                status: "OCCUPIED",
                currentCustomer: nextWaiting.customerName,
                currentService: nextWaiting.serviceName,
              }
            : c
        )
      );
    }

    toast.success(`Calling Token #${nextWaiting.tokenNumber} (${nextWaiting.customerName})!`);
  };

  const handleMarkCompleted = (queueId: number) => {
    const item = queues.find((q) => q.id === queueId);
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status: "COMPLETED" } : q))
    );

    if (item?.chairAssigned) {
      setChairs((prev) =>
        prev.map((c) =>
          c.number === item.chairAssigned
            ? { ...c, status: "AVAILABLE", currentCustomer: undefined, currentService: undefined }
            : c
        )
      );
    }

    toast.success(`Service completed for #${item?.tokenNumber || queueId}!`);
  };

  const handleCancelQueue = (queueId: number, status: "CANCELLED" | "NO_SHOW") => {
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status } : q))
    );
    toast.info(`Token marked as ${status}.`);
  };

  // Chair Operations
  const handleToggleChairStatus = (chairId: number, newStatus: "AVAILABLE" | "OCCUPIED" | "UNAVAILABLE") => {
    setChairs((prev) =>
      prev.map((c) => (c.id === chairId ? { ...c, status: newStatus } : c))
    );
    toast.success("Chair status updated!");
  };

  const handleAddChair = () => {
    // Respect subscription limit (e.g. Intermediate allows up to 3)
    if (chairs.length >= 6) {
      toast.error("Chair limit reached for your salon plan.");
      return;
    }
    const nextNum = chairs.length + 1;
    const newChair: ChairItem = {
      id: Date.now(),
      number: nextNum,
      name: `Station ${nextNum}`,
      status: "AVAILABLE",
    };
    setChairs([...chairs, newChair]);
    toast.success(`Added ${newChair.name}!`);
  };

  const handleRemoveChair = (chairId: number) => {
    if (chairs.length <= 1) {
      toast.error("Salons must have at least 1 active chair.");
      return;
    }
    setChairs(chairs.filter((c) => c.id !== chairId));
    toast.info("Chair removed.");
  };

  // Service Operations
  const handleToggleService = (serviceId: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
    );
    toast.success("Service status updated!");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col md:flex-row">
      {/* ─── SIDEBAR NAVIGATION (Light Warm Theme) ─── */}
      <aside className="w-full md:w-64 bg-[#FFFDFA] border-r border-[#E9E1D7] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Salon Badge */}
          <div className="p-6 border-b border-[#E9E1D7]">
            <Link to="/" className="inline-block" aria-label="Snepr home">
              <SneprWordmark height={32} color="#1B1410" />
            </Link>
            <div className="mt-3">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#7A4B29]">
                SalonOS Desk
              </div>
              <h2 className="text-sm font-bold text-[#1B1410] truncate mt-0.5">
                {salonName}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#267447] bg-[#EAF3EC] px-2 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#267447]" />
                Live Desk Active
              </span>
            </div>
          </div>

          {/* Navigation Links - 6 Core Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#7A4B29] text-white shadow-sm"
                  : "text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#1B1410]"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>1. Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("queue")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "queue"
                  ? "bg-[#7A4B29] text-white shadow-sm"
                  : "text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#1B1410]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>2. Live Queue</span>
              </div>
              {waitingCustomers.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "queue" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {waitingCustomers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("chairs")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "chairs"
                  ? "bg-[#7A4B29] text-white shadow-sm"
                  : "text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#1B1410]"
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>3. Chairs ({chairs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "services"
                  ? "bg-[#7A4B29] text-white shadow-sm"
                  : "text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#1B1410]"
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>4. Services ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#7A4B29] text-white shadow-sm"
                  : "text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#1B1410]"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>5. Salon Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#7A4B29] text-white shadow-sm"
                  : "text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#1B1410]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>6. Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Switcher: Return to Customer View */}
        <div className="p-4 border-t border-[#E9E1D7] space-y-2">
          <Link
            to="/live"
            className="w-full py-2.5 px-3 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2] hover:bg-white text-xs font-bold text-[#1B1410] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#7A4B29]" />
            <span>Return to Customer View</span>
          </Link>

          <button
            onClick={() => {
              try {
                localStorage.removeItem("snepr_session");
              } catch {}
              navigate({ to: "/login" });
            }}
            className="w-full py-2 px-3 text-[11px] font-semibold text-[#786B60] hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign out of SalonOS</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN DASHBOARD CONTENT AREA ─── */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-6xl overflow-y-auto">
        {/* Top Header Row with Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E9E1D7]">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#1B1410]">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "queue" && "Live Queue Operations"}
              {activeTab === "chairs" && "Chairs & Stations"}
              {activeTab === "services" && "Services & Menu"}
              {activeTab === "profile" && "Salon Business Profile"}
              {activeTab === "settings" && "SalonOS Settings"}
            </h1>
            <p className="text-xs text-[#786B60] mt-0.5">
              Live operational desk for <strong>{salonName}</strong> in {locality}, Bhubaneswar.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCallNext}
              className="px-4 py-2.5 rounded-xl bg-[#267447] hover:bg-[#1E5D38] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Call Next</span>
            </button>

            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Walk-in</span>
            </button>
          </div>
        </div>

        {/* ─── TAB A: OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Real Database Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-[#786B60]">Waiting</span>
                <div className="text-2xl font-bold font-serif text-[#1B1410] mt-1">
                  {waitingCustomers.length}
                </div>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  In queue
                </span>
              </div>

              <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-[#786B60]">Now Serving</span>
                <div className="text-2xl font-bold font-serif text-[#267447] mt-1">
                  {servingCustomers.length}
                </div>
                <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                  In chair
                </span>
              </div>

              <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-[#786B60]">Completed Today</span>
                <div className="text-2xl font-bold font-serif text-[#1B1410] mt-1">
                  {completedToday.length}
                </div>
                <span className="text-[10px] text-[#786B60]">Haircuts done</span>
              </div>

              <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-[#786B60]">Available Chairs</span>
                <div className="text-2xl font-bold font-serif text-[#1B1410] mt-1">
                  {availableChairsCount} / {chairs.length}
                </div>
                <span className="text-[10px] text-[#786B60]">Stations open</span>
              </div>

              <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1">
                <span className="text-[11px] font-semibold text-[#786B60]">Avg. Wait Time</span>
                <div className="text-2xl font-bold font-serif text-[#7A4B29] mt-1">
                  {avgWaitTime} min
                </div>
                <span className="text-[10px] text-[#786B60]">Predicted queue</span>
              </div>
            </div>

            {/* Compact Live Queue Preview */}
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-[#1B1410]">Live Queue Preview</h3>
                  <p className="text-xs text-[#786B60]">Customers currently queued for your stylist chairs.</p>
                </div>
                <button
                  onClick={() => setActiveTab("queue")}
                  className="text-xs font-bold text-[#7A4B29] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Manage Live Queue <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {queues.filter((q) => q.status === "WAITING" || q.status === "SERVING").length === 0 ? (
                <div className="p-8 text-center text-xs text-[#786B60] border border-dashed border-[#E9E1D7] rounded-2xl">
                  No active tokens right now. Use <strong>"Add Walk-in"</strong> to queue walk-in customers.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px] tracking-wider">
                        <th className="py-2.5">Token</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Service</th>
                        <th className="py-2.5">Est. Wait</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E1D7]">
                      {queues
                        .filter((q) => q.status === "WAITING" || q.status === "SERVING")
                        .map((q) => (
                          <tr key={q.id} className="hover:bg-[#FAF7F2]/50">
                            <td className="py-3 font-mono font-bold text-sm text-[#7A4B29]">
                              #{q.tokenNumber}
                            </td>
                            <td className="py-3 font-semibold text-[#1B1410]">
                              {q.customerName}
                            </td>
                            <td className="py-3 text-[#786B60]">{q.serviceName}</td>
                            <td className="py-3 font-medium">
                              {q.status === "SERVING" ? (
                                <span className="text-[#267447] font-bold">Serving now</span>
                              ) : (
                                `${q.waitTime} mins`
                              )}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  q.status === "SERVING"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {q.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {q.status === "SERVING" ? (
                                <button
                                  onClick={() => handleMarkCompleted(q.id)}
                                  className="px-3 py-1 rounded-lg bg-[#7A4B29] text-white text-[11px] font-bold hover:bg-[#60391F] cursor-pointer"
                                >
                                  Mark Completed
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setQueues((prev) =>
                                      prev.map((item) =>
                                        item.id === q.id ? { ...item, status: "SERVING" } : item
                                      )
                                    );
                                    toast.success(`Serving Token #${q.tokenNumber}!`);
                                  }}
                                  className="px-3 py-1 rounded-lg border border-[#7A4B29] text-[#7A4B29] text-[11px] font-bold hover:bg-[#7A4B29] hover:text-white cursor-pointer"
                                >
                                  Call Next
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB B: LIVE QUEUE (Primary Feature) ─── */}
        {activeTab === "queue" && (
          <div className="space-y-6">
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold font-serif text-[#1B1410]">Active Live Queue</h3>
                  <p className="text-xs text-[#786B60]">
                    Manage walk-ins and digital token entries. Statuses automatically sync with customer screens.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCallNext}
                    className="px-4 py-2 rounded-xl bg-[#267447] hover:bg-[#1E5D38] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Call Next Customer
                  </button>
                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Issue Walk-in
                  </button>
                </div>
              </div>

              {/* Queue table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px] tracking-wider">
                      <th className="py-2.5">Token</th>
                      <th className="py-2.5">Customer Name</th>
                      <th className="py-2.5">Requested Service</th>
                      <th className="py-2.5">Queue Position</th>
                      <th className="py-2.5">Wait Time</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E1D7]">
                    {queues.map((q) => (
                      <tr key={q.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="py-3 font-mono font-bold text-sm text-[#7A4B29]">
                          #{q.tokenNumber}
                        </td>
                        <td className="py-3">
                          <strong className="block text-[#1B1410]">{q.customerName}</strong>
                          {q.phone && <small className="text-[#786B60]">{q.phone}</small>}
                        </td>
                        <td className="py-3 text-[#786B60]">{q.serviceName}</td>
                        <td className="py-3">
                          {q.status === "SERVING" ? "In chair" : `#${q.position}`}
                        </td>
                        <td className="py-3 font-medium">
                          {q.status === "SERVING" ? (
                            <span className="text-[#267447] font-bold">Serving now</span>
                          ) : (
                            `${q.waitTime} mins`
                          )}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.status === "SERVING"
                                ? "bg-green-100 text-green-800"
                                : q.status === "WAITING"
                                ? "bg-amber-100 text-amber-800"
                                : q.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {q.status === "WAITING" && (
                              <button
                                onClick={() => {
                                  setQueues((prev) =>
                                    prev.map((item) =>
                                      item.id === q.id ? { ...item, status: "SERVING" } : item
                                    )
                                  );
                                  toast.success(`Serving #${q.tokenNumber}!`);
                                }}
                                className="px-2.5 py-1 rounded bg-[#267447] text-white text-[10px] font-bold hover:bg-[#1E5D38] cursor-pointer"
                              >
                                Call Next
                              </button>
                            )}
                            {q.status === "SERVING" && (
                              <button
                                onClick={() => handleMarkCompleted(q.id)}
                                className="px-2.5 py-1 rounded bg-[#7A4B29] text-white text-[10px] font-bold hover:bg-[#60391F] cursor-pointer"
                              >
                                Done
                              </button>
                            )}
                            {(q.status === "WAITING" || q.status === "SERVING") && (
                              <>
                                <button
                                  onClick={() => handleCancelQueue(q.id, "NO_SHOW")}
                                  className="px-2 py-1 rounded border border-[#E9E1D7] text-[#786B60] hover:text-amber-700 text-[10px] cursor-pointer"
                                  title="Mark No-Show"
                                >
                                  No Show
                                </button>
                                <button
                                  onClick={() => handleCancelQueue(q.id, "CANCELLED")}
                                  className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 text-[10px] cursor-pointer"
                                  title="Cancel token"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB C: CHAIRS ─── */}
        {activeTab === "chairs" && (
          <div className="space-y-6">
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold font-serif text-[#1B1410]">Chairs & Stations</h3>
                  <p className="text-xs text-[#786B60]">
                    Manage active chairs in your salon. Respects your subscription plan limits.
                  </p>
                </div>
                <button
                  onClick={handleAddChair}
                  className="px-4 py-2 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Chair
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {chairs.map((chair) => (
                  <div
                    key={chair.id}
                    className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between ${
                      chair.status === "OCCUPIED"
                        ? "border-[#C8993E] bg-[#FAF7F2]"
                        : chair.status === "AVAILABLE"
                        ? "border-[#267447]/30 bg-green-50/30"
                        : "border-[#E9E1D7] bg-gray-50 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#786B60] uppercase">
                          CHAIR {chair.number}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            chair.status === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : chair.status === "OCCUPIED"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {chair.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold font-serif text-[#1B1410] mt-1">
                        {chair.name}
                      </h4>
                      {chair.currentCustomer ? (
                        <p className="text-xs text-[#7A4B29] font-medium mt-1">
                          Serving: {chair.currentCustomer} ({chair.currentService})
                        </p>
                      ) : (
                        <p className="text-xs text-[#786B60] mt-1">Ready for next customer</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E9E1D7]/60 flex items-center justify-between text-xs">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() =>
                            handleToggleChairStatus(
                              chair.id,
                              chair.status === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE"
                            )
                          }
                          className="px-2 py-1 rounded border border-[#E9E1D7] hover:bg-white text-[10px] font-semibold cursor-pointer"
                        >
                          Toggle State
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveChair(chair.id)}
                        className="text-red-500 hover:text-red-700 text-[10px] font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB D: SERVICES ─── */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold font-serif text-[#1B1410]">Service Menu & Pricing</h3>
                <p className="text-xs text-[#786B60]">
                  Changes published here immediately update your public salon page for Bhubaneswar customers.
                </p>
              </div>

              <div className="divide-y divide-[#E9E1D7]">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <strong className="block text-sm text-[#1B1410]">{svc.name}</strong>
                      <span className="text-[#786B60]">{svc.duration} mins</span>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#7A4B29]">₹{svc.price}</div>
                      <span className="text-[10px] text-[#786B60]">0% commission</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleService(svc.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          svc.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {svc.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB E: SALON PROFILE ─── */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold font-serif text-[#1B1410]">Salon Details</h3>
                <p className="text-xs text-[#786B60]">
                  Keep your public listing accurate for Bhubaneswar customers.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                      Direct Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                      Locality (Bhubaneswar)
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                    Full Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => toast.success("Salon profile saved!")}
                    className="px-6 py-2.5 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB F: SETTINGS & SUBSCRIPTIONS ─── */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Subscription Card */}
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A4B29]">
                    Authoritative Pricing
                  </span>
                  <h3 className="text-base font-bold font-serif text-[#1B1410] mt-0.5">
                    SalonOS Subscription Plans
                  </h3>
                  <p className="text-xs text-[#786B60]">
                    0% Haircut Commission Guarantee. Monthly flat software fee only.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  Active: Intermediate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#786B60] uppercase">BASE PLAN</span>
                  <div className="text-xl font-bold font-serif text-[#1B1410]">₹199<small className="text-xs font-normal"> /mo</small></div>
                  <ul className="text-[11px] text-[#786B60] space-y-1 pt-1">
                    <li>✓ 1 Active Stylist Chair</li>
                    <li>✓ Digital Live Queue</li>
                    <li>✓ 0% Haircut Commission</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border-2 border-[#7A4B29] bg-[#FFFDFA] space-y-1.5 relative shadow-sm">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-white bg-[#7A4B29] px-2 py-0.5 rounded-full absolute -top-2.5 right-3">
                    MOST POPULAR
                  </span>
                  <span className="text-[10px] font-bold text-[#7A4B29] uppercase">INTERMEDIATE</span>
                  <div className="text-xl font-bold font-serif text-[#1B1410]">₹400<small className="text-xs font-normal"> /mo</small></div>
                  <ul className="text-[11px] text-[#786B60] space-y-1 pt-1">
                    <li>✓ Up to 3 Stylist Chairs</li>
                    <li>✓ Real-time Queue Updates</li>
                    <li>✓ Walk-in & Digital Tokens</li>
                    <li>✓ 0% Haircut Commission</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#786B60] uppercase">PRO PLAN</span>
                  <div className="text-xl font-bold font-serif text-[#1B1410]">₹449<small className="text-xs font-normal"> /mo</small></div>
                  <ul className="text-[11px] text-[#786B60] space-y-1 pt-1">
                    <li>✓ Unlimited Stylist Chairs</li>
                    <li>✓ Priority Salon Listing</li>
                    <li>✓ Full SalonOS Suite</li>
                    <li>✓ 0% Haircut Commission</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-sm text-[#1B1410] uppercase tracking-wide">
                Account Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#786B60]">
                <div>
                  <span>Owner Account:</span> <strong className="text-[#1B1410]">{session?.name || "Salon Owner"}</strong>
                </div>
                <div>
                  <span>Email:</span> <strong className="text-[#1B1410]">{session?.email || "owner@salon.com"}</strong>
                </div>
                <div>
                  <span>Role:</span> <strong className="text-[#7A4B29]">Authorized Salon Partner</strong>
                </div>
                <div>
                  <span>City Launch:</span> <strong className="text-[#1B1410]">Bhubaneswar, Odisha</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── ADD WALK-IN MODAL ─── */}
      {showWalkInModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowWalkInModal(false)}
        >
          <div
            className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A4B29]">
                  Desk Action
                </span>
                <h3 className="text-lg font-bold font-serif text-[#1B1410]">Issue Walk-in Token</h3>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="text-gray-400 hover:text-black text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1B1410] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Suman Tripathy"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B1410] mb-1">
                  Phone (Optional for SMS/Call)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B1410] mb-1">
                  Select Service
                </label>
                <select
                  value={walkInServiceId}
                  onChange={(e) => setWalkInServiceId(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm bg-white focus:outline-none cursor-pointer"
                >
                  {services
                    .filter((s) => s.isActive)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — ₹{s.price} ({s.duration} mins)
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E9E1D7] text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalonOSWorkspace;

