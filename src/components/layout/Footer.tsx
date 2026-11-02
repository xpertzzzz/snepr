import { Link } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";

export function Footer() {
  return (
    <footer className="snepr-ftr">
      <div className="wrap">
        <div className="fg">
          <div>
            <Link to="/" className="inline-block" aria-label="Snepr home">
              <SneprWordmark height={32} color="#ffffff" className="opacity-95 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="bp">Live salon queues and wait times. Know before you go.</p>
          </div>
          <div>
            <h5>SERVICES</h5>
            <ul>
              <li><Link to="/live">Live Queues</Link></li>
              <li><Link to="/live/aistudio">AI Studio</Link></li>
              <li><Link to="/live">Find a Salon</Link></li>
            </ul>
          </div>
          <div>
            <h5>FOR SALONS</h5>
            <ul>
              <li><Link to="/salon-os">SalonOS</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/partner/register">Register Salon</Link></li>
              <li><Link to="/partner/claim">Claim Salon</Link></li>
            </ul>
          </div>
          <div>
            <h5>COMPANY</h5>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><a href="/#how">How It Works</a></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h5>LEGAL</h5>
            <ul>
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/partner-terms">Partner Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="fb">
          <div>© 2026 Snepr Technologies Inc. · All rights reserved.</div>
          <div>Bhubaneswar, Odisha · 0% commission on salon haircuts.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
