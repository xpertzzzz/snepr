with open('src/styles.css', 'r', encoding='utf-8') as f:
    text = f.read()
print(f"Total lines in src/styles.css: {len(text.splitlines())}")
for l in text.splitlines()[:40]:
    print(l)

