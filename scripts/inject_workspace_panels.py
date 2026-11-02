import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Make profile tab also trigger for settings
code = code.replace(
    '{activeTab === "profile" && (',
    '{(activeTab === "profile" || activeTab === "settings") && (',
    1
)

# Make staff tab also trigger for chairs if chairs not separated
code = code.replace(
    '{activeTab === "staff" && (',
    '{(activeTab === "staff" || activeTab === "chairs") && (',
    1
)

# Add queue, services, customers tab panels before </main>
needle = '</main>'

tabs_markup = '''          {/* TAB: DEDICATED LIVE QUEUE MANAGEMENT */}
          {activeTab === "queue" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    CHAIR TELEMETRY & LIVE CALLING
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Live Queue Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    Advance tokens, call walk-ins to available chairs, and view queue progress for {salonName}.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCallNext}
                    className="px-4 py-2.5 rounded-xl bg-[#477B5D] hover:bg-[#38624A] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Call Next in Line</span>
                  </button>

                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#70472F] hover:bg-[#583724] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Walk-in</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-[#70472F] text-[#70472F] hover:bg-[#70472F] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Reception QR Standee</span>
                  </button>
                </div>
              </div>

              {/* Queue Table */}
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#211912]">Active Queue Pass List ({queues.length})</h3>
                  <span className="text-xs font-semibold text-[#477B5D] bg-[#EAF3EC] px-3 py-1 rounded-full">
                    ● Telemetry Sync Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EEE5DA] text-[#8C8074] font-bold text-[11px] uppercase tracking-wider">
                        <th className="pb-3 pl-2">Token</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Wait</th>
                        <th className="pb-3">Chair</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEE5DA]/60">
                      {queues.map((item) => {
                        const isServing = item.status === "SERVING";
                        const isWaiting = item.status === "WAITING";
                        return (
                          <tr key={item.id} className="hover:bg-[#F7F3ED]/40 transition-colors">
                            <td className="py-3.5 pl-2 font-serif font-black text-sm text-[#70472F]">
                              #{item.tokenNumber}
                            </td>
                            <td className="py-3.5 font-bold text-[#211912]">{item.customerName}</td>
                            <td className="py-3.5 text-[#8C8074]">{item.phone || "+91 94370 xxxxx"}</td>
                            <td className="py-3.5 font-medium text-[#211912]">{item.serviceName}</td>
                            <td className="py-3.5 text-[#8C8074]">
                              {isServing ? "Serving" : `~${item.waitTime}m`}
                            </td>
                            <td className="py-3.5 font-semibold text-[#70472F]">
                              {item.chairAssigned ? `Station ${item.chairAssigned}` : "Queue"}
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  isServing
                                    ? "bg-[#70472F] text-white"
                                    : isWaiting
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right pr-2">
                              {isWaiting && (
                                <button
                                  onClick={() => handleAdvanceQueue(item.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#477B5D] text-white text-[11px] font-bold hover:bg-[#38624A] mr-2"
                                >
                                  Call
                                </button>
                              )}
                              {isServing && (
                                <button
                                  onClick={() => handleCompleteQueue(item.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#70472F] text-white text-[11px] font-bold hover:bg-[#583724] mr-2"
                                >
                                  Complete (+10 pts)
                                </button>
                              )}
                              <button
                                onClick={() => handleCancelQueue(item.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-50"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEDICATED SERVICES MANAGEMENT */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    MENU & PRICING
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Service Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    Configure services, durations, and pricing displayed to customers on Snepr.
                  </p>
                </div>
              </div>

              {/* Add Service Form */}
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-[#211912] mb-4">Add New Salon Service</h3>
                <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Service name (e.g. Charcoal Detox Facial)"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Price in ₹ (e.g. 350)"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#70472F] text-white text-xs font-bold hover:bg-[#583724] transition-all cursor-pointer"
                    >
                      + Add to Menu
                    </button>
                  </div>
                </form>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesList.map((svc) => (
                  <div
                    key={svc.id}
                    className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-2xl p-5 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A8069]">
                        {svc.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#211912] mt-0.5">{svc.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#8C8074] mt-1">
                        <span>{svc.durationMins} mins duration</span>
                        <span>·</span>
                        <span className="font-bold text-[#70472F] text-sm">₹{svc.price}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DEDICATED CUSTOMERS MANAGEMENT */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEE5DA]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9A8069]">
                    CLIENT DIRECTORY & REPUTATION
                  </div>
                  <h1 className="text-2xl font-bold font-serif text-[#211912]">Customer Management</h1>
                  <p className="text-xs text-[#8C8074] mt-0.5">
                    View repeat clients, visit history, and loyalty points across {salonName}.
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-6 shadow-sm">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search client by name or phone number..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EEE5DA] bg-[#F7F3ED] text-xs font-semibold text-[#211912] focus:outline-none focus:border-[#70472F]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EEE5DA] text-[#8C8074] font-bold text-[11px] uppercase tracking-wider">
                        <th className="pb-3 pl-2">Customer</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Total Visits</th>
                        <th className="pb-3">Last Visit</th>
                        <th className="pb-3">Snepr Points</th>
                        <th className="pb-3">Preferred Service</th>
                        <th className="pb-3 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEE5DA]/60">
                      {customersList
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                            c.phone.includes(customerSearch)
                        )
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-[#F7F3ED]/40 transition-colors">
                            <td className="py-3 pl-2 font-bold text-[#211912]">{c.name}</td>
                            <td className="py-3 text-[#8C8074]">{c.phone}</td>
                            <td className="py-3 font-semibold text-[#70472F]">{c.totalVisits} visits</td>
                            <td className="py-3 text-[#8C8074]">{c.lastVisit}</td>
                            <td className="py-3 font-bold text-amber-700">+{c.loyaltyPoints} pts</td>
                            <td className="py-3 text-[#211912]">{c.favoriteService}</td>
                            <td className="py-3 text-right pr-2">
                              <button
                                onClick={() => {
                                  toast.success(`Priority token issued for ${c.name}!`);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#70472F] text-white text-[11px] font-bold hover:bg-[#583724]"
                              >
                                Issue Token
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABLETOP RECEPTION QR MODAL */}
          {showQrModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#FFFDF9] border border-[#EEE5DA] rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="p-1 rounded-full text-[#8C8074] hover:text-[#211912]"
                  >
                    ✕
                  </button>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#70472F]/10 text-[#70472F] text-[10px] font-extrabold uppercase tracking-wider">
                  OFFICIAL RECEPTION STANDEE
                </div>
                <h3 className="text-xl font-bold font-serif text-[#211912]">{salonName}</h3>
                <p className="text-xs text-[#8C8074]">
                  Place this standee at your reception counter. Walk-ins scan to join the live queue without downloading an app.
                </p>
                <div className="w-48 h-48 mx-auto bg-white border-2 border-[#70472F] rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-[11px] font-bold text-[#70472F]">SCAN TO JOIN QUEUE</div>
                  <div className="text-[9px] text-[#8C8074] mt-1">snepr.com/salon/{locality.split(",")[0].toLowerCase()}</div>
                </div>
                <button
                  onClick={() => {
                    toast.success("Reception standee PDF prepared for printing!");
                    setShowQrModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#70472F] text-white text-xs font-bold hover:bg-[#583724]"
                >
                  Print QR Standee PDF
                </button>
              </div>
            </div>
          )}
'''

if needle in code and 'DEDICATED LIVE QUEUE MANAGEMENT' not in code:
    code = code.replace(needle, tabs_markup + '\n' + needle, 1)
    print("Injected queue, services, customers, and QR standee tab panels")

with open('src/components/salon/SalonOSWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Updated SalonOSWorkspace.tsx tab content successfully")
