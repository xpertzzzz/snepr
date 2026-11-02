import sys
sys.stdout.reconfigure(encoding='utf-8')

# Verify homepage file
with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    home_content = f.read()

assert 'id="pricing"' not in home_content, "Error: Homepage should not have id='pricing' section"
assert 'id="cutScene"' in home_content, "Error: Homepage missing scissor animation cutScene"
assert 'id="scissorRig"' in home_content, "Error: Homepage missing scissorRig"
assert 'id="hairPath"' in home_content, "Error: Homepage missing hairPath"
assert 'id="discover"' in home_content, "Error: Homepage missing discovery section"
assert 'search-input' in home_content, "Error: Homepage missing search input"
assert 'Bhubaneswar' in home_content, "Error: Homepage missing Bhubaneswar local copy"
assert 'Best Salons in Bhubaneswar' in home_content, "Error: Homepage missing target SEO heading"
assert 'Salons in Bhubaneswar' in home_content, "Error: Homepage missing target SEO phrase"
assert 'Salon near me' in home_content, "Error: Homepage missing target SEO phrase"
assert 'Live salon queue' in home_content, "Error: Homepage missing target SEO phrase"
assert 'Salon waiting time' in home_content, "Error: Homepage missing target SEO phrase"
assert 'Barber shops in Bhubaneswar' in home_content, "Error: Homepage missing target SEO phrase"
assert '/pricing' in home_content, "Error: Homepage missing link to /pricing"
assert 'Plus Jakarta Sans' in open('src/styles/snepr-final.css', 'r', encoding='utf-8').read(), "Error: Plus Jakarta Sans not imported in CSS"

print("✓ All Homepage verification checks PASSED!")

# Verify pricing page file
with open('src/routes/_marketing/pricing.tsx', 'r', encoding='utf-8') as f:
    pricing_content = f.read()

assert 'Single barber' in pricing_content, "Error: Pricing page missing Base plan"
assert 'Intermediate' in pricing_content, "Error: Pricing page missing Intermediate plan"
assert 'Pro' in pricing_content, "Error: Pricing page missing Pro plan"
assert 'Salon economics' in pricing_content, "Error: Pricing page missing economics calculator"
assert 'customers' in pricing_content, "Error: Pricing page missing customers slider"
assert 'compare' in pricing_content, "Error: Pricing page missing comparison table"
assert 'snepr-logo-transparent.png' in pricing_content, "Error: Pricing page missing brand logo"

print("✓ All Pricing Page verification checks PASSED!")

