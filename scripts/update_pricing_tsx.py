with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import
if 'ScrollCardReveal' not in text:
    text = text.replace(
        'import { Tilt3D } from "@/components/ui/Tilt3D";',
        'import { Tilt3D } from "@/components/ui/Tilt3D";\nimport { ScrollCardReveal } from "@/components/ui/ScrollCardReveal";'
    )

# 2. Wrap Tier 1
old_tier1 = """          {/* TIER 1: BASE PLAN */}
          <Tilt3D maxAngle={5} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">"""

new_tier1 = """          {/* TIER 1: BASE PLAN */}
          <ScrollCardReveal delay={0.08} direction="left" className="flex flex-col h-full rounded-[32px]">
          <Tilt3D maxAngle={5} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">"""

text = text.replace(old_tier1, new_tier1)

# Find closing of Tier 1 before Tier 2
pos_inter = text.find('{/* TIER 2: INTERMEDIATE PLAN')
# search backwards for </Tilt3D>
pos_close_tilt1 = text.rfind('</Tilt3D>', 0, pos_inter)
if pos_close_tilt1 != -1:
    text = text[:pos_close_tilt1+9] + "\n          </ScrollCardReveal>" + text[pos_close_tilt1+9:]

# 3. Wrap Tier 2
old_tier2 = """          {/* TIER 2: INTERMEDIATE PLAN (MOST POPULAR) */}
          <Tilt3D maxAngle={6} scale={1.03} glare={true} className="flex flex-col h-full rounded-[32px]">"""

new_tier2 = """          {/* TIER 2: INTERMEDIATE PLAN (MOST POPULAR) */}
          <ScrollCardReveal delay={0.22} direction="scale" className="flex flex-col h-full rounded-[32px]">
          <Tilt3D maxAngle={6} scale={1.03} glare={true} className="flex flex-col h-full rounded-[32px]">"""

text = text.replace(old_tier2, new_tier2)

# Find closing of Tier 2 before Tier 3
pos_pro = text.find('{/* TIER 3: PRO PLAN')
pos_close_tilt2 = text.rfind('</Tilt3D>', 0, pos_pro)
if pos_close_tilt2 != -1:
    text = text[:pos_close_tilt2+9] + "\n          </ScrollCardReveal>" + text[pos_close_tilt2+9:]

# 4. Wrap Tier 3
old_tier3 = """          {/* TIER 3: PRO PLAN */}
          <Tilt3D maxAngle={5} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">"""

new_tier3 = """          {/* TIER 3: PRO PLAN */}
          <ScrollCardReveal delay={0.36} direction="right" className="flex flex-col h-full rounded-[32px]">
          <Tilt3D maxAngle={5} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">"""

text = text.replace(old_tier3, new_tier3)

# Find closing of Tier 3 before ROI
pos_roi = text.find('{/* Interactive ROI Calculator Card')
pos_close_tilt3 = text.rfind('</Tilt3D>', 0, pos_roi)
if pos_close_tilt3 != -1:
    text = text[:pos_close_tilt3+9] + "\n          </ScrollCardReveal>" + text[pos_close_tilt3+9:]

# 5. Wrap ROI calculator
old_roi = """        {/* Interactive ROI Calculator Card */}
        <div className="mt-16 sm:mt-24">
          <Tilt3D maxAngle={3} scale={1.01} glare={true} className="rounded-[40px]">"""

new_roi = """        {/* Interactive ROI Calculator Card */}
        <div className="mt-16 sm:mt-24">
          <ScrollCardReveal delay={0.15} direction="up" className="rounded-[40px]">
          <Tilt3D maxAngle={3} scale={1.01} glare={true} className="rounded-[40px]">"""

text = text.replace(old_roi, new_roi)

pos_faq = text.find('{/* Frequently Asked Questions')
pos_close_roi = text.rfind('</Tilt3D>', 0, pos_faq)
if pos_close_roi != -1:
    text = text[:pos_close_roi+9] + "\n          </ScrollCardReveal>" + text[pos_close_roi+9:]

with open('src/components/snepr/PricingSection.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated PricingSection.tsx with ScrollCardReveal successfully!")

