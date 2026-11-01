with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.rfind('Frequently Asked Questions')
print(text[pos:pos+1500])

