with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos_hero = text.find('function Hero()')
print(text[pos_hero+1400:pos_hero+3200])

