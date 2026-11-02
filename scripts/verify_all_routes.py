import urllib.request

routes = [
    "/",
    "/explore",
    "/live",
    "/salon/the-scissors-edge",
    "/salon/lakme-salon-patia",
    "/queue/A07",
    "/how-it-works",
    "/ai-studio",
    "/salonos",
    "/pricing",
    "/register-salon",
    "/login",
    "/dashboard",
    "/account",
    "/points",
    "/salonos/dashboard",
    "/salonos/queue",
    "/salonos/chairs",
    "/salonos/services",
    "/salonos/customers",
    "/salonos/analytics",
    "/salonos/settings",
]

all_passed = True
for r in routes:
    url = f"http://localhost:3000{r}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                print(f"[OK 200] {r}")
            else:
                print(f"[FAIL {resp.status}] {r}")
                all_passed = False
    except Exception as e:
        print(f"[ERROR] {r} -> {e}")
        all_passed = False

if all_passed:
    print("\nALL 22 ROUTES SUCCESSFULLY RESPONDED WITH HTTP 200!")
else:
    print("\nSome routes failed.")
