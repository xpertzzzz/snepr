with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('plans = [')
print(text[pos:pos+1500])

