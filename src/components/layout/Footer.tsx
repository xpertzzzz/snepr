import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#211f1b] text-[#f5f1e9] pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="max-w-[1220px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/15">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" aria-label="Snepr home">
              <img
                src="/snepr-logo-transparent.png"
                alt="Snepr"
                className="w-36 h-auto object-contain brightness-0 invert mb-4"
              />
            </Link>
            <p className="text-sm text-[#d0c8be] leading-relaxed max-w-sm">
              Live salon queues, chair countdowns and verified discovery in Bhubaneswar. Know before you go.
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/sneprofficial/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f7f3ed] text-xs font-semibold transition-all border border-white/15"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Follow @sneprofficial</span>
              </a>
            </div>
          </div>

          {/* Customer Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-[#d4a17b] uppercase">Customers</h4>
            <div className="flex flex-col space-y-2 text-sm text-[#c4bcb1]">
              <Link to="/explore" className="hover:text-white transition-colors">Explore salons</Link>
              <Link to="/live" className="hover:text-white transition-colors">Live queues</Link>
              <Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
              <Link to="/ai-studio" className="hover:text-white transition-colors">AI Studio</Link>
              <Link to="/points" className="hover:text-white transition-colors">Snepr Points</Link>
            </div>
          </div>

          {/* Salon Owner Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-[#d4a17b] uppercase">Salon Owners</h4>
            <div className="flex flex-col space-y-2 text-sm text-[#c4bcb1]">
              <Link to="/salonos" className="hover:text-white transition-colors">SalonOS</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">Plans and pricing</Link>
              <Link to="/login" className="hover:text-white transition-colors">Salon desk login</Link>
              <Link to="/register-salon" className="hover:text-white transition-colors">Register a salon</Link>
            </div>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-[#d4a17b] uppercase">Company & Legal</h4>
            <div className="flex flex-col space-y-2 text-sm text-[#c4bcb1]">
              <Link to="/about" className="hover:text-white transition-colors">About Snepr</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/help" className="hover:text-white transition-colors">Help center</Link>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link>
              <Link to="/partner-terms" className="hover:text-white transition-colors">Terms of service</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8d857b] gap-2">
          <span>© 2026 Snepr | Bhubaneswar, Odisha</span>
          <span>Crafted in Bhubaneswar</span>
        </div>
      </div>
    </footer>
  );
}
