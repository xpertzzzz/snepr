with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(420, 440):
    l = lines[i].encode('ascii', errors='replace').decode('ascii')
    print(f"{i+1}: {l}", end='')

