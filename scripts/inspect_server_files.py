for p in ['src/server.ts', 'src/start.ts', 'src/router.tsx']:
    print(f"=== {p} ===")
    with open(p, 'r', encoding='utf-8') as f:
        print(f.read().encode('ascii', errors='replace').decode('ascii'))
