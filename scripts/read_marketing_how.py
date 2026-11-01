with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos_hq = text.find('function HeroQueueCard()')
pos_how = text.find('function HowItWorks()')
print("HeroQueueCard pos:", pos_hq, "HowItWorks pos:", pos_how)
if pos_how != -1:
    print(text[pos_how:pos_how+2200])

