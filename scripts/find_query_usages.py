import os

query_files = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fp:
                c = fp.read()
                if '@tanstack/react-query' in c or 'useQuery' in c or 'useMutation' in c:
                    query_files.append(p)

print(f"Found {len(query_files)} files using query in src:")
for p in query_files:
    print(" -", p)

