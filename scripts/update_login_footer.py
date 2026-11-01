with open('src/routes/login.tsx', 'r', encoding='utf-8') as f:
    t = f.read()
t = t.replace(
    '<img src="/snepr-logo.png" alt="Snepr" className="h-10 w-auto object-contain rounded-md" />',
    '<img src="/snepr-logo.png" alt="Snepr" className="h-14 w-auto object-contain border-0 bg-transparent shadow-none" />'
)
with open('src/routes/login.tsx', 'w', encoding='utf-8') as f:
    f.write(t)

with open('src/components/layout/Footer.tsx', 'r', encoding='utf-8') as f:
    t = f.read()
t = t.replace(
    '<img src="/snepr-logo.png" alt="Snepr" className="h-8 w-auto object-contain rounded-md" />',
    '<img src="/snepr-logo.png" alt="Snepr" className="h-12 w-auto object-contain border-0 bg-transparent shadow-none" />'
)
with open('src/components/layout/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(t)

print("Updated login.tsx and Footer.tsx")

