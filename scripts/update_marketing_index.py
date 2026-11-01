with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add imports
if 'ScrollCardReveal' not in text:
    text = text.replace(
        'import { Tilt3D } from "@/components/ui/Tilt3D";',
        'import { Tilt3D } from "@/components/ui/Tilt3D";\nimport { ScrollCardReveal, AnimatedNumber } from "@/components/ui/ScrollCardReveal";'
    )

# 2. Wrap HeroQueueCard
old_hq_call = '<HeroQueueCard />'
new_hq_call = '<ScrollCardReveal delay={0.15} direction="right"><HeroQueueCard /></ScrollCardReveal>'
text = text.replace(old_hq_call, new_hq_call)

# 3. Wrap HowItWorks steps
old_how_map = """        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Tilt3D key={s.n} maxAngle={5} scale={1.02} glare={true} className="rounded-3xl">"""

new_how_map = """        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, idx) => (
            <ScrollCardReveal
              key={s.n}
              delay={idx * 0.14}
              direction={idx === 0 ? "left" : idx === 1 ? "up" : "right"}
              className="rounded-3xl"
            >
              <Tilt3D maxAngle={5} scale={1.02} glare={true} className="rounded-3xl">"""

text = text.replace(old_how_map, new_how_map)

# close ScrollCardReveal in HowItWorks
pos_how_close = text.find('</Tilt3D>\n          ))}')
if pos_how_close != -1:
    text = text[:pos_how_close+9] + "\n            </ScrollCardReveal>" + text[pos_how_close+9:]
else:
    # Try alternate spacing
    text = text.replace('</Tilt3D>\n          ))}', '</Tilt3D>\n            </ScrollCardReveal>\n          ))}')

# 4. Wrap InteractivePhoneSimulator in main
old_sim = '<InteractivePhoneSimulator />'
new_sim = '<ScrollCardReveal delay={0.1} direction="up"><InteractivePhoneSimulator /></ScrollCardReveal>'
text = text.replace(old_sim, new_sim)

with open('src/routes/_marketing/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated src/routes/_marketing/index.tsx successfully!")

