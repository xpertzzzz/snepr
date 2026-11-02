import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request

with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

with open('src/routes/_marketing/pricing.tsx', 'r', encoding='utf-8') as f:
    pricing = f.read()

# 1. Navigation
assert 'href="#discover"' in home, "Missing explore link to #discover"
assert 'href="/pricing"' in home, "Missing pricing link to /pricing"
assert 'href="/login"' in home, "Missing signin link to /login"
assert 'href="#how"' in home, "Missing how link to #how"
assert 'href="#ai"' in home, "Missing ai link to #ai"
assert 'href="#salons"' in home, "Missing salons link to #salons"

# 2. Hero Section
assert "Never wait in line" in home and "at a salon again" in home, "Hero headline mismatch"
assert "Discover salons across Bhubaneswar, check live chair availability and estimated waiting times, and join the queue before you arrive. Know before you go." in home, "Hero description mismatch"
assert "Find a salon near you" in home, "Primary CTA mismatch"
assert "Explore live queues" in home, "Secondary CTA mismatch"
assert "For salon owners | SalonOS" in home, "Tertiary CTA mismatch"
assert "Zero wait" not in home, "Found removed promise 'Zero wait'"
assert "Scroll to explore" not in home, "Found removed 'Scroll to explore'"

# 3. Scissor Animation
assert 'id="cutScene"' in home, "Missing cutScene"
assert 'id="hairPath"' in home, "Missing hairPath"
assert 'id="scissorRig"' in home, "Missing scissorRig"
assert 'id="bladeA"' in home, "Missing bladeA"
assert 'id="bladeB"' in home, "Missing bladeB"
assert "A little precision. A lot less waiting." in home, "Scissor copy mismatch"
assert "One smooth motion." in home and "A clean cut." in home, "Scissor headline mismatch"

# 4. Salon Discovery
assert "Find your salon. <em>Know the wait.</em>" in home, "Heading mismatch"
assert "searchQuery" in home, "Missing search logic"
assert "selectedLocality" in home, "Missing locality filter"
assert "handleLocate" in home, "Missing geolocation"
assert "handleJoinQueue" in home, "Missing join queue action"

# 5. Customer Demo & SalonOS Demo
assert "handleGenerateNewToken" in home, "Missing generate new token handler"
assert "handleSimulateBarberCall" in home, "Missing simulate barber call handler"
assert "handleDeskCallNextToken" in home, "Missing desk call next token handler"
assert "INTERACTIVE DEMO PREVIEW" in home, "Missing demo label"

# 6. How it Works
assert "01" in home and "Check the wait" in home, "Step 1 mismatch"
assert "02" in home and "Save your place" in home, "Step 2 mismatch"
assert "03" in home and "Walk straight in" in home, "Step 3 mismatch"

# 7. AI Studio
assert "Coming Soon | Concept Preview" in home, "AI Studio not labeled as coming soon"
assert "waitlistSubmitted" in home, "Missing waitlist submission state"

# 8. For Salons & SalonOS
assert "Zero commission" in home or "zero commission" in home, "Missing zero commission positioning"
assert "calc-grid" not in home, "Calculator should NOT be on homepage"
assert "calc-grid" in pricing, "Calculator should be on /pricing"

# 9. Points & Reviews
assert "Points Rewards Example" in home, "Missing points rewards example"
assert "DEMO WALLET" not in home, "Found fake 'DEMO WALLET'"

# 10. FAQ
assert "Do I need to download an app to join a queue?" in home, "FAQ 1 mismatch"
assert "How are live salon waiting times calculated?" in home, "FAQ 2 mismatch"
assert "Which areas of Bhubaneswar does Snepr cover?" in home, "FAQ 3 mismatch"
assert "How can salon owners list their salon on Snepr?" in home, "FAQ 4 mismatch"
assert "How do I redeem Snepr Points for discounts?" in home, "FAQ 5 mismatch"

# 11. Final CTA
assert "Your time is worth" in home, "Missing final CTA headline"
assert "Find a salon near you" in home, "Missing final primary CTA"
assert "Register your salon" in home, "Missing final secondary CTA"

# 12. Footer
assert "/snepr-logo-transparent.png" in home, "Missing transparent logo in footer"
assert "instagram.com/sneprofficial" in home, "Missing real instagram link"
assert "Technologies Inc" not in home, "Found 'Technologies Inc'"
assert "© 2026 Snepr | Bhubaneswar, Odisha" in home, "Copyright mismatch"

# 13. Route availability check
for path in ['/', '/pricing']:
    url = f"http://localhost:3000{path}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Route {url} failed with {resp.status}"

print("ALL 13 IMPLEMENTATION CHECKLIST SECTIONS VERIFIED 100%!")
