import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";

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
    } catch {}
    setSession(null);
    window.dispatchEvent(new Event("storage"));
    navigate({ to: "/" });
  };

  const isHome = location.pathname === "/";

  const getAnchorHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header id="hd" className={`snepr-hdr ${isScrolled ? "s" : ""}`}>
        <div className="wrap nav">
          {/* Brand Original Vector Logo - Big and Borderless */}
          <Link
            to="/"
            className="flex items-center text-[#1B1410] hover:opacity-90 transition-opacity border-0 outline-none bg-transparent shadow-none p-0 m-0 select-none"
            aria-label="Snepr home"
          >
            <SneprWordmark
              height={38}
              color="#1B1410"
              className="transition-transform hover:scale-[1.02] border-0 outline-none shadow-none"
            />
          </Link>

          {/* Desktop Nav Links - Exactly 4 elements */}
          <nav className="links" aria-label="Main">
            <Link to="/live" className="hover:text-[#8c4d27] transition-colors">Live Queues</Link>
            <Link to="/live/aistudio" className="hover:text-[#8c4d27] transition-colors">AI Studio</Link>
            <Link to="/salons" className="hover:text-[#8c4d27] transition-colors">For Salons</Link>
            <Link to="/pricing" className="hover:text-[#8c4d27] transition-colors">Pricing</Link>
          </nav>

          {/* Right Action Button - One Universal CTA: Get Started ↗ */}
          <div className="nav-r">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  to={["super_admin", "sub_admin", "salon_owner"].includes(session.role) ? "/salon-os" : "/profile"}
                  className="si hover:text-[#8c4d27] transition-colors"
                >
                  {session.name ? session.name.split(" ")[0] : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-[#81736a] hover:text-[#211914] transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : null}

            <Link
              className="btn btn-dark"
              to={session ? (["super_admin", "sub_admin", "salon_owner"].includes(session.role) ? "/salon-os" : "/live") : "/login"}
            >
              Get Started ↗
            </Link>

            <button
              className="burger cursor-pointer"
              id="burger"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Menu */}
      <div className={`mmenu ${mobileMenuOpen ? "open" : ""}`} id="mm">
        <button
          className="mclose cursor-pointer"
          id="mc"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          ✕
        </button>
        <Link to="/live" onClick={closeMenu}>Live Queues</Link>
        <Link to="/live/aistudio" onClick={closeMenu}>AI Studio</Link>
        <Link to="/salons" onClick={closeMenu}>For Salons</Link>
        <Link to="/pricing" onClick={closeMenu}>Pricing</Link>
        {session ? (
          <Link
            to={["super_admin", "sub_admin", "salon_owner"].includes(session.role) ? "/salon-os" : "/profile"}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
        ) : (
          <Link to="/login" onClick={closeMenu}>
            Get Started ↗
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
