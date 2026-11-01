with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace double </ScrollCardReveal>
text = text.replace(
    '</Tilt3D>\n          </ScrollCardReveal>\n          </ScrollCardReveal>',
    '</Tilt3D>\n          </ScrollCardReveal>'
)

with open('src/components/snepr/PricingSection.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Removed extra closing tag.")

