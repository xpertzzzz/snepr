with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos_base = text.find('{/* TIER 1: BASE PLAN */}')
pos_inter = text.find('{/* TIER 2:')
pos_pro = text.find('{/* TIER 3:')
pos_roi = text.find('{/* Interactive ROI')
print(f"Base: {pos_base}, Inter: {pos_inter}, Pro: {pos_pro}, ROI: {pos_roi}")

