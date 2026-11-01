import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import { REAL_SALONS_DATA } from "@/lib/real-salons";
import "@/styles/live-page.css";

export const Route = createFileRoute("/live/")({
  head: () => ({
    title: "Live salons near you | Snepr",
    meta: [
      {
        name: "description",
        content: "Check the queue before you visit. Join when you're ready. Live wait times and chair availability across Bhubaneswar salons.",
      },
      { name: "theme-color", content: "#FAF7F2" },
    ],
    links: [
      { rel: "canonical", href: "https://snepr.in/live" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap",
      },
    ],
  }),
  component: LivePageStrict,
});

const CURATED_SALON_PHOTOS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
  2: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
  3: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
  4: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
  5: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80",
  6: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
  7: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
  8: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
  9: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
  10: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80",
  11: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
  12: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
  13: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
};

const AREA_NAMES = [
  "Patia",
  "KIIT Road",
  "Saheed Nagar",
  "Jaydev Vihar",
  "Chandrasekharpur",
  "Rasulgarh",
  "Nayapalli",
  "Khandagiri",
];

export function LivePageStrict() {
  const navigate = useNavigate();

  const [activeArea, setActiveArea] = useState<string>("Patia");
  const [chosenArea, setChosenArea] = useState<string>("Patia");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const filteredSalons = useMemo(() => {
    const q = search.trim().toLowerCase();

    return REAL_SALONS_DATA.filter((s) => {
      // Area match
      let areaMatches = false;
      if (activeArea === "Patia") {
        areaMatches = s.areaId === 1;
      } else if (activeArea === "KIIT Road") {
        areaMatches = s.areaId === 1 && s.address.toLowerCase().includes("kiit");
      } else if (activeArea === "Chandrasekharpur") {
        areaMatches = s.areaId === 2;
      } else if (activeArea === "Jaydev Vihar") {
        areaMatches = s.areaId === 3;
      } else if (activeArea === "Gajapati Nagar") {
        areaMatches = s.areaId === 4;
      } else {
        areaMatches = s.areaName.toLowerCase().includes(activeArea.toLowerCase());
      }

      // If search query is present, check name, address, category, or services
      if (q) {
        const servicesStr = s.services.map((svc) => svc.name).join(" ").toLowerCase();
        const searchMatches =
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          servicesStr.includes(q);

        return areaMatches && searchMatches;
      }

      return areaMatches;
    });
  }, [activeArea, search]);

  const openModal = () => {
    setChosenArea(activeArea);
    setModalOpen(true);
  };

  const confirmAreaChoice = () => {
    setActiveArea(chosenArea);
    setModalOpen(false);
  };

  return (
    <div className="live-page-root">
      {/* ─── HEADER ─── */}
      <header>
        <div className="head">
          <Link to="/" className="logo" aria-label="Snepr home">
            snepr<span>.</span>
          </Link>
          <div className="head-right">
            <button className="location" id="locationBtn" onClick={openModal}>
              <small>YOUR AREA</small>
              <span id="locationText">{activeArea}, Bhubaneswar ▾</span>
            </button>
            <Link to="/live/profile" className="profile" aria-label="Your profile">
              A
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main>
        <section className="intro">
          <div>
            <div className="kicker">Find a salon. Skip the wait.</div>
            <h1>Salons near you</h1>
            <p>Check the queue before you visit. Join when you're ready.</p>
          </div>
          <div className="live-label">
            <span className="live-dot" /> Queue updates from salons
          </div>
        </section>

        {/* Search Row */}
        <div className="search-row">
          <label className="search">
            <span>⌕</span>
            <input
              id="search"
              type="search"
              placeholder="Search salon or service"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          {search && (
            <button className="clear" id="clearSearch" onClick={() => setSearch("")}>
              Clear
            </button>
          )}
        </div>

        {/* Choose Your Area */}
        <div className="area-row">
          <h2>Choose your area</h2>
          <span>Bhubaneswar</span>
        </div>
        <div className="areas" id="areas">
          {AREA_NAMES.map((area) => (
            <button
              key={area}
              className={`area ${activeArea === area ? "active" : ""}`}
              onClick={() => setActiveArea(area)}
            >
              {area}
            </button>
          ))}
        </div>

        {/* List Head */}
        <div className="list-head">
          <h2 id="listTitle">Salons in {activeArea}</h2>
          <span id="salonCount">
            {filteredSalons.length} salon{filteredSalons.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Salons Grid */}
        <section className="salons" id="salonList">
          {filteredSalons.map((s) => {
            const photoUrl =
              CURATED_SALON_PHOTOS[s.id] ||
              "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80";
            const servicesText = s.services.slice(0, 3).map((item) => item.name).join(" · ");
            const isMediumWait = s.waitTime > 10;

            return (
              <article key={s.id} className="salon">
                <div className="photo">
                  <img src={photoUrl} alt={s.name} />
                  <span className="verified">VERIFIED</span>
                </div>
                <div className="details">
                  <div className="title-line">
                    <h3>{s.name}</h3>
                    <span className="rating">★ {s.rating}</span>
                  </div>
                  <p className="place">
                    {s.areaName} · {s.address.split(",")[0]}
                  </p>
                  <div className="services">
                    {servicesText || "Haircut · Beard trim · Styling"}
                  </div>
                  <div className="availability">
                    <div className="wait">
                      <span className={`wait-dot ${isMediumWait ? "medium" : ""}`} />
                      <div>
                        <b>{s.waitTime} min wait</b>
                        <small>
                          {s.availableChairs} chair{s.availableChairs === 1 ? "" : "s"} available
                        </small>
                      </div>
                    </div>
                    <button
                      className="view"
                      onClick={() => navigate({ to: `/live/salon/${s.id}` })}
                    >
                      View salon
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredSalons.length === 0 && (
            <div className="empty" style={{ display: "block" }} id="empty">
              <b>No salons found</b>
              Try another salon name, service or area.
            </div>
          )}
        </section>

        <p className="footnote">
          Wait times and chair availability are updated by each salon. Only verified, active partner salons appear here.
        </p>
      </main>

      {/* ─── FOOTER ─── */}
      <footer>
        <div>
          <span>© Snepr</span>
          <span>
            Need help? <a href="mailto:support@snepr.in">Contact support</a>
          </span>
        </div>
      </footer>

      {/* ─── BOTTOM MOBILE NAVIGATION ─── */}
      <nav className="bottom">
        <Link to="/">
          <i>⌂</i>Home
        </Link>
        <Link to="/live" className="active">
          <i>◷</i>Live
        </Link>
        <Link to="/live/studio">
          <i>✧</i>AI Studio
        </Link>
        <Link to="/live/queue">
          <i>▱</i>My token
        </Link>
        <Link to="/live/profile">
          <i>♙</i>Profile
        </Link>
      </nav>

      {/* ─── MODAL ─── */}
      <div
        className={`modal-bg ${modalOpen ? "show" : ""}`}
        id="areaModal"
        onClick={() => setModalOpen(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top">
            <h3>Change your area</h3>
            <button
              id="closeModal"
              style={{ border: 0, background: "none", fontSize: "22px", cursor: "pointer" }}
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
          </div>
          <p>Choose the area where you want to find salons.</p>
          <div className="modal-areas" id="modalAreas">
            {AREA_NAMES.map((area) => (
              <button
                key={area}
                className={chosenArea === area ? "selected" : ""}
                onClick={() => setChosenArea(area)}
              >
                {area}
              </button>
            ))}
          </div>
          <button className="modal-done" id="confirmArea" onClick={confirmAreaChoice}>
            Show salons
          </button>
        </div>
      </div>
    </div>
  );
}

export default LivePageStrict;
