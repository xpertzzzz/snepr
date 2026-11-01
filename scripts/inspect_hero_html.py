with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('class="hero-stats"')
print("Hero stats HTML:")
print(text[pos1-100:pos1+700])

