with open('src/styles/snepr-final.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Ensure .reveal is always visible and never hides text
css = css.replace('.reveal{opacity:0;transform:translateY(28px);transition:opacity .75s,transform .75s cubic-bezier(.2,.7,.2,1)}', '.reveal{opacity:1;transform:none}')
css = css.replace('.reveal{opacity:0;', '.reveal{opacity:1;')

# 2. Add high-visibility, premium typography and mobile UI phone simulator styles
enhanced_styles = """
/* High-visibility typography & contrast overrides */
.reveal {
  opacity: 1 !important;
  transform: none !important;
}

.step {
  padding: 34px 28px !important;
  border-radius: 26px !important;
  background: #ffffff !important;
  border: 1px solid rgba(112, 71, 47, 0.16) !important;
  box-shadow: 0 14px 38px rgba(75, 51, 32, 0.07) !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
}
.step:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 20px 48px rgba(75, 51, 32, 0.12) !important;
}
.step .n {
  font-family: Georgia, serif !important;
  font-size: 30px !important;
  font-weight: 700 !important;
  color: #70472f !important;
  display: block !important;
  margin-bottom: 12px !important;
}
.step h3 {
  font-family: 'Plus Jakarta Sans', 'Manrope', sans-serif !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #1d1b17 !important;
  margin: 0 0 12px 0 !important;
  letter-spacing: -0.02em !important;
}
.step p {
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #3d322a !important;
  line-height: 1.7 !important;
  margin: 0 !important;
}

.section-head p {
  font-size: 16px !important;
  color: #4a3e35 !important;
  font-weight: 500 !important;
  line-height: 1.7 !important;
}

.hero-desc {
  font-size: 18px !important;
  color: #3d322a !important;
  line-height: 1.7 !important;
  font-weight: 500 !important;
}

.cut-copy p {
  font-size: 16px !important;
  color: #ebe4d8 !important;
  line-height: 1.8 !important;
  font-weight: 500 !important;
}

.sample-note {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #5c4f44 !important;
}

.salon-stats div strong {
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #1d1b17 !important;
}
.salon-stats div span {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #5c4f44 !important;
}

.rule span {
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #2b211a !important;
}

details summary {
  font-size: 17px !important;
  font-weight: 700 !important;
  color: #1d1b17 !important;
  cursor: pointer;
}
details p {
  font-size: 15px !important;
  color: #3d322a !important;
  line-height: 1.7 !important;
  font-weight: 500 !important;
}

/* Authentic Mobile Phone Frame & Internal UI */
.mobile-device-frame {
  max-width: 420px;
  margin: 0 auto;
  background: #1e1b18;
  border-radius: 44px;
  padding: 12px;
  box-shadow: 0 28px 75px rgba(33, 27, 23, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
}
.mobile-device-notch {
  width: 120px;
  height: 22px;
  background: #1e1b18;
  border-radius: 0 0 14px 14px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-device-screen {
  background: #fffdfa;
  border-radius: 34px;
  overflow: hidden;
  min-height: 580px;
  display: flex;
  flex-direction: column;
}
.mobile-device-screen.dark {
  background: #191715;
  color: #f7f3ed;
}

/* 5-stage progress journey from app-customer */
.mob-journey {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 18px 0;
  padding: 0 8px;
}
.mob-journey::before {
  content: "";
  position: absolute;
  top: 14px;
  left: 18px;
  right: 18px;
  height: 2px;
  background: #e6ded3;
  z-index: 1;
}
.mob-stage {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.mob-stage i {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0e8dc;
  color: #70472f;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fffdfa;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.mob-stage.done i {
  background: #4c805e;
  color: #ffffff;
}
.mob-stage.active i {
  background: #c69a5c;
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(198, 154, 92, 0.25);
  animation: pulse-ring 2s infinite;
}
.mob-stage span {
  font-size: 10px;
  font-weight: 600;
  color: #6e6256;
}
.mob-stage.active span {
  color: #70472f;
  font-weight: 700;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(198, 154, 92, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(198, 154, 92, 0); }
  100% { box-shadow: 0 0 0 0 rgba(198, 154, 92, 0); }
}

/* Footer logo & social button */
.foot-brand-logo {
  width: 145px !important;
  height: auto !important;
  display: block !important;
  margin-bottom: 18px !important;
}

.foot-instagram-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #f7f3ed;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 10px;
}
.foot-instagram-btn:hover {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  border-color: transparent;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 39, 67, 0.35);
}
"""

if "/* High-visibility typography & contrast overrides */" not in css:
    css += enhanced_styles

with open('src/styles/snepr-final.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated src/styles/snepr-final.css with enhanced visibility, contrast, and mobile frame styles!")
