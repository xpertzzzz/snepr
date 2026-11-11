import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  LayoutDashboard,
  Armchair,
  Users,
  Scissors,
  BarChart3,
  Sparkles,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Receipt,
  Coins,
  FileText,
  Shield,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { TierBadge } from "@/components/ui/tier-badge";

export type SidebarRole = "owner" | "admin";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DashboardSidebarProps {
  role: SidebarRole;
  activeId: string;
  onSelect: (id: string) => void;
  salonName?: string;
  currentPlan?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  role,
  activeId,
  onSelect,
  salonName = "My Salon",
  currentPlan = "base",
  isMobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  // Collapsed state persisted
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("snepr_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("snepr_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const ownerItems: SidebarItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "queue", label: "Queue Desk", icon: <Armchair className="w-4 h-4" />, badge: "Live" },
    { id: "customers", label: "Customers", icon: <Users className="w-4 h-4" /> },
    { id: "staff", label: "Staff & Chairs", icon: <Users className="w-4 h-4" /> },
    { id: "services", label: "Services", icon: <Scissors className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "studio", label: "Snepr Studio", icon: <Sparkles className="w-4 h-4 text-[#D4A17B]" />, badge: "AI" },
    { id: "subscription", label: "Subscription", icon: <CreditCard className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const adminItems: SidebarItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "salons", label: "Salons", icon: <Building2 className="w-4 h-4" /> },
    { id: "customers", label: "Customers", icon: <Users className="w-4 h-4" /> },
    { id: "subscriptions", label: "Subscriptions", icon: <CreditCard className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <Receipt className="w-4 h-4" /> },
    { id: "ai_usage", label: "AI Usage", icon: <Sparkles className="w-4 h-4 text-[#D4A17B]" /> },
    { id: "token_wallets", label: "Token Wallets", icon: <Coins className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "reports", label: "Reports", icon: <FileText className="w-4 h-4" /> },
    { id: "platform_settings", label: "Platform Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "audit_logs", label: "Audit Logs", icon: <Shield className="w-4 h-4" /> },
  ];

  const items = role === "owner" ? ownerItems : adminItems;

  const handleItemClick = (id: string) => {
    onSelect(id);
    if (onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("snepr_session");
    } catch {}
    navigate({ to: "/login" });
  };

  const sidebarContent = (
    <aside
      className={`h-full bg-[#1C1613] text-[#F3EFEA] flex flex-col justify-between transition-all duration-300 border-r border-[#2C241E] ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#2C241E]">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl font-bold tracking-tight text-white font-serif">
              sn<span className="text-[#D4A17B]">≡</span>pr
            </span>
            {!collapsed && (
              <span className="text-[10px] uppercase tracking-wider text-[#A3978B] font-semibold bg-[#2A211D] px-2 py-0.5 rounded-md">
                {role === "owner" ? "SalonOS" : "Admin"}
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-[#2A211D] hover:bg-[#3D2F28] items-center justify-center text-[#A3978B] hover:text-white transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Close Button */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 text-[#A3978B] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Salon Info / Plan badge (if owner and not collapsed) */}
        {!collapsed && role === "owner" && (
          <div className="p-4 border-b border-[#2C241E]">
            <div className="text-xs font-semibold text-white truncate mb-1.5">
              {salonName}
            </div>
            <div className="flex items-center justify-between">
              <TierBadge tier={currentPlan} size="sm" />
              <button
                onClick={() => handleItemClick("subscription")}
                className="text-[11px] text-[#D4A17B] hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#D4A17B] text-[#1C1613] font-bold shadow-sm"
                    : "text-[#D8CEBF] hover:bg-[#2A211D] hover:text-white"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={isActive ? "text-[#1C1613]" : "text-[#D4A17B]"}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? "bg-[#1C1613] text-[#D4A17B]"
                            : "bg-[#7A4B29] text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-[#2C241E] space-y-1">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors cursor-pointer ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative z-10 h-full max-w-xs w-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

