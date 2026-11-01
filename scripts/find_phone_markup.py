with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('demo-phone-box')
if pos != -1:
    print(text[pos-20:pos+800].replace('\n', ' '))

