with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos2 = text.find('class="hero-preview-leaf"')
print("Hero preview leaf HTML:")
print(text[pos2:pos2+1200])

