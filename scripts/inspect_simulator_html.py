with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="interactive-simulator"')
print("Simulator section HTML:")
print(text[pos:pos+1200])

