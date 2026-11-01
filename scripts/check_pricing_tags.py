with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's count occurrences of ScrollCardReveal opening vs closing
open_count = text.count('<ScrollCardReveal')
close_count = text.count('</ScrollCardReveal>')
print(f"ScrollCardReveal open: {open_count}, close: {close_count}")

tilt_open = text.count('<Tilt3D')
tilt_close = text.count('</Tilt3D>')
print(f"Tilt3D open: {tilt_open}, close: {tilt_close}")

