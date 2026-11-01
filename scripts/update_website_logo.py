with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Update --nav-h
text = text.replace('--nav-h: 70px;', '--nav-h: 82px;')

# Update logo CSS
old_logo_css = """.snepr-logo-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
}
.snepr-logo-img {
  height: 40px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 2px 6px rgba(27,20,16,0.12);
}"""

new_logo_css = """.snepr-logo-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0;
  margin: 0;
}
.snepr-logo-img {
  height: clamp(48px, 5.5vw, 62px);
  width: auto;
  border: none !important;
  outline: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  object-fit: contain;
  display: block;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.snepr-logo-img:hover {
  transform: scale(1.04);
}"""

if old_logo_css in text:
    text = text.replace(old_logo_css, new_logo_css)
    print("Replaced logo CSS in snepr_website.html")
else:
    print("Could not find exact old logo CSS, let's search:")
    pos = text.find('.snepr-logo-img')
    print(repr(text[pos-50:pos+200]))

with open('snepr_website.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated snepr_website.html")

