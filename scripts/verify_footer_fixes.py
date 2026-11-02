import urllib.request

with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

with open('src/routes/_marketing/pricing.tsx', 'r', encoding='utf-8') as f:
    pricing = f.read()

# 1. Check footer uses transparent logo
assert 'foot-brand' in home and '/snepr-logo-transparent.png' in home, "Home footer missing transparent logo"
assert 'foot-brand' in pricing and '/snepr-logo-transparent.png' in pricing, "Pricing footer missing transparent logo"

# 2. Check Instagram handle is sneprofficial
assert 'https://www.instagram.com/sneprofficial/' in home, "Home missing instagram.com/sneprofficial/"
assert 'https://www.instagram.com/sneprofficial/' in pricing, "Pricing missing instagram.com/sneprofficial/"
assert 'Follow @sneprofficial' in home, "Home missing Follow @sneprofficial text"
assert 'Follow @sneprofficial' in pricing, "Pricing missing Follow @sneprofficial text"

# 3. Check "Technologies Inc." is removed, keeping only Snepr
assert 'Technologies Inc' not in home, "Home still contains Technologies Inc"
assert 'Technologies Inc' not in pricing, "Pricing still contains Technologies Inc"
assert '© 2026 Snepr | Bhubaneswar, Odisha' in home, "Home copyright format mismatch"
assert '© 2026 Snepr | Bhubaneswar, Odisha' in pricing, "Pricing copyright format mismatch"

# 4. Check localhost responses
for path in ['/', '/pricing', '/snepr-logo-transparent.png']:
    url = 'http://localhost:3000' + path
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"{url} returned status {resp.status}"

print("✓ All Footer, Logo, Instagram, and Copyright Assertions PASSED!")

