with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("--- Navbar.tsx length:", len(text))
print(text[:1200])
