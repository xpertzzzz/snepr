import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SalonOSWorkspace } from "@/components/salon/SalonOSWorkspace";
import { SneprWordmark } from "@/components/SneprWordmark";
import { ShieldAlert, Clock, ArrowRight } from "lucide-react";

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

export function SalonOSPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {}
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs text-[#786B60]">
        Verifying SalonOS access…
      </div>
    );
  }

  // If not signed in, redirect to login
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#F5EEE7] border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29] text-2xl mb-3">
          🔒
        </div>
        <h2 className="text-xl font-bold font-serif text-[#1B1410]">SalonOS Partner Access</h2>
        <p className="text-xs text-[#786B60] max-w-sm mt-1">
          Please sign in with your authorized salon partner account to access your live desk.
        </p>
        <Link
          to="/login"
          search={{ redirect: "/salon-os" }}
          className="mt-5 px-6 py-2.5 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] transition-colors"
        >
          Sign in to SalonOS
        </Link>
      </div>
    );
  }

  // Check application status if pending review
  let application: any = null;
  try {
    const appStr = localStorage.getItem("snepr_salon_application");
    if (appStr) application = JSON.parse(appStr);
  } catch {}

  const isPending =
    session.approvalStatus === "pending" ||
    (application && application.status === "PENDING_REVIEW");

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-2xl mx-auto">
            ⏳
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#1B1410]">Application Under Review</h2>
          <p className="text-xs text-[#786B60] leading-relaxed">
            Your salon application for <strong>{application?.salonName || session.salonName || "your salon"}</strong> is currently being reviewed by the Snepr Admin team.
          </p>
          <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-[#7A4B29] font-medium">
            Status: <strong>PENDING_REVIEW</strong>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/partner/application"
              className="py-2.5 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F]"
            >
              Track Application Details
            </Link>
            <Link
              to="/live"
              className="py-2 text-xs font-semibold text-[#786B60] hover:text-[#1B1410]"
            >
              Return to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check role: Must be salon_owner, super_admin, or sub_admin
  const isAuthorized =
    ["super_admin", "sub_admin", "salon_owner"].includes(session.role) ||
    session.isAdmin ||
    application?.status === "APPROVED";

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center text-xl mx-auto">
            ✕
          </div>
          <h2 className="text-xl font-bold font-serif text-[#1B1410]">Salon Partner Access Required</h2>
          <p className="text-xs text-[#786B60]">
            Your current account ({session.email}) is registered as a customer. To access SalonOS, register your salon on Snepr.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/partner/register"
              className="py-2.5 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F]"
            >
              Register Your Salon
            </Link>
            <Link
              to="/profile"
              className="py-2 text-xs font-semibold text-[#786B60] hover:text-[#1B1410]"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SalonOSWorkspace session={session} />;
}

export default SalonOSPage;
