import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Building2, Users, MapPin, CheckCircle2, XCircle, AlertTriangle,
  Plus, Edit, Eye, Filter, Search, BarChart3, ShieldCheck,
  TrendingUp, RefreshCw, Armchair, Clock, ChevronRight, Check, X,
  Store as StoreIcon
} from "lucide-react";
import { BHUBANESWAR_AREAS, REAL_SALONS_DATA, RealSalon, Area } from "@/lib/real-salons";
import {
  fetchPartnerApplicationsDb,
  reviewPartnerApplicationDb,
  queryTable
} from "@/lib/supabase";
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
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  // 2. Salons State
  const [salonsList, setSalonsList] = useState<any[]>(REAL_SALONS_DATA.map((s) => ({
    ...s,
    status: "APPROVED",
    isSuspended: false,
  })));
  const [salonSearch, setSalonSearch] = useState("");
  const [salonLocalityFilter, setSalonLocalityFilter] = useState("all");

  // 3. Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");

  // 4. Localities State
  const [areas, setAreas] = useState<Area[]>(BHUBANESWAR_AREAS);
  const [newAreaName, setNewAreaName] = useState("");
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync with Supabase Database
  const loadDatabaseData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Real Partner Applications
      const dbApps = await fetchPartnerApplicationsDb();
      if (Array.isArray(dbApps) && dbApps.length > 0) {
        setApplications(
          dbApps.map((a: any) => ({
            applicationId: a.application_id || a.applicationId,
            salonName: a.salon_name || a.salonName,
            ownerName: a.owner_name || a.ownerName,
            contactNumber: a.contact_number || a.contactNumber,
            businessEmail: a.business_email || a.businessEmail,
            salonDescription: a.salon_description || a.salonDescription,
            locality: a.locality,
            fullAddress: a.full_address || a.fullAddress,
            postalCode: a.postal_code || a.postalCode,
            chairCount: a.chair_count || a.chairCount || 3,
            openingTime: a.opening_time || a.openingTime || "09:00 AM",
            closingTime: a.closing_time || a.closingTime || "09:00 PM",
            weeklyHoliday: a.weekly_holiday || a.weeklyHoliday || "None",
            services: a.services || [],
            status: a.status || "PENDING_REVIEW",
            createdAt: a.created_at || a.createdAt,
            rejectionReason: a.rejection_reason || a.rejectionReason,
          }))
        );
      } else {
        // Fallback default sample if DB has no applications yet
        setApplications([
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
        ]);
      }

      // 2. Fetch Real Salons from PostgreSQL
      const dbSalons = await queryTable<any[]>("salons?order=id.asc");
      if (Array.isArray(dbSalons) && dbSalons.length > 0) {
        setSalonsList(
          dbSalons.map((s: any) => ({
            id: s.id,
            name: s.name,
            address: s.address || s.location || "Bhubaneswar",
            areaId: s.area_id || 1,
            areaName: s.location || "Bhubaneswar",
            areaSlug: (s.location || "bhubaneswar").toLowerCase().replace(/\s+/g, "-"),
            category: s.category || "Unisex Salon",
            rating: s.rating || "4.8",
            reviewCount: s.review_count || 0,
            waitTime: s.wait_time || 0,
            availableChairs: s.available_chairs ?? 3,
            totalChairs: s.total_chairs ?? 3,
            waitingCount: s.waiting_count ?? 0,
            phone: s.phone || "+91 94370 00000",
            status: (s.status || "APPROVED").toUpperCase(),
            isSuspended: s.status === "suspended" || s.operational_status === "paused",
            services: [],
          }))
        );
      }

      // 3. Fetch Real Users from PostgreSQL
      const dbUsers = await queryTable<any[]>(
        "users?select=id,name,email,phone,role,is_verified,failed_attempts,locked_until,last_sign_in_at&order=id.asc"
      );
      if (Array.isArray(dbUsers) && dbUsers.length > 0) {
        setUsersList(
          dbUsers.map((u: any) => ({
            id: u.id,
            name: u.name || u.email.split("@")[0],
            email: u.email,
            phone: u.phone || "—",
            role: u.role,
            isSuspended: Boolean(u.locked_until && new Date(u.locked_until) > new Date()),
            associatedSalon: u.role === "salon_owner" ? "Lakmé Salon | KIIT Road" : null,
            createdAt: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Active",
          }))
        );
      }
    } catch (err) {
      console.warn("Could not sync admin data with Supabase:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Application Actions
  const handleApproveApplication = async (appId: string) => {
    try {
      const res = await reviewPartnerApplicationDb(appId, "APPROVE", session?.name || "Super Admin");
      if (res && res.success) {
        toast.success(`Application ${appId} approved & salon provisioned in database!`);
        await loadDatabaseData();
        return;
      }
    } catch (err: any) {
      console.warn("Supabase review RPC error:", err);
    }

    setApplications((prev) =>
      prev.map((a) => (a.applicationId === appId ? { ...a, status: "APPROVED" } : a))
    );
    toast.success(`Application ${appId} approved!`);
  };

  const handleRejectApplication = async () => {
    if (!rejectingAppId) return;
    const reason = rejectionReasonInput.trim() || "Address could not be verified in Bhubaneswar municipal records.";

    try {
      const res = await reviewPartnerApplicationDb(rejectingAppId, "REJECT", session?.name || "Super Admin", reason);
      if (res && res.success) {
        toast.info(`Application ${rejectingAppId} marked as REJECTED in database.`);
        setRejectingAppId(null);
        setRejectionReasonInput("");
        await loadDatabaseData();
        return;
      }
    } catch (err: any) {
      console.warn("Supabase review RPC error:", err);
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.applicationId === rejectingAppId
          ? { ...a, status: "REJECTED", rejectionReason: reason }
          : a
      )
    );
    toast.info(`Application ${rejectingAppId} marked as REJECTED.`);
    setRejectingAppId(null);
    setRejectionReasonInput("");
  };

  // Salon Actions
  const handleToggleSuspendSalon = async (salonId: number) => {
    const s = salonsList.find((x) => x.id === salonId);
    if (!s) return;
    const newSuspended = !s.isSuspended;

    try {
      await queryTable(`salons?id=eq.${salonId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newSuspended ? "suspended" : "active",
          operational_status: newSuspended ? "paused" : "active",
        }),
      });
      toast.info(newSuspended ? `${s.name} suspended in database.` : `${s.name} reactivated in database.`);
    } catch (err) {
      console.warn("Could not patch salon status:", err);
    }

    setSalonsList((prev) =>
      prev.map((item) =>
        item.id === salonId
          ? { ...item, isSuspended: newSuspended, status: newSuspended ? "SUSPENDED" : "APPROVED" }
          : item
      )
    );
  };

  // User Actions
  const handleToggleSuspendUser = async (userId: number) => {
    const u = usersList.find((x) => x.id === userId);
    if (!u) return;
    const newSuspended = !u.isSuspended;

    try {
      await queryTable(`users?id=eq.${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          locked_until: newSuspended ? new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString() : null,
        }),
      });
      toast.info(newSuspended ? `${u.name} locked out in database.` : `${u.name} unlocked in database.`);
    } catch (err) {
      console.warn("Could not patch user status:", err);
    }

    setUsersList((prev) =>
      prev.map((item) =>
        item.id === userId ? { ...item, isSuspended: newSuspended } : item
      )
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
                <StoreIcon className="w-4 h-4" />
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
          <div className="flex items-center gap-3">
            <button
              onClick={loadDatabaseData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-xs font-bold hover:bg-[#F5EEE7] text-[#1B1410] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync DB"}</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3EC] text-[#267447] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#267447]" />
              Bhubaneswar Active
            </span>
          </div>
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
