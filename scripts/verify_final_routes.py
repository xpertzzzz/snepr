import sys, urllib.request
sys.stdout.reconfigure(encoding='utf-8')

routes_to_test = [
    ("/", "Homepage"),
    ("/explore", "Salon discovery"),
    ("/live", "Live salon queues"),
    ("/salon/the-scissors-edge", "Salon profile slug: the-scissors-edge"),
    ("/salon/lakme-salon-patia", "Salon profile slug: lakme-salon-patia"),
    ("/queue/A07", "Customer queue tracking token: A07"),
    ("/queue/104", "Customer queue tracking token: 104"),
    ("/how-it-works", "How Snepr works"),
    ("/ai-studio", "AI hairstyle discovery"),
    ("/salonos", "SalonOS product page"),
    ("/pricing", "SalonOS pricing"),
    ("/register-salon", "Salon registration"),
    ("/login", "Authentication (Single login page for all roles)"),
    ("/dashboard", "Customer dashboard"),
    ("/account", "Customer profile"),
    ("/points", "Snepr points and rewards"),
    ("/salonos/dashboard", "SalonOS management dashboard"),
    ("/salonos/queue", "SalonOS live queue management"),
    ("/salonos/chairs", "SalonOS chair and staff management"),
    ("/salonos/services", "SalonOS service management"),
    ("/salonos/customers", "SalonOS customer management"),
    ("/salonos/analytics", "SalonOS analytics"),
    ("/salonos/settings", "SalonOS settings"),
    ("/staff/dashboard", "Staff dashboard"),
    ("/staff", "Staff desk alias"),
    ("/ankom/", "Private Admin Console"),
]

print("=== TESTING COMPLETE SNEPR ROUTE ARCHITECTURE ===")
success_count = 0
for route, desc in routes_to_test:
    url = f"http://localhost:3000{route}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as res:
            if res.status == 200:
                print(f"[OK 200] {route.ljust(30)} -> {desc}")
                success_count += 1
            else:
                print(f"[FAIL {res.status}] {route.ljust(30)} -> {desc}")
    except Exception as e:
        print(f"[ERROR] {route.ljust(30)} -> {desc} ({e})")

print(f"\nResult: {success_count} / {len(routes_to_test)} routes verified with HTTP 200 OK!")
