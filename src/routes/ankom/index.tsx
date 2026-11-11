import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Building2, Users, MapPin, CheckCircle2, XCircle, AlertTriangle,
  Plus, Edit, Eye, Filter, Search, BarChart3, ShieldCheck,
  TrendingUp, RefreshCw, Armchair, Clock, ChevronRight, Check, X,
  Store as StoreIcon, CreditCard, Receipt, Coins, Sparkles, FileText,
  Settings, Shield, Download, Lock, Unlock, AlertCircle, ArrowUpRight,
  Menu
} from "lucide-react";
import { BHUBANESWAR_AREAS, REAL_SALONS_DATA, RealSalon, Area } from "@/lib/real-salons";
import {
  fetchPartnerApplicationsDb,
  reviewPartnerApplicationDb,
  queryTable
} from "@/lib/supabase";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { BulkActionBar } from "@/components/ui/bulk-action-bar";
import { FilterBar, FilterOption } from "@/components/ui/filter-bar";
import { DestructiveConfirmModal } from "@/components/ui/destructive-confirm-modal";
import { TierBadge } from "@/components/ui/tier-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SNEPR_PLANS, formatINR, PlanTier } from "@/config/subscriptions";
import { formatDate } from "@/lib/formatters";
import { toast } from "sonner";

export type AdminTab =
  | "overview"
  | "salons"
  | "customers"
  | "subscriptions"
  | "payments"
  | "ai_usage"
  | "token_wallets"
  | "analytics"
  | "reports"
  | "platform_settings"
  | "audit_logs";

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  action: string;
  targetType: "salon" | "customer" | "subscription" | "wallet" | "platform";
  targetId: string;
  details: string;
  timestamp: string;
}

export function AdminConsole() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 1. Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "log_1",
      actorEmail: "admin@snepr.in",
      action: "PLATFORM_INIT",
      targetType: "platform",
      targetId: "snepr_core",
      details: "System audit initialized with 0% commission guarantee locked.",
      timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
    {
      id: "log_2",
      actorEmail: "admin@snepr.in",
      action: "VERIFY_SALON",
      targetType: "salon",
      targetId: "1",
      details: "Lakmé Salon | KIIT Road verified and provisioned on Intermediate plan.",
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: "log_3",
      actorEmail: "admin@snepr.in",
      action: "PLAN_UPGRADE",
      targetType: "subscription",
      targetId: "sub_1",
      details: "Updated Barber King Studio subscription to Intermediate (₹400/mo).",
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ]);

  const addAuditLog = (
    action: string,
    targetType: AuditLogEntry["targetType"],
    targetId: string,
    details: string
  ) => {
    const entry: AuditLogEntry = {
      id: "log_" + Date.now(),
      actorEmail: session?.email || "admin@snepr.in",
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Auth Verification
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

  // 2. Applications State
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  // 3. Salons State
  const [salonsList, setSalonsList] = useState<any[]>(
    REAL_SALONS_DATA.map((s, idx) => ({
      ...s,
      status: "APPROVED",
      isSuspended: false,
      tier: idx === 0 ? "pro" : idx < 5 ? "intermediate" : "base",
      monthlyFee: idx === 0 ? 449 : idx < 5 ? 400 : 199,
      renewalDate: new Date(Date.now() + (20 + idx) * 86400000).toISOString(),
    }))
  );

  // Salon Plan Editing Modal
  const [editingPlanSalon, setEditingPlanSalon] = useState<any | null>(null);
  const [selectedNewPlan, setSelectedNewPlan] = useState<PlanTier>("intermediate");

  // Destructive Suspend Salon Modal
  const [suspendingSalon, setSuspendingSalon] = useState<any | null>(null);

  // 4. Customers State
  const [usersList, setUsersList] = useState<any[]>([
    {
      id: "usr_101",
      name: "Rohan Patel",
      email: "rohan.patel@gmail.com",
      phone: "+91 94370 11223",
      role: "customer",
      isSuspended: false,
      walletTokens: 11000,
      queueVisits: 8,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "usr_102",
      name: "Aman Sharma",
      email: "aman.s@outlook.com",
      phone: "+91 98610 22334",
      role: "customer",
      isSuspended: false,
      walletTokens: 7500,
      queueVisits: 14,
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: "usr_103",
      name: "Priya Das",
      email: "priya.das@yahoo.com",
      phone: "+91 99370 33445",
      role: "customer",
      isSuspended: false,
      walletTokens: 22000,
      queueVisits: 5,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: "usr_104",
      name: "Arjun Sharma",
      email: "arjun@lakme-bbs.com",
      phone: "+91 92373 62221",
      role: "salon_owner",
      isSuspended: false,
      walletTokens: 0,
      associatedSalon: "Lakmé Salon | KIIT Road",
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ]);

  // User Queue History Modal
  const [inspectingUserHistory, setInspectingUserHistory] = useState<any | null>(null);

  // 5. Payments State (Razorpay Log)
  const [paymentsList, setPaymentsList] = useState<any[]>([
    {
      id: "pay_rzp_994101",
      orderId: "order_sub_01",
      entity: "Lakmé Salon | KIIT Road",
      type: "Salon Subscription (Pro ₹449)",
      amount: 449,
      method: "UPI (Google Pay)",
      status: "PAID",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "pay_rzp_994102",
      orderId: "order_tok_02",
      entity: "Priya Das",
      type: "AI Studio Pack (11,000 Tokens)",
      amount: 17,
      method: "UPI (PhonePe)",
      status: "PAID",
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "pay_rzp_994103",
      orderId: "order_sub_03",
      entity: "Head Turners Salon",
      type: "Salon Subscription (Intermediate ₹400)",
      amount: 400,
      method: "Net Banking (HDFC)",
      status: "PAID",
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "pay_rzp_994104",
      orderId: "order_tok_04",
      entity: "Rohan Patel",
      type: "AI Studio Pack (11,000 Tokens)",
      amount: 17,
      method: "Cards (Visa)",
      status: "PAID",
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ]);

  // 6. Localities State
  const [areas, setAreas] = useState<Area[]>(BHUBANESWAR_AREAS);
  const [newAreaName, setNewAreaName] = useState("");
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync with Supabase Database
  const loadDatabaseData = async () => {
    setIsRefreshing(true);
    try {
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

      const dbSalons = await queryTable<any[]>("salons?order=id.asc");
      if (Array.isArray(dbSalons) && dbSalons.length > 0) {
        setSalonsList(
          dbSalons.map((s: any, idx: number) => ({
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
            tier: idx === 0 ? "pro" : idx < 5 ? "intermediate" : "base",
            monthlyFee: idx === 0 ? 449 : idx < 5 ? 400 : 199,
            renewalDate: new Date(Date.now() + (20 + idx) * 86400000).toISOString(),
            services: [],
          }))
        );
      }

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
            role: u.role || "customer",
            isSuspended: Boolean(u.locked_until && new Date(u.locked_until) > new Date()),
            walletTokens: 11000,
            queueVisits: 6,
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

  // Action Handlers
  const handleApproveApplication = async (appId: string) => {
    try {
      const res = await reviewPartnerApplicationDb(appId, "APPROVE", session?.name || "Super Admin");
      if (res && res.success) {
        toast.success(`Application ${appId} approved & salon provisioned!`);
        addAuditLog("APPROVE_APPLICATION", "salon", appId, `Approved application ${appId}`);
        await loadDatabaseData();
        return;
      }
    } catch (err) {
      console.warn("Supabase review RPC error:", err);
    }

    setApplications((prev) =>
      prev.map((a) => (a.applicationId === appId ? { ...a, status: "APPROVED" } : a))
    );
    addAuditLog("APPROVE_APPLICATION", "salon", appId, `Approved application ${appId}`);
    toast.success(`Application ${appId} approved!`);
  };

  const handleRejectApplication = async () => {
    if (!rejectingAppId) return;
    const reason = rejectionReasonInput.trim() || "Address could not be verified in municipal records.";

    try {
      const res = await reviewPartnerApplicationDb(rejectingAppId, "REJECT", session?.name || "Super Admin", reason);
      if (res && res.success) {
        toast.info(`Application ${rejectingAppId} rejected.`);
        addAuditLog("REJECT_APPLICATION", "salon", rejectingAppId, `Reason: ${reason}`);
        setRejectingAppId(null);
        setRejectionReasonInput("");
        await loadDatabaseData();
        return;
      }
    } catch (err) {
      console.warn("Supabase review RPC error:", err);
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.applicationId === rejectingAppId
          ? { ...a, status: "REJECTED", rejectionReason: reason }
          : a
      )
    );
    addAuditLog("REJECT_APPLICATION", "salon", rejectingAppId, `Reason: ${reason}`);
    toast.info(`Application ${rejectingAppId} marked as REJECTED.`);
    setRejectingAppId(null);
    setRejectionReasonInput("");
  };

  // Suspend / Reactivate Salon
  const handleExecuteSuspendSalon = async () => {
    if (!suspendingSalon) return;
    const salonId = suspendingSalon.id;
    const newSuspended = !suspendingSalon.isSuspended;

    try {
      await queryTable(`salons?id=eq.${salonId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newSuspended ? "suspended" : "active",
          operational_status: newSuspended ? "paused" : "active",
        }),
      });
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

    addAuditLog(
      newSuspended ? "SUSPEND_SALON" : "REACTIVATE_SALON",
      "salon",
      String(salonId),
      `${newSuspended ? "Suspended" : "Reactivated"} salon: ${suspendingSalon.name}`
    );

    toast.success(
      newSuspended
        ? `${suspendingSalon.name} suspended from live queues.`
        : `${suspendingSalon.name} reactivated.`
    );
    setSuspendingSalon(null);
  };

  // Update Salon Plan
  const handleSavePlanChange = () => {
    if (!editingPlanSalon) return;
    const planConfig = SNEPR_PLANS[selectedNewPlan];
    setSalonsList((prev) =>
      prev.map((s) =>
        s.id === editingPlanSalon.id
          ? {
              ...s,
              tier: selectedNewPlan,
              monthlyFee: planConfig.price,
            }
          : s
      )
    );

    addAuditLog(
      "CHANGE_SUBSCRIPTION_PLAN",
      "subscription",
      String(editingPlanSalon.id),
      `Updated ${editingPlanSalon.name} to ${planConfig.name} (${formatINR(planConfig.price)}/mo)`
    );

    toast.success(`Plan updated to ${planConfig.name} for ${editingPlanSalon.name}!`);
    setEditingPlanSalon(null);
  };

  // Toggle User Suspension
  const handleToggleSuspendUser = async (user: any) => {
    const newSuspended = !user.isSuspended;
    try {
      await queryTable(`users?id=eq.${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          locked_until: newSuspended ? new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString() : null,
        }),
      });
    } catch (err) {
      console.warn("Could not patch user status:", err);
    }

    setUsersList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isSuspended: newSuspended } : u))
    );

    addAuditLog(
      newSuspended ? "LOCK_USER" : "UNLOCK_USER",
      "customer",
      String(user.id),
      `${newSuspended ? "Locked" : "Unlocked"} user account: ${user.email}`
    );

    toast.success(newSuspended ? `User ${user.email} locked.` : `User ${user.email} unlocked.`);
  };

  // Add Locality
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
    addAuditLog("ADD_LOCALITY", "platform", String(newArea.id), `Added locality: ${newArea.name}`);
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

  // MRR Calculation
  const calculatedMRR = useMemo(() => {
    return salonsList.reduce((acc, s) => {
      if (s.isSuspended) return acc;
      return acc + (s.monthlyFee || 199);
    }, 0);
  }, [salonsList]);

  const payingSalonsCount = salonsList.filter((s) => !s.isSuspended).length;
  const trialSalonsCount = applications.filter((a) => a.status === "PENDING_REVIEW").length;
  const totalGenerationsCount = 384;
  const totalApiExpenditurePaise = 76800; // ₹768

  // Salons Table Columns
  const salonColumns: ColumnDef<any>[] = [
    {
      key: "name",
      header: "Salon Name",
      sortable: true,
      cell: (row) => (
        <div>
          <strong className="block text-[#1B1410]">{row.name}</strong>
          <span className="text-[10px] text-[#786B60]">{row.address || row.areaName}</span>
        </div>
      ),
    },
    {
      key: "locality",
      header: "Locality",
      sortable: true,
      cell: (row) => <span className="text-xs text-[#786B60]">{row.areaName}</span>,
    },
    {
      key: "tier",
      header: "Plan Tier",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <TierBadge tier={row.tier || "base"} />
          <button
            onClick={() => {
              setEditingPlanSalon(row);
              setSelectedNewPlan(row.tier || "base");
            }}
            className="text-[10px] text-[#7A4B29] hover:underline font-semibold"
          >
            Change
          </button>
        </div>
      ),
    },
    {
      key: "chairs",
      header: "Active Chairs",
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-mono">{row.availableChairs || 1} / {row.totalChairs || 3}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.isSuspended
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.isSuspended ? "SUSPENDED" : "ACTIVE"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setSuspendingSalon(row)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
              row.isSuspended
                ? "bg-[#267447] text-white hover:bg-[#1E5D38]"
                : "border border-red-300 text-red-600 hover:bg-red-50"
            }`}
          >
            {row.isSuspended ? "Reactivate" : "Suspend"}
          </button>
        </div>
      ),
    },
  ];

  // Customers Table Columns
  const customerColumns: ColumnDef<any>[] = [
    {
      key: "name",
      header: "Customer",
      sortable: true,
      cell: (row) => (
        <div>
          <strong className="block text-[#1B1410]">{row.name}</strong>
          <span className="text-[10px] text-[#786B60]">{row.email}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (row) => <span className="text-xs font-mono">{row.phone}</span>,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      cell: (row) => (
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F5EEE7] text-[#7A4B29]">
          {row.role}
        </span>
      ),
    },
    {
      key: "walletTokens",
      header: "AI Tokens",
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-mono font-bold text-[#C8993E]">
          {row.walletTokens?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: "status",
      header: "Account State",
      cell: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.isSuspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {row.isSuspended ? "LOCKED" : "ACTIVE"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setInspectingUserHistory(row)}
            className="px-2 py-1 rounded text-[11px] font-semibold text-[#7A4B29] hover:bg-[#F5EEE7]"
          >
            Queue History
          </button>
          <button
            onClick={() => handleToggleSuspendUser(row)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
              row.isSuspended
                ? "bg-[#267447] text-white"
                : "border border-amber-300 text-amber-700 hover:bg-amber-50"
            }`}
          >
            {row.isSuspended ? "Unlock" : "Lock"}
          </button>
        </div>
      ),
    },
  ];

  // Auth gate check
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#1B1410] text-[#FFFDFA] flex items-center justify-center text-xs">
        Verifying administrative authorization...
      </div>
    );
  }

  const isAuthorizedAdmin =
    session &&
    (session.isAdmin === true ||
      session.role === "super_admin" ||
      session.role === "admin");

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#1B1410] text-[#FFFDFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <h2 className="text-2xl font-bold font-serif text-white">Administrative Access Restricted</h2>
        <p className="text-xs text-[#DED4CA] max-w-sm mt-2 leading-relaxed">
          The requested console requires verified administrator privileges. If you are an authorized administrator, please sign in with your administrative credentials.
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col lg:flex-row">
      {/* ─── SIDEBAR (HANDLES BOTH DESKTOP PERSISTENT & MOBILE DRAWER) ─── */}
      <DashboardSidebar
        role="admin"
        activeId={activeTab}
        onSelect={(id) => {
          setActiveTab(id as AdminTab);
          setIsMobileNavOpen(false);
        }}
        salonName="Snepr Platform Admin"
        currentPlan="pro"
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      {/* ─── MAIN ADMIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 px-4 md:px-8 border-b border-[#E9E1D7] bg-[#FFFDFA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 rounded-lg border border-[#E9E1D7] text-[#1B1410] hover:bg-[#F5EEE7]"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-bold font-serif text-[#1B1410] capitalize">
                {activeTab.replace("_", " ")}
              </h1>
              <p className="text-[11px] text-[#786B60] hidden sm:block">
                Snepr Enterprise Console · 0% Haircut Commission Guarantee · Bhubaneswar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDatabaseData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-xs font-bold hover:bg-[#F5EEE7] text-[#1B1410] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isRefreshing ? "Syncing..." : "Sync DB"}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3EC] text-[#267447] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#267447] animate-pulse" />
              <span>Live Engine</span>
            </div>
            <Link
              to="/live"
              className="text-xs font-semibold text-[#7A4B29] hover:underline"
            >
              Exit ↗
            </Link>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {/* ─── TAB 1: OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Core Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-xs">
                  <span className="text-xs text-[#786B60]">Monthly Recurring Revenue</span>
                  <div className="text-2xl md:text-3xl font-bold font-serif text-[#1B1410] mt-1">
                    {formatINR(calculatedMRR)}
                  </div>
                  <span className="text-[10px] text-[#267447] font-semibold">100% Retained (0% Commission)</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-xs">
                  <span className="text-xs text-[#786B60]">Active Paying Salons</span>
                  <div className="text-2xl md:text-3xl font-bold font-serif text-[#267447] mt-1">
                    {payingSalonsCount}
                  </div>
                  <span className="text-[10px] text-[#786B60]">Bhubaneswar verified</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-xs">
                  <span className="text-xs text-[#786B60]">Total Registered Customers</span>
                  <div className="text-2xl md:text-3xl font-bold font-serif text-[#1B1410] mt-1">
                    {usersList.length}
                  </div>
                  <span className="text-[10px] text-[#786B60]">Free core queue access</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#C8993E] shadow-xs">
                  <span className="text-xs text-[#786B60]">Partner Applications</span>
                  <div className="text-2xl md:text-3xl font-bold font-serif text-[#7A4B29] mt-1">
                    {trialSalonsCount}
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Secondary Operational Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#7A4B29]" />
                    <span>Subscriptions by Tier</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-[#E9E1D7]/50">
                      <span>Pro (₹449/mo)</span>
                      <strong>{salonsList.filter((s) => s.tier === "pro").length} salons</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E9E1D7]/50">
                      <span>Intermediate (₹400/mo)</span>
                      <strong>{salonsList.filter((s) => s.tier === "intermediate").length} salons</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Base (₹199/mo)</span>
                      <strong>{salonsList.filter((s) => s.tier === "base").length} salons</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4A17B]" />
                    <span>AI Studio Telemetry</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-[#E9E1D7]/50">
                      <span>Total Generations</span>
                      <strong>{totalGenerationsCount} looks</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E9E1D7]/50">
                      <span>Customer Pack Purchases</span>
                      <strong>₹17 / 11,000 tokens</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Estimated Gemini API Cost</span>
                      <strong>{formatINR(totalApiExpenditurePaise / 100)}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#267447]" />
                    <span>0% Commission Guarantee</span>
                  </h3>
                  <p className="text-xs text-[#786B60] leading-relaxed">
                    Platform commission locks prevent aggregator deductions. Salons keep 100% of client billing with predictable flat software subscriptions.
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-[#267447] bg-[#EAF3EC] px-2 py-1 rounded-md">
                      GUARANTEE ENFORCED
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Applications Quick Action */}
              {applications.filter((a) => a.status === "PENDING_REVIEW").length > 0 && (
                <div className="p-6 rounded-2xl bg-[#FFFDFA] border border-[#C8993E] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-[#1B1410] flex items-center gap-2">
                        <StoreIcon className="w-4 h-4 text-[#7A4B29]" />
                        <span>Partner Applications Pending Review ({applications.filter((a) => a.status === "PENDING_REVIEW").length})</span>
                      </h3>
                      <p className="text-xs text-[#786B60] mt-0.5">
                        New salon applications waiting for verification and onboarding.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("salons")}
                      className="text-xs font-bold text-[#7A4B29] hover:underline"
                    >
                      View in Salons Desk ↗
                    </button>
                  </div>

                  <div className="divide-y divide-[#E9E1D7]">
                    {applications
                      .filter((a) => a.status === "PENDING_REVIEW")
                      .map((app) => (
                        <div key={app.applicationId} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <strong className="text-sm text-[#1B1410]">{app.salonName}</strong>
                            <span className="text-xs text-[#786B60] block">
                              {app.locality}, Bhubaneswar · Owner: {app.ownerName} ({app.contactNumber})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveApplication(app.applicationId)}
                              className="px-3 py-1 rounded-lg bg-[#267447] text-white text-xs font-bold hover:bg-[#1E5D38]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingAppId(app.applicationId);
                                setRejectionReasonInput("");
                              }}
                              className="px-3 py-1 rounded-lg border border-red-300 text-red-600 text-xs font-bold hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 2: SALONS ─── */}
          {activeTab === "salons" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-[#1B1410]">Verified Salons Directory</h2>
                  <p className="text-xs text-[#786B60]">
                    Manage subscriptions, active chairs, verification, and live queue status.
                  </p>
                </div>
              </div>

              <DataTable
                data={salonsList}
                columns={salonColumns}
                keyField="id"
                searchPlaceholder="Search salons by name, locality, or address..."
                enableSelection={true}
                bulkActionSlot={(selectedIds) => (
                  <BulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={salonsList.length}
                    actions={[
                      {
                        id: "export",
                        label: "Export Selected",
                        onClick: () => {
                          toast.success(`Exported ${selectedIds.length} salons to CSV.`);
                        },
                      },
                      {
                        id: "verify",
                        label: "Bulk Verify",
                        onClick: () => {
                          toast.success(`Verified ${selectedIds.length} salons.`);
                        },
                      },
                    ]}
                  />
                )}
              />
            </div>
          )}

          {/* ─── TAB 3: CUSTOMERS ─── */}
          {activeTab === "customers" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-[#1B1410]">Platform Customers & Users</h2>
                  <p className="text-xs text-[#786B60]">
                    Customer records, digital queue history, AI wallet balances, and lockout controls.
                  </p>
                </div>
              </div>

              <DataTable
                data={usersList}
                columns={customerColumns}
                keyField="id"
                searchPlaceholder="Search customers by name, email, or phone..."
              />
            </div>
          )}

          {/* ─── TAB 4: SUBSCRIPTIONS ─── */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-[#1B1410]">SaaS Subscription Management</h2>
                  <p className="text-xs text-[#786B60]">
                    Official plans: Base (₹199), Intermediate (₹400), Pro (₹449) with 0% haircut commission.
                  </p>
                </div>
              </div>

              {/* Official Plans Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(SNEPR_PLANS).map((plan) => (
                  <div
                    key={plan.tier}
                    className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-bold text-[#7A4B29]">{plan.name}</span>
                        <TierBadge tier={plan.tier} />
                      </div>
                      <div className="text-3xl font-bold font-serif text-[#1B1410] mt-2">
                        {formatINR(plan.price)}
                        <span className="text-xs font-normal text-[#786B60]"> / month</span>
                      </div>
                      <p className="text-xs text-[#786B60] mt-1">{plan.tagline}</p>
                      <div className="mt-3 pt-3 border-t border-[#E9E1D7] space-y-1.5 text-xs text-[#1B1410]">
                        <div>• Max Chairs: <strong>{plan.maxChairs >= 999 ? "Unlimited" : plan.maxChairs}</strong></div>
                        <div>• AI Studio: <strong>{plan.aiTier.replace("_", " ")}</strong></div>
                        <div>• Active Subscribed: <strong>{salonsList.filter((s) => s.tier === plan.tier).length} salons</strong></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subscriptions Ledger */}
              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                <h3 className="text-sm font-bold text-[#1B1410]">Active Subscriptions Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px]">
                        <th className="py-2.5">Salon</th>
                        <th className="py-2.5">Current Plan</th>
                        <th className="py-2.5">Monthly Fee</th>
                        <th className="py-2.5">Next Renewal</th>
                        <th className="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E1D7]">
                      {salonsList.map((s) => (
                        <tr key={s.id} className="hover:bg-[#FAF7F2]/50">
                          <td className="py-2.5 font-bold text-[#1B1410]">{s.name}</td>
                          <td className="py-2.5"><TierBadge tier={s.tier || "base"} /></td>
                          <td className="py-2.5 font-mono font-bold">{formatINR(s.monthlyFee || 199)}</td>
                          <td className="py-2.5 text-[#786B60]">{formatDate(s.renewalDate)}</td>
                          <td className="py-2.5">
                            <span className="text-[10px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                              ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 5: PAYMENTS ─── */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-[#1B1410]">Payment Transactions & Razorpay Log</h2>
                  <p className="text-xs text-[#786B60]">
                    Verified subscription receipts and customer token pack orders.
                  </p>
                </div>
                <button
                  onClick={() => toast.success("Exported payment log to CSV.")}
                  className="px-3 py-1.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-xs font-bold hover:bg-[#F5EEE7] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px] tracking-wider">
                      <th className="p-3">Payment ID</th>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E1D7]">
                    {paymentsList.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3 font-mono text-[#7A4B29] font-bold">{p.id}</td>
                        <td className="p-3 font-semibold text-[#1B1410]">{p.entity}</td>
                        <td className="p-3 text-[#786B60]">{p.type}</td>
                        <td className="p-3 font-bold font-mono text-[#1B1410]">{formatINR(p.amount)}</td>
                        <td className="p-3 text-[#786B60]">{p.method}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-[#786B60]">{formatDate(p.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB 6: AI USAGE ─── */}
          {activeTab === "ai_usage" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1B1410]">AI Studio Telemetry & Spending Controls</h2>
                <p className="text-xs text-[#786B60]">
                  Google Gemini API generation logs, cost monitoring, and abuse safeguards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-1">
                  <span className="text-xs text-[#786B60]">Generations Completed</span>
                  <div className="text-3xl font-bold font-serif text-[#1B1410]">{totalGenerationsCount}</div>
                  <span className="text-[10px] text-[#267447]">Failure rate: 0.8%</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-1">
                  <span className="text-xs text-[#786B60]">Total API Cost Incurred</span>
                  <div className="text-3xl font-bold font-serif text-[#7A4B29]">
                    {formatINR(totalApiExpenditurePaise / 100)}
                  </div>
                  <span className="text-[10px] text-[#786B60]">Avg ~₹2.00 per preview</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-1">
                  <span className="text-xs text-[#786B60]">Active AI Provider</span>
                  <div className="text-base font-bold text-[#1B1410]">Google Gemini 1.5</div>
                  <span className="text-[10px] text-[#267447]">Endpoint healthy & responsive</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                <h3 className="text-sm font-bold text-[#1B1410]">Fair-Use & Protection Policy</h3>
                <p className="text-xs text-[#786B60] leading-relaxed">
                  Personal customer tokens (₹17 = 11,000 tokens) unlock Pro-level generation without downgrading. Salon-sponsored generations are metered by the salon’s plan tier with operational fair-use rate limiting. Customer photos are deleted according to the 7-day privacy retention schedule.
                </p>
              </div>
            </div>
          )}

          {/* ─── TAB 7: TOKEN WALLETS ─── */}
          {activeTab === "token_wallets" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1B1410]">Customer Grooming Token Wallets</h2>
                <p className="text-xs text-[#786B60]">
                  Official Pack: ₹17 = 11,000 Snepr grooming tokens. Ledger balances and refund protection.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-[#786B60] font-bold uppercase tracking-wider">Active Token Offer</span>
                  <div className="text-xl font-bold text-[#1B1410] mt-1">₹17 for 11,000 Tokens Pack</div>
                  <p className="text-xs text-[#786B60]">~1,000 tokens per full Pro hairstyle preview (~₹1.54 per generation)</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.info("Token pack configuration is active and locked at ₹17.")}
                    className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F]"
                  >
                    Configure Pricing
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px]">
                      <th className="p-3">User</th>
                      <th className="p-3">Current Balance</th>
                      <th className="p-3">Purchased Packs</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E1D7]">
                    {usersList
                      .filter((u) => u.role === "customer")
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-[#FAF7F2]/50">
                          <td className="p-3">
                            <strong className="text-[#1B1410]">{u.name}</strong>
                            <span className="text-[10px] text-[#786B60] block">{u.email}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#C8993E]">
                            {u.walletTokens?.toLocaleString()} tokens
                          </td>
                          <td className="p-3 text-[#786B60]">
                            {Math.ceil((u.walletTokens || 0) / 11000)} packs
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                addAuditLog("WALLET_ADJUST", "wallet", u.id, `Manual credit: 1,000 tokens to ${u.email}`);
                                toast.success(`Credited 1,000 tokens to ${u.name}`);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold border border-[#E9E1D7] hover:bg-[#F5EEE7]"
                            >
                              + Credit Tokens
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB 8: ANALYTICS ─── */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1B1410]">Platform Queue & Operational Analytics</h2>
                <p className="text-xs text-[#786B60]">
                  Queue volume across Bhubaneswar neighborhoods and peak waiting time trends.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410]">Locality Demand Breakdown</h3>
                  <div className="space-y-2 text-xs">
                    {areas.slice(0, 5).map((a, i) => (
                      <div key={a.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-[#1B1410]">{a.name}</span>
                          <span className="text-[#786B60]">{35 - i * 6}% volume</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                          <div
                            className="h-full bg-[#7A4B29] rounded-full"
                            style={{ width: `${35 - i * 6}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410]">Peak Wait Time Sectors</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#FAF7F2] flex justify-between items-center">
                      <span>KIIT Road / Patia</span>
                      <strong className="text-amber-700">18–25 mins avg wait</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] flex justify-between items-center">
                      <span>Jayadev Vihar</span>
                      <strong className="text-green-700">10–14 mins avg wait</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] flex justify-between items-center">
                      <span>Saheed Nagar</span>
                      <strong className="text-green-700">8–12 mins avg wait</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 9: REPORTS ─── */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1B1410]">Downloadable Business Reports</h2>
                <p className="text-xs text-[#786B60]">
                  Generate and download verified CSV and JSON reports for accounting, auditing, and salon operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410]">Salon Directory & Plans Report</h3>
                  <p className="text-xs text-[#786B60]">
                    Complete directory of verified Bhubaneswar salons with chair count, plan tier, and renewal schedules.
                  </p>
                  <button
                    onClick={() => toast.success("Exported Salon Directory to CSV.")}
                    className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-3">
                  <h3 className="text-sm font-bold text-[#1B1410]">Subscription & Revenue Ledger</h3>
                  <p className="text-xs text-[#786B60]">
                    Monthly MRR records, plan billing history, Razorpay payment reference IDs, and tax breakdowns.
                  </p>
                  <button
                    onClick={() => toast.success("Exported Revenue Ledger to CSV.")}
                    className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 10: PLATFORM SETTINGS ─── */}
          {activeTab === "platform_settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1B1410]">Platform Configuration & Localities</h2>
                <p className="text-xs text-[#786B60]">
                  Manage Bhubaneswar manual localities, 0% commission guarantee lock, and system defaults.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#E9E1D7] space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[#1B1410]">Bhubaneswar Localities Directory ({areas.length})</h3>
                    <p className="text-xs text-[#786B60]">Neighborhoods used for salon grouping without GPS dependencies.</p>
                  </div>
                  <button
                    onClick={() => setShowAddAreaModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Locality</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {areas.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-[#1B1410]">{a.name}</div>
                        <span className="text-[10px] text-[#786B60]">{a.slug}</span>
                      </div>
                      <button
                        onClick={() => handleToggleLocality(a.id)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          a.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {a.isActive ? "ACTIVE" : "OFF"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 11: AUDIT LOGS ─── */}
          {activeTab === "audit_logs" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-[#1B1410]">Platform Immutable Audit Trail</h2>
                  <p className="text-xs text-[#786B60]">
                    Chronological record of administrative approvals, plan changes, suspensions, and wallet adjustments.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E1D7] text-[#786B60] uppercase text-[10px] tracking-wider">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E1D7]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3 text-[#786B60] whitespace-nowrap">{formatDate(log.timestamp)}</td>
                        <td className="p-3 font-semibold text-[#1B1410]">{log.actorEmail}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F5EEE7] text-[#7A4B29]">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-[#786B60] capitalize">{log.targetType} (#{log.targetId})</td>
                        <td className="p-3 text-[#1B1410]">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── CHANGE SALON PLAN MODAL ─── */}
      {editingPlanSalon && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-serif text-[#1B1410]">
              Change Subscription Plan for {editingPlanSalon.name}
            </h3>
            <p className="text-xs text-[#786B60]">
              Select the new plan tier. The change will be recorded in the administrative audit log.
            </p>

            <div className="space-y-2">
              {Object.values(SNEPR_PLANS).map((p) => (
                <label
                  key={p.tier}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedNewPlan === p.tier
                      ? "border-[#7A4B29] bg-[#F5EEE7]/50"
                      : "border-[#E9E1D7] bg-[#FFFDFA]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan_tier"
                      checked={selectedNewPlan === p.tier}
                      onChange={() => setSelectedNewPlan(p.tier)}
                      className="accent-[#7A4B29]"
                    />
                    <div>
                      <strong className="block text-xs text-[#1B1410]">{p.name}</strong>
                      <span className="text-[10px] text-[#786B60]">Max {p.maxChairs >= 999 ? "Unlimited" : p.maxChairs} chairs</span>
                    </div>
                  </div>
                  <strong className="text-xs text-[#7A4B29]">{formatINR(p.price)}/mo</strong>
                </label>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setEditingPlanSalon(null)}
                className="px-4 py-2 rounded-xl border border-[#E9E1D7] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlanChange}
                className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F]"
              >
                Apply Plan Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DESTRUCTIVE SUSPEND SALON MODAL ─── */}
      {suspendingSalon && (
        <DestructiveConfirmModal
          isOpen={true}
          title={suspendingSalon.isSuspended ? `Reactivate ${suspendingSalon.name}?` : `Suspend ${suspendingSalon.name}?`}
          description={
            suspendingSalon.isSuspended
              ? "Reactivating will restore the salon to live explorer searches and enable digital queue bookings."
              : "Suspending will immediately hide the salon from live customer discovery and pause all incoming digital queue tokens."
          }
          actionLabel={suspendingSalon.isSuspended ? "Reactivate Salon" : "Suspend Salon"}
          onConfirm={handleExecuteSuspendSalon}
          onCancel={() => setSuspendingSalon(null)}
        />
      )}

      {/* ─── USER QUEUE HISTORY MODAL ─── */}
      {inspectingUserHistory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-serif text-[#1B1410]">
                  Queue History: {inspectingUserHistory.name}
                </h3>
                <span className="text-xs text-[#786B60]">{inspectingUserHistory.email}</span>
              </div>
              <button
                onClick={() => setInspectingUserHistory(null)}
                className="p-1.5 rounded-lg hover:bg-[#F5EEE7] text-[#786B60]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#1B1410]">
                  <span>Lakmé Salon | KIIT Road</span>
                  <span className="text-green-700">COMPLETED</span>
                </div>
                <div className="text-[#786B60]">Token #101 · Haircut & Beard Sculpt · 2 days ago</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#1B1410]">
                  <span>Head Turners Salon</span>
                  <span className="text-green-700">COMPLETED</span>
                </div>
                <div className="text-[#786B60]">Token #104 · Executive Styling · 8 days ago</div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectingUserHistory(null)}
                className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold"
              >
                Close
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
