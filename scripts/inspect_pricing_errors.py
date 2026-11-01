with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines 230-250:")
for i in range(229, min(250, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')

print("\nLines 425-450:")
for i in range(424, min(450, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')

