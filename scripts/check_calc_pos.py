with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos_calc = text.find('Transparent Economics Calculator')
print("Calculator pos:", pos_calc)
print(text[pos_calc-200:pos_calc+100].encode('ascii', errors='replace').decode('ascii'))

