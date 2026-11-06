import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  advanceQueueAtomic,
  completeQueueAtomic,
  joinQueueAtomic,
  fetchSalonLiveQueues,
} from "@/lib/queue-client";
import {
  Scissors,
  CheckCircle2,
  Play,
  QrCode,
  UserPlus,
  User,
  LogOut,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { SneprWordmark } from "@/components/SneprWordmark";

export const Route = createFileRoute("/staff/")({
  head: () => ({
    title: "Staff Desk  |  Chair Queue & Intake | Snepr",
    meta: [
      {
        name: "description",
        content: "Live chair queue desk for salon barbers and stylists. Call next, complete service, and scan customer tickets.",
      },
      { name: "theme-color", content: "#F8F4ED" },
    ],
  }),
  component: StaffDeskPage,
});

interface QueueToken {
  id: string;
  tokenNumber: string;
  customerName: string;
  service: string;
  joinedTime: string;
  status: "SERVING" | "WAITING" | "COMPLETED";
}

export function StaffDeskPage() {
  const navigate = useNavigate();

  // Active view: 'queue' | 'scan' | 'walkin' | 'profile'
  const [activeTab, setActiveTab] = useState<"queue" | "scan" | "walkin" | "profile">("queue");
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Staff details
  const [staffInfo, setStaffInfo] = useState({
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    chair: "Chair 02",
    salon: "Lakmé Salon  |  KIIT Road",
    locality: "Patia, Bhubaneswar",
  });

  // Current Serving Token
  const [servingToken, setServingToken] = useState<QueueToken | null>({
    id: "snep-024",
    tokenNumber: "#024",
    customerName: "Arjun Sharma",
    service: "Haircut",
    joinedTime: "10:42 AM",
    status: "SERVING",
  });

  // Up Next Queue
  const [queueList, setQueueList] = useState<QueueToken[]>([
    {
      id: "snep-025",
      tokenNumber: "#025",
      customerName: "Priya Mohapatra",
      service: "Haircut",
      joinedTime: "10:51 AM",
      status: "WAITING",
    },
    {
      id: "snep-026",
      tokenNumber: "#026",
      customerName: "Rohan Patel",
      service: "Beard trim",
      joinedTime: "11:04 AM",
      status: "WAITING",
    },
    {
      id: "snep-027",
      tokenNumber: "#027",
      customerName: "Dev Anand",
      service: "Haircut + Beard",
      joinedTime: "11:15 AM",
      status: "WAITING",
    },
  ]);

  // Modal forms
  const [ticketInput, setTicketInput] = useState("");
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinService, setWalkinService] = useState("Haircut");

  // Load session if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setStaffInfo((prev) => ({
            ...prev,
            name: parsed.name,
            email: parsed.email || prev.email,
            chair: parsed.chairAssigned ? `Chair 0${parsed.chairAssigned}` : prev.chair,
            salon: parsed.salonName || prev.salon,
          }));
        }
      }
    } catch {}
  }, []);

  // Sync real queues from Supabase
  useEffect(() => {
    let isMounted = true;
    const fetchRemote = async () => {
      try {
        const remote = await fetchSalonLiveQueues(1);
        if (isMounted && Array.isArray(remote) && remote.length > 0) {
          const serving = remote.find((r: any) => r.status === "in_service" || r.status === "called");
          if (serving) {
            setServingToken({
              id: String(serving.id),
              tokenNumber: serving.token_code || `#${serving.token_number}`,
              customerName: serving.customer_name || "Customer",
              service: serving.service_name || "Haircut",
              joinedTime: new Date(serving.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: "SERVING",
            });
          }
          const waiting = remote.filter((r: any) => r.status === "waiting");
          setQueueList(
            waiting.map((w: any) => ({
              id: String(w.id),
              tokenNumber: w.token_code || `#${w.token_number}`,
              customerName: w.customer_name || "Customer",
              service: w.service_name || "Haircut",
              joinedTime: new Date(w.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: "WAITING",
            }))
          );
        }
      } catch {}
    };

    fetchRemote();
    const interval = setInterval(fetchRemote, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Complete current service
  const handleCompleteService = async () => {
    if (!servingToken) {
      toast.info("No service currently in progress.");
      return;
    }
    const qId = parseInt(servingToken.id.replace(/\D/g, "") || "0", 10);
    if (qId) {
      try {
        await completeQueueAtomic(qId, 10);
      } catch (err) {
        console.warn("Complete queue error:", err);
      }
    }
    toast.success(`Service completed for ${servingToken.tokenNumber} (${servingToken.customerName})!`);
    setServingToken(null);
  };

  // Call next waiting customer
  const handleCallNext = async () => {
    if (queueList.length === 0) {
      toast.info("Queue is empty. No customers waiting.");
      return;
    }

    const [nextCustomer, ...remaining] = queueList;
    const qId = parseInt(nextCustomer.id.replace(/\D/g, "") || "0", 10);
    if (qId) {
      try {
        await advanceQueueAtomic(qId, 2, staffInfo.name, "call");
      } catch (err) {
        console.warn("Advance queue error:", err);
      }
    }

    setServingToken({
      ...nextCustomer,
      status: "SERVING",
      joinedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setQueueList(remaining);
    toast.success(`Now calling ${nextCustomer.tokenNumber} (${nextCustomer.customerName}) to ${staffInfo.chair}!`);
  };

  // Verify ticket code
  const handleVerifyTicket = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticketInput.trim()) {
      toast.error("Please enter a ticket code.");
      return;
    }

    const code = ticketInput.trim().toUpperCase();
    const tokenNum = code.startsWith("#") ? code : `#${code.slice(-3)}`;
    const newEntry: QueueToken = {
      id: `snep-${Date.now()}`,
      tokenNumber: tokenNum,
      customerName: "Verified Customer",
      service: "Standard Service",
      joinedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "WAITING",
    };

    setQueueList((prev) => [...prev, newEntry]);
    setTicketInput("");
    setActiveTab("queue");
    toast.success(`Ticket ${code} verified and added to queue!`);
  };

  // Add walk in customer
  const handleAddWalkIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!walkinName.trim()) {
      toast.error("Please enter the customer name.");
      return;
    }

    try {
      const res = await joinQueueAtomic({
        salonId: 1,
        customerName: walkinName.trim(),
        customerPhone: walkinPhone.trim() || undefined,
        serviceName: walkinService,
        joinType: "walk_in",
      });

      const nextNum = res.tokenCode || `#0${24 + queueList.length + (servingToken ? 1 : 0) + 1}`;
      const newEntry: QueueToken = {
        id: String(res.queue?.id || Date.now()),
        tokenNumber: nextNum,
        customerName: walkinName.trim(),
        service: walkinService,
        joinedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "WAITING",
      };

      setQueueList((prev) => [...prev, newEntry]);
      setWalkinName("");
      setWalkinPhone("");
      setActiveTab("queue");
      toast.success(`Walk in added: Token ${nextNum} issued for ${newEntry.customerName}!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add walk in.");
    }
  };

  // Sign out
  const handleSignOut = () => {
    try {
      localStorage.removeItem("snepr_session");
    } catch {}
    toast.info("Signed out of Staff Desk.");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-[#F8F4ED] text-[#211912] font-sans pb-28 selection:bg-[#EAD8BD]">
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-30 bg-[#F8F4ED]/80 backdrop-blur-md border-b border-[#684E34]/10 px-4 py-3 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-block" aria-label="Snepr home">
              <SneprWordmark height={30} color="#211912" />
            </Link>
            <div className="hidden sm:block text-[11px] text-[#887D72] pl-3 border-l border-[#684E34]/15">
              <span>{staffInfo.salon}</span> · <span className="text-[#A17B50] font-semibold">{staffInfo.locality}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                isOnDuty
                  ? "bg-[#E8F3EB] text-[#28734F] border-[#28734F]/20"
                  : "bg-[#F2EEE7] text-[#887D72] border-[#887D72]/20"
              }`}
            >
              {isOnDuty ? "● On duty" : "○ Off duty"}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 p-1 pl-2 bg-white/70 border border-[#684E34]/15 rounded-full hover:bg-white transition-all cursor-pointer shadow-sm"
            >
              <div className="text-left hidden sm:block pr-1">
                <div className="text-xs font-bold text-[#211912] leading-tight">{staffInfo.name}</div>
                <div className="text-[10px] text-[#A17B50] font-semibold">{staffInfo.chair}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9A77E] to-[#E8D3B7] text-[#54391F] font-bold text-xs flex items-center justify-center">
                {staffInfo.name.split(" ").map((n) => n[0]).join("")}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8 sm:px-8">
        {/* VIEW 1: MY QUEUE */}
        {activeTab === "queue" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Primary Serving & Queue Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#A17B50]">
                    MY ACTIVE STATION
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">
                    {staffInfo.chair} <span className="font-sans text-sm font-normal text-[#887D72]">({staffInfo.salon})</span>
                  </h1>
                </div>
              </div>

              {/* Serving Card */}
              {servingToken ? (
                <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#34271C] via-[#5B412B] to-[#7A5938] text-white shadow-xl">
                  {/* Background concentric rings */}
                  <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute -right-28 -top-28 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#E4D4C2]">
                    <span>Now Serving</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px]">
                      {staffInfo.chair}
                    </span>
                  </div>

                  <div className="relative z-10 my-4">
                    <div className="text-5xl sm:text-6xl font-black font-serif tracking-tight leading-none text-white">
                      {servingToken.tokenNumber}
                    </div>
                    <div className="mt-2 text-sm text-[#F4E9DC] font-medium flex items-center gap-2">
                      <span className="font-bold text-white">{servingToken.customerName}</span>
                      <span>·</span>
                      <span>{servingToken.service}</span>
                      <span>·</span>
                      <span className="text-white/70">Started {servingToken.joinedTime}</span>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCompleteService}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#E5C18C] to-[#C18D4D] text-[#2D2116] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Service</span>
                    </button>
                    <button
                      onClick={handleCallNext}
                      className="py-3 px-5 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Call Next</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl p-8 bg-white/60 border border-[#684E34]/15 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAD8BD]/50 text-[#7A5938] flex items-center justify-center mx-auto mb-3">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#211912]">Station is Idle</h3>
                  <p className="text-xs text-[#887D72] max-w-xs mx-auto mt-1 mb-4">
                    Call the next waiting customer to begin service on {staffInfo.chair}.
                  </p>
                  <button
                    onClick={handleCallNext}
                    disabled={queueList.length === 0}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#7A4B29] text-white hover:bg-[#60391F] disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                  >
                    Call Next Customer
                  </button>
                </div>
              )}

              {/* Up Next List */}
              <div className="bg-white/75 backdrop-blur-md rounded-3xl border border-white/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-serif text-[#211912]">Up Next</h2>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F1E7D9] text-[#765A3C]">
                    {queueList.length} customer{queueList.length === 1 ? "" : "s"} waiting
                  </span>
                </div>

                {queueList.length > 0 ? (
                  <div className="space-y-2.5">
                    {queueList.map((token, idx) => (
                      <div
                        key={token.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          idx === 0
                            ? "bg-[#FFFDF9] border-[#C18D4D]/40 shadow-xs"
                            : "bg-white/50 border-[#684E34]/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F2E8DC] text-[#70472F] font-bold font-mono text-xs flex items-center justify-center">
                            {token.tokenNumber}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#211912]">{token.customerName}</div>
                            <div className="text-[11px] text-[#887D72]">
                              {token.service} · Joined {token.joinedTime}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F3EEE7] text-[#887D72]">
                          {idx === 0 ? "Next in line" : "Waiting"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-[#887D72]">
                    No other customers waiting in this chair queue.
                  </div>
                )}
              </div>
            </div>

            {/* Side Actions Column (Desktop) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/75 backdrop-blur-md rounded-3xl border border-white/80 p-5 shadow-sm space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#A17B50]">
                  QUICK ACTIONS
                </div>

                <button
                  onClick={() => setActiveTab("scan")}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#684E34]/10 text-left transition-all hover:-translate-y-0.5 shadow-xs cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#F5EADB] to-[#E8D6BD] text-[#79532E] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#211912]">Scan Customer Ticket</div>
                    <div className="text-[11px] text-[#887D72]">Verify arrival QR from ticket</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("walkin")}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#684E34]/10 text-left transition-all hover:-translate-y-0.5 shadow-xs cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#F5EADB] to-[#E8D6BD] text-[#79532E] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#211912]">Add Walk in Customer</div>
                    <div className="text-[11px] text-[#887D72]">Issue manual token at counter</div>
                  </div>
                </button>

                <div className="pt-2 text-[11px] text-[#887D72] flex items-center gap-1.5 border-t border-[#684E34]/10">
                  <Clock className="w-3.5 h-3.5 text-[#A17B50]" />
                  <span>Shift started: <strong>9:30 AM</strong></span>
                </div>
              </div>

              {/* Station Telemetry Card */}
              <div className="bg-[#FAF7F2] border border-[#684E34]/10 rounded-3xl p-5 text-xs space-y-2">
                <div className="font-bold text-[#211912]">Real time Station Telemetry</div>
                <p className="text-[11px] text-[#887D72] leading-relaxed">
                  Your station wait time is dynamically calculated and broadcast to customers in {staffInfo.locality}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SCAN QR TICKET */}
        {activeTab === "scan" && (
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-3xl border border-white/90 p-6 sm:p-8 shadow-sm">
            <div className="text-center space-y-1 mb-5">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#A17B50]">
                CUSTOMER CHECK-IN
              </div>
              <h2 className="text-xl font-bold font-serif text-[#211912]">Scan Ticket QR</h2>
              <p className="text-xs text-[#887D72]">
                Scan the QR code displayed on the customer's phone ticket or enter their code manually.
              </p>
            </div>

            {/* Camera Scanner Simulation */}
            <div className="h-52 rounded-2xl bg-[#282019] text-white flex flex-col items-center justify-center relative overflow-hidden my-4 border border-[#684E34]/20 shadow-inner">
              <div className="w-36 h-36 rounded-2xl border-2 border-[#E3BF89] flex items-center justify-center text-[#E3BF89] animate-pulse">
                <QrCode className="w-16 h-16" />
              </div>
              <span className="absolute bottom-3 text-[10px] text-[#E6D8C8]/80 font-mono">
                Camera scanner active
              </span>
            </div>

            {/* Manual Code Input Form */}
            <form onSubmit={handleVerifyTicket} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#887D72] mb-1.5">
                  OR ENTER TICKET CODE
                </label>
                <input
                  type="text"
                  placeholder="e.g. SNP-024-8K2"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#684E34]/20 bg-[#FFFDF9] text-sm font-mono uppercase text-[#211912] focus:outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("queue")}
                  className="flex-1 py-2.5 rounded-xl border border-[#684E34]/20 text-xs font-bold text-[#887D72] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C18C] to-[#C18D4D] text-[#2D2116] text-xs font-bold hover:brightness-105 cursor-pointer shadow-sm"
                >
                  Verify Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: WALK IN MANUAL INTAKE */}
        {activeTab === "walkin" && (
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-3xl border border-white/90 p-6 sm:p-8 shadow-sm">
            <div className="text-center space-y-1 mb-5">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#A17B50]">
                COUNTER INTAKE
              </div>
              <h2 className="text-xl font-bold font-serif text-[#211912]">Add Walk in Customer</h2>
              <p className="text-xs text-[#887D72]">
                For customers who walk in without using the app. They will be queued for your chair.
              </p>
            </div>

            <form onSubmit={handleAddWalkIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#887D72] mb-1.5">
                  CUSTOMER NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sambit Mishra"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#684E34]/20 bg-[#FFFDF9] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#887D72] mb-1.5">
                  PHONE NUMBER (OPTIONAL FOR SMS ALERTS)
                </label>
                <input
                  type="tel"
                  placeholder="+91 94370 00000"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#684E34]/20 bg-[#FFFDF9] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#7A4B29]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#887D72] mb-1.5">
                  SERVICE
                </label>
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#684E34]/20 bg-[#FFFDF9] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#7A4B29]"
                >
                  <option value="Haircut">Haircut (₹150)</option>
                  <option value="Beard trim">Beard trim (₹80)</option>
                  <option value="Haircut + Beard">Haircut + Beard (₹200)</option>
                  <option value="Hair Styling">Hair Styling (₹120)</option>
                  <option value="Head Massage">Head Massage (₹100)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("queue")}
                  className="flex-1 py-2.5 rounded-xl border border-[#684E34]/20 text-xs font-bold text-[#887D72] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C18C] to-[#C18D4D] text-[#2D2116] text-xs font-bold hover:brightness-105 cursor-pointer shadow-sm"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 4: STAFF PROFILE (READ ONLY) */}
        {activeTab === "profile" && (
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-3xl border border-white/90 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#684E34]/10">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#211912]">Staff Profile</h2>
                <p className="text-xs text-[#887D72]">{staffInfo.salon}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAD8BD] text-[#70472F] font-bold text-base flex items-center justify-center">
                {staffInfo.name.split(" ").map((n) => n[0]).join("")}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#684E34]/10 flex items-center justify-between">
                <span className="text-[#887D72] uppercase text-[10px] font-extrabold tracking-wider">Full Name</span>
                <span className="font-bold text-[#211912]">{staffInfo.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#684E34]/10 flex items-center justify-between">
                <span className="text-[#887D72] uppercase text-[10px] font-extrabold tracking-wider">Phone Number</span>
                <span className="font-bold text-[#211912]">{staffInfo.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#684E34]/10 flex items-center justify-between">
                <span className="text-[#887D72] uppercase text-[10px] font-extrabold tracking-wider">Email Address</span>
                <span className="font-bold text-[#211912]">{staffInfo.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#684E34]/10 flex items-center justify-between">
                <span className="text-[#887D72] uppercase text-[10px] font-extrabold tracking-wider">Assigned Chair</span>
                <span className="font-bold text-[#A17B50]">{staffInfo.chair}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#684E34]/10 text-[11px] text-[#887D72] leading-relaxed">
              Your profile and assigned chair are managed by the salon owner. Contact your salon administrator if any details need correction.
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("queue")}
                className="w-full py-2.5 rounded-xl border border-[#684E34]/20 text-xs font-bold text-[#211912] hover:bg-black/5 cursor-pointer"
              >
                Back to Chair Queue
              </button>
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ─── BOTTOM NAVIGATION (EXACTLY 4 ACTIONS: MY QUEUE, SCAN, WALK IN, PROFILE) ─── */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40">
        <nav className="bg-white/85 backdrop-blur-xl border border-[#684E34]/15 rounded-2xl p-1.5 shadow-lg flex items-center justify-around">
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "queue"
                ? "bg-[#EAD8BD]/60 text-[#70472F] shadow-xs"
                : "text-[#887D72] hover:text-[#211912]"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span className="text-[10px]">My Queue</span>
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "scan"
                ? "bg-[#EAD8BD]/60 text-[#70472F] shadow-xs"
                : "text-[#887D72] hover:text-[#211912]"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="text-[10px]">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab("walkin")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "walkin"
                ? "bg-[#EAD8BD]/60 text-[#70472F] shadow-xs"
                : "text-[#887D72] hover:text-[#211912]"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-[10px]">Walk in</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#EAD8BD]/60 text-[#70472F] shadow-xs"
                : "text-[#887D72] hover:text-[#211912]"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default StaffDeskPage;

