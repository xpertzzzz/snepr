with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find all occurrences of Tilt3D
for i, m in enumerate(re.finditer(r'<Tilt3D[^>]*>', text)):
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 50)
    print(f"Tilt3D {i+1} context:")
    print(text[start:end])
    print('---')

