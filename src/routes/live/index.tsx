import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import { BHUBANESWAR_AREAS, REAL_SALONS_DATA, RealSalon } from "@/lib/real-salons";

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
    links: [{ rel: "canonical", href: "https://snepr.in/live" }],
  }),
  component: LivePageExact,
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

export function LivePageExact() {
  const navigate = useNavigate();

  // Selected area state (Defaults to Patia)
  const [activeArea, setActiveArea] = useState<string>("Patia");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChosenArea, setModalChosenArea] = useState<string>("Patia");
  const [searchQuery, setSearchQuery] = useState("");

  const areaList = [
    { name: "Patia", matchSlugs: ["patia"] },
    { name: "KIIT Road", matchSlugs: ["patia"] },
    { name: "Chandrasekharpur", matchSlugs: ["chandrasekharpur"] },
    { name: "Jaydev Vihar", matchSlugs: ["jayadev-vihar"] },
    { name: "Gajapati Nagar", matchSlugs: ["gajapati-nagar"] },
    { name: "Saheed Nagar", matchSlugs: ["saheed-nagar"] },
    { name: "Nayapalli", matchSlugs: ["nayapalli"] },
    { name: "Rasulgarh", matchSlugs: ["rasulgarh"] },
    { name: "Khandagiri", matchSlugs: ["khandagiri"] },
  ];

  // Filter salons based on activeArea and searchQuery
  const currentAreaObj = areaList.find((a) => a.name === activeArea) || areaList[0];

  const filteredSalons = REAL_SALONS_DATA.filter((salon) => {
    // Area match
    const areaMatches =
      salon.areaName.toLowerCase().includes(activeArea.toLowerCase()) ||
      currentAreaObj.matchSlugs.some((s) => salon.areaSlug.toLowerCase().includes(s)) ||
      (activeArea === "KIIT Road" && salon.address.toLowerCase().includes("kiit"));

    if (!areaMatches) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const servicesText = salon.services.map((s) => s.name).join(" ").toLowerCase();
      const match =
        salon.name.toLowerCase().includes(q) ||
        salon.address.toLowerCase().includes(q) ||
        salon.category.toLowerCase().includes(q) ||
        servicesText.includes(q);
      if (!match) return false;
    }

    return true;
  });

  const openAreaModal = () => {
    setModalChosenArea(activeArea);
    setModalOpen(true);
  };

  const confirmModalArea = () => {
    setActiveArea(modalChosenArea);
    setModalOpen(false);
  };

  return (
    <div className="snepr-live-page min-h-screen bg-[#FAF7F2] text-[#211812] font-sans flex flex-col selection:bg-[#7a4b29]/20">
      <style>{`
        .snepr-live-page {
          --bg: #faf7f2;
          --surface: #fff;
          --ink: #211812;
          --muted: #786b60;
          --brown: #7a4b29;
          --gold: #c8993e;
          --line: #e9e1d7;
          --green: #267447;
          --green-bg: #eaf3ec;
        }
        .live-dot-pulse {
          animation: livePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>

      {/* ─── 1. STICKY HEADER ─── */}
      <header className="bg-[#FAF7F2] border-b border-[#e9e1d7] sticky top-0 z-20">
        <div className="max-w-[1120px] h-[70px] px-6 mx-auto flex items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-1 border-0 bg-transparent shadow-none" aria-label="Snepr home">
            <SneprWordmark height={30} color="#211812" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={openAreaModal}
              className="border-0 bg-[#f0e8df] rounded-lg px-3 py-2 text-[#211812] text-xs font-semibold cursor-pointer hover:bg-[#e8dece] transition-colors"
              aria-label="Change location area"
            >
              <small className="block text-[#786b60] text-[9px] font-medium text-left mb-0.5">YOUR AREA</small>
              <span className="font-bold">{activeArea}, Bhubaneswar ▾</span>
            </button>

            <Link
              to="/live/profile"
              className="w-[34px] h-[34px] rounded-full grid place-items-center bg-[#e8d8c8] text-[#7a4b29] text-xs font-bold hover:opacity-90 transition-opacity"
              aria-label="Your profile"
            >
              A
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. MAIN CONTENT ─── */}
      <main className="max-w-[1120px] w-full mx-auto px-6 pt-7 pb-24 flex-1">
        {/* INTRO HERO */}
        <section className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[1.4px] font-bold text-[#7a4b29] mb-1">
              Find a salon. Skip the wait.
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#211812] leading-[1.1] my-1">
              Salons near you
            </h1>
            <p className="m-0 text-[#786b60] text-xs sm:text-sm">
              Check the queue before you visit. Join when you're ready.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#267447] font-bold pb-1 whitespace-nowrap bg-[#eaf3ec] px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#2f9857] live-dot-pulse" />
            Queue updates from salons
          </div>
        </section>

        {/* SEARCH BAR & CLEAR */}
        <div className="flex gap-2.5 mb-6">
          <label className="h-12 flex-1 flex items-center gap-2.5 bg-white border border-[#e9e1d7] rounded-xl px-4 shadow-sm focus-within:border-[#7a4b29] transition-colors">
            <span className="text-lg text-[#9b8b7e]">⌕</span>
            <input
              type="search"
              placeholder="Search salon or service"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 outline-none w-full text-xs sm:text-sm bg-transparent text-[#211812] placeholder:text-[#a39488]"
            />
          </label>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="border border-[#e9e1d7] bg-white rounded-xl px-4 text-[#7a4b29] text-xs font-bold hover:bg-[#faf7f2] transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* AREA SELECTOR ROW */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-sm m-0 font-bold text-[#211812]">Choose your area</h2>
          <span className="text-[11px] text-[#786b60]">Bhubaneswar, Odisha</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 pt-0.5 scrollbar-none">
          {areaList.map((a) => (
            <button
              key={a.name}
              onClick={() => setActiveArea(a.name)}
              className={`border rounded-lg px-3.5 py-2 text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeArea === a.name
                  ? "bg-[#211812] border-[#211812] text-white font-semibold shadow-sm"
                  : "border-[#e9e1d7] bg-white text-[#6f6054] hover:border-[#7a4b29]"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        {/* LIST HEADING */}
        <div className="flex items-center justify-between my-5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#211812] m-0">
            Salons in {activeArea}
          </h2>
          <span className="text-xs text-[#786b60]">
            {filteredSalons.length} salon{filteredSalons.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* SALONS GRID (2 COLUMNS DESKTOP, 1 COLUMN MOBILE) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredSalons.map((salon) => {
            const photoUrl =
              CURATED_SALON_PHOTOS[salon.id] ||
              "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80";
            const servicesPreview = salon.services.slice(0, 3).map((s) => s.name).join(" · ");
            const isShortWait = salon.waitTime <= 10;

            return (
              <article
                key={salon.id}
                className="bg-white border border-[#e9e1d7] rounded-2xl overflow-hidden grid grid-cols-[130px_1fr] sm:grid-cols-[142px_1fr] min-h-[166px] shadow-sm hover:shadow-md transition-shadow"
              >
                {/* PHOTO */}
                <div className="relative bg-[#e9dfd4] min-h-[160px]">
                  <img
                    src={photoUrl}
                    alt={salon.name}
                    className="w-full h-full absolute inset-0 object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-2 bottom-2 bg-[#fffdf2]/95 backdrop-blur-xs rounded px-1.5 py-1 text-[8px] font-extrabold text-[#267447] tracking-wider shadow-xs">
                    VERIFIED
                  </span>
                </div>

                {/* DETAILS */}
                <div className="p-3 sm:p-3.5 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-base sm:text-lg font-semibold leading-tight text-[#211812] m-0 line-clamp-1">
                        {salon.name}
                      </h3>
                      <span className="text-[10px] whitespace-nowrap text-[#735d42] font-bold pt-0.5">
                        ★ {salon.rating}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#786b60] my-1 line-clamp-1">
                      {salon.areaName} · {salon.address.split(",")[0]}
                    </p>

                    <div className="text-[10px] text-[#78685c] mb-2 line-clamp-1">
                      {servicesPreview || "Haircut · Beard trim · Styling"}
                    </div>
                  </div>

                  {/* AVAILABILITY BOTTOM BAR */}
                  <div className="border-t border-[#eee7df] pt-2 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isShortWait ? "bg-[#2e8b50]" : "bg-[#c18a35]"
                        }`}
                      />
                      <div className="leading-tight">
                        <b className="text-[11px] text-[#211812] block">
                          {salon.waitTime} min wait
                        </b>
                        <small className="text-[9px] text-[#786b60] block">
                          {salon.availableChairs} chair{salon.availableChairs === 1 ? "" : "s"} available
                        </small>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate({ to: `/live/salon/${salon.id}` })}
                      className="border-0 bg-[#7a4b29] text-white rounded-md px-3 py-2 text-[10px] font-bold whitespace-nowrap hover:bg-[#60391f] transition-colors cursor-pointer"
                    >
                      View salon
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredSalons.length === 0 && (
            <div className="col-span-1 md:col-span-2 bg-white border border-[#e9e1d7] rounded-xl p-8 text-center text-[#786b60] text-xs">
              <b className="block text-[#211812] text-sm mb-1.5 font-bold">No salons found</b>
              Try another salon name, service or area in Bhubaneswar.
            </div>
          )}
        </section>

        {/* FOOTNOTE */}
        <p className="text-[10px] text-[#94867a] mt-5">
          Wait times and chair availability are updated by each salon. Only verified, active partner salons appear here.
        </p>
      </main>

      {/* ─── 3. FOOTER ─── */}
      <footer className="border-t border-[#e9e1d7] py-4 px-6 text-[#938579] text-[10px] mb-16 sm:mb-0">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row justify-between gap-2.5">
          <span>© {new Date().getFullYear()} Snepr Technologies Inc. · Bhubaneswar</span>
          <span>
            Need help?{" "}
            <a href="mailto:support@snepr.in" className="text-[#7a4b29] underline">
              Contact support
            </a>
          </span>
        </div>
      </footer>

      {/* ─── 4. BOTTOM MOBILE NAVIGATION ─── */}
      <nav className="sm:hidden fixed bottom-2.5 left-2.5 right-2.5 h-[59px] rounded-xl bg-[#211812] text-white z-20 flex items-center justify-around shadow-[0_8px_25px_rgba(33,24,18,0.3)]">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-[9px] text-[#ded4ca]">
          <i className="not-italic text-base leading-none">⌂</i>
          Home
        </Link>
        <Link to="/live" className="flex flex-col items-center gap-0.5 text-[9px] text-[#e7bd73] font-bold">
          <i className="not-italic text-base leading-none">◷</i>
          Live
        </Link>
        <Link to="/live/studio" className="flex flex-col items-center gap-0.5 text-[9px] text-[#ded4ca]">
          <i className="not-italic text-base leading-none">✧</i>
          AI Studio
        </Link>
        <Link to="/live/queue" className="flex flex-col items-center gap-0.5 text-[9px] text-[#ded4ca]">
          <i className="not-italic text-base leading-none">▱</i>
          My token
        </Link>
        <Link to="/live/profile" className="flex flex-col items-center gap-0.5 text-[9px] text-[#ded4ca]">
          <i className="not-italic text-base leading-none">♙</i>
          Profile
        </Link>
      </nav>

      {/* ─── 5. CHANGE AREA MODAL ─── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-[#211812]/50 z-40 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#fffdf9] w-[min(100%,380px)] rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-serif text-2xl font-medium text-[#211812] m-0">
                Change your area
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="border-0 bg-transparent text-2xl text-[#786b60] cursor-pointer hover:text-[#211812]"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-[#786b60] leading-relaxed mb-4">
              Choose the area in Bhubaneswar where you want to find salons.
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {areaList.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setModalChosenArea(a.name)}
                  className={`p-2.5 border rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    modalChosenArea === a.name
                      ? "border-[#7a4b29] bg-[#f5eee7] text-[#7a4b29] font-bold"
                      : "border-[#e9e1d7] bg-white text-[#211812] hover:bg-[#faf7f2]"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>

            <button
              onClick={confirmModalArea}
              className="w-full mt-4 bg-[#7a4b29] text-white border-0 rounded-lg py-3 text-xs font-bold hover:bg-[#60391f] transition-colors cursor-pointer"
            >
              Show salons
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LivePageExact;
