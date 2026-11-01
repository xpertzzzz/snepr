with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find CSS for cards
css_cards = re.findall(r'(\.[a-zA-Z0-9_\-]*card[a-zA-Z0-9_\-]*\s*\{[^}]+\})', text)
print(f"Found {len(css_cards)} CSS card rules:")
for c in css_cards[:10]:
    print(c[:120].strip().replace('\n', ' '))
    print('---')

