import re

with open('app/app/(tabs)/index.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add auth state variables
old_state = "  // Experience Mode: 'customer' | 'owner' | 'staff'\n  const [role, setRole] = useState<'customer' | 'owner' | 'staff'>('customer');"
new_state = """  // Authentication State & Initial Screen
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authSignupRole, setAuthSignupRole] = useState<'customer' | 'owner'>('customer');

  // Experience Mode: 'customer' | 'owner' | 'staff'
  const [role, setRole] = useState<'customer' | 'owner' | 'staff'>('customer');"""

assert old_state in code, "old_state not found"
code = code.replace(old_state, new_state)

# 2. Update handleDemoLogin, handleManualAuth, and add handleSignOut
old_handlers = """  // Quick Demo Login Handler
  const handleDemoLogin = (userRole: 'customer' | 'owner' | 'staff') => {
    setRole(userRole);
    setAuthModalVisible(false);
    if (userRole === 'customer') {
      setCustomerTab('explore');
      Alert.alert('Signed in as Customer', 'Welcome Priya Mohapatra (customer@snepr.demo)');
    } else if (userRole === 'owner') {
      setOwnerTab('overview');
      Alert.alert('Signed in as Salon Owner', 'Welcome Arjun Sharma — Lakmé Salon KIIT Road');
    } else if (userRole === 'staff') {
      setStaffTab('queue');
      Alert.alert('Signed in as Barber Staff', 'Welcome Rahul Kumar — Station 1 (Lakmé Salon)');
    }
  };

  const handleManualAuth = () => {
    const clean = authEmail.trim().toLowerCase();
    if (clean === 'owner@snepr.demo') {
      handleDemoLogin('owner');
    } else if (clean === 'staff@snepr.demo') {
      handleDemoLogin('staff');
    } else {
      handleDemoLogin('customer');
    }
  };"""

new_handlers = """  // Sign Out Handler
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAuthEmail('');
    setAuthPass('');
    Alert.alert('Signed Out', 'You have returned to the Snepr sign in screen.');
  };

  // Quick Demo Login Handler
  const handleDemoLogin = (userRole: 'customer' | 'owner' | 'staff') => {
    setIsLoggedIn(true);
    setRole(userRole);
    setAuthModalVisible(false);
    if (userRole === 'customer') {
      setCustomerTab('explore');
      Alert.alert('Customer Interface Activated', 'Welcome Priya Mohapatra (customer@snepr.demo)\\n\\n• Explore Salons\\n• Live 5-Stage Queue\\n• GPS Route & Directions\\n• AI Studio Lookbook');
    } else if (userRole === 'owner') {
      setOwnerTab('overview');
      Alert.alert('SalonOS Owner Interface Activated', 'Welcome Arjun Sharma (owner@snepr.demo)\\n\\n• Live Chairs & Overview\\n• Staff Roster\\n• Analytics\\n• Flat SaaS Plans (₹199, ₹400, ₹449)');
    } else if (userRole === 'staff') {
      setStaffTab('queue');
      Alert.alert('Staff Interface Activated', 'Welcome Rahul Kumar (staff@snepr.demo)\\n\\n• Station 1 Queue\\n• Now Serving #024\\n• Scan QR Code\\n• Walk-in Customer Intake');
    }
  };

  const handleManualAuth = () => {
    const clean = authEmail.trim().toLowerCase();
    if (!clean) {
      Alert.alert('Email Required', 'Please enter your email or tap one of the 1-Tap Demo Logins below.');
      return;
    }
    setIsLoggedIn(true);
    setAuthModalVisible(false);
    if (clean === 'owner@snepr.demo' || clean.includes('owner') || clean.includes('salon') || (authMode === 'signup' && authSignupRole === 'owner')) {
      setRole('owner');
      setOwnerTab('overview');
      Alert.alert('Welcome to SalonOS', `Signed in as Salon Owner (${authName || 'Arjun Sharma'})`);
    } else if (clean === 'staff@snepr.demo' || clean.includes('staff') || clean.includes('barber')) {
      setRole('staff');
      setStaffTab('queue');
      Alert.alert('Welcome to Barber Desk', `Signed in as Barber Staff (${authName || 'Rahul Kumar'})`);
    } else {
      setRole('customer');
      setCustomerTab('explore');
      Alert.alert('Welcome to Snepr', `Signed in as Customer (${authName || 'Priya Mohapatra'})`);
    }
  };"""

assert old_handlers in code, "old_handlers not found"
code = code.replace(old_handlers, new_handlers)

# 3. Add initial Sign In / Sign Up Screen gate before returning main UI
old_return = "  return (\n    <View style={s.container}>\n      <StatusBar barStyle=\"dark-content\" backgroundColor=\"#F7F3ED\" />"

new_return = """  // If not logged in, display the dedicated Sign In / Sign Up screen
  if (!isLoggedIn) {
    return (
      <View style={[s.container, { backgroundColor: '#FAF7F2' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
        <ScrollView contentContainerStyle={s.authScreenScroll} showsVerticalScrollIndicator={false}>
          {/* Brand Vector Logo & Header */}
          <View style={s.authScreenBrandHeader}>
            <Text style={s.authScreenWordmark}>
              snepr<Text style={{ color: C.brown }}>.</Text>
            </Text>
            <View style={s.authCityBadge}>
              <Text style={s.authCityBadgeText}>✦ Bhubaneswar Launch Edition</Text>
            </View>
            <Text style={s.authScreenHeadline}>One Platform for All of Snepr</Text>
            <Text style={s.authScreenSub}>
              Customer live queues, SalonOS owner dashboard, and Barber desk in one unified mobile app.
            </Text>
          </View>

          {/* Form Card */}
          <View style={s.authFormCard}>
            {/* Tab Switcher: Sign In vs Create Account */}
            <View style={s.authModeTabRow}>
              <TouchableOpacity
                style={[s.authModeTab, authMode === 'signin' && s.authModeTabActive]}
                onPress={() => setAuthMode('signin')}
              >
                <Text style={[s.authModeTabText, authMode === 'signin' && s.authModeTabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.authModeTab, authMode === 'signup' && s.authModeTabActive]}
                onPress={() => setAuthMode('signup')}
              >
                <Text style={[s.authModeTabText, authMode === 'signup' && s.authModeTabTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* If Sign Up Mode: Full Name & Desired Role */}
            {authMode === 'signup' && (
              <>
                <Text style={s.fieldLabel}>FULL NAME</Text>
                <TextInput
                  style={s.formInput}
                  placeholder="e.g. Priya Mohapatra / Arjun Sharma"
                  placeholderTextColor={C.mute}
                  value={authName}
                  onChangeText={setAuthName}
                />

                <Text style={s.fieldLabel}>ACCOUNT TYPE</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                  <TouchableOpacity
                    style={[s.roleSelectPill, authSignupRole === 'customer' && s.roleSelectPillActive]}
                    onPress={() => setAuthSignupRole('customer')}
                  >
                    <Text style={[s.roleSelectPillText, authSignupRole === 'customer' && s.roleSelectPillTextActive]}>
                      👤 Customer (Live Queues)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.roleSelectPill, authSignupRole === 'owner' && s.roleSelectPillActive]}
                    onPress={() => setAuthSignupRole('owner')}
                  >
                    <Text style={[s.roleSelectPillText, authSignupRole === 'owner' && s.roleSelectPillTextActive]}>
                      🏢 Salon Owner (SalonOS)
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Text style={s.fieldLabel}>EMAIL OR PHONE</Text>
            <TextInput
              style={s.formInput}
              placeholder="customer@snepr.demo"
              placeholderTextColor={C.mute}
              keyboardType="email-address"
              autoCapitalize="none"
              value={authEmail}
              onChangeText={setAuthEmail}
            />

            <Text style={s.fieldLabel}>PASSWORD</Text>
            <TextInput
              style={s.formInput}
              placeholder="••••••••••••"
              placeholderTextColor={C.mute}
              secureTextEntry
              value={authPass}
              onChangeText={setAuthPass}
            />

            <TouchableOpacity
              style={s.authSubmitBtn}
              onPress={handleManualAuth}
              activeOpacity={0.85}
            >
              <Text style={s.authSubmitBtnText}>
                {authMode === 'signin' ? 'Sign In to Snepr ➔' : 'Create Account & Continue ➔'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick 1-Tap Demo Credentials Section */}
          <View style={s.demoSection}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={s.demoSectionEyebrow}>DEMO CREDENTIALS (1-TAP INSTANT ACCESS)</Text>
              <Text style={s.demoSectionSub}>Tap any role to launch its complete interface immediately:</Text>
            </View>

            {/* 1. Customer Demo Card */}
            <TouchableOpacity
              style={s.demoCredentialCard}
              onPress={() => handleDemoLogin('customer')}
              activeOpacity={0.8}
            >
              <View style={s.demoCardHeadRow}>
                <View style={[s.demoRoleBadge, { backgroundColor: '#EBF7EE' }]}>
                  <Text style={[s.demoRoleBadgeText, { color: '#1C5434' }]}>👤 CUSTOMER INTERFACE</Text>
                </View>
                <Text style={s.demoTapAction}>1-Tap Launch ➔</Text>
              </View>
              <Text style={s.demoPersonaName}>Priya Mohapatra · Patia, Bhubaneswar</Text>
              <View style={s.demoCredsPill}>
                <Text style={s.demoCredsText}>customer@snepr.demo · SneprDemo@2026</Text>
              </View>
              <Text style={s.demoFeaturesText}>
                ✓ 13 Bhubaneswar Salons  ✓ Live 5-Stage Queue  ✓ GPS Route  ✓ AI Lookbook
              </Text>
            </TouchableOpacity>

            {/* 2. SalonOS Owner Demo Card */}
            <TouchableOpacity
              style={[s.demoCredentialCard, { borderColor: '#8A4C24', borderWidth: 1.5 }]}
              onPress={() => handleDemoLogin('owner')}
              activeOpacity={0.8}
            >
              <View style={s.demoCardHeadRow}>
                <View style={[s.demoRoleBadge, { backgroundColor: '#F7EFE9' }]}>
                  <Text style={[s.demoRoleBadgeText, { color: '#8A4C24' }]}>🏢 SALONOS OWNER WORKSPACE</Text>
                </View>
                <Text style={[s.demoTapAction, { color: '#8A4C24' }]}>1-Tap Launch ➔</Text>
              </View>
              <Text style={s.demoPersonaName}>Arjun Sharma · Lakmé Salon KIIT Road</Text>
              <View style={[s.demoCredsPill, { backgroundColor: '#F7EFE9' }]}>
                <Text style={[s.demoCredsText, { color: '#8A4C24' }]}>owner@snepr.demo · SneprDemo@2026</Text>
              </View>
              <Text style={s.demoFeaturesText}>
                ✓ 4 Stat Cards  ✓ 4 Live Chairs  ✓ Barber Roster  ✓ SaaS Plans (₹199, ₹400, ₹449)
              </Text>
            </TouchableOpacity>

            {/* 3. Staff Desk Demo Card */}
            <TouchableOpacity
              style={s.demoCredentialCard}
              onPress={() => handleDemoLogin('staff')}
              activeOpacity={0.8}
            >
              <View style={s.demoCardHeadRow}>
                <View style={[s.demoRoleBadge, { backgroundColor: '#FAF3E1' }]}>
                  <Text style={[s.demoRoleBadgeText, { color: '#705217' }]}>✂️ BARBER STAFF DESK</Text>
                </View>
                <Text style={s.demoTapAction}>1-Tap Launch ➔</Text>
              </View>
              <Text style={s.demoPersonaName}>Rahul Kumar · Master Barber (Station 1)</Text>
              <View style={[s.demoCredsPill, { backgroundColor: '#FAF3E1' }]}>
                <Text style={[s.demoCredsText, { color: '#705217' }]}>staff@snepr.demo · SneprDemo@2026</Text>
              </View>
              <Text style={s.demoFeaturesText}>
                ✓ Station Queue  ✓ Now Serving #024 Card  ✓ QR Code Scanner  ✓ Counter Walk-in
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={s.authFooterText}>Snepr Technologies Private Limited · Bhubaneswar, Odisha</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F3ED" />"""

assert old_return in code, "old_return not found"
code = code.replace(old_return, new_return)

# 4. Update Header Right with Log Out button
old_hdr_right = """        <View style={s.headerRight}>
          {/* Quick Experience Mode Switcher */}
          <TouchableOpacity
            style={s.roleSwitcherBtn}
            onPress={() => {
              if (role === 'customer') handleDemoLogin('owner');
              else if (role === 'owner') handleDemoLogin('staff');
              else handleDemoLogin('customer');
            }}
            activeOpacity={0.8}
          >
            <Text style={s.roleSwitcherBtnText}>
              {role === 'customer' ? 'Owner OS ➔' : role === 'owner' ? 'Staff ➔' : 'Customer ➔'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.avatarBtn}
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={s.avatarBtnText}>
              {role === 'customer' ? 'PM' : role === 'owner' ? 'AS' : 'RK'}
            </Text>
          </TouchableOpacity>
        </View>"""

new_hdr_right = """        <View style={s.headerRight}>
          {/* Quick Experience Mode Switcher */}
          <TouchableOpacity
            style={s.roleSwitcherBtn}
            onPress={() => {
              if (role === 'customer') handleDemoLogin('owner');
              else if (role === 'owner') handleDemoLogin('staff');
              else handleDemoLogin('customer');
            }}
            activeOpacity={0.8}
          >
            <Text style={s.roleSwitcherBtnText}>
              {role === 'customer' ? 'Owner OS ➔' : role === 'owner' ? 'Staff ➔' : 'Customer ➔'}
            </Text>
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity
            style={s.signOutHeaderBtn}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={s.signOutHeaderBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>"""

assert old_hdr_right in code, "old_hdr_right not found"
code = code.replace(old_hdr_right, new_hdr_right)

# 5. Update Profile sign out buttons to call handleSignOut
code = code.replace("onPress={() => setAuthModalVisible(true)}", "onPress={handleSignOut}")
code = code.replace("<Text style={s.signOutBtnText}>Switch Account / Demo Logins</Text>", "<Text style={s.signOutBtnText}>Log Out & Return to Sign In</Text>")

# 6. Add Styles for Sign In / Sign Up Screen
styles_anchor = "  footerVersionText: { textAlign: 'center', fontSize: 10, color: '#A18B76', paddingVertical: 16 }"
new_styles = """  footerVersionText: { textAlign: 'center', fontSize: 10, color: '#A18B76', paddingVertical: 16 },

  // Sign In / Sign Up Screen Styles
  authScreenScroll: { padding: 20, paddingTop: 40, paddingBottom: 60 },
  authScreenBrandHeader: { alignItems: 'center', marginBottom: 20 },
  authScreenWordmark: { fontSize: 36, fontWeight: '900', color: '#1B1410', letterSpacing: -1 },
  authCityBadge: {
    backgroundColor: '#F7EFE9',
    borderWidth: 1,
    borderColor: '#ECD9BE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 8,
  },
  authCityBadgeText: { fontSize: 11, fontWeight: '800', color: '#8A4C24' },
  authScreenHeadline: { fontSize: 20, fontWeight: '900', color: '#1B1410', marginTop: 10, textAlign: 'center' },
  authScreenSub: { fontSize: 12, color: '#6E6159', textAlign: 'center', marginTop: 4, lineHeight: 17, paddingHorizontal: 12 },
  authFormCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#211912',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  authModeTabRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E1D7',
  },
  authModeTab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  authModeTabActive: { backgroundColor: '#1B1410' },
  authModeTabText: { fontSize: 12, fontWeight: '700', color: '#6E6159' },
  authModeTabTextActive: { color: '#FFFFFF' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#6E6159', letterSpacing: 0.8, marginBottom: 5 },
  formInput: {
    height: 44,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1B1410',
    marginBottom: 12,
  },
  roleSelectPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E1D7',
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
  },
  roleSelectPillActive: { borderColor: '#8A4C24', backgroundColor: '#F7EFE9' },
  roleSelectPillText: { fontSize: 11, fontWeight: '700', color: '#6E6159' },
  roleSelectPillTextActive: { color: '#8A4C24', fontWeight: '800' },
  authSubmitBtn: {
    backgroundColor: '#1B1410',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  authSubmitBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  // Demo Credentials Section
  demoSection: { marginBottom: 16 },
  demoSectionEyebrow: { fontSize: 10, fontWeight: '900', color: '#8A4C24', letterSpacing: 1 },
  demoSectionSub: { fontSize: 11, color: '#6E6159', marginTop: 2, textAlign: 'center' },
  demoCredentialCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#211912',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  demoCardHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  demoRoleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  demoRoleBadgeText: { fontSize: 9.5, fontWeight: '800' },
  demoTapAction: { fontSize: 11, fontWeight: '800', color: '#1B1410' },
  demoPersonaName: { fontSize: 14, fontWeight: '800', color: '#1B1410', marginTop: 6 },
  demoCredsPill: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 6,
  },
  demoCredsText: { fontSize: 10.5, fontWeight: '700', color: '#6E6159' },
  demoFeaturesText: { fontSize: 10.5, color: '#6E6159', lineHeight: 15 },
  authFooterText: { textAlign: 'center', fontSize: 10, color: '#A18B76', marginTop: 10 },
  signOutHeaderBtn: { backgroundColor: '#F5EFEB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: '#E8E1D7' },
  signOutHeaderBtnText: { fontSize: 10, fontWeight: '800', color: '#8A4C24' }"""

assert styles_anchor in code, "styles_anchor not found"
code = code.replace(styles_anchor, new_styles)

with open('app/app/(tabs)/index.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully integrated initial Sign In / Sign Up Screen into app/app/(tabs)/index.tsx!")
