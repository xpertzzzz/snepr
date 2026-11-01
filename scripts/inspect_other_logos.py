for path in ['src/routes/login.tsx', 'src/components/layout/Footer.tsx']:
    print(f"=== {path} ===")
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    pos = text.find('snepr-logo')
    if pos != -1:
        print(text[max(0, pos-40):min(len(text), pos+160)].encode('ascii', errors='replace').decode('ascii'))

