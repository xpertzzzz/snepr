with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines 420-440:")
for i in range(419, 440):
    l = lines[i].encode('ascii', errors='replace').decode('ascii')
    print(f"{i+1}: {l}", end='')

print("\nLines 480-end:")
for i in range(479, len(lines)):
    l = lines[i].encode('ascii', errors='replace').decode('ascii')
    print(f"{i+1}: {l}", end='')

