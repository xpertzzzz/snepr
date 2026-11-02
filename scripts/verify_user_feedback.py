import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

with open('src/routes/_marketing/pricing.tsx', 'r', encoding='utf-8') as f:
    pricing = f.read()

# 1. Step texts
assert "Check the wait" in home, "Missing 'Check the wait'"
assert "Save your chair" in home, "Missing 'Save your chair'"
assert "Walk straight in" in home, "Missing 'Walk straight in'"
assert "View live chair availability and estimated salon waiting times across Bhubaneswar before traveling" in home, "Missing step 1 desc"
assert "Select your haircut or groom service and join the digital queue directly from your phone" in home, "Missing step 2 desc"
assert "Track your token live on Snepr and step in right as your barber chair opens" in home, "Missing step 3 desc"

# 2. Check for unwanted hyphens in key phrases
assert "wait-free" not in home, "Found 'wait-free' with hyphen in home"
assert "real-time" not in home, "Found 'real-time' with hyphen in home"
assert "multi-chair" not in home, "Found 'multi-chair' with hyphen in home"
assert "no-commission" not in home, "Found 'no-commission' with hyphen in home"

# 3. Check footer logo
assert "snepr-logo-white-transparent.png" in home, "Missing white transparent logo in home footer"
assert "snepr-logo-white-transparent.png" in pricing, "Missing white transparent logo in pricing footer"

# 4. Check Instagram
assert "instagram.com/snepr.app" in home, "Missing real Instagram link in home"
assert "instagram.com/snepr.app" in pricing, "Missing real Instagram link in pricing"

# 5. Check mobile phone simulator UI
assert "mob-journey" in home, "Missing 5-stage mobile journey in Customer View"
assert "Chair 01" in home, "Missing Chair 01 in SalonOS Desk"
assert "Chair 02" in home, "Missing Chair 02 in SalonOS Desk"
assert "Chair 03" in home, "Missing Chair 03 in SalonOS Desk"
assert "Serving" in home or "SERVING" in home, "Missing Serving state"

# 6. Check Owner Cockpit Dashboard
assert "The Scissors Edge | Flagship Salon" in home, "Missing premium cockpit salon header"

print("✓ All 6 User Feedback & Quality Assertions PASSED!")
