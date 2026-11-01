with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('price')
for m in re.finditer(r'<div[^>]*grid[^>]*>', text):
    print(m.group(0))

