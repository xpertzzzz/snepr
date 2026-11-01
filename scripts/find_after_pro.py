with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos_pro = text.find('{/* TIER 3:')
print(text[pos_pro+4500:pos_pro+5500])

