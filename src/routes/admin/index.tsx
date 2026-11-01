import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2, MapPin, Users, CheckCircle2, XCircle, AlertTriangle,
  Plus, Edit, Eye, Filter, Search, BarChart3, Mail, ShieldCheck,
  TrendingUp, RefreshCw, Armchair, Clock, ChevronRight
} from "lucide-react";
import { SneprWordmark } from "@/components/SneprWordmark";
import { BHUBANESWAR_AREAS, REAL_SALONS_DATA, RealSalon, Area } from "@/lib/real-salons";
import { EmailCenter } from "@/components/admin/EmailCenter";
import { toast } from "sonner";

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"overview" | "localities" | "salons" | "email">("overview");

  // Localities State
  const [areas, setAreas] = useState<Area[]>(BHUBANESWAR_AREAS);
  const [newAreaName, setNewAreaName] = useState("");
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);

  // Salons State
  const [salonsList, setSalonsList] = useState<RealSalon[]>(REAL_SALONS_DATA);
  const [salonSearch, setSalonSearch] = useState("");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<number | "all">("all");

  // Locality Actions
  const handleToggleAreaStatus = (areaId: number) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, isActive: !a.isActive } : a))
    );
    toast.success("Locality status updated!");
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) {
      toast.error("Please enter a locality name.");
      return;
    }
    const newId = areas.length + 1;
    const slug = newAreaName.trim().toLowerCase().replace(/\s+/g, "-");
    const newArea: Area = {
      id: newId,
      cityId: 1,
      name: newAreaName.trim(),
      slug,
      isActive: true,
      displayOrder: areas.length + 1,
    };
    setAreas((prev) => [...prev, newArea]);
    setNewAreaName("");
    setShowAddAreaModal(false);
    toast.success(`Locality "${newArea.name}" added successfully!`);
  };

  // Salon Actions
  const handleToggleVerification = (salonId: number) => {
    setSalonsList((prev) =>
      prev.map((s) => {
        if (s.id !== salonId) return s;
        const newStatus = s.verificationStatus === "verified" ? "unverified" : "verified";
        toast.success(`${s.name} is now ${newStatus}!`);
        return { ...s, verificationStatus: newStatus };
      })
    );
  };

  const handleUpdateOperationalStatus = (salonId: number, status: "active" | "inactive" | "paused") => {
    setSalonsList((prev) =>
      prev.map((s) => (s.id === salonId ? { ...s, operationalStatus: status } : s))
    );
    toast.success("Operational status updated!");
  };

  const handleReassignArea = (salonId: number, newAreaId: number) => {
    const area = areas.find((a) => a.id === newAreaId);
    if (!area) return;
    setSalonsList((prev) =>
      prev.map((s) =>
        s.id === salonId
          ? { ...s, areaId: area.id, areaName: area.name, areaSlug: area.slug }
          : s
      )
    );
    toast.success(`Salon reassigned to ${area.name}!`);
  };

  // Metrics
  const totalSalons = salonsList.length;
  const verifiedSalons = salonsList.filter((s) => s.verificationStatus === "verified").length;
  const totalChairs = salonsList.reduce((acc, s) => acc + (s.totalChairs || 3), 0);
  const activeQueuesCount = salonsList.reduce((acc, s) => acc + (s.waitingCount || 0), 0);

  const filteredSalons = salonsList.filter((s) => {
    if (selectedAreaFilter !== "all" && s.areaId !== selectedAreaFilter) return false;
    if (salonSearch.trim()) {
      const q = salonSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.areaName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] font-sans">
      {/* ─── Top Admin Bar ─── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D7] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <SneprWordmark height={30} className="text-[#1B1410]" />
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-[#7A4B29]/10 text-[#7A4B29] text-[11px] font-bold tracking-wider uppercase border border-[#7A4B29]/20">
              Admin Console · Bhubaneswar
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/salon"
              className="text-xs font-bold text-[#7A4B29] hover:underline"
            >
              SalonOS Portal ↗
            </Link>
            <Link
              to="/live"
              className="text-xs font-bold text-[#1B1410] hover:underline"
            >
              Live Queues ↗
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Sub-nav Tabs ─── */}
      <div className="bg-white border-b border-[#E8E1D7] px-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-[#7A4B29] text-[#7A4B29]"
                : "border-transparent text-[#6B5E55] hover:text-[#1B1410]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            System Overview
          </button>
          <button
            onClick={() => setActiveTab("localities")}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "localities"
                ? "border-[#7A4B29] text-[#7A4B29]"
                : "border-transparent text-[#6B5E55] hover:text-[#1B1410]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Locality Management ({areas.length})
          </button>
          <button
            onClick={() => setActiveTab("salons")}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "salons"
                ? "border-[#7A4B29] text-[#7A4B29]"
                : "border-transparent text-[#6B5E55] hover:text-[#1B1410]"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Salon Partner Operations ({salonsList.length})
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "email"
                ? "border-[#7A4B29] text-[#7A4B29]"
                : "border-transparent text-[#6B5E55] hover:text-[#1B1410]"
            }`}
          >
            <Mail className="w-4 h-4" />
            Partner Broadcast & Email
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E8E1D7] shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8F8177]">
                  Total Registered Salons
                </span>
                <div className="text-3xl font-black text-[#1B1410] mt-1">{totalSalons}</div>
                <div className="text-xs text-[#2E7D4F] font-bold mt-1">
                  ✓ {verifiedSalons} verified partners
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E1D7] shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8F8177]">
                  Active Chairs Tracked
                </span>
                <div className="text-3xl font-black text-[#1B1410] mt-1">{totalChairs}</div>
                <div className="text-xs text-[#8F8177] font-medium mt-1">Across 8 Bhubaneswar localities</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E1D7] shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8F8177]">
                  Active Queues Today
                </span>
                <div className="text-3xl font-black text-[#7A4B29] mt-1">{activeQueuesCount}</div>
                <div className="text-xs text-[#8F8177] font-medium mt-1">Live customer tokens</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E1D7] shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8F8177]">
                  Launch Locality Coverage
                </span>
                <div className="text-3xl font-black text-[#C8993E] mt-1">{areas.length}</div>
                <div className="text-xs text-[#8F8177] font-medium mt-1">Bhubaneswar neighborhoods active</div>
              </div>
            </div>

            {/* Locality Breakdown Table */}
            <div className="bg-white rounded-3xl border border-[#E8E1D7] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7] mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1B1410]">Locality Breakdown</h3>
                  <p className="text-xs text-[#8F8177]">Partner density across Bhubaneswar neighborhoods</p>
                </div>
                <button
                  onClick={() => setActiveTab("localities")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7A4B29] text-white text-xs font-bold"
                >
                  Manage Localities
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {areas.map((area) => {
                  const count = salonsList.filter((s) => s.areaId === area.id).length;
                  return (
                    <div
                      key={area.id}
                      className="p-4 rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-[#1B1410]">{area.name}</div>
                        <div className="text-xs text-[#8F8177]">{count} salon{count === 1 ? "" : "s"} listed</div>
                      </div>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          area.isActive ? "bg-[#2E7D4F]" : "bg-zinc-400"
                        }`}
                        title={area.isActive ? "Active" : "Inactive"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOCALITY MANAGEMENT */}
        {activeTab === "localities" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-[#E8E1D7]">
              <div>
                <h3 className="text-lg font-bold text-[#1B1410]">Bhubaneswar Locality Catalog</h3>
                <p className="text-xs text-[#8F8177]">
                  Manage predefined discovery neighborhoods. Zero GPS permissions needed by users.
                </p>
              </div>
              <button
                onClick={() => setShowAddAreaModal(true)}
                className="px-4 py-2 bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Locality
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E1D7] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#7A4B29] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E1D7]">
                  <tr>
                    <th className="p-4">Order</th>
                    <th className="p-4">Locality Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Salons Count</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E1D7]">
                  {areas.map((area) => {
                    const salonCount = salonsList.filter((s) => s.areaId === area.id).length;
                    return (
                      <tr key={area.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#8F8177]">#{area.displayOrder}</td>
                        <td className="p-4 font-bold text-sm text-[#1B1410]">{area.name}</td>
                        <td className="p-4 font-mono text-[#8F8177]">{area.slug}</td>
                        <td className="p-4">
                          <span className="font-bold text-[#7A4B29]">{salonCount} salons</span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              area.isActive
                                ? "bg-[#2E7D4F]/10 text-[#2E7D4F]"
                                : "bg-zinc-200 text-zinc-600"
                            }`}
                          >
                            {area.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleAreaStatus(area.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              area.isActive
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {area.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SALON PARTNER OPERATIONS */}
        {activeTab === "salons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E1D7]">
              <div>
                <h3 className="text-lg font-bold text-[#1B1410]">Salon Partner Verification & Status</h3>
                <p className="text-xs text-[#8F8177]">
                  Verify Bhubaneswar salon listings, reassign localities, and monitor live queues.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedAreaFilter}
                  onChange={(e) =>
                    setSelectedAreaFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="h-10 px-3 bg-[#FAF7F2] border border-[#E8E1D7] rounded-xl text-xs font-bold text-[#1B1410]"
                >
                  <option value="all">All Bhubaneswar Areas</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8F8177]" />
                  <input
                    type="text"
                    placeholder="Search salon..."
                    value={salonSearch}
                    onChange={(e) => setSalonSearch(e.target.value)}
                    className="h-10 pl-9 pr-3 w-full bg-[#FAF7F2] border border-[#E8E1D7] rounded-xl text-xs text-[#1B1410]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E1D7] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#7A4B29] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E1D7]">
                  <tr>
                    <th className="p-4">Salon Name</th>
                    <th className="p-4">Locality</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Chairs</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Operations</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E1D7]">
                  {filteredSalons.map((salon) => (
                    <tr key={salon.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-[#1B1410]">{salon.name}</div>
                        <div className="text-[11px] text-[#8F8177] truncate max-w-xs">{salon.address}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={salon.areaId}
                          onChange={(e) => handleReassignArea(salon.id, Number(e.target.value))}
                          className="px-2 py-1 bg-[#FAF7F2] border border-[#E8E1D7] rounded-lg text-xs font-bold text-[#7A4B29]"
                        >
                          {areas.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-[#6B5E55]">{salon.category}</td>
                      <td className="p-4 font-bold text-[#1B1410]">
                        {salon.availableChairs}/{salon.totalChairs} Free
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            salon.verificationStatus === "verified"
                              ? "bg-[#2E7D4F]/10 text-[#2E7D4F]"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {salon.verificationStatus === "verified" ? "✓ Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={salon.operationalStatus}
                          onChange={(e) =>
                            handleUpdateOperationalStatus(salon.id, e.target.value as any)
                          }
                          className="px-2 py-1 bg-[#FAF7F2] border border-[#E8E1D7] rounded-lg text-xs font-semibold"
                        >
                          <option value="active">Active (Open)</option>
                          <option value="paused">Paused</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleVerification(salon.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            salon.verificationStatus === "verified"
                              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                              : "bg-[#2E7D4F] text-white hover:bg-[#25633e]"
                          }`}
                        >
                          {salon.verificationStatus === "verified" ? "Revoke" : "Approve Partner"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PARTNER BROADCAST & EMAIL */}
        {activeTab === "email" && (
          <div className="bg-white rounded-3xl border border-[#E8E1D7] p-6 shadow-xs">
            <EmailCenter />
          </div>
        )}
      </main>

      {/* Add Locality Modal */}
      {showAddAreaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1410]/50 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8E1D7] p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[#1B1410] mb-1">Add Bhubaneswar Locality</h3>
            <p className="text-xs text-[#8F8177] mb-4">
              Enter the name of the new Bhubaneswar neighborhood to enable for salon discovery.
            </p>

            <input
              type="text"
              placeholder="e.g. Master Canteen, Infocity..."
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="w-full h-11 px-4 bg-white rounded-xl border border-[#E8E1D7] text-sm text-[#1B1410] mb-4 focus:outline-none focus:ring-2 focus:ring-[#7A4B29]"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddAreaModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#8F8177] hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddArea}
                className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold shadow-xs hover:bg-[#60391F]"
              >
                Save Locality
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminConsole;

