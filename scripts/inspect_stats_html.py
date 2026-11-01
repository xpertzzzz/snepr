with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('<div class="hero-stats">')
if pos != -1:
    print(text[pos:pos+500])

