with open('scripts/generate_perfect_app.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all \n that are inside the code string with \\n
# In python raw strings, r'\n' is the 2 chars \ and n.
# We want to replace r'\n' with r'\\n' (which is 4 chars \ \ n).
new_text = text.replace(r'\n', r'\\n')

with open('scripts/generate_perfect_app.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Replaced all \\n with \\\\n in scripts/generate_perfect_app.py successfully.")
