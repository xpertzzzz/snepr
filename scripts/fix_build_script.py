with open('scripts/build_full_release.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "has_studio = b'Snepr Studio 2026' in bundle_data",
    "has_studio = b'Hairstyle Consultation' in bundle_data"
)
text = text.replace(
    "print(f\"Snepr Studio 2026 present: {has_studio}\")",
    "print(f\"Hairstyle Consultation Studio present: {has_studio}\")"
)

with open('scripts/build_full_release.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated build_full_release.py")

