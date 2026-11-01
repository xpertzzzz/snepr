with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find style section in head
m = re.search(r'<style>([\s\S]*?)</style>', text)
if m:
    css = m.group(1)
    print(f"CSS length: {len(css)} chars")
    # check pillar-card and price-card
    for rule in re.finditer(r'(\.(?:pillar-card|price-card|step-item|faq-item|hero-preview-leaf|phone-frame)[^{]*\{[^}]+\})', css):
        print(rule.group(1)[:120].strip().replace('\n', ' '))
        print('---')

