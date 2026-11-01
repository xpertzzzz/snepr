import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="snepr-ftr">
      <div className="wrap">
        <div className="fg">
          <div>
            <Link to="/" className="inline-block" aria-label="Snepr home">
              <img
                src="/snepr-logo.png"
                alt="sn≡pr"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
              />
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
              <li><Link to="/privacy-policy">Privacy policy</Link></li>
              <li><Link to="/terms-of-service">Terms of service</Link></li>
            </ul>
            <h5 style={{ marginTop: "22px" }}>SOCIAL</h5>
            <ul>
              <li>
                <a href="https://instagram.com/snepr" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fb">
          <span>© 2026 Snepr. All rights reserved.</span>
          <span>Made in Bhubaneswar</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
