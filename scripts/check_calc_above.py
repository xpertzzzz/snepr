with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos_calc = text.find('Transparent Economics Calculator')
print(text[pos_calc-500:pos_calc].encode('ascii', errors='replace').decode('ascii'))

