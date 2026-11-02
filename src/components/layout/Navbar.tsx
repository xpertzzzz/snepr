import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = localStorage.getItem("snepr_session");
        setSession(stored ? JSON.parse(stored) : null);
      } catch {
        setSession(null);
      }
    };
    checkSession();
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("snepr_session");
      setSession(null);
      navigate("/login");
    } catch {}
  };

  const navLinks = [
    { label: "Explore", to: "/explore" },
    { label: "Live Queues", to: "/live" },
    { label: "How it works", to: "/how-it-works" },
    { label: "AI Studio", to: "/ai-studio" },
    { label: "For Salons", to: "/salonos" },
    { label: "Pricing", to: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#f5f1e9]/95 backdrop-blur-md shadow-sm border-b border-[#1d1b17]/10 py-3.5"
          : "bg-[#f5f1e9] py-5"
      }`}
    >
      <div className="max-w-[1340px] mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Snepr home">
          <img
            src="/snepr-logo-transparent.png"
            alt="Snepr"
            className="w-28 h-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-[#514d46]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors hover:text-[#80543a] ${
                  isActive ? "text-[#80543a] font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                to={session.role === "SALON_OWNER" || session.role === "STAFF" ? "/salonos/dashboard" : "/dashboard"}
                className="text-[12px] font-bold px-4 py-2 rounded-full border border-[#1d1b17] text-[#1d1b17] hover:bg-[#1d1b17] hover:text-[#f5f1e9] transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-[12px] font-medium text-[#777168] hover:text-[#1d1b17]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[12px] font-semibold px-5 py-2.5 rounded-full border border-[#1d1b17] text-[#1d1b17] hover:bg-[#1d1b17] hover:text-[#f5f1e9] transition-all"
              >
                Sign in
              </Link>
              <Link
                to="/explore"
                className="text-[12px] font-semibold px-5 py-2.5 rounded-full bg-[#1d1b17] text-[#f5f1e9] hover:bg-[#3d322a] transition-all shadow-sm"
              >
                Find a Salon ↗
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#1d1b17] text-2xl focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fffdfa] border-b border-[#1d1b17]/10 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#1d1b17] py-2 border-b border-[#1d1b17]/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            {session ? (
              <>
                <Link
                  to={session.role === "SALON_OWNER" || session.role === "STAFF" ? "/salonos/dashboard" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-[#1d1b17] text-[#f5f1e9] font-bold text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 rounded-full border border-[#1d1b17]/20 text-[#1d1b17] font-semibold text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full border border-[#1d1b17] text-[#1d1b17] font-bold text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-[#1d1b17] text-[#f5f1e9] font-bold text-sm"
                >
                  Find a Salon ↗
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
