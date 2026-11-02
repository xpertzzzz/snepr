import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update hero navbar links
old_hero_nav = '''          <nav className={`hero-nav ${navOpen ? "open" : ""}`} id="navlinks">
            <a href="#discover" onClick={() => setNavOpen(false)}>
              Explore
            </a>
            <a href="#discover" onClick={() => setNavOpen(false)}>
              Live Queues
            </a>
            <a href="#how" onClick={() => setNavOpen(false)}>
              How it works
            </a>
            <a href="#ai" onClick={() => setNavOpen(false)}>
              AI Studio
            </a>
            <a href="#salons" onClick={() => setNavOpen(false)}>
              For Salons
            </a>
            <a href="/pricing" onClick={() => setNavOpen(false)}>
              Pricing
            </a>
          </nav>
          <div className="head-actions">
            <a className="btn" href="/login">
              Sign in
            </a>
            <a className="btn fill" href="#discover">
              Find a Salon ↗
            </a>'''

new_hero_nav = '''          <nav className={`hero-nav ${navOpen ? "open" : ""}`} id="navlinks">
            <a href="/explore" onClick={() => setNavOpen(false)}>
              Explore
            </a>
            <a href="/live" onClick={() => setNavOpen(false)}>
              Live Queues
            </a>
            <a href="/how-it-works" onClick={() => setNavOpen(false)}>
              How it works
            </a>
            <a href="/ai-studio" onClick={() => setNavOpen(false)}>
              AI Studio
            </a>
            <a href="/salonos" onClick={() => setNavOpen(false)}>
              For Salons
            </a>
            <a href="/pricing" onClick={() => setNavOpen(false)}>
              Pricing
            </a>
          </nav>
          <div className="head-actions">
            <a className="btn" href="/login">
              Sign in
            </a>
            <a className="btn fill" href="/explore">
              Find a Salon ↗
            </a>'''

if old_hero_nav in code:
    code = code.replace(old_hero_nav, new_hero_nav, 1)
    print("Updated hero nav links")

# 2. Update hero CTAs
old_hero_ctas = '''            <div className="hero-ctas">
              <a className="btn fill" href="#discover">
                Find a salon near you
              </a>
              <a className="btn" href="#discover">
                Explore live queues
              </a>
            </div>
            <a className="owner-link" href="#salons" style={{ marginTop: "18px" }}>
              For salon owners | SalonOS ↗
            </a>'''

new_hero_ctas = '''            <div className="hero-ctas">
              <a className="btn fill" href="/explore">
                Find a salon near you
              </a>
              <a className="btn" href="/live">
                Explore live queues
              </a>
            </div>
            <a className="owner-link" href="/salonos" style={{ marginTop: "18px" }}>
              For salon owners | SalonOS ↗
            </a>'''

if old_hero_ctas in code:
    code = code.replace(old_hero_ctas, new_hero_ctas, 1)
    print("Updated hero CTAs")

# 3. Update salon card title to link to /salon/:id
old_h3 = '<h3>{s.name}</h3>'
new_h3 = '<h3><a href={`/salon/${s.id}`} style={{ color: "inherit", textDecoration: "none" }}>{s.name}</a></h3>'

if old_h3 in code:
    code = code.replace(old_h3, new_h3, 1)
    print("Updated salon title link")

with open('src/routes/_marketing/index.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Updated src/routes/_marketing/index.tsx successfully")
