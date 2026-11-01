for p in ['app/app/index.tsx', 'app/app/_layout.tsx']:
    print(f"=== {p} ===")
    with open(p, 'r', encoding='utf-8') as f:
        print(f.read()[:600])

