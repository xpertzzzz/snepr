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
            <h5>CUSTOMERS</h5>
            <ul>
              <li><a href="#discover">Explore salons</a></li>
              <li><a href="#discover">Live queues</a></li>
              <li><a href="#demo">Join queue</a></li>
              <li><a href="#ai">AI Studio</a></li>
              <li><Link to="/live/activity">My bookings</Link></li>
              <li><a href="#points">Snepr Points</a></li>
            </ul>
          </div>
          <div>
            <h5>SALON OWNERS</h5>
            <ul>
              <li><Link to="/claim">List your salon</Link></li>
              <li><Link to="/claim">Claim your salon</Link></li>
              <li><a href="#salonos">SalonOS</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><Link to="/terms-of-service">Partner terms</Link></li>
              <li><Link to="/salon">Partner dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h5>COMPANY</h5>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#faq">Help center</a></li>
            </ul>
          </div>
          <div>
            <h5>LEGAL</h5>
            <ul>
              <li><Link to="/terms-of-service">Terms of service</Link></li>
              <li><Link to="/privacy">Privacy policy</Link></li>
              <li><Link to="/refund">Refund policy</Link></li>
              <li><Link to="/pricing">Pricing terms</Link></li>
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
