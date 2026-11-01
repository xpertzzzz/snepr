import os

for root, dirs, files in os.walk('.'):
    if any(skip in root for skip in ['.git', 'node_modules', '.next', '.output', 'dist', 'playstore', 'scratch']):
        continue
    for f in files:
        if f.endswith(('.tsx', '.html', '.css')):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    if 'snepr-logo' in content:
                        print(f"Found in {path}")
            except:
                pass
