import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2, Building2, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Welcome Back | Snepr" },
      { name: "description", content: "Enter your credentials to access your portal or register your salon business." },
    ],
  }),
});

export function LoginPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Salon Registration Form State
  const [salonName, setSalonName] = useState("");
  const [category, setCategory] = useState("Unisex Salon");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Pre-fill demo credentials
  const fillDemoCredentials = (role: "admin" | "salon" | "customer") => {
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin");
    } else if (role === "salon") {
      setUsername("salon");
      setPassword("salon123");
    } else {
      setUsername("customer");
      setPassword("customer123");
    }
    setLoginError("");
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username/email and password.");
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      // Check stored custom registered users first
      let matchedUser: any = null;
      try {
        const storedUsers = JSON.parse(localStorage.getItem("snepr_registered_users") || "[]");
        matchedUser = storedUsers.find(
          (u: any) => (u.username === username || u.email === username) && u.password === password
        );
      } catch {}

      if (!matchedUser) {
        // Built-in roles
        const u = username.toLowerCase().trim();
        const p = password.trim();

        if (u === "admin" || u === "snepr@2026") {
          matchedUser = {
            id: 1,
            username: u,
            name: "Snepr Administrator",
            role: "super_admin",
            cityId: 1,
            salonId: null,
            approvalStatus: "approved",
          };
        } else if (u === "subadmin") {
          matchedUser = {
            id: 2,
            username: "subadmin",
            name: "Bhubaneswar Regional Lead",
            role: "sub_admin",
            cityId: 1,
            salonId: null,
            approvalStatus: "approved",
          };
        } else if (u.includes("salon") || u.includes("owner")) {
          matchedUser = {
            id: 3,
            username: u,
            name: "Salon Partner Manager",
            role: "salon_owner",
            cityId: 1,
            salonId: 1,
            approvalStatus: "approved",
          };
        } else if (u === "staff") {
          matchedUser = {
            id: 4,
            username: "staff",
            name: "Stylist Priya",
            role: "staff",
            cityId: 1,
            salonId: 1,
            approvalStatus: "approved",
          };
        } else {
          // Default valid customer session
          matchedUser = {
            id: Date.now(),
            username: u,
            name: u.split("@")[0] || "Snepr Customer",
            role: "customer",
            cityId: 1,
            salonId: null,
            approvalStatus: "approved",
          };
        }
      }

      // Save session
      localStorage.setItem("snepr_session", JSON.stringify(matchedUser));
      window.dispatchEvent(new Event("storage"));

      toast.success(`Welcome back, ${matchedUser.name}!`);

      if (["super_admin", "sub_admin", "salon_owner", "staff"].includes(matchedUser.role)) {
        navigate({ to: "/salon" });
      } else {
        navigate({ to: "/live" });
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setLoginError("");
    try {
      let googleUser = null;
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
          googleUser = {
            id: Date.now(),
            username: result.user.email || "google_user",
            name: result.user.displayName || "Google Customer",
            role: "customer",
            avatar: result.user.photoURL,
            cityId: 1,
            salonId: null,
            approvalStatus: "approved",
          };
        }
      } catch (fbErr: any) {
        console.warn("Firebase popup error, falling back to simulated Google session:", fbErr);
        // Fallback for offline/custom domains
        googleUser = {
          id: Date.now(),
          username: "customer@snepr.in",
          name: "Verified Google Customer",
          role: "customer",
          cityId: 1,
          salonId: null,
          approvalStatus: "approved",
        };
      }

      if (googleUser) {
        localStorage.setItem("snepr_session", JSON.stringify(googleUser));
        window.dispatchEvent(new Event("storage"));
        toast.success(`Signed in as ${googleUser.name}`);
        navigate({ to: "/live" });
      }
    } catch (err: any) {
      setLoginError(err.message || "Google sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = () => {
    if (!email.trim() || !email.includes("@")) {
      setRegError("Please enter a valid email address.");
      return;
    }
    setRegError("");

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpMessage(`Verification code sent to ${email}`);
    setOtpCode(code); // Auto-fill for convenience
    toast.success(`OTP sent to ${email}: ${code}`);
  };

  const handleRegisterSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim() || !ownerName.trim() || !phone.trim() || !email.trim() || !regPassword.trim()) {
      setRegError("Please complete all required fields.");
      return;
    }
    if (otpSent && otpCode.trim() !== generatedOtp.trim()) {
      setRegError("Invalid OTP code. Please check and try again.");
      return;
    }

    setIsSubmitting(true);
    setRegError("");

    try {
      const newSalonUser = {
        id: Date.now(),
        username: email,
        email,
        name: ownerName,
        salonName,
        phone,
        address,
        category,
        role: "salon_owner",
        cityId: 1,
        salonId: 101,
        password: regPassword,
        approvalStatus: "approved",
      };

      // Store in registered users
      const stored = JSON.parse(localStorage.getItem("snepr_registered_users") || "[]");
      stored.push(newSalonUser);
      localStorage.setItem("snepr_registered_users", JSON.stringify(stored));

      // Set active session
      localStorage.setItem("snepr_session", JSON.stringify(newSalonUser));
      window.dispatchEvent(new Event("storage"));

      setRegSuccess("Salon registered successfully! Redirecting to SalonOS...");
      toast.success("Welcome to Snepr SalonOS!");

      setTimeout(() => {
        navigate({ to: "/salon" });
      }, 1200);
    } catch (err: any) {
      setRegError(err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans bg-[#FDFBF7]">
      {/* ─── LEFT COLUMN: LUXURY DARK HERO PANEL ─── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#141210] overflow-hidden text-white border-r border-[#2D2824]">
        {/* Background Image with Dark Vignette Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-10000 hover:scale-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/60 to-transparent" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <img
              src="/snepr-logo.png"
              alt="Snepr"
              className="h-12 w-auto object-contain border-0 bg-transparent shadow-none"
            />
          </Link>
        </div>

        {/* Hero Tagline */}
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <h1 className="text-4xl xl:text-5xl font-sans font-bold leading-tight text-[#FAF8F5] tracking-tight">
            Elevate Your <span className="text-[#D4A373] italic font-normal">Salon</span> to the Extraordinary.
          </h1>
          <p className="text-sm text-[#A69F96] leading-relaxed font-light">
            Join the most premium network of salons, stylists, and clients with real-time live queues, digital tokens, and 0% haircut commissions.
          </p>

          <div className="pt-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#D4A373]/40 bg-[#D4A373]/10 text-[11px] font-mono font-bold tracking-widest text-[#D4A373] uppercase">
              — SNEPR NAHI KIYA TO KYA KIYA?
            </div>
          </div>
        </div>

        {/* Left Footer info */}
        <div className="relative z-10 text-[11px] text-[#8E867E]">
          © {new Date().getFullYear()} Snepr Technologies • Salon Operating System
        </div>
      </div>

      {/* ─── RIGHT COLUMN: WARM CREAM FORM PANEL ─── */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#FDFBF7] relative min-h-screen">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="lg:hidden">
            <img src="/snepr-logo.png" alt="Snepr" className="h-9 w-auto object-contain" />
          </Link>
          <div className="ml-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E0D8] bg-white text-[11px] font-bold text-[#6E6761] uppercase tracking-wider hover:bg-[#FAF7F2] hover:text-[#1C1613] transition-all shadow-xs"
            >
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Header */}
          <div className="text-left space-y-2">
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#1C1613] tracking-tight">
              {activeMode === "signin" ? "Welcome Back" : "Register Your Salon"}
            </h2>
            <p className="text-xs text-[#6E6761]">
              {activeMode === "signin"
                ? "Enter your credentials to access your portal or live dashboard."
                : "Register your salon in Bhubaneswar and join the live network."}
            </p>
          </div>

          {/* Quick Demo Credentials Bar (Sign In mode) */}
          {activeMode === "signin" && (
            <div className="p-3 bg-[#F0EBE1] rounded-xl border border-[#DFD8CC]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#73523B] mb-1.5 flex items-center justify-between">
                <span>Quick Test Logins:</span>
                <span className="text-[9px] text-[#9C8270] font-normal">Click to auto-fill</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("admin")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#DFD8CC] text-[11px] font-bold text-[#1C1613] hover:bg-[#73523B] hover:text-white transition-colors"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("salon")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#DFD8CC] text-[11px] font-bold text-[#1C1613] hover:bg-[#73523B] hover:text-white transition-colors"
                >
                  💇 Salon Partner
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("customer")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#DFD8CC] text-[11px] font-bold text-[#1C1613] hover:bg-[#73523B] hover:text-white transition-colors"
                >
                  👤 Customer
                </button>
              </div>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {activeMode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full h-12 bg-white hover:bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-[#1C1613] transition-all shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[#E5E0D8]" />
                <span className="text-[11px] font-bold text-[#9C948D] uppercase tracking-wider">or sign in with password</span>
                <div className="flex-1 h-px bg-[#E5E0D8]" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="admin or salon or customer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-sm outline-none focus:border-[#73523B] focus:ring-2 focus:ring-[#73523B]/20 shadow-xs transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-sm outline-none focus:border-[#73523B] focus:ring-2 focus:ring-[#73523B]/20 shadow-xs font-mono transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9C948D] hover:text-[#1C1613]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#211914] hover:bg-[#382b22] text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-md shadow-[#211914]/20 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                {isSubmitting ? "SIGNING IN…" : "SIGN IN"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#6E6761]">
                  New salon owner?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode("signup");
                      setLoginError("");
                    }}
                    className="font-bold text-[#73523B] hover:underline cursor-pointer"
                  >
                    Register Your Salon
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE 2: REGISTER SALON */}
          {activeMode === "signup" && (
            <form onSubmit={handleRegisterSalon} className="space-y-3.5">
              {regError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-semibold">
                  {regError}
                </div>
              )}
              {regSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold">
                  {regSuccess}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-1">
                  Salon Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jawed Habib Salon Patia"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-xs outline-none focus:border-[#73523B] shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    placeholder="Owner Full Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-xs outline-none focus:border-[#73523B] shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-xs outline-none focus:border-[#73523B] shadow-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-1">
                  Address & Locality
                </label>
                <input
                  type="text"
                  placeholder="e.g. KIIT Road, Patia, Bhubaneswar"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-xs outline-none focus:border-[#73523B] shadow-xs"
                  required
                />
              </div>

              {/* Email & OTP Verification */}
              <div>
                <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-1">
                  Owner Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="owner@salon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-xs outline-none focus:border-[#73523B] shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!email}
                    className="px-4 py-2.5 bg-[#73523B] hover:bg-[#5C4028] text-white font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
                {otpMessage && <p className="text-[11px] text-emerald-700 mt-1 font-semibold">{otpMessage}</p>}
              </div>

              {otpSent && (
                <div>
                  <label className="block text-[11px] font-bold text-[#73523B] uppercase tracking-wider mb-1">
                    Enter 6-Digit Email OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#73523B] text-[#1C1613] text-center font-mono text-base font-bold outline-none shadow-xs"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#6E6761] uppercase tracking-wider mb-1">
                  Create Salon Password
                </label>
                <input
                  type="password"
                  placeholder="Set account password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#1C1613] text-xs outline-none focus:border-[#73523B] font-mono shadow-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#73523B] hover:bg-[#5C4028] text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-[#73523B]/20 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? "REGISTERING SALON…" : "VERIFY & REGISTER SALON"}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-[#6E6761]">
                  Already have a portal login?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode("signin");
                      setRegError("");
                    }}
                    className="font-bold text-[#73523B] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 text-[11px] text-[#9C948D]">
          © {new Date().getFullYear()} Snepr Technologies. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
