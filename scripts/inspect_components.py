import os

components = [
    'src/components/snepr/PillarsSection.tsx',
    'src/components/snepr/PricingSection.tsx',
    'src/components/snepr/InteractivePhoneSimulator.tsx',
    'src/components/snepr/AiStudioShowcase.tsx',
    'src/components/snepr/FaqSection.tsx',
    'src/components/ui/ParallaxLayer.tsx'
]

for c in components:
    if os.path.exists(c):
        print(f"=== {c} ===")
        with open(c, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            print(f"Total lines: {len(lines)}")
            for l in lines[:15]:
                print("  ", l, end='')

