import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Users,
  Armchair,
  Scissors,
  Clock,
  Store,
  Settings,
  Plus,
  Check,
  X,
  Phone,
  AlertCircle,
  Play,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Sparkles,
  UserPlus,
  BarChart3,
  HelpCircle,
  Send,
  Shield,
  Layers,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

export type SalonOSTab = "overview" | "queue" | "chairs" | "staff" | "services" | "customers" | "analytics" | "profile" | "settings";

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
  barberName: string;
  status: "AVAILABLE" | "OCCUPIED" | "OFFLINE";
  currentCustomer?: string;
  currentService?: string;
  elapsedMins?: number;
}

export interface StaffItem {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  chairAssigned: string;
  servedToday: number;
  status: "ON_DUTY" | "OFF_DUTY";
}

const INITIAL_STAFF: StaffItem[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    role: "Senior Barber",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    chairAssigned: "Station 1",
    servedToday: 12,
    status: "ON_DUTY",
  },
  {
    id: 2,
    name: "Amit Dash",
    role: "Master Stylist",
    phone: "+91 94370 22334",
    email: "amit@example.com",
    chairAssigned: "Station 2",
    servedToday: 9,
    status: "ON_DUTY",
  },
  {
    id: 3,
    name: "Pooja Sen",
    role: "Grooming Specialist",
    phone: "+91 99371 88990",
    email: "pooja@example.com",
    chairAssigned: "Station 3",
    servedToday: 7,
    status: "ON_DUTY",
  },
  {
    id: 4,
    name: "Bikash Raut",
    role: "Junior Stylist",
    phone: "+91 91240 55667",
    email: "bikash@example.com",
    chairAssigned: "Station 4",
    servedToday: 0,
    status: "OFF_DUTY",
  },
];

const INITIAL_CHAIRS: ChairItem[] = [
  {
    id: 1,
    number: 1,
    name: "Station 1",
    barberName: "Rahul Kumar",
    status: "OCCUPIED",
    currentCustomer: "Rohan Patel",
    currentService: "Haircut",
    elapsedMins: 14,
  },
  {
    id: 2,
    number: 2,
    name: "Station 2",
    barberName: "Amit Dash",
    status: "AVAILABLE",
  },
  {
    id: 3,
    number: 3,
    name: "Station 3",
    barberName: "Pooja Sen",
    status: "OCCUPIED",
    currentCustomer: "Aman Sharma",
    currentService: "Beard trim",
    elapsedMins: 8,
  },
  {
    id: 4,
    number: 4,
    name: "Station 4",
    barberName: "Bikash Raut",
    status: "OFFLINE",
  },
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
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
  },
  {
    id: 102,
    tokenNumber: 102,
    customerName: "Aman Sharma",
    phone: "+91 98610 22334",
    serviceName: "Beard trim",
    position: 0,
    waitTime: 0,
    status: "SERVING",
    chairAssigned: 3,
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 103,
    tokenNumber: 103,
    customerName: "Priya Das",
    phone: "+91 99370 33445",
    serviceName: "Hair Styling",
    position: 1,
    waitTime: 10,
    status: "WAITING",
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 104,
    tokenNumber: 104,
    customerName: "Subhashree Ray",
    phone: "+91 98532 99881",
    serviceName: "Haircut + Facial",
    position: 2,
    waitTime: 22,
    status: "WAITING",
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
];

export function SalonOSWorkspace({
  session,
  initialTab = "overview",
}: {
  session: any;
  initialTab?: SalonOSTab;
}) {
  const navigate = useNavigate();

  // Exactly 4 tabs: overview, staff, analytics, profile
  const [activeTab, setActiveTab] = useState<SalonOSTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Salon info
  const [salonName, setSalonName] = useState(
    session?.salonName || "Lakmé Salon  |  KIIT Road"
  );
  const [locality, setLocality] = useState("Patia, Bhubaneswar");
  const [ownerName, setOwnerName] = useState(session?.name || "Arjun Sharma");
  const [ownerEmail, setOwnerEmail] = useState(
    session?.email || "arjun@example.com"
  );
  const [ownerPhone, setOwnerPhone] = useState("+91 92373 62221");

  // Subscriptions state
  const [currentPlan, setCurrentPlan] = useState<"base" | "intermediate" | "pro">(
    "intermediate"
  );

  // Queues & Chairs state
  const [queues, setQueues] = useState<QueueItem[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_active_queues");
      return stored ? JSON.parse(stored) : INITIAL_QUEUES;
    } catch {
      return INITIAL_QUEUES;
    }
  });

  const [chairs, setChairs] = useState<ChairItem[]>(INITIAL_CHAIRS);
  const [staffList, setStaffList] = useState<StaffItem[]>(INITIAL_STAFF);

  // Modals state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInService, setWalkInService] = useState("Haircut");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Services State
  const [servicesList, setServicesList] = useState([
    { id: 1, name: "Signature Haircut & Styling", price: 280, durationMins: 30, category: "Hair", isActive: true },
    { id: 2, name: "Beard Sculpt & Razor Finish", price: 150, durationMins: 15, category: "Beard", isActive: true },
    { id: 3, name: "Deep Nourishing Hair Spa", price: 650, durationMins: 45, category: "Spa", isActive: true },
    { id: 4, name: "Charcoal Face Clean up", price: 400, durationMins: 30, category: "Skin", isActive: true },
    { id: 5, name: "Hot Towel Shave & Oil Massage", price: 200, durationMins: 20, category: "Grooming", isActive: true },
  ]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30");
  const [newServiceCategory, setNewServiceCategory] = useState("Hair");

  // Customers State
  const [customerSearch, setCustomerSearch] = useState("");
  const [customersList, setCustomersList] = useState([
    { id: 1, name: "Rohan Patel", phone: "+91 94370 11223", totalVisits: 5, lastVisit: "Today", loyaltyPoints: 50, favoriteService: "Haircut" },
    { id: 2, name: "Aman Sharma", phone: "+91 98610 22334", totalVisits: 8, lastVisit: "Today", loyaltyPoints: 80, favoriteService: "Beard trim" },
    { id: 3, name: "Priya Das", phone: "+91 99370 33445", totalVisits: 3, lastVisit: "Today", loyaltyPoints: 30, favoriteService: "Hair Styling" },
    { id: 4, name: "Subhashree Ray", phone: "+91 98532 99881", totalVisits: 6, lastVisit: "2 days ago", loyaltyPoints: 60, favoriteService: "Haircut + Facial" },
    { id: 5, name: "Debabrata Dash", phone: "+91 94380 55432", totalVisits: 11, lastVisit: "Yesterday", loyaltyPoints: 110, favoriteService: "Signature Haircut" },
  ]);
  const [inviteName, setInviteName] = useState("");
  const [inviteContact, setInviteContact] = useState("");
  const [inviteRole, setInviteRole] = useState("Barber");
  const [inviteChair, setInviteChair] = useState("Station 4");

  // Support ticket form state
  const [supportCategory, setSupportCategory] = useState("Technical Support");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Sync queues to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("snepr_active_queues", JSON.stringify(queues));
    } catch {}
  }, [queues]);

  // Derived counts
  const waitingCustomers = queues.filter((q) => q.status === "WAITING");
  const servingCustomers = queues.filter((q) => q.status === "SERVING");

  // Queue Operations
  const handleCallNext = () => {
    const nextWaiting = queues.find((q) => q.status === "WAITING");
    if (!nextWaiting) {
      toast.info("No customers currently waiting in queue.");
      return;
    }

    const freeChair = chairs.find((c) => c.status === "AVAILABLE");
    const chairNum = freeChair?.number || 2;

    setQueues((prev) =>
      prev.map((q) =>
        q.id === nextWaiting.id
          ? { ...q, status: "SERVING", chairAssigned: chairNum }
          : q
      )
    );

    setChairs((prev) =>
      prev.map((c) =>
        c.number === chairNum
          ? {
              ...c,
              status: "OCCUPIED",
              currentCustomer: nextWaiting.customerName,
              currentService: nextWaiting.serviceName,
              elapsedMins: 0,
            }
          : c
      )
    );

    toast.success(
      `Token #${nextWaiting.tokenNumber} (${nextWaiting.customerName}) called to Station ${chairNum}!`
    );
  };

  const handleCompleteService = (queueId: number) => {
    const item = queues.find((q) => q.id === queueId);
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status: "COMPLETED" } : q))
    );

    if (item?.chairAssigned) {
      setChairs((prev) =>
        prev.map((c) =>
          c.number === item.chairAssigned
            ? {
                ...c,
                status: "AVAILABLE",
                currentCustomer: undefined,
                currentService: undefined,
                elapsedMins: undefined,
              }
            : c
        )
      );
    }

    toast.success(
      `Service completed for Token #${item?.tokenNumber || queueId}! (+10 Loyalty Points awarded)`
    );
  };

  const handleAdvanceQueue = (queueId: number) => {
    const item = queues.find((q) => q.id === queueId);
    if (!item) return;
    const freeChair = chairs.find((c) => c.status === "AVAILABLE");
    const chairNum = freeChair?.number || 1;

    setQueues((prev) =>
      prev.map((q) =>
        q.id === queueId ? { ...q, status: "SERVING", chairAssigned: chairNum } : q
      )
    );

    setChairs((prev) =>
      prev.map((c) =>
        c.number === chairNum
          ? {
              ...c,
              status: "OCCUPIED",
              currentCustomer: item.customerName,
              currentService: item.serviceName,
              elapsedMins: 0,
            }
          : c
      )
    );

    toast.success(`Token #${item.tokenNumber} (${item.customerName}) is now being served at Chair ${chairNum}!`);
  };

  const handleCompleteQueue = (queueId: number) => {
    handleCompleteService(queueId);
  };

  const handleCancelQueue = (queueId: number) => {
    const item = queues.find((q) => q.id === queueId);
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status: "CANCELLED" } : q))
    );

    if (item?.chairAssigned) {
      setChairs((prev) =>
        prev.map((c) =>
          c.number === item.chairAssigned
            ? {
                ...c,
                status: "AVAILABLE",
                currentCustomer: undefined,
                currentService: undefined,
                elapsedMins: undefined,
              }
            : c
        )
      );
    }

    toast.info(`Token #${item?.tokenNumber || queueId} has been cancelled.`);
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      toast.error("Please enter the customer name.");
      return;
    }

    const maxToken = queues.reduce(
      (max, q) => Math.max(max, q.tokenNumber),
      100
    );
    const nextToken = maxToken + 1;
    const position = waitingCustomers.length + 1;
    const waitTime = position * 12;

    const newQueueItem: QueueItem = {
      id: Date.now(),
      tokenNumber: nextToken,
      customerName: walkInName.trim(),
      phone: walkInPhone.trim() || undefined,
      serviceName: walkInService,
      position,
      waitTime,
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };

    setQueues([...queues, newQueueItem]);
    setWalkInName("");
    setWalkInPhone("");
    setShowWalkInModal(false);
    toast.success(`Walk in added: Token #${nextToken} issued for ${newQueueItem.customerName}!`);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) {
      toast.error("Please enter service name and price.");
      return;
    }
    const newSvc = {
      id: Date.now(),
      name: newServiceName.trim(),
      price: parseInt(newServicePrice, 10) || 200,
      durationMins: parseInt(newServiceDuration, 10) || 30,
      category: newServiceCategory,
      isActive: true,
    };
    setServicesList([...servicesList, newSvc]);
    setNewServiceName("");
    setNewServicePrice("");
    toast.success(`Service "${newSvc.name}" added to menu!`);
  };

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteContact.trim()) {
      toast.error("Please fill in staff name and contact.");
      return;
    }

    const newStaff: StaffItem = {
      id: Date.now(),
      name: inviteName.trim(),
      role: inviteRole,
      phone: inviteContact.trim(),
      email: `${inviteName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      chairAssigned: inviteChair,
      servedToday: 0,
      status: "ON_DUTY",
    };

    setStaffList([...staffList, newStaff]);
    setShowInviteModal(false);
    setInviteName("");
    setInviteContact("");
    toast.success(`Staff invite sent to ${newStaff.name}! Added to ${newStaff.chairAssigned}.`);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error("Please fill in subject and description.");
      return;
    }

    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setSupportSubject("");
      setSupportMessage("");
      toast.success("Support ticket #SN-8921 opened! Snepr team will respond via email within 2 hours.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F7F3ED] text-[#211912] font-sans flex flex-col selection:bg-[#EAD8BD]">
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-30 bg-[#F7F3ED]/90 backdrop-blur-md border-b border-[#EEE5DA] px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-block" aria-label="Snepr home">
              <SneprWordmark height={30} color="#211912" />
            </Link>
            <div className="hidden sm:block text-[11px] text-[#8C8074] pl-3 border-l border-[#EEE5DA]">
              <span className="font-bold text-[#211912]">SalonOS</span> · {salonName} ({locality})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#211912]">{ownerName}</div>
              <div className="text-[10px] text-[#8C8074] uppercase tracking-wider font-semibold">
                Salon Owner · {currentPlan.toUpperCase()} TIER
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#E7D6C3] text-[#70472F] font-bold text-xs flex items-center justify-center border border-[#EEE5DA]">
              {ownerName.split(" ").map((n) => n[0]).join("")}
            </div>
          </div>
        </div>
      </header>

      {/* ─── WORKSPACE LAYOUT (SIDEBAR ON DESKTOP, MAIN AREA) ─── */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* DESKTOP SIDEBAR (EXACTLY 4 TABS: OVERVIEW, STAFF, ANALYTICS, PROFILE) */}
        <aside className="hidden md:flex w-56 flex-col justify-between border-r border-[#EEE5DA] p-5 bg-[#F0E8DE]/60">
          <div className="space-y-6">
            <div className="px-2">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                SALON WORKSPACE
              </div>
              <div className="text-sm font-serif font-bold text-[#70472F] mt-0.5 truncate">
                {salonName}
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab("overview"); navigate({ to: "/salonos/dashboard" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Armchair className="w-4 h-4 text-[#70472F]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab("queue"); navigate({ to: "/salonos/queue" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "queue"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Clock className="w-4 h-4 text-[#70472F]" />
                <span>Live Queue</span>
              </button>

              <button
                onClick={() => { setActiveTab("chairs"); navigate({ to: "/salonos/chairs" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "chairs" || activeTab === "staff"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Users className="w-4 h-4 text-[#70472F]" />
                <span>Chairs & Staff</span>
              </button>

              <button
                onClick={() => { setActiveTab("services"); navigate({ to: "/salonos/services" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "services"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Scissors className="w-4 h-4 text-[#70472F]" />
                <span>Services</span>
              </button>

              <button
                onClick={() => { setActiveTab("customers"); navigate({ to: "/salonos/customers" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "customers"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#70472F]" />
                <span>Customers</span>
              </button>

              <button
                onClick={() => { setActiveTab("analytics"); navigate({ to: "/salonos/analytics" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#70472F]" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => { setActiveTab("settings"); navigate({ to: "/salonos/settings" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "settings" || activeTab === "profile"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Settings className="w-4 h-4 text-[#70472F]" />
                <span>Settings & Plans</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#EEE5DA] space-y-2">
            <Link
              to="/staff"
              className="w-full py-2 px-3 rounded-xl bg-white/60 hover:bg-white text-[11px] font-bold text-[#70472F] flex items-center justify-center gap-1.5 transition-colors border border-[#EEE5DA]"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Switch to Staff Desk</span>
            </Link>

            <button
              onClick={() => {
                try {
                  localStorage.removeItem("snepr_session");
                } catch {}
                toast.info("Signed out of SalonOS.");
                navigate({ to: "/login" });
              }}
              className="w-full py-2 px-3 text-[11px] font-semibold text-[#8C8074] hover:text-red-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header with Call Next & Add Walk in */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    TODAY'S OPERATIONS
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Salon Overview</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    Live chairs, telemetry, and customer queue for {salonName}.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCallNext}
                    className="px-4 py-2.5 rounded-xl bg-[#477B5D] hover:bg-[#38624A] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Call Next</span>
                  </button>

                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Walk in</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-semibold text-[#8C8074]">Customers today</div>
                  <div className="text-3xl font-bold font-serif text-[#211912] mt-1">28</div>
                  <div className="text-[11px] text-[#477B5D] font-bold mt-1">↑ 14% vs yesterday</div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-semibold text-[#8C8074]">Avg. service time</div>
                  <div className="text-3xl font-bold font-serif text-[#211912] mt-1">
                    26 <span className="text-xs font-sans font-normal text-[#8C8074]">min</span>
                  </div>
                  <div className="text-[11px] text-[#8C8074] mt-1">Across completed services</div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-semibold text-[#8C8074]">Queue completion</div>
                  <div className="text-3xl font-bold font-serif text-[#211912] mt-1">91%</div>
                  <div className="text-[11px] text-[#477B5D] font-bold mt-1">↑ 3.2% this week</div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-semibold text-[#8C8074]">Repeat customers</div>
                  <div className="text-3xl font-bold font-serif text-[#211912] mt-1">34%</div>
                  <div className="text-[11px] text-[#8C8074] mt-1">Snepr loyalty members</div>
                </div>
              </div>

              {/* Live Chair Grid & Live Queue Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Chairs Status Grid */}
                <div className="lg:col-span-6 bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EEE5DA]">
                    <div>
                      <h2 className="text-base font-bold font-serif text-[#211912]">Live Chairs</h2>
                      <p className="text-[11px] text-[#8C8074]">Active station telemetry</p>
                    </div>
                    <span className="text-xs font-bold text-[#70472F] bg-[#F1E8DC] px-2.5 py-1 rounded-full">
                      {chairs.filter((c) => c.status === "OCCUPIED").length} Busy ·{" "}
                      {chairs.filter((c) => c.status === "AVAILABLE").length} Free
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chairs.map((chair) => (
                      <div
                        key={chair.id}
                        className="p-3.5 rounded-2xl border border-[#EEE5DA] bg-[#FFFDF9] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#211912]">{chair.name}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                chair.status === "AVAILABLE"
                                  ? "bg-[#5D9871]"
                                  : chair.status === "OCCUPIED"
                                  ? "bg-[#D49A4D]"
                                  : "bg-[#B8AAA0]"
                              }`}
                            />
                            <span
                              className={
                                chair.status === "AVAILABLE"
                                  ? "text-[#5D9871]"
                                  : chair.status === "OCCUPIED"
                                  ? "text-[#D49A4D]"
                                  : "text-[#B8AAA0]"
                              }
                            >
                              {chair.status === "AVAILABLE" ? "Free" : chair.status === "OCCUPIED" ? "Busy" : "Off"}
                            </span>
                          </span>
                        </div>

                        <div className="text-xs text-[#8C8074]">
                          Barber: <strong>{chair.barberName}</strong>
                        </div>

                        {chair.status === "OCCUPIED" ? (
                          <div className="pt-1.5 border-t border-[#EEE5DA] text-[11px] text-[#70472F] font-medium flex items-center justify-between">
                            <span>{chair.currentCustomer} ({chair.currentService})</span>
                            <span className="text-[10px] text-[#8C8074]">{chair.elapsedMins}m in chair</span>
                          </div>
                        ) : (
                          <div className="pt-1.5 border-t border-[#EEE5DA] text-[11px] text-[#5D9871] font-medium">
                            Ready for next customer
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Live Queue Operations Table */}
                <div className="lg:col-span-6 bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EEE5DA]">
                    <div>
                      <h2 className="text-base font-bold font-serif text-[#211912]">Live Queue</h2>
                      <p className="text-[11px] text-[#8C8074]">
                        {waitingCustomers.length} waiting · {servingCustomers.length} serving
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-[#EEE5DA]">
                    {queues.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F2E8DC] text-[#70472F] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                            #{item.tokenNumber}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#211912]">{item.customerName}</div>
                            <div className="text-[11px] text-[#8C8074]">
                              {item.serviceName} ·{" "}
                              {item.status === "SERVING" ? (
                                <span className="text-[#477B5D] font-bold">In Station {item.chairAssigned}</span>
                              ) : (
                                <span>~{item.waitTime}m wait</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === "SERVING"
                                ? "bg-[#E5F0E7] text-[#477B5D]"
                                : item.status === "WAITING"
                                ? "bg-[#F1E8DF] text-[#8A6B50]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.status}
                          </span>

                          {item.status === "SERVING" && (
                            <button
                              onClick={() => handleCompleteService(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#477B5D] text-white text-[11px] font-bold hover:bg-[#38624A] cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF */}
          {(activeTab === "staff" || activeTab === "chairs") && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    TEAM & BARBERS
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Staff Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    Assign barbers to stations, track individual customer counts, and invite staff.
                  </p>
                </div>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite Staff Member</span>
                </button>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#EADBCA] text-[#70472F] font-bold text-sm flex items-center justify-center">
                          {staff.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#211912]">{staff.name}</div>
                          <div className="text-xs text-[#8C8074]">{staff.role}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          staff.status === "ON_DUTY"
                            ? "bg-[#E8F3EB] text-[#28734F]"
                            : "bg-[#F2EEE7] text-[#8C8074]"
                        }`}
                      >
                        {staff.status === "ON_DUTY" ? "On duty" : "Off duty"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#8C8074] pt-2 border-t border-[#EEE5DA]">
                      <div className="flex justify-between">
                        <span>Assigned Station:</span>
                        <strong className="text-[#70472F]">{staff.chairAssigned}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact:</span>
                        <span>{staff.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Served Today:</span>
                        <strong className="text-[#211912]">{staff.servedToday} customers</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#EEE5DA]">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                  PERFORMANCE & METRICS
                </div>
                <h1 className="text-2xl font-bold font-serif text-[#211912]">Salon Analytics</h1>
                <p className="text-xs text-[#8C8074] mt-0.5">
                  Understand chair utilization, peak queue hours, and client retention.
                </p>
              </div>

              {/* Analytics Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1: Customers Served */}
                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#211912]">Customers Served</h3>
                    <p className="text-xs text-[#8C8074]">Daily completed services this week</p>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { day: "Mon", val: 55 },
                      { day: "Tue", val: 68 },
                      { day: "Wed", val: 48 },
                      { day: "Thu", val: 82 },
                      { day: "Fri", val: 72 },
                      { day: "Sat", val: 96, active: true },
                      { day: "Sun", val: 62 },
                    ].map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex justify-center">
                          <div
                            style={{ height: `${item.val}%` }}
                            className={`w-7 rounded-t-lg transition-all ${
                              item.active ? "bg-[#70472F]" : "bg-[#D4C3B3] hover:bg-[#BCA998]"
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#8C8074]">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Queue Activity Peak Hours */}
                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#211912]">Queue Activity</h3>
                    <p className="text-xs text-[#8C8074]">Queue entries by time of day</p>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { time: "9 AM", val: 25 },
                      { time: "11 AM", val: 48 },
                      { time: "1 PM", val: 70 },
                      { time: "3 PM", val: 92, active: true },
                      { time: "5 PM", val: 75 },
                      { time: "7 PM", val: 45 },
                    ].map((item) => (
                      <div key={item.time} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex justify-center">
                          <div
                            style={{ height: `${item.val}%` }}
                            className={`w-7 rounded-t-lg transition-all ${
                              item.active ? "bg-[#70472F]" : "bg-[#D4C3B3] hover:bg-[#BCA998]"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#8C8074] whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Services Breakdown */}
                <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#211912]">Top Services</h3>
                    <p className="text-xs text-[#8C8074]">By completed services this week</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[#211912]">
                        <span>Haircut</span>
                        <span>118</span>
                      </div>
                      <div className="h-2 w-full bg-[#F0E8DF] rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#70472F] rounded-full w-[86%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-[#211912]">
                        <span>Haircut + Beard</span>
                        <span>76</span>
                      </div>
                      <div className="h-2 w-full bg-[#F0E8DF] rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#956746] rounded-full w-[62%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-[#211912]">
                        <span>Beard trim</span>
                        <span>52</span>
                      </div>
                      <div className="h-2 w-full bg-[#F0E8DF] rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#C8AD91] rounded-full w-[42%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Trends (Pro Teaser) */}
                <div className="relative overflow-hidden bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#211912]">Revenue & P&L Trends</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C69A5C]/20 text-[#70472F]">
                        Pro Plan Feature
                      </span>
                    </div>
                    <p className="text-xs text-[#8C8074] mt-1">
                      Direct gross billing, stylist commissions, and zero marketplace clawbacks.
                    </p>
                  </div>

                  <div className="my-6 p-4 rounded-2xl bg-[#F7F3ED] border border-[#EEE5DA] text-center space-y-2">
                    <Crown className="w-8 h-8 text-[#C69A5C] mx-auto" />
                    <div className="text-xs font-bold text-[#211912]">
                      Unlock Advanced Financial Analytics
                    </div>
                    <p className="text-[11px] text-[#8C8074] max-w-xs mx-auto">
                      Upgrade to the Pro Plan (₹449/mo) to track real time revenue and chair monetization.
                    </p>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="px-4 py-2 rounded-xl bg-[#70472F] text-white text-xs font-bold hover:bg-[#583724] transition-colors cursor-pointer mt-1"
                    >
                      View Subscription Plans
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & SUPPORT */}
          {(activeTab === "profile" || activeTab === "settings") && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-[#EEE5DA]">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                  OWNER & SALON SETTINGS
                </div>
                <h1 className="text-2xl font-bold font-serif text-[#211912]">Profile & Subscriptions</h1>
                <p className="text-xs text-[#8C8074] mt-0.5">
                  Manage your verified salon credentials, flat SaaS subscription, and reach support.
                </p>
              </div>

              {/* Owner Profile Card */}
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEE5DA]">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#211912]">Owner Profile</h2>
                    <p className="text-xs text-[#8C8074]">Your account and salon details</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E7D6C3] text-[#70472F] font-bold text-base flex items-center justify-center">
                    {ownerName.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F7F3ED] border border-[#EEE5DA]">
                    <span className="text-[10px] font-bold text-[#8C8074] uppercase block mb-0.5">Full Name</span>
                    <strong className="text-[#211912]">{ownerName}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7F3ED] border border-[#EEE5DA]">
                    <span className="text-[10px] font-bold text-[#8C8074] uppercase block mb-0.5">Email Address</span>
                    <strong className="text-[#211912]">{ownerEmail}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7F3ED] border border-[#EEE5DA]">
                    <span className="text-[10px] font-bold text-[#8C8074] uppercase block mb-0.5">Phone Number</span>
                    <strong className="text-[#211912]">{ownerPhone}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7F3ED] border border-[#EEE5DA]">
                    <span className="text-[10px] font-bold text-[#8C8074] uppercase block mb-0.5">Salon Name</span>
                    <strong className="text-[#70472F]">{salonName}</strong>
                  </div>
                </div>
              </div>

              {/* 3 Flat SaaS Subscription Plans */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold font-serif text-[#211912]">Flat SaaS Plans (0% Commission)</h2>
                  <p className="text-xs text-[#8C8074]">
                    No haircut cut. Keep 100% of your earnings with predictable monthly pricing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* BASE PLAN */}
                  <div
                    className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                      currentPlan === "base"
                        ? "bg-white border-[#70472F] shadow-md ring-2 ring-[#70472F]/20"
                        : "bg-[#FFFDF9] border-[#EEE5DA]"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C8074]">
                        BASE PLAN · SINGLE BARBER
                      </div>
                      <h3 className="text-xl font-bold font-serif text-[#211912] mt-1">Barbershop Starter</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold font-serif text-[#211912]">₹199</span>
                        <span className="text-xs text-[#8C8074]">/month</span>
                      </div>

                      <div className="my-4 h-px bg-[#EEE5DA]" />

                      <ul className="space-y-2 text-xs text-[#8C8074]">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>1 Active Stylist Chair</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Real time chair countdown queue</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Printable counter QR standee</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>100% Free for your customers</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPlan("base");
                        toast.success("Switched to Base Plan (₹199/mo)!");
                      }}
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currentPlan === "base"
                          ? "bg-[#F1E8DC] text-[#70472F]"
                          : "border border-[#EEE5DA] text-[#211912] hover:bg-black/5"
                      }`}
                    >
                      {currentPlan === "base" ? "Current Active Plan" : "Select Base Plan"}
                    </button>
                  </div>

                  {/* INTERMEDIATE PLAN (MOST POPULAR) */}
                  <div
                    className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
                      currentPlan === "intermediate"
                        ? "bg-white border-[#70472F] shadow-lg ring-2 ring-[#70472F]"
                        : "bg-[#FFFDF9] border-[#EEE5DA]"
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#70472F] text-white text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#70472F]">
                        INTERMEDIATE · UP TO 3 CHAIRS
                      </div>
                      <h3 className="text-xl font-bold font-serif text-[#211912] mt-1">High-Traffic Salon</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold font-serif text-[#70472F]">₹400</span>
                        <span className="text-xs text-[#8C8074]">/month</span>
                      </div>

                      <div className="my-4 h-px bg-[#EEE5DA]" />

                      <ul className="space-y-2 text-xs text-[#8C8074]">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span><b>Up to 3 Chairs & Staff Logins</b></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Multi barber queue routing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Automated WhatsApp delay alerts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Snepr Points Loyalty Network</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPlan("intermediate");
                        toast.success("Switched to Intermediate Plan (₹400/mo)!");
                      }}
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currentPlan === "intermediate"
                          ? "bg-[#70472F] text-white"
                          : "border border-[#EEE5DA] text-[#211912] hover:bg-black/5"
                      }`}
                    >
                      {currentPlan === "intermediate" ? "Current Active Plan" : "Choose Intermediate"}
                    </button>
                  </div>

                  {/* PRO PLAN */}
                  <div
                    className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                      currentPlan === "pro"
                        ? "bg-white border-[#70472F] shadow-md ring-2 ring-[#70472F]/20"
                        : "bg-[#FFFDF9] border-[#EEE5DA]"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C8074]">
                        PRO PLAN · UNLIMITED
                      </div>
                      <h3 className="text-xl font-bold font-serif text-[#211912] mt-1">Luxury Lounge</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold font-serif text-[#211912]">₹449</span>
                        <span className="text-xs text-[#8C8074]">/month</span>
                      </div>

                      <div className="my-4 h-px bg-[#EEE5DA]" />

                      <ul className="space-y-2 text-xs text-[#8C8074]">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span><b>Unlimited Chairs & Barbers</b></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Full AI Snepr Studio previews</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Advanced revenue & turnover metrics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#477B5D]" />
                          <span>Priority 24/7 dedicated support</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPlan("pro");
                        toast.success("Upgraded to Pro Plan (₹449/mo)!");
                      }}
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currentPlan === "pro"
                          ? "bg-[#70472F] text-white"
                          : "border border-[#EEE5DA] text-[#211912] hover:bg-black/5"
                      }`}
                    >
                      {currentPlan === "pro" ? "Current Active Plan" : "Upgrade to Pro"}
                    </button>
                  </div>
                </div>
              </div>

              {/* INTEGRATED HELP CENTRE SUPPORT TICKET FORM (NO FLOATING BUBBLE) */}
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#EEE5DA]">
                  <div className="w-10 h-10 rounded-2xl bg-[#EADBCA] text-[#70472F] flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#211912]">
                      Integrated Partner Support Desk
                    </h2>
                    <p className="text-xs text-[#8C8074]">
                      Submit a direct support ticket to the Snepr engineering & operations team.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                        ISSUE CATEGORY
                      </label>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-bold text-[#211912] focus:outline-none focus:border-[#70472F]"
                      >
                        <option value="Technical Support">Technical & Telemetry Support</option>
                        <option value="Billing & Subscription">Billing & Plan Inquiry</option>
                        <option value="Staff & Chair Setup">Staff & Chair Configuration</option>
                        <option value="Feature Request">New Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Question regarding SMS customer notifications"
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                      MESSAGE / DESCRIPTION
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe what you need assistance with..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs text-[#211912] focus:outline-none focus:border-[#70472F]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingTicket}
                      className="px-6 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingTicket ? "Sending Ticket..." : "Submit Support Ticket"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
                  {/* TAB: DEDICATED LIVE QUEUE MANAGEMENT */}
          {activeTab === "queue" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    CHAIR TELEMETRY & LIVE CALLING
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Live Queue Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    Advance tokens, call walk ins to available chairs, and view queue progress for {salonName}.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCallNext}
                    className="px-4 py-2.5 rounded-xl bg-[#477B5D] hover:bg-[#38624A] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Call Next in Line</span>
                  </button>

                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Walk in</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-[#70472F] text-[#70472F] hover:bg-[#70472F] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Reception QR Standee</span>
                  </button>
                </div>
              </div>

              {/* Queue Table */}
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#211912]">Active Queue Pass List ({queues.length})</h3>
                  <span className="text-xs font-semibold text-[#477B5D] bg-[#EAF3EC] px-3 py-1 rounded-full">
                    ● Telemetry Sync Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EEE5DA] text-[#8C8074] font-bold text-[11px] uppercase tracking-wider">
                        <th className="pb-3 pl-2">Token</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Wait</th>
                        <th className="pb-3">Chair</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEE5DA]/60">
                      {queues.map((item) => {
                        const isServing = item.status === "SERVING";
                        const isWaiting = item.status === "WAITING";
                        return (
                          <tr key={item.id} className="hover:bg-[#F7F3ED]/40 transition-colors">
                            <td className="py-3.5 pl-2 font-serif font-black text-sm text-[#70472F]">
                              #{item.tokenNumber}
                            </td>
                            <td className="py-3.5 font-bold text-[#211912]">{item.customerName}</td>
                            <td className="py-3.5 text-[#8C8074]">{item.phone || "+91 94370 xxxxx"}</td>
                            <td className="py-3.5 font-medium text-[#211912]">{item.serviceName}</td>
                            <td className="py-3.5 text-[#8C8074]">
                              {isServing ? "Serving" : `~${item.waitTime}m`}
                            </td>
                            <td className="py-3.5 font-semibold text-[#70472F]">
                              {item.chairAssigned ? `Station ${item.chairAssigned}` : "Queue"}
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  isServing
                                    ? "bg-[#70472F] text-white"
                                    : isWaiting
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right pr-2">
                              {isWaiting && (
                                <button
                                  onClick={() => handleAdvanceQueue(item.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#477B5D] text-white text-[11px] font-bold hover:bg-[#38624A] mr-2"
                                >
                                  Call
                                </button>
                              )}
                              {isServing && (
                                <button
                                  onClick={() => handleCompleteQueue(item.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#70472F] text-white text-[11px] font-bold hover:bg-[#583724] mr-2"
                                >
                                  Complete (+10 pts)
                                </button>
                              )}
                              <button
                                onClick={() => handleCancelQueue(item.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-50"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEDICATED SERVICES MANAGEMENT */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    MENU & PRICING
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Service Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    Configure services, durations, and pricing displayed to customers on Snepr.
                  </p>
                </div>
              </div>

              {/* Add Service Form */}
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-[#211912] mb-4">Add New Salon Service</h3>
                <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Service name (e.g. Charcoal Detox Facial)"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Price in ₹ (e.g. 350)"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#70472F] text-white text-xs font-bold hover:bg-[#583724] transition-all cursor-pointer"
                    >
                      + Add to Menu
                    </button>
                  </div>
                </form>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesList.map((svc) => (
                  <div
                    key={svc.id}
                    className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-2xl p-5 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A8069]">
                        {svc.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#211912] mt-0.5">{svc.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#8C8074] mt-1">
                        <span>{svc.durationMins} mins duration</span>
                        <span>·</span>
                        <span className="font-bold text-[#70472F] text-sm">₹{svc.price}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DEDICATED CUSTOMERS MANAGEMENT */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    CLIENT DIRECTORY & REPUTATION
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Customer Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    View repeat clients, visit history, and loyalty points across {salonName}.
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search client by name or phone number..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EEE5DA] text-[#8C8074] font-bold text-[11px] uppercase tracking-wider">
                        <th className="pb-3 pl-2">Customer</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Total Visits</th>
                        <th className="pb-3">Last Visit</th>
                        <th className="pb-3">Snepr Points</th>
                        <th className="pb-3">Preferred Service</th>
                        <th className="pb-3 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEE5DA]/60">
                      {customersList
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                            c.phone.includes(customerSearch)
                        )
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-[#F7F3ED]/40 transition-colors">
                            <td className="py-3 pl-2 font-bold text-[#211912]">{c.name}</td>
                            <td className="py-3 text-[#8C8074]">{c.phone}</td>
                            <td className="py-3 font-semibold text-[#70472F]">{c.totalVisits} visits</td>
                            <td className="py-3 text-[#8C8074]">{c.lastVisit}</td>
                            <td className="py-3 font-bold text-amber-700">+{c.loyaltyPoints} pts</td>
                            <td className="py-3 text-[#211912]">{c.favoriteService}</td>
                            <td className="py-3 text-right pr-2">
                              <button
                                onClick={() => {
                                  toast.success(`Priority token issued for ${c.name}!`);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#70472F] text-white text-[11px] font-bold hover:bg-[#583724]"
                              >
                                Issue Token
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABLETOP RECEPTION QR MODAL */}
          {showQrModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="p-1 rounded-full text-[#8C8074] hover:text-[#211912]"
                  >
                    ✕
                  </button>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#70472F]/10 text-[#70472F] text-[10px] font-extrabold uppercase tracking-wider">
                  OFFICIAL RECEPTION STANDEE
                </div>
                <h3 className="text-xl font-bold font-serif text-[#211912]">{salonName}</h3>
                <p className="text-xs text-[#8C8074]">
                  Place this standee at your reception counter. Walk ins scan to join the live queue without downloading an app.
                </p>
                <div className="w-48 h-48 mx-auto bg-white border-2 border-[#70472F] rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-[11px] font-bold text-[#70472F]">SCAN TO JOIN QUEUE</div>
                  <div className="text-[9px] text-[#8C8074] mt-1">snepr.com/salon/{locality.split(",")[0].toLowerCase()}</div>
                </div>
                <button
                  onClick={() => {
                    toast.success("Reception standee PDF prepared for printing!");
                    setShowQrModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#70472F] text-white text-xs font-bold hover:bg-[#583724]"
                >
                  Print QR Standee PDF
                </button>
              </div>
            </div>
          )}

</main>
      </div>

      {/* ─── MOBILE BOTTOM NAVIGATION (4 TABS: OVERVIEW, STAFF, ANALYTICS, PROFILE) ─── */}
      <div className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40">
        <nav className="bg-white/90 backdrop-blur-xl border border-[#EEE5DA] rounded-2xl p-1.5 shadow-lg flex items-center justify-around">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#F1E8DC] text-[#70472F]"
                : "text-[#8C8074] hover:text-[#211912]"
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span className="text-[10px]">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "staff"
                ? "bg-[#F1E8DC] text-[#70472F]"
                : "text-[#8C8074] hover:text-[#211912]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px]">Staff</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#F1E8DC] text-[#70472F]"
                : "text-[#8C8074] hover:text-[#211912]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px]">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#F1E8DC] text-[#70472F]"
                : "text-[#8C8074] hover:text-[#211912]"
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="text-[10px]">Profile</span>
          </button>
        </nav>
      </div>

      {/* ─── MODAL 1: ADD WALK IN CUSTOMER ─── */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEE5DA]">
              <div>
                <h3 className="text-base font-bold font-serif text-[#211912]">Add Walk in Customer</h3>
                <p className="text-xs text-[#8C8074]">Manual entry at salon counter</p>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#8C8074] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                  CUSTOMER NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Das"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                  PHONE NUMBER (FOR SMS NOTIFICATION)
                </label>
                <input
                  type="tel"
                  placeholder="+91 94370 00000"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                  SERVICE
                </label>
                <select
                  value={walkInService}
                  onChange={(e) => setWalkInService(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-bold text-[#211912] focus:outline-none focus:border-[#70472F]"
                >
                  <option value="Haircut">Haircut (₹150)</option>
                  <option value="Beard trim">Beard trim (₹80)</option>
                  <option value="Haircut + Beard">Haircut + Beard (₹200)</option>
                  <option value="Hair Styling">Hair Styling (₹120)</option>
                  <option value="Hair Colour">Hair Colour (₹450)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EEE5DA] text-xs font-bold text-[#8C8074] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: INVITE STAFF MEMBER ─── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEE5DA]">
              <div>
                <h3 className="text-base font-bold font-serif text-[#211912]">Invite Staff Member</h3>
                <p className="text-xs text-[#8C8074]">Onboard barber or stylist to chair</p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#8C8074] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteStaff} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                  STAFF FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subrat Mohanty"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                  PHONE OR EMAIL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 94370 12345 or subrat@example.com"
                  value={inviteContact}
                  onChange={(e) => setInviteContact(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                    ROLE
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-bold text-[#211912] focus:outline-none focus:border-[#70472F]"
                  >
                    <option value="Barber">Barber</option>
                    <option value="Senior Stylist">Senior Stylist</option>
                    <option value="Grooming Specialist">Grooming Specialist</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8074] mb-1">
                    ASSIGN CHAIR
                  </label>
                  <select
                    value={inviteChair}
                    onChange={(e) => setInviteChair(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-bold text-[#211912] focus:outline-none focus:border-[#70472F]"
                  >
                    <option value="Station 1">Station 1</option>
                    <option value="Station 2">Station 2</option>
                    <option value="Station 3">Station 3</option>
                    <option value="Station 4">Station 4</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EEE5DA] text-xs font-bold text-[#8C8074] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Send Invite
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
