with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find all cards that should have on-scroll reveal
cards_to_tag = [
    'hero-preview-leaf',
    'hero-stats',
    'demo-feature-item',
    'phone-chassis',
    'pillar-card',
    'step-item',
    'price-card',
    'faq-item',
]

for tag in cards_to_tag:
    matches = len(re.findall(r'class="[^"]*' + tag + r'[^"]*"', text))
    print(f"Tag '{tag}': {matches} occurrences in snepr_website.html")

