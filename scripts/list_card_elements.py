with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find sections and inspect their HTML
sections = re.findall(r'<section[\s\S]*?</section>', text)
for i, s in enumerate(sections):
    print(f"--- Section {i+1} ---")
    cards = re.findall(r'class=["\']([^"\']*(?:card|stat|step|price|pillar|preview|feature|faq)[^"\']*)["\']', s)
    print("Found elements with classes:", list(set(cards)))

