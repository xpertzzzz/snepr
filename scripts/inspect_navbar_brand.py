with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('BRAND LOGO')
print(text[pos-50:pos+400].encode('ascii', errors='replace').decode('ascii'))
