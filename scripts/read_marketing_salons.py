with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos_salon = text.find('salons.map')
print("Salons map pos:", pos_salon)
if pos_salon != -1:
    print(text[pos_salon-100:pos_salon+600])

