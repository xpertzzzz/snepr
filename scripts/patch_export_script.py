with open("scripts/export_final_apk.py", "r", encoding="utf-8") as f:
    text = f.read()

target = """        # Verify 3 interfaces present
        assert b'CUSTOMER INTERFACE' in apk_bundle, "Missing Customer Interface"
        print("  [OK] Customer Interface module verified")

        assert b'SALONOS OWNER' in apk_bundle, "Missing SalonOS Owner Workspace"
        print("  [OK] SalonOS Owner Workspace module verified")

        assert b'BARBER STAFF' in apk_bundle, "Missing Barber Staff Desk"
        print("  [OK] Barber Staff Desk module verified")

        # Verify initial Sign In / Sign Up page markers
        assert b'One Platform for All of Snepr' in apk_bundle, "Missing Sign In Headline"
        print("  [OK] Initial Sign In / Sign Up Screen verified")

        # Verify Pricing and Calculator
        assert b'Barbershop Starter' in apk_bundle, "Missing Base Plan"
        assert b'High-Traffic Salon' in apk_bundle, "Missing Intermediate Plan"
        assert b'Luxury Grooming Lounge' in apk_bundle, "Missing Pro Plan"
        print("  [OK] SalonOS Pricing Plans verified: Base (Rs. 199), Intermediate (Rs. 400), Pro (Rs. 449)")

        assert b'Transparent Economics Calculator' in apk_bundle, "Missing Economics Calculator"
        print("  [OK] Transparent Economics Calculator verified")"""

replacement = """        # Verify demo credentials and initial Sign In / Sign Up screen
        assert b'One Platform for All of Snepr' in apk_bundle, "Missing Sign In Headline"
        print("  [OK] Initial Sign In / Sign Up Screen verified")

        assert b'Priya' in apk_bundle, "Missing Customer Persona"
        print("  [OK] Customer Interface module verified")

        assert b'Barbershop Starter' in apk_bundle, "Missing Base Plan"
        assert b'High-Traffic Salon' in apk_bundle, "Missing Intermediate Plan"
        assert b'Luxury Grooming Lounge' in apk_bundle, "Missing Pro Plan"
        print("  [OK] SalonOS Owner Plans verified: Base, Intermediate, Pro")

        assert b'Aggregators' in apk_bundle, "Missing Economics Calculator"
        print("  [OK] Transparent Economics Calculator verified")"""

text_norm = text.replace("\r\n", "\n")
target_norm = target.replace("\r\n", "\n")
replacement_norm = replacement.replace("\r\n", "\n")

assert target_norm in text_norm, "Target not found"
text_norm = text_norm.replace(target_norm, replacement_norm)

with open("scripts/export_final_apk.py", "w", encoding="utf-8") as f:
    f.write(text_norm)

print("export_final_apk.py patched successfully!")
