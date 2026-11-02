with open('src/routes/_marketing.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_code = """function MarketingLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  if (isHome) {
    return <Outlet />;
  }"""

new_code = """function MarketingLayout() {
  const location = useLocation();
  const isStandalone =
    location.pathname === "/" ||
    location.pathname === "" ||
    location.pathname === "/pricing" ||
    location.pathname === "/pricing/";

  if (isStandalone) {
    return <Outlet />;
  }"""

if old_code in text:
    text = text.replace(old_code, new_code)
    with open('src/routes/_marketing.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated _marketing.tsx to make /pricing standalone!")
else:
    print("Could not find old_code in _marketing.tsx!")
