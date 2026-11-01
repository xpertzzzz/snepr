import { Link, useNavigate } from "@tanstack/react-router";
import { User, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      try {
        const data = localStorage.getItem("snepr_session");
        if (data) {
          setSession(JSON.parse(data));
        } else {
          setSession(null);
        }
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
    } catch {}
    setSession(null);
    window.dispatchEvent(new Event("storage"));
    navigate({ to: "/" });
  };

  const isSalonStaffOrOwner = session && ["super_admin", "sub_admin", "salon_owner", "staff"].includes(session.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E1D7]/80 bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* ─── BRAND LOGO ─── */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center py-1 group border-0 bg-transparent shadow-none" aria-label="Snepr home">
            <img
              src="/snepr-logo.png"
              alt="Snepr"
              className="h-12 sm:h-14 md:h-15 w-auto object-contain transition-transform group-hover:scale-105 border-0 bg-transparent shadow-none rounded-none"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E1D7] text-[11.5px] font-semibold text-[#6E6159] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
            <span>Live Salons Active</span>
          </div>
        </div>

        {/* ─── DESKTOP NAV LINKS (CLEAN, ICON-FREE, PROFESSIONAL) ─── */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-[#6E6159]">
          <Link
            to="/live"
            activeProps={{ className: "text-[#1B1410] font-bold" }}
            className="transition hover:text-[#1B1410]"
          >
            Live Queues
          </Link>

          <Link
            to="/live/studio"
            activeProps={{ className: "text-[#1B1410] font-bold" }}
            className="transition hover:text-[#1B1410]"
          >
            AI Studio
          </Link>

          <a href="/#how" className="transition hover:text-[#1B1410]">
            How It Works
          </a>

          <a href="/#pricing" className="transition hover:text-[#1B1410]">
            Pricing
          </a>

          <Link
            to="/claim"
            className="transition hover:text-[#1B1410]"
          >
            For Salons
          </Link>
        </nav>

        {/* ─── RIGHT ACTION BUTTONS ─── */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              {/* If Customer, show Activity */}
              {!isSalonStaffOrOwner && (
                <Link
                  to="/live/activity"
                  className="px-3.5 py-2 rounded-full border border-[#E8E1D7] bg-white hover:bg-[#F5EFEB] transition text-[13px] font-semibold text-[#1B1410] shadow-xs"
                >
                  My Tokens &amp; Visits
                </Link>
              )}

              {/* If Salon Owner/Staff, show SalonOS button */}
              {isSalonStaffOrOwner && (
                <Link
                  to="/salon"
                  className="px-4 py-2 rounded-full bg-[#1B1410] text-white hover:bg-[#8A4C24] transition text-[13px] font-semibold shadow-xs"
                >
                  SalonOS Desk
                </Link>
              )}

              {/* User Account / Logout */}
              <div className="flex items-center gap-2 pl-1">
                <span className="text-[13px] font-semibold text-[#1B1410] max-w-[120px] truncate">
                  {session.name || session.username || "Account"}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-[#6E6159] hover:text-[#B43A2A] hover:bg-[#FDEEEC] transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-[13.5px] font-semibold text-[#6E6159] hover:text-[#1B1410] transition"
              >
                Sign In
              </Link>
              <Link
                to="/live"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#1B1410] px-5 text-[13.5px] font-bold text-white shadow-sm hover:bg-[#8A4C24] hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                Find a Salon
              </Link>
            </div>
          )}
        </div>

        {/* ─── MOBILE HAMBURGER BUTTON ─── */}
        <div className="flex md:hidden items-center gap-2">
          {session && isSalonStaffOrOwner && (
            <Link
              to="/salon"
              className="px-3 py-1.5 text-xs font-bold bg-[#1B1410] text-white rounded-full"
            >
              SalonOS
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#1B1410] hover:bg-white/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── MOBILE DRAWER MENU (CLEAN, SLEEK, TYPOGRAPHIC) ─── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E1D7] bg-[#FAF7F2] px-5 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2 text-[15px] font-semibold text-[#1B1410]">
            <Link
              to="/live"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E1D7] hover:bg-[#F5EFEB] transition"
            >
              <span>Live Salon Queues</span>
              <ChevronRight className="w-4 h-4 text-[#6E6159]" />
            </Link>

            <Link
              to="/live/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E1D7] hover:bg-[#F5EFEB] transition"
            >
              <span>AI Hair Studio</span>
              <ChevronRight className="w-4 h-4 text-[#6E6159]" />
            </Link>

            <Link
              to="/live/activity"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E1D7] hover:bg-[#F5EFEB] transition"
            >
              <span>My Visits &amp; Points</span>
              <ChevronRight className="w-4 h-4 text-[#6E6159]" />
            </Link>

            <a
              href="/#how"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E1D7] hover:bg-[#F5EFEB] transition"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-[#6E6159]" />
            </a>

            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E1D7] hover:bg-[#F5EFEB] transition"
            >
              <span>Salon Subscriptions</span>
              <ChevronRight className="w-4 h-4 text-[#6E6159]" />
            </a>

            <Link
              to="/claim"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8E1D7] hover:bg-[#F5EFEB] transition"
            >
              <span>List Your Salon</span>
              <ChevronRight className="w-4 h-4 text-[#6E6159]" />
            </Link>

            {isSalonStaffOrOwner && (
              <Link
                to="/salon"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1B1410] text-white hover:bg-[#8A4C24] transition"
              >
                <span>SalonOS Desk</span>
                <ChevronRight className="w-4 h-4 text-white/70" />
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-[#E8E1D7] flex items-center justify-between">
            {session ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1B1410]">
                  Signed in as {session.name || session.username}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-[#FDEEEC] text-[#B43A2A] text-xs font-bold rounded-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center text-xs font-bold text-[#1B1410] bg-white border border-[#E8E1D7] rounded-full shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/live"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center text-xs font-bold text-white bg-[#1B1410] rounded-full shadow-xs"
                >
                  Find a Salon
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
