with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# line 434 is index 433: '</ScrollCardReveal>\n'
if '</ScrollCardReveal>' in lines[433]:
    print("Found line 434:", repr(lines[433]))
    lines.pop(433)
    with open('src/components/snepr/PricingSection.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Popped line 434 successfully!")
else:
    for i in range(430, 438):
        print(i+1, repr(lines[i]))

