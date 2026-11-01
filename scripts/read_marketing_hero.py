with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos_hero = text.find('function Hero()')
pos_how = text.find('function HowItWorks()')
print("Hero pos:", pos_hero, "How pos:", pos_how)
if pos_hero != -1:
    print(text[pos_hero:pos_hero+1400])

