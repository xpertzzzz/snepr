for p in ['src/routes/_marketing.tsx', 'src/routes/__root.tsx']:
    print(f"=== {p} ===")
    with open(p, 'r', encoding='utf-8') as f:
        print(f.read()[:800].encode('ascii', errors='replace').decode('ascii'))

