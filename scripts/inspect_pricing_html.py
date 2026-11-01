with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="pricing"')
s = text[pos:pos+2000].encode('ascii', errors='replace').decode('ascii')
print(s)
