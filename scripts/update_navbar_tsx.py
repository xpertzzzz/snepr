with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Update header height
text = text.replace(
    'flex h-18 max-w-6xl items-center',
    'flex h-20 max-w-6xl items-center'
)

# Update logo link and img
old_logo_block = """          <Link to="/" className="flex items-center py-2 group" aria-label="Snepr home">
            <img
              src="/snepr-logo.png"
              alt="Snepr"
              className="h-9 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
            />
          </Link>"""

new_logo_block = """          <Link to="/" className="flex items-center py-1 group border-0 bg-transparent shadow-none" aria-label="Snepr home">
            <img
              src="/snepr-logo.png"
              alt="Snepr"
              className="h-12 sm:h-14 md:h-15 w-auto object-contain transition-transform group-hover:scale-105 border-0 bg-transparent shadow-none rounded-none"
            />
          </Link>"""

if old_logo_block in text:
    text = text.replace(old_logo_block, new_logo_block)
    print("Replaced logo block in Navbar.tsx")
else:
    print("Could not find exact old logo block")

with open('src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Navbar.tsx")

