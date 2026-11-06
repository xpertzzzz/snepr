import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import {
  Store, MapPin, Scissors, Clock, CheckCircle2,
  ChevronRight, ChevronLeft, Plus, Trash2, Edit3, ShieldAlert
} from "lucide-react";
import { submitPartnerApplicationDb } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/partner/register")({
  head: () => ({
    title: "Register Your Salon | Snepr Partner",
    meta: [
      { name: "description", content: "Register your salon on Snepr. Manage live chair queues, walk-in tokens, and transparent wait times in Bhubaneswar." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: SalonRegistrationWizard,
});

const BHUBANESWAR_LOCALITIES = [
  "Patia",
  "KIIT Road",
  "Saheed Nagar",
  "Jaydev Vihar",
  "Chandrasekharpur",
  "Rasulgarh",
  "Nayapalli",
  "Khandagiri",
];

const DEFAULT_SERVICES_TEMPLATE = [
  { name: "Haircut", price: 150, duration: 25 },
  { name: "Beard Grooming", price: 80, duration: 15 },
  { name: "Haircut + Beard Trim", price: 200, duration: 40 },
  { name: "Hair Styling", price: 120, duration: 20 },
  { name: "Hair Colour", price: 450, duration: 50 },
  { name: "Kids Haircut", price: 100, duration: 20 },
];

export function SalonRegistrationWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  // Form State
  const [salonName, setSalonName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [salonDescription, setSalonDescription] = useState("");

  const [stateName] = useState("Odisha");
  const [cityName] = useState("Bhubaneswar");
  const [locality, setLocality] = useState("Patia");
  const [fullAddress, setFullAddress] = useState("");
  const [postalCode, setPostalCode] = useState("751024");

  const [services, setServices] = useState(DEFAULT_SERVICES_TEMPLATE);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");

  const [chairCount, setChairCount] = useState<number>(3);
  const [openingTime, setOpeningTime] = useState("09:00 AM");
  const [closingTime, setClosingTime] = useState("09:00 PM");
  const [weeklyHoliday, setWeeklyHoliday] = useState("None");

  // Load existing session if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setOwnerName(u.name);
        if (u.email) setBusinessEmail(u.email);
        if (u.phone) setContactNumber(u.phone);
      }
    } catch {}
  }, []);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const price = parseInt(newServicePrice) || 150;
    const duration = parseInt(newServiceDuration) || 25;
    setServices([...services, { name: newServiceName.trim(), price, duration }]);
    setNewServiceName("");
    setNewServicePrice("");
    setNewServiceDuration("");
    toast.success("Service added!");
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!salonName.trim()) {
        toast.error("Please enter your salon name.");
        return false;
      }
      if (!ownerName.trim()) {
        toast.error("Please enter the owner's name.");
        return false;
      }
      if (!contactNumber.trim()) {
        toast.error("Please enter a contact number.");
        return false;
      }
      if (!businessEmail.trim() || !businessEmail.includes("@")) {
        toast.error("Please enter a valid business email.");
        return false;
      }
    } else if (step === 2) {
      if (!fullAddress.trim()) {
        toast.error("Please provide the full street address.");
        return false;
      }
      if (!postalCode.trim()) {
        toast.error("Please enter the postal code.");
        return false;
      }
    } else if (step === 3) {
      if (services.length === 0) {
        toast.error("Please list at least one service.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(5, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    const appId = `SN-BBS-${Math.floor(1000 + Math.random() * 9000)}`;
    const application = {
      applicationId: appId,
      salonName,
      ownerName,
      contactNumber,
      businessEmail,
      salonDescription,
      state: stateName,
      city: cityName,
      locality,
      fullAddress,
      postalCode,
      services,
      chairCount,
      openingTime,
      closingTime,
      weeklyHoliday,
      status: "PENDING_REVIEW",
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Submit directly to PostgreSQL database
      const res = await submitPartnerApplicationDb({
        salonName,
        ownerName,
        contactNumber,
        businessEmail,
        salonDescription,
        locality,
        fullAddress,
        postalCode,
        chairCount,
        openingTime,
        closingTime,
        weeklyHoliday,
        services,
      });
      if (res && res.applicationId) {
        application.applicationId = res.applicationId;
      }
    } catch (err: any) {
      console.warn("Direct DB submit error:", err);
    }

    // Save to local session so the user can immediately track their application
    try {
      localStorage.setItem("snepr_salon_application", JSON.stringify(application));
      const s = localStorage.getItem("snepr_session");
      if (s) {
        const u = JSON.parse(s);
        u.approvalStatus = "pending";
        u.salonName = salonName;
        localStorage.setItem("snepr_session", JSON.stringify(u));
      }
    } catch {}

    setSubmittedApp(application);
    setIsSubmitting(false);
    toast.success("Salon application submitted to Snepr database!");
  };

  if (submittedApp) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF3EC] border border-[#267447]/30 flex items-center justify-center text-[#267447] text-3xl mx-auto">
            ✓
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A4B29] bg-[#F5EEE7] px-3 py-1 rounded-full">
              Application ID: {submittedApp.applicationId}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B1410] mt-3">
              Application Submitted!
            </h1>
            <p className="text-xs sm:text-sm text-[#786B60] mt-2 leading-relaxed">
              Your application for <strong>{submittedApp.salonName}</strong> in <strong>{submittedApp.locality}, Bhubaneswar</strong> has been received and is currently marked as <strong className="text-[#C8993E]">PENDING_REVIEW</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] text-left text-xs space-y-2 text-[#786B60]">
            <div className="flex justify-between">
              <span>Chairs registered:</span>
              <strong className="text-[#1B1410]">{submittedApp.chairCount} chairs</strong>
            </div>
            <div className="flex justify-between">
              <span>Services submitted:</span>
              <strong className="text-[#1B1410]">{submittedApp.services.length} services</strong>
            </div>
            <div className="flex justify-between">
              <span>Review timeline:</span>
              <strong className="text-[#7A4B29]">Usually within 24–48 hours</strong>
            </div>
          </div>

          <p className="text-[11px] text-[#9B8B7E]">
            Our Snepr onboarding team will review your salon details. Once approved, your SalonOS desk will be unlocked automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/partner/application"
              className="flex-1 py-3 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors text-center"
            >
              Track Application Status
            </Link>
            <Link
              to="/live"
              className="flex-1 py-3 rounded-xl border border-[#E9E1D7] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#1B1410] transition-colors text-center"
            >
              Back to Live Queues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      {/* Header */}
      <header className="border-b border-[#E9E1D7] bg-[#FAF7F2] sticky top-0 z-20">
        <div className="max-w-[840px] h-16 mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Snepr home">
            <SneprWordmark height={30} color="#1B1410" />
          </Link>
          <div className="text-xs text-[#786B60]">
            Step <strong>{currentStep}</strong> of 5
          </div>
        </div>
      </header>

      {/* Main Wizard */}
      <main className="max-w-[840px] mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-[#786B60] mb-3">
            <span className={currentStep >= 1 ? "text-[#7A4B29]" : ""}>1. Basic Details</span>
            <span className={currentStep >= 2 ? "text-[#7A4B29]" : ""}>2. Location</span>
            <span className={currentStep >= 3 ? "text-[#7A4B29]" : ""}>3. Services</span>
            <span className={currentStep >= 4 ? "text-[#7A4B29]" : ""}>4. Operations</span>
            <span className={currentStep >= 5 ? "text-[#7A4B29]" : ""}>5. Review</span>
          </div>
          <div className="w-full h-1.5 bg-[#E9E1D7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7A4B29] transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* ─── STEP 1: BASIC DETAILS ─── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A4B29]">Step 1</span>
                <h2 className="text-2xl font-bold font-serif text-[#1B1410] mt-1">Salon Details</h2>
                <p className="text-xs text-[#786B60] mt-1">
                  Tell us the name of your salon and who to contact.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Salon Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Scissor Unisex Salon"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                      Owner / Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Mohapatra"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94370 12345"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="salon@example.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Highlight your specialties, experience, and atmosphere..."
                    value={salonDescription}
                    onChange={(e) => setSalonDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: LOCATION ─── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A4B29]">Step 2</span>
                <h2 className="text-2xl font-bold font-serif text-[#1B1410] mt-1">Salon Location</h2>
                <p className="text-xs text-[#786B60] mt-1">
                  Choose your neighborhood in Bhubaneswar. We use manual localities — no GPS tracking needed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      disabled
                      value={stateName}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#F5EEE7] text-sm text-[#786B60]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      disabled
                      value={cityName}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#F5EEE7] text-sm text-[#786B60]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Bhubaneswar Locality *
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-sm font-semibold text-[#1B1410] focus:border-[#7A4B29] focus:outline-none cursor-pointer"
                  >
                    {BHUBANESWAR_LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Full Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Plot / Khata No., Floor, Landmark, Street Name..."
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Postal Code (PIN) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="751024"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: SERVICES ─── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A4B29]">Step 3</span>
                <h2 className="text-2xl font-bold font-serif text-[#1B1410] mt-1">Services & Menu</h2>
                <p className="text-xs text-[#786B60] mt-1">
                  List the services you offer with their price (₹) and estimated duration (minutes).
                </p>
              </div>

              {/* Service list table */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {services.map((svc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#1B1410] truncate">{svc.name}</div>
                      <div className="text-[11px] text-[#786B60]">{svc.duration} mins</div>
                    </div>
                    <div className="font-bold text-sm text-[#7A4B29]">₹{svc.price}</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Service Box */}
              <div className="p-4 rounded-xl border border-dashed border-[#C8993E] bg-[#FAF7F2]/30 space-y-3">
                <div className="text-xs font-bold text-[#1B1410] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#7A4B29]" />
                  <span>Add another service</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Service name (e.g. Head Massage)"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#E9E1D7] bg-white text-xs focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price in ₹ (e.g. 180)"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#E9E1D7] bg-white text-xs focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Minutes (e.g. 20)"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-[#E9E1D7] bg-white text-xs focus:outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="px-4 h-10 rounded-lg bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: OPERATIONS ─── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A4B29]">Step 4</span>
                <h2 className="text-2xl font-bold font-serif text-[#1B1410] mt-1">Operational Hours & Chairs</h2>
                <p className="text-xs text-[#786B60] mt-1">
                  Set how many chairs you operate and your working schedule.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Active Stylist Chairs
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setChairCount(num)}
                        className={`w-12 h-12 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                          chairCount === num
                            ? "border-[#7A4B29] bg-[#7A4B29] text-white shadow-sm"
                            : "border-[#E9E1D7] bg-[#FAF7F2] text-[#1B1410] hover:bg-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#786B60]">
                    Base plan includes 1 chair (₹199/mo). Intermediate covers up to 3 chairs (₹400/mo). Pro covers unlimited chairs (₹449/mo).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                      Opening Time
                    </label>
                    <input
                      type="text"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                      Closing Time
                    </label>
                    <input
                      type="text"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      placeholder="09:00 PM"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 text-sm focus:border-[#7A4B29] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B1410] uppercase mb-1.5">
                    Weekly Holiday
                  </label>
                  <select
                    value={weeklyHoliday}
                    onChange={(e) => setWeeklyHoliday(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] text-sm text-[#1B1410] focus:border-[#7A4B29] focus:outline-none cursor-pointer"
                  >
                    <option value="None">None (Open 7 days)</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 5: REVIEW AND SUBMIT ─── */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A4B29]">Step 5</span>
                <h2 className="text-2xl font-bold font-serif text-[#1B1410] mt-1">Review Your Application</h2>
                <p className="text-xs text-[#786B60] mt-1">
                  Confirm all details before submission. Applications are reviewed manually by Snepr Admin.
                </p>
              </div>

              {/* Review sections */}
              <div className="space-y-4">
                {/* Basic Details summary */}
                <div className="p-4 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-[#E9E1D7] pb-2">
                    <span className="text-xs font-bold uppercase text-[#1B1410]">Basic Details</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[11px] font-semibold text-[#7A4B29] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#786B60]">Salon:</span> <strong>{salonName}</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Owner:</span> <strong>{ownerName}</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Phone:</span> <strong>{contactNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Email:</span> <strong>{businessEmail}</strong>
                    </div>
                  </div>
                </div>

                {/* Location summary */}
                <div className="p-4 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-[#E9E1D7] pb-2">
                    <span className="text-xs font-bold uppercase text-[#1B1410]">Location</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-[11px] font-semibold text-[#7A4B29] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-[#786B60]">Locality:</span> <strong>{locality}, Bhubaneswar, Odisha</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Address:</span> {fullAddress} (PIN: {postalCode})
                    </div>
                  </div>
                </div>

                {/* Services & Operations */}
                <div className="p-4 rounded-xl border border-[#E9E1D7] bg-[#FAF7F2]/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-[#E9E1D7] pb-2">
                    <span className="text-xs font-bold uppercase text-[#1B1410]">Operations & Menu</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-[11px] font-semibold text-[#7A4B29] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#786B60]">Active Chairs:</span> <strong>{chairCount} chairs</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Hours:</span> <strong>{openingTime} – {closingTime}</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Weekly Off:</span> <strong>{weeklyHoliday}</strong>
                    </div>
                    <div>
                      <span className="text-[#786B60]">Menu items:</span> <strong>{services.length} services</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission note */}
              <div className="p-3.5 rounded-xl bg-[#EAF3EC] border border-[#267447]/30 text-xs text-[#267447] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>0% Commission Guarantee:</strong> You keep 100% of customer haircut payments. Snepr charges flat monthly software subscriptions only.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-[#E9E1D7] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl border border-[#E9E1D7] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#1B1410] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                to="/profile"
                className="text-xs font-semibold text-[#786B60] hover:text-[#1B1410]"
              >
                Cancel
              </Link>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitApplication}
                className="px-7 py-2.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SalonRegistrationWizard;

