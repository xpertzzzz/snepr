with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos_phone = text.find('<InteractivePhoneSimulator')
print("InteractivePhoneSimulator JSX pos:", pos_phone)
if pos_phone != -1:
    print(text[pos_phone-100:pos_phone+300])

