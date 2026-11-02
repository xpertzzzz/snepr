import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Clock, CheckCircle2, XCircle, AlertCircle,
  Building2, Store, ChevronRight, Edit3, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/partner/application")({
  head: () => ({
    title: "Application Status | Snepr Partner",
    meta: [
      { name: "description", content: "Check the status of your Snepr salon partner onboarding application." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: PartnerApplicationStatusPage,
});

export function PartnerApplicationStatusPage() {
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const [correctedName, setCorrectedName] = useState("");
  const [correctedAddress, setCorrectedAddress] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_salon_application");
      if (stored) {
        const parsed = JSON.parse(stored);
        setApp(parsed);
        setCorrectedName(parsed.salonName || "");
        setCorrectedAddress(parsed.fullAddress || "");
      }
    } catch {}
  }, []);

  const handleResubmit = () => {
    if (!correctedName.trim() || !correctedAddress.trim()) {
      toast.error("Please provide updated salon details.");
      return;
    }
    const updated = {
      ...app,
      salonName: correctedName.trim(),
      fullAddress: correctedAddress.trim(),
      status: "PENDING_REVIEW",
      rejectionReason: null,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("snepr_salon_application", JSON.stringify(updated));
      const adminApps = JSON.parse(localStorage.getItem("snepr_admin_applications") || "[]");
      const idx = adminApps.findIndex((a: any) => a.applicationId === app.applicationId);
      if (idx !== -1) {
        adminApps[idx] = updated;
      } else {
        adminApps.unshift(updated);
      }
      localStorage.setItem("snepr_admin_applications", JSON.stringify(adminApps));
    } catch {}

    setApp(updated);
    setResubmitting(false);
    toast.success("Application corrected and resubmitted for review!");
  };

  if (!app) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col items-center justify-center p-6 text-center">
        <Store className="w-12 h-12 text-[#9B8B7E] mb-3" />
        <h2 className="text-xl font-bold font-serif text-[#1B1410]">No Active Application Found</h2>
        <p className="text-xs text-[#786B60] max-w-sm mt-1">
          You have not submitted a salon onboarding application yet, or your previous session has ended.
        </p>
        <Link
          to="/partner/register"
          className="mt-5 px-6 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors"
        >
          Register a Salon
        </Link>
      </div>
    );
  }

  const isApproved = app.status === "APPROVED";
  const isRejected = app.status === "REJECTED";
  const isPending = app.status === "PENDING_REVIEW" || !app.status;
  const isSuspended = app.status === "SUSPENDED";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      {/* Header */}
      <header className="border-b border-[#E9E1D7] bg-[#FAF7F2] sticky top-0 z-20">
        <div className="max-w-[760px] h-16 mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Snepr home">
            <SneprWordmark height={30} color="#1B1410" />
          </Link>
          <Link to="/profile" className="text-xs font-semibold text-[#7A4B29] hover:underline">
            Back to Profile
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Status Card */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4">
            {isApproved && <div className="w-16 h-16 rounded-2xl bg-[#EAF3EC] text-[#267447] flex items-center justify-center">✓</div>}
            {isPending && <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">⏳</div>}
            {isRejected && <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">✕</div>}
            {isSuspended && <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">⚠</div>}
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 bg-[#FAF7F2] text-[#7A4B29] border border-[#E9E1D7]">
            Application ID: {app.applicationId}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B1410]">
            {isApproved && "Application Approved!"}
            {isPending && "Application Pending Review"}
            {isRejected && "Action Required: Application Rejected"}
            {isSuspended && "Salon Listing Suspended"}
          </h1>

          <p className="text-xs sm:text-sm text-[#786B60] max-w-md mx-auto mt-2 leading-relaxed">
            {isApproved && `Congratulations! ${app.salonName} has been verified by the Snepr Admin team. Your SalonOS desk is now fully active.`}
            {isPending && `Our Bhubaneswar onboarding team is verifying ${app.salonName}'s business listing and location. Decisions typically take 24–48 hours.`}
            {isRejected && `We were unable to approve ${app.salonName} with the submitted details. Please review the reason below and submit corrections.`}
            {isSuspended && "This salon listing has been temporarily paused from operating live queues. Please contact Snepr support."}
          </p>

          {/* Rejection reason box */}
          {isRejected && (
            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-left text-xs text-red-800 space-y-1">
              <strong className="block text-red-900 font-bold uppercase text-[10px] tracking-wider">
                Reason for Rejection:
              </strong>
              <p>{app.rejectionReason || "Address or contact proof could not be verified in Bhubaneswar records."}</p>
            </div>
          )}

          {/* Action CTA */}
          <div className="mt-6 pt-4 flex flex-col sm:flex-row justify-center gap-3">
            {isApproved && (
              <Link
                to="/salon-os"
                className="px-6 py-3 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>Launch SalonOS</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}

            {isRejected && !resubmitting && (
              <button
                onClick={() => setResubmitting(true)}
                className="px-6 py-3 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Correct & Resubmit Details</span>
              </button>
            )}

            <Link
              to="/live"
              className="px-5 py-3 rounded-xl border border-[#E9E1D7] bg-white hover:bg-[#FAF7F2] text-[#1B1410] text-xs font-semibold transition-colors"
            >
              Back to Live Queues
            </Link>
          </div>
        </div>

        {/* Resubmission Form (if editing rejected app) */}
        {resubmitting && (
          <div className="bg-[#FFFDFA] border-2 border-[#7A4B29] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif text-[#1B1410]">
              Correct Salon Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1B1410] mb-1">
                  Salon Name
                </label>
                <input
                  type="text"
                  value={correctedName}
                  onChange={(e) => setCorrectedName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#1B1410] mb-1">
                  Full Street Address & Landmark
                </label>
                <textarea
                  rows={2}
                  value={correctedAddress}
                  onChange={(e) => setCorrectedAddress(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setResubmitting(false)}
                className="px-4 py-2 rounded-lg border border-[#E9E1D7] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResubmit}
                className="px-5 py-2 rounded-lg bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F]"
              >
                Submit Correction
              </button>
            </div>
          </div>
        )}

        {/* Application Summary Box */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#1B1410] uppercase tracking-wide border-b border-[#E9E1D7] pb-2">
            Submitted Details Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#786B60]">
            <div>
              <span>Salon Name:</span> <strong className="text-[#1B1410]">{app.salonName}</strong>
            </div>
            <div>
              <span>Owner Name:</span> <strong className="text-[#1B1410]">{app.ownerName}</strong>
            </div>
            <div>
              <span>Locality:</span> <strong className="text-[#1B1410]">{app.locality}, Bhubaneswar</strong>
            </div>
            <div>
              <span>Contact Phone:</span> <strong className="text-[#1B1410]">{app.contactNumber}</strong>
            </div>
            <div>
              <span>Active Chairs:</span> <strong className="text-[#1B1410]">{app.chairCount || 3} chairs</strong>
            </div>
            <div>
              <span>Hours:</span> <strong className="text-[#1B1410]">{app.openingTime} – {app.closingTime}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PartnerApplicationStatusPage;

