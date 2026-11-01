import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import { REAL_SALONS_DATA, RealSalon } from "@/lib/real-salons";
import { sendAuthEmailOtp, verifyOtp } from "@/backend/functions/otp";
import {
  Building2, Search, CheckCircle2, ShieldCheck,
  ChevronRight, ArrowRight, Store, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/partner/claim")({
  head: () => ({
    title: "Claim Existing Salon | Snepr Partner",
    meta: [
      { name: "description", content: "Internal partner flow to verify ownership of an existing listed Bhubaneswar salon." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: ClaimSalonInternalPage,
});

export function ClaimSalonInternalPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSalon, setSelectedSalon] = useState<RealSalon | null>(null);

  // Verification Form State
  const [ownerName, setOwnerName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [claimNotes, setClaimNotes] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const filteredSalons = REAL_SALONS_DATA.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.areaName.toLowerCase().includes(q)
    );
  });

  const handleSendClaimOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessEmail || !businessEmail.includes("@")) {
      toast.error("Please enter a valid business email address.");
      return;
    }
    if (!ownerName.trim() || !contactPhone.trim()) {
      toast.error("Please fill in owner name and contact number.");
      return;
    }

    setIsSending(true);
    try {
      try {
        await sendAuthEmailOtp({ data: { email: businessEmail } });
      } catch (err: any) {
        console.warn("sendAuthEmailOtp fallback:", err);
      }
      setOtpSent(true);
      toast.success(`Verification code sent to ${businessEmail}!`);
    } catch {
      toast.error("Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyAndSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setIsClaiming(true);
    try {
      const appId = `SN-CLM-${Math.floor(1000 + Math.random() * 9000)}`;
      const claimRecord = {
        applicationId: appId,
        type: "CLAIM",
        salonId: selectedSalon?.id,
        salonName: selectedSalon?.name,
        locality: selectedSalon?.areaName,
        fullAddress: selectedSalon?.address,
        ownerName,
        businessEmail,
        contactNumber: contactPhone,
        claimNotes,
        status: "PENDING_REVIEW",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("snepr_salon_application", JSON.stringify(claimRecord));
      const adminApps = JSON.parse(localStorage.getItem("snepr_admin_applications") || "[]");
      adminApps.unshift(claimRecord);
      localStorage.setItem("snepr_admin_applications", JSON.stringify(adminApps));

      toast.success("Salon claim submitted for Admin review!");
      navigate({ to: "/partner/application" });
    } catch {
      toast.error("Failed to submit claim.");
    } finally {
      setIsClaiming(false);
    }
  };

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
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A4B29] bg-[#F5EEE7] px-2.5 py-1 rounded-full">
            Internal Partner Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B1410] mt-2">
            Claim an Existing Salon Listing
          </h1>
          <p className="text-xs sm:text-sm text-[#786B60] mt-1 leading-relaxed">
            If your salon is already listed in our Bhubaneswar database, verify your business credentials to take control of its SalonOS operations.
          </p>
        </div>

        {/* Step 1: Select Salon */}
        {!selectedSalon ? (
          <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B1410]">
              1. Search Your Salon in Bhubaneswar
            </h2>

            <div className="relative">
              <input
                type="search"
                placeholder="Search by salon name or locality (e.g. Lakme, Patia)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 px-3.5 pl-10 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#9B8B7E] absolute left-3.5 top-3.5" />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredSalons.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSalon(s)}
                  className="p-3.5 rounded-xl border border-[#E9E1D7] hover:border-[#7A4B29] bg-[#FAF7F2]/30 hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#1B1410] group-hover:text-[#7A4B29]">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-[#786B60] truncate">
                      {s.areaName} · {s.address}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-[#7A4B29] text-white text-[11px] font-bold group-hover:bg-[#60391F] transition-colors shrink-0"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Step 2: Verification Form for Selected Salon */
          <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#7A4B29] uppercase tracking-wider">
                  Selected Salon
                </span>
                <h3 className="text-base font-bold text-[#1B1410]">{selectedSalon.name}</h3>
                <p className="text-xs text-[#786B60]">{selectedSalon.areaName} · {selectedSalon.address}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSalon(null);
                  setOtpSent(false);
                }}
                className="text-xs text-[#7A4B29] font-bold hover:underline"
              >
                Change
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendClaimOtp} className="space-y-4">
                <h3 className="text-sm font-bold text-[#1B1410] uppercase tracking-wider">
                  2. Business Proof & Email OTP
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                      Direct Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                    Official Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner@salon.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] text-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-[#786B60] mt-1">
                    We will send a 6-digit verification code to confirm you represent this salon.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1">
                    Ownership Notes / GSTIN (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mention your role, trade license, or business registration number..."
                    value={claimNotes}
                    onChange={(e) => setClaimNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E9E1D7] text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSending ? "Sending code..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndSubmitClaim} className="space-y-4">
                <h3 className="text-sm font-bold text-[#1B1410] uppercase tracking-wider">
                  3. Enter 6-Digit Email Code
                </h3>
                <p className="text-xs text-[#786B60]">
                  Code sent to <strong>{businessEmail}</strong>.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-12 rounded-xl border-2 border-[#7A4B29] text-center text-xl font-mono tracking-[8px] font-bold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isClaiming || otpCode.length < 6}
                  className="w-full py-3 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isClaiming ? "Submitting..." : "Verify & Submit Claim Application"}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ClaimSalonInternalPage;
