with open('app/app/(tabs)/index.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update auth screen logo
old_auth_logo = """          {/* Brand Vector Logo & Header */}
          <View style={s.authScreenBrandHeader}>
            <Text style={s.authScreenWordmark}>
              snepr<Text style={{ color: C.brown }}>.</Text>
            </Text>"""

new_auth_logo = """          {/* Brand Vector Logo & Header */}
          <View style={s.authScreenBrandHeader}>
            <Image
              source={require('../../assets/images/snepr-logo-transparent.png')}
              style={s.authScreenLogoImg}
              resizeMode="contain"
            />"""

# 2. Update main header logo
old_header_logo = """        <View style={s.headerLeft}>
          <Text style={s.wordmark}>
            snepr<Text style={{ color: C.brown }}>.</Text>
          </Text>"""

new_header_logo = """        <View style={s.headerLeft}>
          <Image
            source={require('../../assets/images/snepr-logo-transparent.png')}
            style={s.headerLogoImg}
            resizeMode="contain"
          />"""

# 3. Add styles
old_style_anchor = "  wordmark: { fontSize: 26, fontWeight: '900', color: C.espresso, letterSpacing: -1 },"
new_style_anchor = """  wordmark: { fontSize: 26, fontWeight: '900', color: C.espresso, letterSpacing: -1 },
  headerLogoImg: { width: 92, height: 30 },
  authScreenLogoImg: { width: 170, height: 56, marginBottom: 6 },"""

c_norm = c.replace('\r\n', '\n')
old_auth_logo_norm = old_auth_logo.replace('\r\n', '\n')
new_auth_logo_norm = new_auth_logo.replace('\r\n', '\n')
old_header_logo_norm = old_header_logo.replace('\r\n', '\n')
new_header_logo_norm = new_header_logo.replace('\r\n', '\n')
old_style_anchor_norm = old_style_anchor.replace('\r\n', '\n')
new_style_anchor_norm = new_style_anchor.replace('\r\n', '\n')

assert old_auth_logo_norm in c_norm, "old_auth_logo not found"
assert old_header_logo_norm in c_norm, "old_header_logo not found"
assert old_style_anchor_norm in c_norm, "old_style_anchor not found"

c_norm = c_norm.replace(old_auth_logo_norm, new_auth_logo_norm)
c_norm = c_norm.replace(old_header_logo_norm, new_header_logo_norm)
c_norm = c_norm.replace(old_style_anchor_norm, new_style_anchor_norm)

with open('app/app/(tabs)/index.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print("Updated app/app/(tabs)/index.tsx with new logo image!")

