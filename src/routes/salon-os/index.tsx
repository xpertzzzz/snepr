import { createFileRoute, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SalonOSWorkspace, SalonOSTab } from "@/components/salon/SalonOSWorkspace";
import { SneprWordmark } from "@/components/SneprWordmark";
import { ShieldAlert, Clock, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/salon-os/")({
  head: () => ({
    title: "SalonOS Desk | Snepr",
    meta: [
      { name: "description", content: "SalonOS operations desk: live queues, chairs, services and walk-in tokens." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: SalonOSPage,
});

export function SalonOSPage({ initialTab: propTab }: { initialTab?: SalonOSTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Compute tab from URL path if not passed as prop
  const path = location.pathname.toLowerCase();
  let resolvedTab: SalonOSTab = propTab || "overview";
  if (path.includes("/queue")) resolvedTab = "queue";
  else if (path.includes("/chairs")) resolvedTab = "chairs";
  else if (path.includes("/services")) resolvedTab = "services";
  else if (path.includes("/customers")) resolvedTab = "customers";
  else if (path.includes("/analytics")) resolvedTab = "analytics";
  else if (path.includes("/settings")) resolvedTab = "settings";
  else if (path.includes("/dashboard") || path.includes("/salonos")) resolvedTab = "overview";

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      }
    } catch {}
    setLoading(false);
  }, []);

  const handleStartDemoSession = () => {
    const demoPartnerSession = {
      id: 1,
      name: "Arjun Sharma",
      email: "arjun@thescissorsedge.in",
      role: "salon_owner",
      salonName: "The Scissors Edge",
      locality: "Saheed Nagar, Bhubaneswar",
      approvalStatus: "approved",
    };
    try {
      localStorage.setItem("snepr_session", JSON.stringify(demoPartnerSession));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    setSession(demoPartnerSession);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs text-[#786B60]">
        Loading SalonOS Desk…
      </div>
    );
  }

  // If not signed in, show sign in with one-click demo access
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5EEE7] border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29] text-2xl mx-auto">
            ✂️
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#1B1410]">SalonOS Partner Access</h2>
          <p className="text-xs text-[#786B60] leading-relaxed">
            Welcome to SalonOS. Manage live chairs, walk-in tokens, and customer queues across your salon in Bhubaneswar.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={handleStartDemoSession}
              className="py-3 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Launch SalonOS Workspace (Live Demo)</span>
            </button>

            <Link
              to="/login"
              search={{ redirect: location.pathname }}
              className="py-2.5 rounded-xl border border-[#7A4B29] text-[#7A4B29] text-xs font-bold hover:bg-[#7A4B29] hover:text-white transition-all"
            >
              Sign in with Salon Owner Account
            </Link>

            <Link
              to="/salonos"
              className="py-2 text-xs font-semibold text-[#786B60] hover:text-[#1B1410]"
            >
              Learn about SalonOS Features ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SalonOSWorkspace session={session} initialTab={resolvedTab} />;
}

export default SalonOSPage;
