import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Building2, Users, MapPin, CheckCircle2, XCircle, AlertTriangle,
  Plus, Edit, Eye, Filter, Search, BarChart3, ShieldCheck,
  TrendingUp, RefreshCw, Armchair, Clock, ChevronRight, Check, X
} from "lucide-react";
import { BHUBANESWAR_AREAS, REAL_SALONS_DATA, RealSalon, Area } from "@/lib/real-salons";
import { toast } from "sonner";

export type AdminTab = "overview" | "applications" | "salons" | "users" | "localities";

export function AdminConsole() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const u = JSON.parse(stored);
        setSession(u);
      }
    } catch {}
    setAuthChecked(true);
  }, []);

  // Check admin access
  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const u = JSON.parse(stored);
        setSession(u);
      }
    } catch {}
  }, []);

  // 1. Applications State
  const [applications, setApplications] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_admin_applications");
      if (stored) return JSON.parse(stored);
      // Sample initial pending application
      return [
        {
          applicationId: "SN-BBS-1042",
          salonName: "Barber King Studio",
          ownerName: "Bikash Sahoo",
          contactNumber: "+91 94371 88990",
          businessEmail: "bikash@barberking.com",
          salonDescription: "Modern fades and beard styling near KIIT Square.",
          locality: "KIIT Road",
          fullAddress: "Plot No. 12, KIIT Road, opposite Big Bazaar, Patia",
          postalCode: "751024",
          chairCount: 2,
          openingTime: "09:30 AM",
          closingTime: "09:00 PM",
          weeklyHoliday: "Tuesday",
          services: [
            { name: "Executive Haircut", price: 180, duration: 25 },
            { name: "Beard Sculpt & Trim", price: 100, duration: 20 },
            { name: "Charcoal Face Mask", price: 250, duration: 30 },
          ],
          status: "PENDING_REVIEW",
          createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  const [applicationSearch, setApplicationSearch] = useState("");
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  // 2. Salons State
  const [salonsList, setSalonsList] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_admin_salons");
      if (stored) return JSON.parse(stored);
      return REAL_SALONS_DATA.map((s) => ({
        ...s,
        status: "APPROVED",
        isSuspended: false,
      }));
    } catch {
      return REAL_SALONS_DATA.map((s) => ({
        ...s,
        status: "APPROVED",
        isSuspended: false,
      }));
    }
  });
  const [salonSearch, setSalonSearch] = useState("");
  const [salonLocalityFilter, setSalonLocalityFilter] = useState("all");

  // 3. Users State
  const [usersList, setUsersList] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_admin_users");
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 1,
          name: "Ankit Kumar",
          email: "xpertenzo.in@gmail.com",
          phone: "+91 98765 43210",
          role: "super_admin",
          isSuspended: false,
          associatedSalon: null,
          createdAt: "2026-10-15",
        },
        {
          id: 2,
          name: "Rajesh Mohapatra",
          email: "rajesh@lakmesalon.in",
          phone: "+91 92373 62221",
          role: "salon_owner",
          isSuspended: false,
          associatedSalon: "Lakmé Salon  |  KIIT Road",
          createdAt: "2026-10-20",
        },
        {
          id: 3,
          name: "Suman Tripathy",
          email: "suman.t@gmail.com",
          phone: "+91 94370 55443",
          role: "customer",
          isSuspended: false,
          associatedSalon: null,
          createdAt: "2026-11-01",
        },
      ];
    } catch {
      return [];
    }
  });
  const [userSearch, setUserSearch] = useState("");

  // 4. Localities State
  const [areas, setAreas] = useState<Area[]>(() => {
    try {
      const stored = localStorage.getItem("snepr_admin_localities");
      if (stored) return JSON.parse(stored);
      return BHUBANESWAR_AREAS;
    } catch {
      return BHUBANESWAR_AREAS;
    }
  });
  const [newAreaName, setNewAreaName] = useState("");
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("snepr_admin_applications", JSON.stringify(applications));
      localStorage.setItem("snepr_admin_salons", JSON.stringify(salonsList));
      localStorage.setItem("snepr_admin_users", JSON.stringify(usersList));
      localStorage.setItem("snepr_admin_localities", JSON.stringify(areas));
    } catch {}
  }, [applications, salonsList, usersList, areas]);

  // Application Actions
  const handleApproveApplication = (appId: string) => {
    const app = applications.find((a) => a.applicationId === appId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.applicationId === appId ? { ...a, status: "APPROVED" } : a))
    );

    // Add to approved salons list
    const newSalon: any = {
      id: salonsList.length + 10,
      name: app.salonName,
      address: app.fullAddress,
      areaId: 1,
      areaName: app.locality,
      areaSlug: app.locality.toLowerCase().replace(/\s+/g, "-"),
      category: "Unisex Salon",
      rating: "5.0",
      reviewCount: 0,
      waitTime: 0,
      availableChairs: app.chairCount || 3,
      totalChairs: app.chairCount || 3,
      waitingCount: 0,
      phone: app.contactNumber,
      status: "APPROVED",
      isSuspended: false,
      services: app.services || [],
    };

    setSalonsList((prev) => [newSalon, ...prev]);

    // Update session application if current user submitted it
    try {
      const activeApp = localStorage.getItem("snepr_salon_application");
      if (activeApp) {
        const parsed = JSON.parse(activeApp);
        if (parsed.applicationId === appId) {
          parsed.status = "APPROVED";
          localStorage.setItem("snepr_salon_application", JSON.stringify(parsed));
        }
      }
    } catch {}

    toast.success(`Application ${appId} (${app.salonName}) approved!`);
  };

  const handleRejectApplication = () => {
    if (!rejectingAppId) return;
    const reason = rejectionReasonInput.trim() || "Address could not be verified in Bhubaneswar municipal records.";

    setApplications((prev) =>
      prev.map((a) =>
        a.applicationId === rejectingAppId
          ? { ...a, status: "REJECTED", rejectionReason: reason }
          : a
      )
    );

    try {
      const activeApp = localStorage.getItem("snepr_salon_application");
      if (activeApp) {
        const parsed = JSON.parse(activeApp);
        if (parsed.applicationId === rejectingAppId) {
          parsed.status = "REJECTED";
          parsed.rejectionReason = reason;
          localStorage.setItem("snepr_salon_application", JSON.stringify(parsed));
        }
      }
    } catch {}

    toast.info(`Application ${rejectingAppId} marked as REJECTED.`);
    setRejectingAppId(null);
    setRejectionReasonInput("");
  };

  // Salon Actions
  const handleToggleSuspendSalon = (salonId: number) => {
    setSalonsList((prev) =>
      prev.map((s) => {
        if (s.id !== salonId) return s;
        const newSuspended = !s.isSuspended;
        toast.info(newSuspended ? `${s.name} has been suspended.` : `${s.name} is reactivated.`);
        return { ...s, isSuspended: newSuspended, status: newSuspended ? "SUSPENDED" : "APPROVED" };
      })
    );
  };

  // User Actions
  const handleToggleSuspendUser = (userId: number) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newSuspended = !u.isSuspended;
        toast.info(newSuspended ? `${u.name} suspended.` : `${u.name} reactivated.`);
        return { ...u, isSuspended: newSuspended };
      })
    );
  };

  // Locality Actions
  const handleAddLocality = () => {
    if (!newAreaName.trim()) {
      toast.error("Enter locality name.");
      return;
    }
    const newArea: Area = {
      id: areas.length + 1,
      cityId: 1,
      name: newAreaName.trim(),
      slug: newAreaName.trim().toLowerCase().replace(/\s+/g, "-"),
      isActive: true,
      displayOrder: areas.length + 1,
    };
    setAreas([...areas, newArea]);
    setNewAreaName("");
    setShowAddAreaModal(false);
    toast.success(`Locality "${newArea.name}" added!`);
  };

  const handleToggleLocality = (areaId: number) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, isActive: !a.isActive } : a))
    );
    toast.success("Locality active status toggled.");
  };

  // Metrics
  const totalUsersCount = usersList.length;
  const totalSalonsCount = salonsList.length;
  const pendingAppsCount = applications.filter((a) => a.status === "PENDING_REVIEW").length;
  const approvedSalonsCount = salonsList.filter((s) => !s.isSuspended).length;
  const suspendedSalonsCount = salonsList.filter((s) => s.isSuspended).length;
  const activeQueuesCount = salonsList.reduce((acc, s) => acc + (s.waitingCount || 0), 3);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#1B1410] text-[#FFFDFA] flex items-center justify-center text-xs">
        Verifying administrative authorization...
      </div>
    );
  }

  const isAuthorizedAdmin = session && (session.isAdmin === true || session.role === "super_admin" || session.role === "admin");

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#1B1410] text-[#FFFDFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <h2 className="text-2xl font-bold font-serif text-white">Administrative Access Restricted</h2>
        <p className="text-xs text-[#DED4CA] max-w-sm mt-2 leading-relaxed">
          The requested console requires verified administrator privileges. If you are an authorized administrator, please sign in with your administrative account.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/login"
            search={{ redirect: "/ankom/" }}
            className="px-6 py-2.5 rounded-xl bg-[#C8993E] text-[#1B1410] text-xs font-bold hover:bg-[#d8a84e] transition-colors"
          >
            Sign in as Administrator
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl border border-white/20 text-[#DED4CA] text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col md:flex-row">
      {/* ─── ADMIN SIDEBAR ─── */}
      <aside className="w-full md:w-64 bg-[#1B1410] text-[#FFFDFA] flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="inline-block" aria-label="Snepr home">
              <SneprWordmark height={32} color="#FFFFFF" />
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8993E]">
                Admin Console
              </span>
              <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-[#DED4CA]">
                v3.0 BBS
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#7A4B29] text-white"
                  : "text-[#DED4CA] hover:bg-white/5 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>1. Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "applications"
                  ? "bg-[#7A4B29] text-white"
                  : "text-[#DED4CA] hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                <span>2. Salon Applications</span>
              </div>
              {pendingAppsCount > 0 && (
                <span className="text-[10px] bg-[#C8993E] text-black font-bold px-1.5 py-0.5 rounded-full">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("salons")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "salons"
                  ? "bg-[#7A4B29] text-white"
                  : "text-[#DED4CA] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>3. Salons ({salonsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "users"
                  ? "bg-[#7A4B29] text-white"
                  : "text-[#DED4CA] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>4. Users ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("localities")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "localities"
                  ? "bg-[#7A4B29] text-white"
                  : "text-[#DED4CA] hover:bg-white/5 hover:text-white"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>5. Localities ({areas.length})</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/live"
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
          >
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-6xl overflow-y-auto">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E9E1D7]">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#1B1410]">
              {activeTab === "overview" && "Platform Metrics"}
              {activeTab === "applications" && "Partner Applications"}
              {activeTab === "salons" && "Verified Salons Directory"}
              {activeTab === "users" && "User Accounts"}
              {activeTab === "localities" && "Bhubaneswar Localities"}
            </h1>
            <p className="text-xs text-[#786B60] mt-0.5">
              Secure administrator console · Zero SMS OTPs · 0% Haircut Commissions.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3EC] text-[#267447] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#267447]" />
            Bhubaneswar Active
          </span>
        </div>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm">
                <span className="text-xs text-[#786B60]">Total Registered Users</span>
                <div className="text-3xl font-bold font-serif text-[#1B1410] mt-1">{totalUsersCount}</div>
                <span className="text-[10px] text-[#786B60]">Customers & Partners</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm">
                <span className="text-xs text-[#786B60]">Total Salons Listed</span>
                <div className="text-3xl font-bold font-serif text-[#1B1410] mt-1">{totalSalonsCount}</div>
                <span className="text-[10px] text-[#267447]">13 Real Verified BBS Leads</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#C8993E] shadow-sm">
                <span className="text-xs text-[#786B60]">Pending Applications</span>
                <div className="text-3xl font-bold font-serif text-[#7A4B29] mt-1">{pendingAppsCount}</div>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  Needs review
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm">
                <span className="text-xs text-[#786B60]">Approved Salons</span>
                <div className="text-3xl font-bold font-serif text-[#267447] mt-1">{approvedSalonsCount}</div>
                <span className="text-[10px] text-[#786B60]">Operating live queues</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm">
                <span className="text-xs text-[#786B60]">Suspended Salons</span>
                <div className="text-3xl font-bold font-serif text-red-600 mt-1">{suspendedSalonsCount}</div>
                <span className="text-[10px] text-[#786B60]">Hidden from discovery</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm">
                <span className="text-xs text-[#786B60]">Active Live Queue Entries</span>
                <div className="text-3xl font-bold font-serif text-[#7A4B29] mt-1">{activeQueuesCount}</div>
                <span className="text-[10px] text-[#786B60]">Across all stations</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: APPLICATIONS ─── */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="search"
                placeholder="Search applications by salon name or owner..."
                value={applicationSearch}
                onChange={(e) => setApplicationSearch(e.target.value)}
                className="flex-1 h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {applications
                .filter(
                  (a) =>
                    !applicationSearch.trim() ||
                    a.salonName.toLowerCase().includes(applicationSearch.toLowerCase()) ||
                    a.ownerName.toLowerCase().includes(applicationSearch.toLowerCase())
                )
                .map((app) => (
                  <div
                    key={app.applicationId}
                    className="p-6 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#7A4B29] bg-[#F5EEE7] px-2 py-0.5 rounded">
                            {app.applicationId}
                          </span>
                          <h3 className="text-base font-bold text-[#1B1410]">{app.salonName}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              app.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : app.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#786B60] mt-1">
                          Owner: <strong>{app.ownerName}</strong> · Phone: {app.contactNumber} · Email: {app.businessEmail}
                        </p>
                      </div>

                      {app.status === "PENDING_REVIEW" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveApplication(app.applicationId)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#267447] text-white text-xs font-bold hover:bg-[#1E5D38] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingAppId(app.applicationId);
                              setRejectionReasonInput("");
                            }}
                            className="px-3.5 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FAF7F2] text-xs text-[#786B60]">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#9B8B7E]">Locality & Address</span>
                        <strong className="text-[#1B1410]">{app.locality}, Bhubaneswar</strong>
                        <div className="truncate">{app.fullAddress}</div>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#9B8B7E]">Chairs & Hours</span>
                        <div>{app.chairCount || 3} Stylist Chairs</div>
                        <div>{app.openingTime} – {app.closingTime} (Off: {app.weeklyHoliday})</div>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#9B8B7E]">Submitted Menu</span>
                        <div>{app.services?.length || 0} services configured</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: SALONS ─── */}
        {activeTab === "salons" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="search"
                placeholder="Search salons by name or address..."
                value={salonSearch}
                onChange={(e) => setSalonSearch(e.target.value)}
                className="flex-1 h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-sm focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px] tracking-wider">
                    <th className="p-3">Salon Name</th>
                    <th className="p-3">Locality</th>
                    <th className="p-3">Chairs</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D7]">
                  {salonsList
                    .filter((s) => !salonSearch.trim() || s.name.toLowerCase().includes(salonSearch.toLowerCase()))
                    .map((salon) => (
                      <tr key={salon.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3 font-semibold text-[#1B1410]">{salon.name}</td>
                        <td className="p-3 text-[#786B60]">{salon.areaName}</td>
                        <td className="p-3">{salon.totalChairs || 3} chairs</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              salon.isSuspended
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {salon.isSuspended ? "SUSPENDED" : "ACTIVE"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleSuspendSalon(salon.id)}
                            className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer ${
                              salon.isSuspended
                                ? "bg-[#267447] text-white"
                                : "border border-red-300 text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {salon.isSuspended ? "Reactivate" : "Suspend"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 4: USERS ─── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <input
              type="search"
              placeholder="Search users by name, email or phone..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-sm focus:outline-none"
            />

            <div className="overflow-x-auto bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px] tracking-wider">
                    <th className="p-3">User</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Associated Salon</th>
                    <th className="p-3 text-right">Account State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D7]">
                  {usersList
                    .filter((u) => !userSearch.trim() || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3">
                          <strong className="block text-[#1B1410]">{user.name}</strong>
                          <span className="text-[10px] text-[#786B60]">ID: #{user.id}</span>
                        </td>
                        <td className="p-3 text-[#786B60]">
                          <div>{user.email}</div>
                          <small>{user.phone || "No phone"}</small>
                        </td>
                        <td className="p-3 font-semibold uppercase text-[10px] text-[#7A4B29]">
                          {user.role}
                        </td>
                        <td className="p-3 text-[#786B60]">{user.associatedSalon || " | "}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleSuspendUser(user.id)}
                            className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer ${
                              user.isSuspended
                                ? "bg-[#267447] text-white"
                                : "border border-red-300 text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {user.isSuspended ? "Reactivate" : "Suspend"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 5: LOCALITIES ─── */}
        {activeTab === "localities" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#786B60]">
                Manage manual Bhubaneswar localities. Salons are categorized by these neighborhoods without GPS.
              </p>
              <button
                onClick={() => setShowAddAreaModal(true)}
                className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Locality
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="p-4 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1410]">{area.name}</h4>
                    <span className="text-[10px] text-[#786B60]">slug: {area.slug}</span>
                  </div>
                  <button
                    onClick={() => handleToggleLocality(area.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                      area.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {area.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ─── REJECTION MODAL ─── */}
      {rejectingAppId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-serif text-[#1B1410]">Provide Rejection Reason</h3>
            <p className="text-xs text-[#786B60]">
              The salon owner will see this reason in their portal so they can correct and resubmit.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Address proof mismatch with Bhubaneswar shop establishment records..."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E9E1D7] text-xs focus:outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectingAppId(null)}
                className="px-4 py-2 rounded-lg border border-[#E9E1D7] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectApplication}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD LOCALITY MODAL ─── */}
      {showAddAreaModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-serif text-[#1B1410]">Add Bhubaneswar Locality</h3>
            <input
              type="text"
              placeholder="e.g. Tamando, Pokhariput..."
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddAreaModal(false)}
                className="px-4 py-2 rounded-lg border border-[#E9E1D7] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocality}
                className="px-4 py-2 rounded-lg bg-[#7A4B29] text-white text-xs font-bold"
              >
                Add Locality
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminConsole;
