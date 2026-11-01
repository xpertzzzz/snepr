with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Tilt 2 opening
old_tilt2 = """          {/* TIER 2: INTERMEDIATE PLAN (FEATURED / MOST POPULAR) */}
          <Tilt3D maxAngle={5} scale={1.025} glare={true} className="flex flex-col h-full rounded-[36px]">"""

new_tilt2 = """          {/* TIER 2: INTERMEDIATE PLAN (FEATURED / MOST POPULAR) */}
          <ScrollCardReveal delay={0.22} direction="scale" className="flex flex-col h-full rounded-[36px]">
          <Tilt3D maxAngle={5} scale={1.025} glare={true} className="flex flex-col h-full rounded-[36px]">"""

text = text.replace(old_tilt2, new_tilt2)

# Fix Tilt 4 (ROI calculator) opening
old_tilt4 = """        {/* ??? INTERACTIVE COMMISSION ROI CALCULATOR ??? */}
        <div className="mt-20">
          <Tilt3D maxAngle={3} scale={1.01} glare={false} className="rounded-[40px]">"""

new_tilt4 = """        {/* ??? INTERACTIVE COMMISSION ROI CALCULATOR ??? */}
        <div className="mt-20">
          <ScrollCardReveal delay={0.15} direction="up" className="rounded-[40px]">
          <Tilt3D maxAngle={3} scale={1.01} glare={false} className="rounded-[40px]">"""

text = text.replace(old_tilt4, new_tilt4)

with open('src/components/snepr/PricingSection.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated PricingSection.tsx")

