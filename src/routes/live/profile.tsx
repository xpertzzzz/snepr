import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  User, Store, ShieldCheck, Ticket, Award, Settings,
  LogOut, ChevronRight, PlusCircle, Building2, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/live/profile")({
  head: () => ({
    title: "My Account | Snepr",
    meta: [
      { name: "description", content: "Manage your Snepr customer profile, track queue tokens, and register or manage your salon." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: ProfilePageUnified,
});

export function ProfilePageUnified() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [salonApplication, setSalonApplication] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const u = JSON.parse(stored);
        setSession(u);
      }
      const app = localStorage.getItem("snepr_salon_application");
      if (app) {
        setSalonApplication(JSON.parse(app));
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("snepr_session");
    } catch {}
    setSession(null);
    window.dispatchEvent(new Event("storage"));
    toast.success("Signed out successfully.");
    navigate({ to: "/login" });
  };

  const isSalonApproved = session?.role === "salon_owner" && (session?.approvalStatus === "approved" || salonApplication?.status === "APPROVED");
  const isPendingReview = session?.approvalStatus === "pending" || salonApplication?.status === "PENDING_REVIEW";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      {/* Top Header */}
      <header className="border-b border-[#E9E1D7] bg-[#FAF7F2] sticky top-0 z-20">
        <div className="max-w-[800px] h-16 mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Snepr home">
            <SneprWordmark height={30} color="#1B1410" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/live"
              className="text-xs font-semibold text-[#7A4B29] hover:underline"
            >
              Live Salons
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* User Card */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F0E8DF] border border-[#E0D4C5] flex items-center justify-center text-[#7A4B29] font-bold text-2xl uppercase">
              {session?.name ? session.name[0] : "S"}
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-[#1B1410]">
                {session?.name || "Guest Customer"}
              </h1>
              <p className="text-xs text-[#786B60] mt-0.5">
                {session?.email || "Not signed in"}
              </p>
              {session?.phone && (
                <p className="text-[11px] text-[#9B8B7E] mt-0.5">{session.phone}</p>
              )}
            </div>
          </div>

          <div>
            {session ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E9E1D7] bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold text-[#786B60] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm"
              >
                Sign in with OTP / Google
              </Link>
            )}
          </div>
        </div>

        {/* Quick Customer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/live/queue"
            className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E9E1D7] hover:border-[#7A4B29]/40 transition-colors flex items-center gap-3.5 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29] group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1B1410]">My Token</div>
              <div className="text-[11px] text-[#786B60] truncate">Track active queues</div>
            </div>
          </Link>

          <Link
            to="/points"
            className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E9E1D7] hover:border-[#7A4B29]/40 transition-colors flex items-center gap-3.5 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-center text-[#C8993E] group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1B1410]">Snepr Points</div>
              <div className="text-[11px] text-[#786B60] truncate">Rewards & discounts</div>
            </div>
          </Link>

          <Link
            to="/live/aistudio"
            className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E9E1D7] hover:border-[#7A4B29]/40 transition-colors flex items-center gap-3.5 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29] group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1B1410]">AI Studio</div>
              <div className="text-[11px] text-[#786B60] truncate">Hairstyle catalogue</div>
            </div>
          </Link>
        </div>

        {/* Existing Application Banner (if present) */}
        {salonApplication && (
          <div className="bg-[#FFFDFA] border border-[#C8993E]/40 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C8993E]/50 flex items-center justify-center text-[#C8993E] text-lg">
                  {salonApplication.status === "APPROVED" ? "✓" : "⏳"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1B1410]">
                      {salonApplication.salonName}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      salonApplication.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : salonApplication.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {salonApplication.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#786B60] mt-0.5">
                    Application ID: <strong>{salonApplication.applicationId}</strong> · Submitted on {new Date(salonApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Link
                to="/partner/application"
                className="px-3.5 py-1.5 rounded-lg border border-[#7A4B29] text-[#7A4B29] hover:bg-[#7A4B29] hover:text-white text-xs font-semibold transition-colors shrink-0"
              >
                View Status
              </Link>
            </div>
          </div>
        )}

        {/* Approved SalonOS Access Button */}
        {isSalonApproved && (
          <div className="bg-[#1B1410] text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#C8993E]">
                Salon Partner Workspace
              </div>
              <h3 className="text-lg font-bold font-serif text-white mt-1">
                Open SalonOS Dashboard
              </h3>
              <p className="text-xs text-[#DED4CA] mt-1">
                Manage live queue tokens, barber chairs, service pricing and customer wait times.
              </p>
            </div>
            <Link
              to="/salon-os"
              className="px-5 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <span>SalonOS</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ─── SECTION 4 REQUIRED: OWN A SALON? ─── */}
        <section className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold font-serif text-[#1B1410]">
                Own a salon?
              </h2>
              <p className="text-xs text-[#786B60] mt-1">
                Bring your salon onto Snepr and manage your daily operations.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A4B29] bg-[#F5EEE7] px-2.5 py-1 rounded-full">
              Partner Workspace
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Action 1: Register a new salon */}
            <Link
              to="/partner/register"
              className="p-4 rounded-xl border border-[#E9E1D7] hover:border-[#7A4B29] bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29] group-hover:scale-105 transition-transform mt-0.5">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#1B1410] flex items-center justify-between">
                  <span>Register a new salon</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9B8B7E] group-hover:text-[#7A4B29]" />
                </div>
                <p className="text-[11px] text-[#786B60] mt-1 leading-relaxed">
                  Apply for a new listing in Bhubaneswar with chair limits and digital live queues.
                </p>
              </div>
            </Link>

            {/* Action 2: Claim an existing salon (internal partner flow) */}
            <Link
              to="/partner/claim"
              className="p-4 rounded-xl border border-[#E9E1D7] hover:border-[#7A4B29] bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29] group-hover:scale-105 transition-transform mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#1B1410] flex items-center justify-between">
                  <span>Claim an existing salon</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9B8B7E] group-hover:text-[#7A4B29]" />
                </div>
                <p className="text-[11px] text-[#786B60] mt-1 leading-relaxed">
                  Verify ownership of a listed Bhubaneswar salon to take control of its SalonOS desk.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Administrator Portal Link if Authorized */}
        {(session?.role === "super_admin" || session?.isAdmin) && (
          <div className="bg-[#FAF7F2] border border-[#7A4B29]/30 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#7A4B29]" />
              <div>
                <div className="text-xs font-bold text-[#1B1410]">Administrator Console</div>
                <div className="text-[11px] text-[#786B60]">Review partner applications, verify salons, and manage Bhubaneswar localities.</div>
              </div>
            </div>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-[#1B1410] text-white text-xs font-bold hover:bg-[#2C2420] transition-colors shrink-0"
            >
              Open Admin
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePageUnified;
