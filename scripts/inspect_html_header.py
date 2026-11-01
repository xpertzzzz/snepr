with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('<header')
if pos != -1:
    print(text[pos:pos+1000].encode('ascii', errors='replace').decode('ascii'))

