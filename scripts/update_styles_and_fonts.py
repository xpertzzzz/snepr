with open('src/styles/snepr-final.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace fonts import to include Plus Jakarta Sans
old_import = "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');"
new_import = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');"

if old_import in css:
    css = css.replace(old_import, new_import)

# Update body font-family
css = css.replace("font-family:'DM Sans',sans-serif;", "font-family:'Plus Jakarta Sans','DM Sans',sans-serif;")

# Add search input styles if not present
if '.search-input' not in css:
    search_css = """
.search-wrap{position:relative;flex:1;min-width:240px}
.search-input{width:100%;border:1px solid var(--line);background:var(--white);border-radius:99px;padding:12px 20px 12px 38px;font-size:12px;color:var(--ink);outline:none;transition:all .2s ease;font-family:inherit}
.search-input:focus{border-color:var(--brown);box-shadow:0 0 0 3px rgba(128,84,58,.1)}
.search-input::placeholder{color:var(--muted)}
.search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--muted);pointer-events:none}
"""
    css += search_css

with open('src/styles/snepr-final.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated src/styles/snepr-final.css with Plus Jakarta Sans and search input styles!')

