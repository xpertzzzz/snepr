import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add servicesList and customersList state right after showWalkInModal state
needle = '  const [showInviteModal, setShowInviteModal] = useState(false);'
addition = '''  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Services State
  const [servicesList, setServicesList] = useState([
    { id: 1, name: "Signature Haircut & Styling", price: 280, durationMins: 30, category: "Hair", isActive: true },
    { id: 2, name: "Beard Sculpt & Razor Finish", price: 150, durationMins: 15, category: "Beard", isActive: true },
    { id: 3, name: "Deep Nourishing Hair Spa", price: 650, durationMins: 45, category: "Spa", isActive: true },
    { id: 4, name: "Charcoal Face Clean-up", price: 400, durationMins: 30, category: "Skin", isActive: true },
    { id: 5, name: "Hot Towel Shave & Oil Massage", price: 200, durationMins: 20, category: "Grooming", isActive: true },
  ]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30");
  const [newServiceCategory, setNewServiceCategory] = useState("Hair");

  // Customers State
  const [customerSearch, setCustomerSearch] = useState("");
  const [customersList, setCustomersList] = useState([
    { id: 1, name: "Rohan Patel", phone: "+91 94370 11223", totalVisits: 5, lastVisit: "Today", loyaltyPoints: 50, favoriteService: "Haircut" },
    { id: 2, name: "Aman Sharma", phone: "+91 98610 22334", totalVisits: 8, lastVisit: "Today", loyaltyPoints: 80, favoriteService: "Beard trim" },
    { id: 3, name: "Priya Das", phone: "+91 99370 33445", totalVisits: 3, lastVisit: "Today", loyaltyPoints: 30, favoriteService: "Hair Styling" },
    { id: 4, name: "Subhashree Ray", phone: "+91 98532 99881", totalVisits: 6, lastVisit: "2 days ago", loyaltyPoints: 60, favoriteService: "Haircut + Facial" },
    { id: 5, name: "Debabrata Dash", phone: "+91 94380 55432", totalVisits: 11, lastVisit: "Yesterday", loyaltyPoints: 110, favoriteService: "Signature Haircut" },
  ]);'''

if needle in code and 'servicesList' not in code:
    code = code.replace(needle, addition, 1)
    print("Added servicesList and customersList state")

# 2. Add handleAddService
service_needle = '  const handleInviteStaff = (e: React.FormEvent) => {'
service_func = '''  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) {
      toast.error("Please enter service name and price.");
      return;
    }
    const newSvc = {
      id: Date.now(),
      name: newServiceName.trim(),
      price: parseInt(newServicePrice, 10) || 200,
      durationMins: parseInt(newServiceDuration, 10) || 30,
      category: newServiceCategory,
      isActive: true,
    };
    setServicesList([...servicesList, newSvc]);
    setNewServiceName("");
    setNewServicePrice("");
    toast.success(`Service "${newSvc.name}" added to menu!`);
  };

  const handleInviteStaff = (e: React.FormEvent) => {'''

if service_needle in code and 'handleAddService' not in code:
    code = code.replace(service_needle, service_func, 1)
    print("Added handleAddService handler")

# 3. Update sidebar navigation items
old_sidebar_nav = '''            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Armchair className="w-4 h-4 text-[#70472F]" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("staff")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "staff"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Users className="w-4 h-4 text-[#70472F]" />
                <span>Staff</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#70472F]" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Store className="w-4 h-4 text-[#70472F]" />
                <span>Profile & Plans</span>
              </button>
            </nav>'''

new_sidebar_nav = '''            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab("overview"); navigate({ to: "/salonos/dashboard" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Armchair className="w-4 h-4 text-[#70472F]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab("queue"); navigate({ to: "/salonos/queue" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "queue"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Clock className="w-4 h-4 text-[#70472F]" />
                <span>Live Queue</span>
              </button>

              <button
                onClick={() => { setActiveTab("chairs"); navigate({ to: "/salonos/chairs" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "chairs" || activeTab === "staff"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Users className="w-4 h-4 text-[#70472F]" />
                <span>Chairs & Staff</span>
              </button>

              <button
                onClick={() => { setActiveTab("services"); navigate({ to: "/salonos/services" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "services"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Scissors className="w-4 h-4 text-[#70472F]" />
                <span>Services</span>
              </button>

              <button
                onClick={() => { setActiveTab("customers"); navigate({ to: "/salonos/customers" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "customers"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#70472F]" />
                <span>Customers</span>
              </button>

              <button
                onClick={() => { setActiveTab("analytics"); navigate({ to: "/salonos/analytics" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#70472F]" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => { setActiveTab("settings"); navigate({ to: "/salonos/settings" }); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "settings" || activeTab === "profile"
                    ? "bg-[#FFFDF9] text-[#70472F] shadow-sm border border-[#EEE5DA]"
                    : "text-[#78695C] hover:bg-[#FFFDF9]/60 hover:text-[#211912]"
                }`}
              >
                <Settings className="w-4 h-4 text-[#70472F]" />
                <span>Settings & Plans</span>
              </button>
            </nav>'''

if old_sidebar_nav in code:
    code = code.replace(old_sidebar_nav, new_sidebar_nav, 1)
    print("Updated sidebar navigation with all 7 tabs")

with open('src/components/salon/SalonOSWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Updated SalonOSWorkspace.tsx successfully")
