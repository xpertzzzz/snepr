import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { SneprWordmark } from "./SneprWordmark";

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

type ToolKey = "scissors" | "comb" | "razor" | "dryer";

interface CardItem {
  id: number;
  tool: ToolKey;
  symbol: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

const TOOLS_CONFIG: Record<ToolKey, { symbol: string; label: string }> = {
  scissors: { symbol: "✂", label: "SCISSORS" },
  comb: { symbol: "≋", label: "COMB" },
  razor: { symbol: "▱", label: "RAZOR" },
  dryer: { symbol: "◉", label: "DRYER" },
};

export function ErrorPage({
  code = "500",
  message = "Something went wrong on our side.",
  onRetry,
}: ErrorPageProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardItem | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardItem | null>(null);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [statusText, setStatusText] = useState("Find the matching pairs to win.");

  const initGame = () => {
    const initialTools: ToolKey[] = [
      "scissors", "comb", "razor", "dryer",
      "comb", "dryer", "scissors", "razor",
    ];

    // Shuffle
    const shuffled = [...initialTools].sort(() => Math.random() - 0.5);

    const newCards: CardItem[] = shuffled.map((tool, idx) => ({
      id: idx,
      tool,
      symbol: TOOLS_CONFIG[tool].symbol,
      label: TOOLS_CONFIG[tool].label,
      flipped: false,
      matched: false,
    }));

    setCards(newCards);
    setFirstChoice(null);
    setSecondChoice(null);
    setLocked(false);
    setMoves(0);
    setPairs(0);
    setStatusText("Find the matching pairs to win.");
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card: CardItem) => {
    if (locked || card.matched || card.flipped || card.id === firstChoice?.id) return;

    // Flip card
    const updated = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    setCards(updated);

    if (!firstChoice) {
      setFirstChoice(card);
      return;
    }

    setSecondChoice(card);
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Check Match
    if (firstChoice.tool === card.tool) {
      const matchUpdated = updated.map((c) =>
        c.tool === card.tool ? { ...c, matched: true, flipped: true } : c
      );
      setCards(matchUpdated);
      const newPairs = pairs + 1;
      setPairs(newPairs);
      setFirstChoice(null);
      setSecondChoice(null);

      if (newPairs === 4) {
        setStatusText(`You did it! All four pairs found in ${newMoves} moves.`);
      } else {
        setStatusText("Nice match! Find the next pair.");
      }
    } else {
      setLocked(true);
      setStatusText("Not a match. Try another pair.");
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstChoice.id || c.id === card.id ? { ...c, flipped: false } : c
          )
        );
        setFirstChoice(null);
        setSecondChoice(null);
        setLocked(false);
      }, 750);
    }
  };

  return (
    <div className="snepr-err-page min-h-screen bg-[#faf7f2] text-[#1b1410] font-sans flex flex-col selection:bg-[#7a4b29]/20">
      <style>{`
        .snepr-err-page {
          --bg: #faf7f2;
          --card: #fff;
          --ink: #1b1410;
          --muted: #75685e;
          --brown: #7a4b29;
          --gold: #c8993e;
          --line: #e8e1d7;
          --green: #2e7d4f;
        }
        .memory-card {
          perspective: 650px;
        }
        .card-inner {
          transform-style: preserve-3d;
          transition: transform .35s;
        }
        .memory-card.flipped .card-inner,
        .memory-card.matched .card-inner {
          transform: rotateY(180deg);
        }
        .card-back, .card-front {
          backface-visibility: hidden;
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="h-[76px] flex items-center justify-between px-6 max-w-[1120px] w-full mx-auto border-b border-[#eae3da]">
        <Link to="/" className="flex items-center gap-1 border-0 bg-transparent shadow-none" aria-label="Snepr home">
          <SneprWordmark height={30} color="#1b1410" />
        </Link>
        <div className="text-[11px] text-[#8b7c70] tracking-[1.4px] uppercase font-semibold">
          Something went wrong
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="w-[min(100%-40px,980px)] mx-auto py-14 grid grid-cols-1 md:grid-cols-[1fr_350px] gap-14 items-center flex-1">
        {/* LEFT COPY */}
        <section className="max-w-[570px]">
          <div className="text-[11px] tracking-[1.6px] uppercase text-[#7a4b29] font-bold">
            {code === "404"
              ? "Page Not Found"
              : code === "403"
              ? "Access Restricted"
              : code === "503"
              ? "Scheduled Maintenance"
              : "Something went wrong"}
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium tracking-tight leading-[1.05] my-4">
            {code === "404" ? (
              <>
                Lost in the<br />
                <span className="text-[#7a4b29]">salon queue?</span>
              </>
            ) : code === "403" ? (
              <>
                Access<br />
                <span className="text-[#7a4b29]">restricted.</span>
              </>
            ) : code === "503" ? (
              <>
                Brief maintenance<br />
                <span className="text-[#7a4b29]">in progress.</span>
              </>
            ) : (
              <>
                Oops! This page<br />
                <span className="text-[#7a4b29]">isn't working.</span>
              </>
            )}
          </h1>
          <p className="text-base leading-relaxed text-[#75685e] max-w-[490px] m-0">
            {code === "404"
              ? "The salon profile, queue ticket, or page you are looking for does not exist or has been relocated."
              : code === "403"
              ? "You do not have the required permissions to access this administrative or salon management portal."
              : code === "503"
              ? "Snepr is currently performing a quick routine infrastructure update. Queue sync will resume momentarily."
              : "Something went wrong while opening this page. Please try again. If it still doesn't work, go back to Snepr and continue browsing."}
          </p>
          <div className="mt-5 text-xs text-[#918378] flex items-center gap-2">
            <strong className="text-[#7a4b29]">Error {code}</strong>
            <span>{message}</span>
          </div>
          <div className="flex gap-2.5 flex-wrap mt-7">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-[#7a4b29] text-white border-0 rounded-lg px-5 py-3 text-xs font-bold hover:bg-[#60391f] transition-colors cursor-pointer"
              >
                Try again
              </button>
            )}
            <Link
              to="/salons"
              className="bg-[#1C1613] text-white border border-[#1C1613] rounded-lg px-5 py-3 text-xs font-bold hover:bg-[#3D2E24] transition-colors"
            >
              Search Salons in Bhubaneswar
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-[#1b1410] border border-[#e8e1d7] rounded-lg px-5 py-3 text-xs font-bold hover:bg-[#faf7f2] transition-colors"
            >
              My Dashboard
            </Link>
            <Link
              to="/"
              className="bg-white text-[#75685e] border border-[#e8e1d7] rounded-lg px-5 py-3 text-xs font-bold hover:bg-[#faf7f2] transition-colors"
            >
              Home
            </Link>
          </div>
        </section>

        {/* RIGHT ILLUSTRATION */}
        <aside className="bg-[#f1e7dc] border border-[#e5d7c8] rounded-3xl min-h-[310px] flex flex-col items-center justify-center p-7 relative overflow-hidden">
          <div className="absolute w-[260px] h-[260px] border border-[#dfcdbb] rounded-full pointer-events-none" />
          <div className="absolute w-[205px] h-[205px] border border-[#dfcdbb] rounded-full pointer-events-none" />
          
          <div className="z-10 bg-[#fffdf9] border border-[#e3d6c9] rounded-xl w-[180px] p-5 text-center shadow-[0_12px_30px_rgba(73,50,29,0.08)] -rotate-3">
            <div className="w-14 h-14 rounded-full bg-[#f2e5d8] mx-auto mb-3 grid place-items-center text-[#7a4b29] text-2xl font-bold">
              !
            </div>
            <strong className="font-serif text-lg font-medium block">Page not found</strong>
            <p className="text-[11px] text-[#75685e] leading-relaxed mt-1.5">
              Don't worry. You can return to Snepr and try another page.
            </p>
          </div>
          <div className="z-10 flex gap-2 mt-5">
            <i className="w-1.5 h-1.5 bg-[#c8993e] rounded-full inline-block" />
            <i className="w-1.5 h-1.5 bg-[#c8993e] rounded-full inline-block" />
            <i className="w-1.5 h-1.5 bg-[#c8993e] rounded-full inline-block" />
          </div>
        </aside>

        {/* INTERACTIVE MINI-GAME */}
        <section className="col-span-1 md:col-span-2 bg-white border border-[#e8e1d7] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-6 items-center shadow-sm">
          <div>
            <div className="text-[10px] tracking-[1.5px] uppercase text-[#7a4b29] font-extrabold mb-2">
              SNEPR MINI GAME
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#1b1410] mb-2">
              Match the salon tools
            </h2>
            <p className="text-xs leading-relaxed text-[#75685e] max-w-[300px]">
              Flip two cards at a time and find all four matching pairs. How quickly can you do it?
            </p>
            <div className="flex gap-5 mt-4 text-xs text-[#75685e]">
              <span>Pairs <strong className="text-[#7a4b29] ml-1">{pairs} / 4</strong></span>
              <span>Moves <strong className="text-[#7a4b29] ml-1">{moves}</strong></span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-2 max-w-[420px] md:ml-auto">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCardClick(c)}
                  disabled={c.matched}
                  className={`memory-card aspect-[1.18] p-0 border-0 bg-transparent cursor-pointer ${
                    c.flipped ? "flipped" : ""
                  } ${c.matched ? "matched" : ""}`}
                >
                  <span className="card-inner relative block w-full h-full">
                    {/* BACK */}
                    <span className="card-back absolute inset-0 rounded-xl bg-[#f2e8de] border border-[#e5d7c8] text-[#7a4b29] font-serif text-2xl italic flex flex-col items-center justify-center">
                      S
                    </span>
                    {/* FRONT */}
                    <span
                      className={`card-front absolute inset-0 rounded-xl flex flex-col items-center justify-center rotate-y-180 ${
                        c.matched
                          ? "bg-[#edf3eb] border border-[#c9ddce] text-[#2e7d4f]"
                          : "bg-[#fffaf4] border border-[#d8c2ac] text-[#7a4b29]"
                      }`}
                    >
                      <b className="text-2xl font-normal leading-none">{c.symbol}</b>
                      <small className="text-[7px] tracking-[1px] font-extrabold mt-1">
                        {c.label}
                      </small>
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 max-w-[420px] md:ml-auto mt-3">
              <span className="text-[10px] text-[#75685e] leading-snug">
                {statusText}
              </span>
              <button
                onClick={initGame}
                className="border border-[#e8e1d7] bg-white text-[#1b1410] rounded-lg px-3 py-1.5 text-[10px] font-bold whitespace-nowrap hover:bg-[#faf7f2] cursor-pointer"
              >
                Restart game
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="w-[min(100%-40px,1120px)] mx-auto py-5 border-t border-[#e8e1d7] flex flex-col sm:flex-row justify-between text-[#95877b] text-xs gap-3">
        <span>© {new Date().getFullYear()} Snepr Technologies Inc.</span>
        <a href="mailto:support@snepr.in" className="text-[#7a4b29] hover:underline">
          Need help? Contact support
        </a>
      </footer>
    </div>
  );
}

export default ErrorPage;

