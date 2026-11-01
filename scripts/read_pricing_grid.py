with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('mt-14 grid gap-8 lg:grid-cols-3')
print(text[pos-100:pos+1200])

