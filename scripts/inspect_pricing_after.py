with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="pricing"')
pos2 = text.find('</section>', pos)
s = text[pos+1800:pos2+10].encode('ascii', errors='replace').decode('ascii')
print(s)

