with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find each section tag and its heading
sections = re.findall(r'(<section[^>]*>[\s\S]*?</section>)', text)
print(f"Total sections: {len(sections)}")
for i, s in enumerate(sections):
    h = re.findall(r'<h[1-3][^>]*>([\s\S]*?)</h[1-3]>', s)
    sec_id = re.findall(r'id=["\']([^"\']+)["\']', s[:100])
    sec_cls = re.findall(r'class=["\']([^"\']+)["\']', s[:100])
    print(f"Section {i+1}: id={sec_id} class={sec_cls}")
    if h:
        print("  Headings:", [re.sub(r'<[^>]+>', '', x).strip() for x in h[:2]])

