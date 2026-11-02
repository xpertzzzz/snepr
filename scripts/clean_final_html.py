import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('final website design exact copy this .html', 'r', encoding='utf-8') as f:
    raw = f.read()

# Replace the base64 with a placeholder
clean = re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+', '/snepr-logo-transparent.png', raw)

with open('final_clean_preview.html', 'w', encoding='utf-8') as f:
    f.write(clean)

print("Created final_clean_preview.html without base64!")
print(f"Original size: {len(raw):,} bytes | Clean size: {len(clean):,} bytes")
