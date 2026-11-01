with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.snepr-logo-img')
print(text[pos-100:pos+300])

