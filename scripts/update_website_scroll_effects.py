import re

with open('snepr_website.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ADD CSS STYLES
css_to_insert = """
/* ================= CREATIVE 3D ON-SCROLL REVEAL & CARD ANIMATIONS ================= */
.card-reveal {
  opacity: 0;
  transform: perspective(1200px) translateY(44px) rotateX(7deg) scale(0.96);
  transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s ease,
              border-color 0.4s ease;
  transition-delay: var(--delay, 0s);
  will-change: opacity, transform;
  position: relative;
  overflow: hidden;
}

.card-reveal.in {
  opacity: 1;
  transform: perspective(1200px) translateY(0) rotateX(0deg) scale(1);
}

.card-reveal-left {
  transform: perspective(1200px) translateX(-44px) rotateY(-8deg) scale(0.96);
}
.card-reveal-left.in {
  transform: perspective(1200px) translateX(0) rotateY(0deg) scale(1);
}

.card-reveal-right {
  transform: perspective(1200px) translateX(44px) rotateY(8deg) scale(0.96);
}
.card-reveal-right.in {
  transform: perspective(1200px) translateX(0) rotateY(0deg) scale(1);
}

.card-reveal-scale {
  transform: perspective(1200px) translateY(24px) scale(0.92);
}
.card-reveal-scale.in {
  transform: perspective(1200px) translateY(0) scale(1);
}

/* Card Entrance Shimmer Light Beam */
.card-reveal::after {
  content: '';
  position: absolute;
  top: 0;
  left: -160%;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, transparent 20%, rgba(200, 153, 62, 0.14) 42%, rgba(255, 255, 255, 0.4) 50%, rgba(200, 153, 62, 0.14) 58%, transparent 80%);
  transform: skewX(-22deg);
  pointer-events: none;
  z-index: 6;
}
.card-reveal.in::after {
  animation: shimmerSweep 1.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--delay, 0s) + 0.3s);
}

@keyframes shimmerSweep {
  0% { left: -160%; }
  100% { left: 190%; }
}

/* Interactive Cursor Spotlight Glow on Cards */
.pillar-card, .price-card, .step-item, .demo-feature-item, .hero-preview-leaf, .hero-stat-card {
  position: relative;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
  transform-style: preserve-3d;
}

.spotlight-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(circle 340px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(200, 153, 62, 0.15), transparent 75%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.pillar-card:hover .spotlight-glow,
.price-card:hover .spotlight-glow,
.step-item:hover .spotlight-glow,
.demo-feature-item:hover .spotlight-glow,
.hero-preview-leaf:hover .spotlight-glow,
.hero-stat-card:hover .spotlight-glow {
  opacity: 1;
}

/* Floating Levitation Effect for Phone Mockup */
@keyframes phoneFloatingLevitation {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(0.4deg);
  }
}
.phone-floating {
  animation: phoneFloatingLevitation 5.5s ease-in-out infinite;
}

/* Hero Stats Micro-Cards */
.hero-stats-cards {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 32px;
}
.hero-stat-card {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  cursor: default;
}
.hero-stat-card:hover {
  border-color: var(--caramel);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-md);
}
.hero-stat-val {
  font-family: var(--font-main);
  font-size: 20px;
  font-weight: 700;
  color: var(--espresso);
  line-height: 1;
}
.hero-stat-label {
  font-size: 12px;
  color: var(--text-2);
  line-height: 1.25;
}

/* Connecting Glowing Line for Steps */
.steps-list {
  position: relative;
}
.steps-list::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: linear-gradient(180deg, var(--cognac) 0%, var(--gold) 50%, var(--cream-mid) 100%);
  opacity: 0.35;
  transition: opacity 0.6s ease;
}
"""

# Insert CSS right before </style>
pos_style = html.find('</style>')
if pos_style != -1:
    html = html[:pos_style] + css_to_insert + "\n" + html[pos_style:]
    print("Inserted CSS styles successfully.")

# 2. UPDATE HERO STATS WITH STAGGERED REVEAL & ANIMATED METRIC COUNTERS
old_hero_stats = """      <div class="hero-stats">
        <span>
          <svg class="ico s" style="color:var(--green);" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          No App Download Required to Queue
        </span>
        <span>
          <svg class="ico s" style="color:var(--gold);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Average 22 Minutes Saved
        </span>
        <span>
          <svg class="ico s" style="color:var(--cognac);" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Fair +10 Points on Verified Reviews
        </span>
      </div>"""

new_hero_stats = """      <div class="hero-stats-cards">
        <div class="hero-stat-card card-reveal card-reveal-left" style="--delay: 0.08s;">
          <div class="spotlight-glow"></div>
          <div style="width:38px;height:38px;border-radius:12px;background:var(--green-soft);color:var(--green-ink);display:grid;place-items:center;flex:none;">
            <svg class="ico s" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div class="hero-stat-val"><span data-count-target="22" data-count-suffix=" mins">0 mins</span></div>
            <div class="hero-stat-label">Average Wait Saved</div>
          </div>
        </div>

        <div class="hero-stat-card card-reveal card-reveal-left" style="--delay: 0.18s;">
          <div class="spotlight-glow"></div>
          <div style="width:38px;height:38px;border-radius:12px;background:var(--gold-soft);color:var(--gold-ink);display:grid;place-items:center;flex:none;">
            <svg class="ico s" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div class="hero-stat-val"><span data-count-target="78" data-count-suffix="%">0%</span></div>
            <div class="hero-stat-label">Repeat Salon Visits</div>
          </div>
        </div>

        <div class="hero-stat-card card-reveal card-reveal-left" style="--delay: 0.28s;">
          <div class="spotlight-glow"></div>
          <div style="width:38px;height:38px;border-radius:12px;background:var(--cognac-soft);color:var(--cognac-ink);display:grid;place-items:center;flex:none;">
            <svg class="ico s" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <div class="hero-stat-val">Rs. 0</div>
            <div class="hero-stat-label">Free For Customers</div>
          </div>
        </div>
      </div>"""

if old_hero_stats in html:
    html = html.replace(old_hero_stats, new_hero_stats)
    print("Updated Hero stats to micro-cards with counters.")

# 3. UPDATE HERO PREVIEW LEAF (RIGHT STAND-EE CARD)
html = html.replace(
    'class="hero-preview-leaf"',
    'class="hero-preview-leaf card-reveal card-reveal-right" style="--delay: 0.16s;"'
)

# 4. UPDATE INTERACTIVE SIMULATOR (PHONE + SIDEBAR CARDS)
html = html.replace(
    'class="demo-feature-item"',
    'class="demo-feature-item card-reveal card-reveal-left"'
)

html = html.replace(
    'class="phone-chassis"',
    'class="phone-chassis card-reveal card-reveal-right phone-floating" style="--delay: 0.14s;"'
)

# 5. UPDATE PILLARS SECTION CARDS WITH STAGGERED 3D REVEALS
# Replace each pillar card with left, up, right reveals and delays
pillar_cards = list(re.finditer(r'<div class="pillar-card">', html))
print(f"Found {len(pillar_cards)} pillar cards.")
delays = ['0.08s', '0.22s', '0.36s']
classes = ['card-reveal card-reveal-left', 'card-reveal card-reveal-up', 'card-reveal card-reveal-right']

# We replace from end to beginning so indices don't shift
for i in reversed(range(len(pillar_cards))):
    idx = i % 3
    m = pillar_cards[i]
    repl = f'<div class="pillar-card {classes[idx]}" style="--delay: {delays[idx]};"><div class="spotlight-glow"></div>'
    html = html[:m.start()] + repl + html[m.end():]

# 6. UPDATE HOW IT WORKS STEPS (CUSTOMER & OWNER)
step_items = list(re.finditer(r'<div class="step-item">', html))
print(f"Found {len(step_items)} step items.")
step_delays = ['0.08s', '0.20s', '0.32s', '0.44s', '0.08s', '0.20s', '0.32s', '0.44s']
for i in reversed(range(len(step_items))):
    delay = step_delays[i % len(step_delays)]
    m = step_items[i]
    repl = f'<div class="step-item card-reveal card-reveal-left" style="--delay: {delay};"><div class="spotlight-glow"></div>'
    html = html[:m.start()] + repl + html[m.end():]

# 7. UPDATE PRICING CARDS (BASE, INTERMEDIATE, PRO)
price_cards = list(re.finditer(r'<div class="price-card(\s+featured)?">', html))
print(f"Found {len(price_cards)} pricing cards.")
price_classes = [
    'price-card card-reveal card-reveal-left" style="--delay: 0.08s;"',
    'price-card featured card-reveal card-reveal-scale" style="--delay: 0.22s;"',
    'price-card card-reveal card-reveal-right" style="--delay: 0.36s;"'
]
for i in reversed(range(len(price_cards))):
    idx = i % 3
    m = price_cards[i]
    repl = f'<div class="{price_classes[idx]}><div class="spotlight-glow"></div>'
    html = html[:m.start()] + repl + html[m.end():]

# 8. UPDATE FAQ ITEMS
faq_items = list(re.finditer(r'<div class="faq-item" onclick="toggleFaq\(this\)">', html))
print(f"Found {len(faq_items)} FAQ items.")
faq_delays = ['0.06s', '0.16s', '0.26s', '0.36s']
for i in reversed(range(len(faq_items))):
    delay = faq_delays[i % len(faq_delays)]
    m = faq_items[i]
    repl = f'<div class="faq-item card-reveal card-reveal-scale" style="--delay: {delay};" onclick="toggleFaq(this)">'
    html = html[:m.start()] + repl + html[m.end():]

# 9. INJECT INTERSECTION OBSERVER, NUMBER COUNTERS & 3D SPOTLIGHT TRACKER SCRIPT
js_to_insert = """
// ================= HIGH-PERFORMANCE 3D ON-SCROLL ENGINE =================
(function initScrollEffects() {
  // 1. IntersectionObserver for On-Scroll Card Reveals
  const revealCards = document.querySelectorAll('.card-reveal');
  
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          
          // Trigger any animated number counters inside this card
          const counters = entry.target.querySelectorAll('[data-count-target]');
          counters.forEach(counter => {
            if (!counter.dataset.animated) {
              counter.dataset.animated = 'true';
              runCounterAnimation(counter);
            }
          });

          // Unobserve once revealed for peak smooth 60fps performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealCards.forEach(card => cardObserver.observe(card));
  } else {
    // Fallback for older browsers
    revealCards.forEach(card => card.classList.add('in'));
  }

  // 2. Animated Counter Helper
  function runCounterAnimation(el) {
    const target = parseFloat(el.dataset.countTarget);
    const suffix = el.dataset.countSuffix || '';
    const prefix = el.dataset.countPrefix || '';
    const duration = 1400; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }
    requestAnimationFrame(update);
  }

  // 3. Interactive 3D Cursor Tilt & Specular Spotlight
  const interactiveCards = document.querySelectorAll(
    '.pillar-card, .price-card, .hero-preview-leaf, .demo-feature-item, .hero-stat-card, .phone-chassis'
  );

  interactiveCards.forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set spotlight coordinates
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Skip 3D tilt on phone chassis during its floating animation to prevent jitter
        if (!card.classList.contains('phone-chassis')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = -((y - centerY) / centerY) * 7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)`;
        }
        ticking = false;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('phone-chassis')) {
        card.style.transform = '';
      }
    });
  });

  // 4. Subtle Parallax Float on Scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.featured-pill, .chair-status-box').forEach((el, i) => {
      const speed = (i % 2 === 0 ? 0.04 : -0.04);
      el.style.transform = `translateY(${(scrollY * speed).toFixed(1)}px)`;
    });
  }, { passive: true });
})();
"""

# Replace the old tilt listener in the bottom script
old_script_tilt = """// Interactive 3D Tilt on Hover for Cards & Simulator
document.querySelectorAll('.price-card, .pillar-card, .phone-frame, .hero-standee, .roi-card, .how-step').forEach(card => {
  card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
  card.style.transformStyle = 'preserve-3d';

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 6;
    const rotY = (x / (rect.width / 2)) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});"""

if old_script_tilt in html:
    html = html.replace(old_script_tilt, js_to_insert)
    print("Replaced old tilt script with full 3D on-scroll engine.")
else:
    pos_end_script = html.rfind('</script>')
    if pos_end_script != -1:
        html = html[:pos_end_script] + "\n" + js_to_insert + "\n" + html[pos_end_script:]
        print("Appended 3D on-scroll engine before </script>.")

with open('snepr_website.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved updated snepr_website.html successfully!")

