import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app-customer ui.html', 'r', encoding='utf-8') as f:
    customer_html = f.read()

with open('app-owner-snepros ui.html', 'r', encoding='utf-8') as f:
    owner_html = f.read()

print("--- APP CUSTOMER UI STRUCTURE ---")
screens = re.findall(r'<div[^>]*id="([^"]*view[^"]*|[^"]*screen[^"]*|[^"]*tab[^"]*)"[^>]*>', customer_html)
print("Customer views/screens:", screens)

m = re.search(r'<div class="queue-banner".*?</div>\s*</div>\s*</div>', customer_html, re.DOTALL)
if m:
    print("Found queue-banner snippet:")
    print(m.group(0)[:1200])

print("\n--- APP OWNER SNEPROS UI STRUCTURE ---")
owner_chairs = re.search(r'<div class="chairs".*?</div>\s*</div>', owner_html, re.DOTALL)
if owner_chairs:
    print("Found owner chairs snippet:")
    print(owner_chairs.group(0)[:1200])
