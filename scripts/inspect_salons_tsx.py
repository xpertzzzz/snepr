with open('src/routes/salons.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("--- src/routes/salons.tsx length:", len(text))
print(text[:1000])
