import React, { useState } from "react";
import { Scissors, Sparkles, Ticket, ShieldCheck, QrCode, ArrowRight, Check, Clock, User, Phone, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import { Tilt3D } from "@/components/ui/Tilt3D";

export function InteractivePhoneSimulator() {
  const [pov, setPov] = useState<"customer" | "owner">("customer");
  const [dockTab, setDockTab] = useState<"explore" | "studio" | "pass" | "points" | "desk">("explore");
  const [activeToken, setActiveToken] = useState("#B-15");
  const [estWaitMinutes, setEstWaitMinutes] = useState(11);
  const [isCustomerInChair, setIsCustomerInChair] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);
  const [pointsBalance, setPointsBalance] = useState(240);
  const [isScanning, setIsScanning] = useState(false);

  const [chairs, setChairs] = useState([
    { id: 1, barber: "Rajesh Kumar", status: "serving", token: "#B-14", time: "4m" },
    { id: 2, barber: "Aman Singh", status: "serving", token: "#B-13", time: "8m" },
    { id: 3, barber: "Sameer Khan", status: "free", token: null, time: "Free" }
  ]);

  const [waitingQueue, setWaitingQueue] = useState([
    { token: "#B-15", name: "Rahul Sharma (You)", service: "Signature Fade", arrived: false },
    { token: "#B-16", name: "Priya Sen", service: "Hair Spa", arrived: false }
  ]);

  const handleBook = () => {
    setActiveToken("#B-15");
    setDockTab("pass");
    toast.success("Token #B-15 confirmed! SMS notification sent.");
  };

  const handleArrived = () => {
    setHasArrived(true);
    setWaitingQueue((prev) =>
      prev.map((q) => (q.token === "#B-15" ? { ...q, arrived: true } : q))
    );
    toast.success("Reception desk notified of your arrival!");
  };

  const handleDelay = () => {
    setEstWaitMinutes((m) => m + 10);
    toast.info("Slot delayed by 10 minutes.");
  };

  const handleRateStar = (star: number) => {
    toast.info(`Rated ${star} stars. Click Submit to claim +10 Snepr Points.`);
  };

  const handleSubmitReview = () => {
    setPointsBalance((p) => p + 10);
    toast.success("Review verified! +10 Snepr Points credited (= Rs. 10 discount).");
  };

  const handleOwnerCallNext = () => {
    if (waitingQueue.length > 0) {
      const next = waitingQueue[0];
      setWaitingQueue((prev) => prev.slice(1));
      setChairs((prev) => [
        { ...prev[0], token: next.token },
        prev[1],
        prev[2]
      ]);
      if (next.token === "#B-15") {
        setIsCustomerInChair(true);
        setEstWaitMinutes(0);
      }
      toast.success(`Called ${next.token} (${next.name}) to Chair 1!`);
    } else {
      toast.info("Queue is currently empty!");
    }
  };

  const handleScanQR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      handleArrived();
      toast.success("Scanned & verified customer Token #B-15!");
    }, 2000);
  };

  const handleAddWalkIn = () => {
    const nextNum = `#B-${16 + waitingQueue.length}`;
    setWaitingQueue((prev) => [
      ...prev,
      { token: nextNum, name: "Walk-in Client", service: "Haircut", arrived: true }
    ]);
    toast.success(`Walk-in Token ${nextNum} printed at counter!`);
  };

  return (
    <section id="simulator" className="py-20 px-4 sm:px-6 bg-[#FAF7F2] border-y border-[#E8E1D7] font-['Space_Grotesk',sans-serif]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EFE9] border border-[#B86B33]/30 text-[12px] font-bold tracking-widest uppercase text-[#8A4C24] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C8993E]" />
            Live App Simulation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1B1410]">
            Experience Snepr in Action
          </h2>
          <p className="mt-4 text-[16px] text-[#6E6159] leading-relaxed">
            Test the live queue pass from a customer's phone or take the barber desk view to manage real-time chair flow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Walkthrough Explanations */}
          <div className="space-y-5">
            <Tilt3D maxAngle={4} scale={1.015} glare={true} className="rounded-[24px]">
              <div className="bg-white border border-[#E8E1D7] rounded-[24px] p-6 shadow-sm hover:border-[#8A4C24] transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7EFE9] text-[#8A4C24] flex items-center justify-center font-bold flex-none shadow-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1B1410]">Pick your style &amp; get a live token</h3>
                    <p className="text-[14px] text-[#6E6159] mt-1 leading-relaxed">
                      Select your service (e.g. Signature Fade for Rs. 350) and lock in Token #B-15 instantly. Your phone counts down the minutes so you never sit in a crowded waiting lobby.
                    </p>
                  </div>
                </div>
              </div>
            </Tilt3D>

            <Tilt3D maxAngle={4} scale={1.015} glare={true} className="rounded-[24px]">
              <div className="bg-white border border-[#E8E1D7] rounded-[24px] p-6 shadow-sm hover:border-[#8A4C24] transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF3E1] text-[#705217] flex items-center justify-center font-bold flex-none shadow-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1B1410]">Barbers call you in 1 tap</h3>
                    <p className="text-[14px] text-[#6E6159] mt-1 leading-relaxed">
                      Barbers see who is coming up and tap "Call Next". You receive an instant WhatsApp alert telling you Chair 1 is ready, so you step straight into your cut.
                    </p>
                  </div>
                </div>
              </div>
            </Tilt3D>

            <Tilt3D maxAngle={4} scale={1.015} glare={true} className="rounded-[24px]">
              <div className="bg-white border border-[#E8E1D7] rounded-[24px] p-6 shadow-sm hover:border-[#8A4C24] transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#1C5434] flex items-center justify-center font-bold flex-none shadow-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1B1410]">Get Rs. 10 off for every review</h3>
                    <p className="text-[14px] text-[#6E6159] mt-1 leading-relaxed">
                      Every verified review earns +10 Snepr Points (= Rs. 10 discount on your next visit). Rate 1 star or 5 stars—you always get your points. Zero fake or paid reviews.
                    </p>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </div>

          {/* Right Virtual Phone */}
          <div className="w-full max-w-[380px] mx-auto">
            {/* POV Toggle */}
            <div className="flex bg-white border border-[#E8E1D7] rounded-full p-1 mb-4 shadow-sm">
              <button
                onClick={() => {
                  setPov("customer");
                  setDockTab("explore");
                }}
                className={`flex-1 py-2 text-center rounded-full text-[13px] font-bold transition-all ${
                  pov === "customer" ? "bg-[#1B1410] text-white shadow-sm" : "text-[#6E6159] hover:text-[#1B1410]"
                }`}
              >
                Customer View
              </button>
              <button
                onClick={() => {
                  setPov("owner");
                  setDockTab("desk");
                }}
                className={`flex-1 py-2 text-center rounded-full text-[13px] font-bold transition-all ${
                  pov === "owner" ? "bg-[#1B1410] text-white shadow-sm" : "text-[#6E6159] hover:text-[#1B1410]"
                }`}
              >
                SalonOS Barber Desk
              </button>
            </div>

            {/* Virtual Chassis */}
            <Tilt3D maxAngle={8} scale={1.02} glare={true} className="rounded-[46px]">
              <div className="w-full h-[620px] bg-[#110B08] rounded-[46px] p-2.5 shadow-2xl relative overflow-hidden border border-[#382820]">
              {/* Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#110B08] z-30" />

              <div className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative transition-colors ${
                pov === "owner" ? "bg-[#1A120E] text-[#FAF7F2]" : "bg-[#FAF7F2] text-[#2C2420]"
              }`}>
                {/* Status Bar */}
                <div className={`h-9 flex items-end justify-between px-5 pb-1 text-[11px] font-bold ${
                  pov === "owner" ? "text-white/80" : "text-[#1B1410]"
                }`}>
                  <img src="/snepr-logo.png" alt="Snepr" className="h-4.5 w-auto object-contain rounded" />
                  <span>5G · 100%</span>
                </div>

                {/* Laser QR Scanner Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-[#110B08]/95 z-50 flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-40 h-40 border-2 border-[#C8993E] rounded-2xl relative overflow-hidden mb-4 shadow-[0_0_20px_rgba(200,153,62,0.3)]">
                      <div className="absolute inset-x-0 h-0.5 bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] animate-bounce" />
                      <QrCode className="w-full h-full text-white/40 p-4" />
                    </div>
                    <div className="font-bold text-[14px] text-[#C8993E]">Scanning Pass...</div>
                    <div className="text-[12px] text-white/70 mt-1">Align customer ticket QR in frame</div>
                  </div>
                )}

                {/* Phone Scroll Content */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  {pov === "customer" ? (
                    dockTab === "explore" ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <div className="text-[10.5px] text-[#6E6159]">Saheed Nagar, Bhubaneswar</div>
                            <h4 className="font-bold text-[15px] text-[#1B1410]">Urban Blade Grooming Co.</h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF3E1] text-[#705217] font-bold text-[11px]">
                            Rs. {pointsBalance} Pts
                          </span>
                        </div>

                        {/* Chair Grid */}
                        <div className="grid grid-cols-3 gap-1.5 my-2">
                          <div className={`border rounded-xl p-2 text-center text-[10.5px] ${
                            chairs[0].status === "free" ? "bg-[#EBF7EE] border-[#BBE1C8] text-[#1C5434] font-bold" : "bg-[#FFF8EE] border-[#ECD9BE] text-[#8C5512]"
                          }`}>
                            <b>Chair 1</b><br />{chairs[0].token || "Free"}
                          </div>
                          <div className="border border-[#ECD9BE] bg-[#FFF8EE] text-[#8C5512] rounded-xl p-2 text-center text-[10.5px]">
                            <b>Chair 2</b><br />{chairs[1].token || "Free"}
                          </div>
                          <div className="border border-[#BBE1C8] bg-[#EBF7EE] text-[#1C5434] font-bold rounded-xl p-2 text-center text-[10.5px]">
                            <b>Chair 3</b><br />Free Now
                          </div>
                        </div>

                        {/* Services Card */}
                        <div className="bg-white border border-[#E8E1D7] rounded-2xl p-3 shadow-sm">
                          <div className="text-[11px] font-bold text-[#1B1410] uppercase mb-2">Service Menu</div>
                          <div className="flex justify-between items-center py-1.5 border-b border-[#E8E1D7] text-[12px]">
                            <div>
                              <b className="block text-[#1B1410]">Signature Fade & Wash</b>
                              <span className="text-[10px] text-[#6E6159]">25 mins · Master cut</span>
                            </div>
                            <span className="font-bold text-[#1B1410]">Rs. 350</span>
                          </div>

                          <div className="flex justify-between items-center py-1.5 text-[12px]">
                            <div>
                              <b className="block text-[#1B1410]">Beard Sculpt & Lineup</b>
                              <span className="text-[10px] text-[#6E6159]">15 mins · Hot towel</span>
                            </div>
                            <span className="font-bold text-[#1B1410]">Rs. 180</span>
                          </div>

                          <button
                            onClick={handleBook}
                            className="w-full mt-3 py-2.5 rounded-full bg-[#8A4C24] hover:bg-[#733E1D] text-white font-bold text-[13px] shadow-sm transition-all"
                          >
                            Take Live Token #B-15 (~11m wait)
                          </button>
                        </div>
                      </div>
                    ) : dockTab === "pass" ? (
                      <div className="bg-white border border-[#E8E1D7] rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#1C5434] font-bold text-[11px] inline-block mb-1">
                            Live Token Pass
                          </span>
                          <div className="text-[11px] text-[#6E6159] uppercase">Urban Blade Grooming Co.</div>
                          <div className="text-4xl font-bold text-[#1B1410] my-1">{activeToken}</div>
                          <div className="text-[13px] font-bold text-[#8A4C24]">
                            {isCustomerInChair ? "You are in chair service!" : `Estimated Wait: ${estWaitMinutes} mins`}
                          </div>
                          <div className="text-[11px] text-[#6E6159] mt-1">
                            Stylist: <b>Chair 1 (Rajesh Kumar)</b>
                          </div>
                        </div>

                        <div className="border-t-2 border-dashed border-[#D6CEC3] mx-3 my-1" />

                        <div className="bg-[#F5EFEB] p-4 text-center">
                          <div className="w-24 h-24 bg-white border border-[#1B1410] rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                            <QrCode className="w-full h-full text-[#1B1410]" />
                          </div>
                          <div className="text-[11px] text-[#6E6159] mt-2">Scan at counter upon arrival</div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={handleDelay}
                              className="flex-1 py-1.5 rounded-full border border-[#E8E1D7] bg-white text-[11px] font-bold text-[#1B1410]"
                            >
                              Delay 10m
                            </button>
                            <button
                              onClick={handleArrived}
                              className="flex-1 py-1.5 rounded-full bg-[#8A4C24] text-white text-[11px] font-bold"
                            >
                              {hasArrived ? "Arrival Notified" : "I've Arrived"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-[#E8E1D7] rounded-2xl p-4 shadow-sm text-center">
                        <div className="text-[11px] text-[#6E6159] uppercase">Snepr Points Wallet</div>
                        <div className="text-3xl font-bold text-[#C8993E] my-1">{pointsBalance} Pts</div>
                        <div className="text-[12px] text-[#6E6159] mb-4">Worth Rs. {pointsBalance} discount on next bill</div>

                        <div className="border-t border-[#E8E1D7] pt-3 text-left">
                          <div className="text-[12px] font-bold text-[#1B1410]">Rate Visit at Urban Blade</div>
                          <div className="text-[11px] text-[#705217] font-semibold mb-2">+10 Pts on ANY rating (1 to 5 stars)</div>
                          <div className="flex justify-center gap-2 mb-3 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} type="button" onClick={() => handleRateStar(s)} className="p-0.5 hover:scale-110 transition-transform">
                                <Star className="w-5 h-5 fill-[#C8993E] text-[#C8993E]" />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={handleSubmitReview}
                            className="w-full py-2 rounded-full bg-[#1B1410] text-white font-bold text-[12px]"
                          >
                            Submit Verified Review (+10 Pts)
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    /* SALONOS DESK */
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-[#C8993E] uppercase font-bold">Counter 1 · Desk</div>
                          <h4 className="font-bold text-[14px] text-white">SalonOS Chair Kanban</h4>
                        </div>
                        <button
                          onClick={handleScanQR}
                          className="px-2.5 py-1 rounded-full bg-[#C8993E] text-[#1B1410] font-bold text-[11px]"
                        >
                          Scan QR Pass
                        </button>
                      </div>

                      {/* Chair 1 Active Card */}
                      <div className="bg-[#2C1E17] border border-white/10 rounded-2xl p-3">
                        <div className="flex justify-between items-center text-[12px]">
                          <b className="text-[#C8993E]">Chair 1 (Rajesh Kumar)</b>
                          <span className="px-2 py-0.5 rounded-full bg-[#4ADE80] text-[#0F2916] text-[10.5px] font-bold">
                            Serving {chairs[0].token || "Free"}
                          </span>
                        </div>
                        <div className="text-[11px] text-white/70 my-2">
                          Customer: {chairs[0].token === "#B-15" ? "Rahul Sharma (You)" : "Amit Patel (Fade)"}
                        </div>
                        <button
                          onClick={handleOwnerCallNext}
                          className="w-full py-2 rounded-full bg-[#8A4C24] hover:bg-[#733E1D] text-white font-bold text-[12px]"
                        >
                          Complete & Call Next ({waitingQueue[0]?.token || "#B-16"})
                        </button>
                      </div>

                      {/* Queue List */}
                      <div className="bg-[#241913] border border-white/10 rounded-2xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <b className="text-[12px] text-white">Waiting Line ({waitingQueue.length})</b>
                          <button onClick={handleAddWalkIn} className="text-[11px] text-[#C8993E] font-bold">
                            + Walk-In
                          </button>
                        </div>

                        {waitingQueue.map((item) => (
                          <div key={item.token} className="flex justify-between items-center py-1.5 border-b border-white/5 text-[11px]">
                            <div>
                              <b className="text-white">{item.token} · {item.name}</b>
                              <div className={item.arrived ? "text-[#4ADE80]" : "text-white/50"}>
                                {item.arrived ? "Arrived at salon" : "In transit (~5m)"}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setChairs((prev) => [{ ...prev[0], token: item.token }, prev[1], prev[2]]);
                                setWaitingQueue((prev) => prev.filter((q) => q.token !== item.token));
                                if (item.token === "#B-15") setIsCustomerInChair(true);
                                toast.success(`${item.token} seated in Chair 1.`);
                              }}
                              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[10px]"
                            >
                              Seat
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dock Navbar */}
                <div className="grid grid-cols-5 items-center bg-white/90 backdrop-blur-md border border-white/95 rounded-[28px] mx-2 mb-2 p-1 shadow-md text-center">
                  <div
                    onClick={() => { setPov("customer"); setDockTab("explore"); }}
                    className={`py-1 cursor-pointer text-[10px] font-bold ${
                      pov === "customer" && dockTab === "explore" ? "text-[#1B1410]" : "text-[#9C9089]"
                    }`}
                  >
                    Explore
                  </div>
                  <div
                    onClick={() => { setPov("customer"); setDockTab("studio"); }}
                    className={`py-1 cursor-pointer text-[10px] font-bold ${
                      pov === "customer" && dockTab === "studio" ? "text-[#1B1410]" : "text-[#9C9089]"
                    }`}
                  >
                    Studio
                  </div>
                  <div
                    onClick={() => { setPov("customer"); setDockTab("pass"); }}
                    className="cursor-pointer -mt-4 flex flex-col items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#8A4C24] text-white flex items-center justify-center shadow-md relative">
                      <Ticket className="w-5 h-5" />
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] absolute top-1 right-1 animate-ping" />
                    </div>
                    <span className="text-[9px] font-bold text-[#1B1410] mt-0.5">Pass</span>
                  </div>
                  <div
                    onClick={() => { setPov("customer"); setDockTab("points"); }}
                    className={`py-1 cursor-pointer text-[10px] font-bold ${
                      pov === "customer" && dockTab === "points" ? "text-[#1B1410]" : "text-[#9C9089]"
                    }`}
                  >
                    Points
                  </div>
                  <div
                    onClick={() => { setPov("owner"); setDockTab("desk"); }}
                    className={`py-1 cursor-pointer text-[10px] font-bold ${
                      pov === "owner" ? "text-[#1B1410]" : "text-[#9C9089]"
                    }`}
                  >
                    Desk
                  </div>
                </div>
              </div>
            </div>
          </Tilt3D>
          </div>
        </div>
      </div>
    </section>
  );
}
