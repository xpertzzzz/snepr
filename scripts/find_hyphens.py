import re

with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Find words with hyphens in text/strings (exclude imports and standard tag attributes like className, onClick, etc.)
lines = text.splitlines()
hyphen_lines = []
for i, line in enumerate(lines):
    # Skip imports
    if line.strip().startswith('import') or line.strip().startswith('export const Route'):
        continue
    # find words with hyphens in text
    matches = re.findall(r'[a-zA-Z0-9]+-[a-zA-Z0-9]+', line)
    # filter out common code terms if any
    filtered = [m for m in matches if m not in ['d4a17b', '1d1b17', 'snepr-final', 'snepr-logo', 'app-customer', 'cut-scene', 'cut-sticky', 'hair-svg', 'hair-line', 'hair-cut', 'scissor-rig', 'scissor-metal', 'scissor-dark', 'blade-a', 'blade-b', 'cut-copy', 'cut-kicker', 'cut-progress', 'section-head', 'live-label', 'area-bar', 'search-wrap', 'search-icon', 'search-input', 'area-select', 'salon-grid', 'salon-top', 'salon-meta', 'salon-stats', 'salon-foot', 'sample-note', 'demo-layout', 'demo-copy', 'phone-head', 'demo-token', 'queue-row', 'ai-band', 'ai-layout', 'ai-copy', 'ai-list', 'style-orbit', 'style-disc', 'owner-flow', 'owner-grid', 'owner-feature', 'owner-dashboard', 'dash-top', 'point-rules', 'faq-list', 'final-cta', 'final-actions', 'foot-top', 'foot-brand', 'foot-col', 'foot-bottom']]
    if filtered:
        hyphen_lines.append((i+1, filtered, line.strip()))

print(f"Total lines with hyphenated text in index.tsx: {len(hyphen_lines)}")
for ln, m, content in hyphen_lines[:25]:
    print(f"Line {ln}: {m} -> {content[:80]}")

