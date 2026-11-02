with open('src/routes/live/queue.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("--- src/routes/live/queue.tsx length:", len(text))
print(text[:1000])
