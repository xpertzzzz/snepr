import os

file_path = os.path.join('src', 'routes', 'live', 'salon.$id.tsx')
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = [line.strip() for line in text.splitlines() if 'useParams' in line or 'id' in line or 'slug' in line]
print(f"Total matching lines in salon.$id.tsx: {len(lines)}")
for line in lines[:15]:
    print(" ", line)
