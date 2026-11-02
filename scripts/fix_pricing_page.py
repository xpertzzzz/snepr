with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Normalize CRLF
c_norm = c.replace('\r\n', '\n')

old_toggle = """          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-white border border-[#E8E1D7] rounded-full shadow-sm gap-1">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-[13.5px] font-bold transition-all border-0 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#1B1410] text-white shadow-sm"
                  : "bg-transparent text-[#6E6159] hover:text-[#1B1410]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-[13.5px] font-bold transition-all border-0 cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#8A4C24] text-white shadow-sm"
                  : "bg-transparent text-[#6E6159] hover:text-[#8A4C24]"
              }`}
            >
              <span>Annual Billing</span>
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                billingCycle === "annual" ? "bg-white/20 text-white" : "bg-[#FAF3E1] text-[#705217]"
              }`}>
                Save 15%
              </span>
            </button>
          </div>"""

new_toggle = """          {/* Billing Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E1D7",
              borderRadius: "9999px",
              padding: "6px 8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              marginTop: "28px",
            }}
          >
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              style={{
                backgroundColor: billingCycle === "monthly" ? "#1B1410" : "transparent",
                color: billingCycle === "monthly" ? "#FFFFFF" : "#6E6159",
                padding: "8px 20px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "13.5px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: billingCycle === "annual" ? "#8A4C24" : "transparent",
                color: billingCycle === "annual" ? "#FFFFFF" : "#6E6159",
                padding: "8px 18px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "13.5px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  backgroundColor: billingCycle === "annual" ? "rgba(255,255,255,0.22)" : "#FAF3E1",
                  color: billingCycle === "annual" ? "#FFFFFF" : "#705217",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                Save 15%
              </span>
            </button>
          </div>"""

c_norm = c_norm.replace('className="px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28 bg-[#FAF7F2] text-[#2C2420] relative overflow-hidden"', 'className="px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-28 bg-[#FAF7F2] text-[#2C2420] relative overflow-hidden"')

if old_toggle in c_norm:
    c_norm = c_norm.replace(old_toggle, new_toggle)
    print("Replaced toggle successfully!")
else:
    print("WARNING: old_toggle not matched exactly")

with open('src/components/snepr/PricingSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

