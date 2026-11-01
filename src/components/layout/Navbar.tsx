import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";

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
          {/* Brand Original Logo */}
          <Link to="/" className="flex items-center gap-2 group border-0 bg-transparent shadow-none" aria-label="Snepr home">
            <img
              src="/snepr-logo.png"
              alt="sn≡pr"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 border-0 bg-transparent shadow-none rounded-none"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="links" aria-label="Main">
            <a href={getAnchorHref("#discover")}>Explore</a>
            <a href={getAnchorHref("#discover")}>Live Queues</a>
            <a href={getAnchorHref("#ai")}>AI Studio</a>
            <a href={getAnchorHref("#how")}>How it works</a>
            <a href={getAnchorHref("#salonos")}>For Salons</a>
            <a href={getAnchorHref("#pricing")}>Pricing</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="nav-r">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  to={["super_admin", "sub_admin", "salon_owner", "staff"].includes(session.role) ? "/salon" : "/live"}
                  className="si hover:text-[#8c4d27] transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-[#81736a] hover:text-[#211914] transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" className="si hover:text-[#8c4d27] transition-colors">
                Sign in
              </Link>
            )}

            <a className="btn btn-dark" href={getAnchorHref("#discover")}>
              Find a Salon
            </a>

            <button
              className="burger"
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
          className="mclose"
          id="mc"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          ✕
        </button>
        <a href={getAnchorHref("#discover")} onClick={closeMenu}>Explore</a>
        <a href={getAnchorHref("#discover")} onClick={closeMenu}>Live Queues</a>
        <a href={getAnchorHref("#ai")} onClick={closeMenu}>AI Studio</a>
        <a href={getAnchorHref("#how")} onClick={closeMenu}>How it works</a>
        <a href={getAnchorHref("#salonos")} onClick={closeMenu}>For Salons</a>
        <a href={getAnchorHref("#pricing")} onClick={closeMenu}>Pricing</a>
        {session ? (
          <Link
            to={["super_admin", "sub_admin", "salon_owner", "staff"].includes(session.role) ? "/salon" : "/live"}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
        ) : (
          <Link to="/login" onClick={closeMenu}>
            Sign in
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
