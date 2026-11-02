with open('src/routes/live/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("--- src/routes/live/index.tsx length:", len(text))
print(text[:800])

with open('src/routes/live/salon.$id.tsx', 'r', encoding='utf-8') as f:
    text_salon = f.read()

print("\n--- src/routes/live/salon.$id.tsx length:", len(text_salon))
print(text_salon[:800])
