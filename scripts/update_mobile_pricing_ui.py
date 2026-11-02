import re

with open('app/app/(tabs)/index.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state variables if not present
state_target = "  const [currentPlan, setCurrentPlan] = useState<'base' | 'intermediate' | 'pro'>('intermediate');"
state_replacement = """  const [currentPlan, setCurrentPlan] = useState<'base' | 'intermediate' | 'pro'>('intermediate');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [calcDailyClients, setCalcDailyClients] = useState(35);
  const [calcTicketSize, setCalcTicketSize] = useState(350);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketTopic, setTicketTopic] = useState('Subscription & Billing');
  const [ticketDesc, setTicketDesc] = useState('');"""

assert state_target in code, "state_target not found"
code = code.replace(state_target, state_replacement)

# 2. Replace Tab D: Profile & Subscriptions in SalonOS Owner Desk
profile_tab_target = """            {/* TAB D: PROFILE & SUBSCRIPTIONS */}
            {ownerTab === 'profile' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={s.ownerHeadTitle}>Profile & Plans</Text>

                <View style={s.profileCard}>
                  <Text style={s.profileName}>Arjun Sharma</Text>
                  <Text style={s.profileEmail}>owner@snepr.demo · +91 92373 62221</Text>
                  <Text style={s.profilePhone}>Lakmé Salon — KIIT Road, Patia</Text>
                </View>

                <Text style={s.ownerSectionTitle}>Flat SaaS Plans (0% Commission)</Text>
                {[
                  { id: 'base', title: 'Barbershop Starter', price: '₹199', desc: '1 Active Chair · Real-time queue · Printable QR' },
                  { id: 'intermediate', title: 'High-Traffic Salon', price: '₹400', desc: 'Up to 3 Chairs & Staff · WhatsApp alerts · Loyalty network' },
                  { id: 'pro', title: 'Luxury Lounge', price: '₹449', desc: 'Unlimited chairs · Full AI studio · Priority support' },
                ].map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[s.planCard, currentPlan === p.id && s.planCardActive]}
                    onPress={() => { setCurrentPlan(p.id as any); Alert.alert('Plan Updated', `Selected ${p.title} (${p.price}/mo)`); }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={s.planTitle}>{p.title}</Text>
                      <Text style={s.planPrice}>{p.price}/mo</Text>
                    </View>
                    <Text style={s.planDesc}>{p.desc}</Text>
                    {currentPlan === p.id && <Text style={s.planActiveTag}>✓ Active Subscription</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}"""

profile_tab_replacement = """            {/* TAB D: PROFILE & PLANS — MATCHES SNEPR PRICING MASTER SPEC */}
            {ownerTab === 'profile' && (() => {
              const monthlyRevenue = calcDailyClients * calcTicketSize * 30;
              const commissionLoss = Math.round(monthlyRevenue * 0.25);
              const sneprCost = billingCycle === 'monthly' ? 400 : 340;
              const netMonthlySavings = commissionLoss - sneprCost;

              return (
                <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                  {/* Owner Account Card */}
                  <View style={s.ownerAccountCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={s.ownerAccountName}>Arjun Sharma</Text>
                        <Text style={s.ownerAccountSub}>owner@snepr.demo · +91 92373 62221</Text>
                        <Text style={s.ownerAccountSub}>Lakmé Salon — KIIT Road, Patia</Text>
                      </View>
                      <View style={s.ownerActivePill}>
                        <Text style={s.ownerActivePillText}>Active Owner</Text>
                      </View>
                    </View>
                  </View>

                  {/* Section Eyebrow & Main Title */}
                  <View style={{ alignItems: 'center', marginVertical: 14 }}>
                    <View style={s.pricingEyebrowPill}>
                      <Text style={s.pricingEyebrowText}>✦ SalonOS Subscription Plans</Text>
                    </View>
                    <Text style={s.pricingMasterTitle}>Simple, Flat Pricing for Salons</Text>
                    <Text style={s.pricingMasterSub}>
                      No 20% to 30% predatory marketplace commissions on your haircuts. Keep 100% of your earnings with transparent, predictable flat SaaS.
                    </Text>

                    {/* Monthly vs Annual Switcher */}
                    <View style={s.billingSwitcherPill}>
                      <TouchableOpacity
                        style={[s.billingToggleBtn, billingCycle === 'monthly' && s.billingToggleBtnActive]}
                        onPress={() => setBillingCycle('monthly')}
                      >
                        <Text style={[s.billingToggleText, billingCycle === 'monthly' && s.billingToggleTextActive]}>
                          Monthly Billing
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.billingToggleBtn, billingCycle === 'annual' && s.billingToggleBtnAnnualActive]}
                        onPress={() => setBillingCycle('annual')}
                      >
                        <Text style={[s.billingToggleText, billingCycle === 'annual' && s.billingToggleTextActive]}>
                          Annual Billing
                        </Text>
                        <View style={[s.saveBadge, billingCycle === 'annual' && s.saveBadgeActive]}>
                          <Text style={[s.saveBadgeText, billingCycle === 'annual' && s.saveBadgeTextActive]}>Save 15%</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ─── CARD 1: BASE PLAN ─── */}
                  <View style={s.luxuryPricingCard}>
                    <View style={s.pricingCardHeadRow}>
                      <Text style={s.planEyebrowLabel}>BASE PLAN</Text>
                      <View style={s.planCapPill}><Text style={s.planCapPillText}>Single Barber</Text></View>
                    </View>
                    <Text style={s.planHeading}>Barbershop Starter</Text>
                    <Text style={s.planDescription}>Single-chair barbershops & independent local groomers.</Text>
                    <View style={s.priceRow}>
                      <Text style={s.priceNumberBig}>{billingCycle === 'monthly' ? 'Rs. 199' : 'Rs. 169'}</Text>
                      <Text style={s.pricePerMonth}>/month</Text>
                    </View>
                    <Text style={s.priceBilledNote}>
                      {billingCycle === 'annual' ? 'Billed annually (Rs. 2,028/yr)' : 'Billed monthly, cancel anytime'}
                    </Text>
                    <View style={s.cardHr} />
                    <Text style={s.featureSectionHead}>EVERYTHING INCLUDED:</Text>
                    <View style={s.featureList}>
                      {[
                        '1 Active Stylist Chair live telemetry',
                        'Real-time chair countdown queue',
                        'Printable counter table QR standee',
                        'Basic SMS customer arrival alerts',
                        'Verified customer reviews & feedback',
                        '100% Free for all your customers',
                      ].map((item, idx) => (
                        <View key={idx} style={s.featureItemRow}>
                          <View style={s.greenCheckCircle}><Text style={s.greenCheckChar}>✓</Text></View>
                          <Text style={s.featureItemText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[s.planActionBtnOutlined, currentPlan === 'base' && s.planActionBtnActive]}
                      onPress={() => { setCurrentPlan('base'); Alert.alert('Plan Selected', 'Activated Barbershop Starter Plan'); }}
                    >
                      <Text style={[s.planActionBtnOutlinedText, currentPlan === 'base' && s.planActionBtnActiveText]}>
                        {currentPlan === 'base' ? '✓ Current Plan' : 'Get Started with Base'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ─── CARD 2: INTERMEDIATE PLAN (MOST POPULAR) ─── */}
                  <View style={s.luxuryPricingCardFeatured}>
                    <View style={s.mostPopularBadge}>
                      <Text style={s.mostPopularBadgeText}>MOST POPULAR</Text>
                    </View>
                    <View style={s.pricingCardHeadRow}>
                      <Text style={[s.planEyebrowLabel, { color: '#8A4C24' }]}>INTERMEDIATE</Text>
                      <View style={[s.planCapPill, { backgroundColor: '#F7EFE9' }]}>
                        <Text style={[s.planCapPillText, { color: '#8A4C24' }]}>Up to 3 Chairs</Text>
                      </View>
                    </View>
                    <Text style={s.planHeading}>High-Traffic Salon</Text>
                    <Text style={s.planDescription}>Neighborhood grooming parlors, unisex salons & busy studios.</Text>
                    <View style={s.priceRow}>
                      <Text style={[s.priceNumberBig, { color: '#8A4C24' }]}>{billingCycle === 'monthly' ? 'Rs. 400' : 'Rs. 340'}</Text>
                      <Text style={s.pricePerMonth}>/month</Text>
                    </View>
                    <Text style={[s.priceBilledNote, { color: '#8A4C24' }]}>
                      {billingCycle === 'annual' ? 'Billed annually (Rs. 4,080/yr) · Save Rs. 720' : 'Billed monthly, cancel anytime'}
                    </Text>
                    <View style={[s.cardHr, { backgroundColor: '#ECD9BE' }]} />
                    <Text style={s.featureSectionHead}>EVERYTHING IN BASE, PLUS:</Text>
                    <View style={s.featureList}>
                      {[
                        'Up to 3 Chairs & Staff Logins with individual queues',
                        'Multi-barber queue routing & fast reassignment',
                        'Automated WhatsApp customer delay & call-in alerts',
                        'Snepr Points Loyalty Network member listing',
                        'Peak-hour chair analytics & wait duration tracking',
                        '0% Cut — Keep every single rupee of client revenue',
                      ].map((item, idx) => (
                        <View key={idx} style={s.featureItemRow}>
                          <View style={[s.greenCheckCircle, { backgroundColor: '#F7EFE9' }]}>
                            <Text style={[s.greenCheckChar, { color: '#8A4C24' }]}>✓</Text>
                          </View>
                          <Text style={s.featureItemText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={s.planActionBtnFilled}
                      onPress={() => { setCurrentPlan('intermediate'); Alert.alert('Plan Selected', 'Activated High-Traffic Salon Plan'); }}
                    >
                      <Text style={s.planActionBtnFilledText}>
                        {currentPlan === 'intermediate' ? '✓ Current Plan (Intermediate)' : 'Choose Intermediate'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ─── CARD 3: PRO PLAN ─── */}
                  <View style={s.luxuryPricingCard}>
                    <View style={s.pricingCardHeadRow}>
                      <Text style={s.planEyebrowLabel}>PRO PLAN</Text>
                      <View style={s.planCapPill}><Text style={s.planCapPillText}>Unlimited</Text></View>
                    </View>
                    <Text style={s.planHeading}>Luxury Grooming Lounge</Text>
                    <Text style={s.planDescription}>Multi-chair luxury grooming chains, ateliers & hair studios.</Text>
                    <View style={s.priceRow}>
                      <Text style={s.priceNumberBig}>{billingCycle === 'monthly' ? 'Rs. 449' : 'Rs. 381'}</Text>
                      <Text style={s.pricePerMonth}>/month</Text>
                    </View>
                    <Text style={s.priceBilledNote}>
                      {billingCycle === 'annual' ? 'Billed annually (Rs. 4,572/yr)' : 'Billed monthly, cancel anytime'}
                    </Text>
                    <View style={s.cardHr} />
                    <Text style={s.featureSectionHead}>EVERYTHING IN INTERMEDIATE, PLUS:</Text>
                    <View style={s.featureList}>
                      {[
                        'Unlimited Chairs & Barbers with master admin dashboard',
                        'Full AI Snepr Studio integration for hairstyle previews',
                        'Advanced chair turnover, stylist performance & revenue metrics',
                        'Featured Placement on the city "Explore" directory',
                        'Priority 24/7 dedicated WhatsApp support desk',
                      ].map((item, idx) => (
                        <View key={idx} style={s.featureItemRow}>
                          <View style={s.greenCheckCircle}><Text style={s.greenCheckChar}>✓</Text></View>
                          <Text style={s.featureItemText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[s.planActionBtnOutlined, currentPlan === 'pro' && s.planActionBtnActive]}
                      onPress={() => { setCurrentPlan('pro'); Alert.alert('Plan Selected', 'Upgraded to Luxury Grooming Lounge Plan'); }}
                    >
                      <Text style={[s.planActionBtnOutlinedText, currentPlan === 'pro' && s.planActionBtnActiveText]}>
                        {currentPlan === 'pro' ? '✓ Current Plan (Pro)' : 'Upgrade to Pro'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ─── TRANSPARENT ECONOMICS CALCULATOR ─── */}
                  <View style={s.calculatorCard}>
                    <View style={s.calcBadgeRow}>
                      <Text style={s.calcBadgeText}>📊 Transparent Economics Calculator</Text>
                    </View>
                    <Text style={s.calcHeading}>How Much Are Aggregators Really Taking From You?</Text>
                    <Text style={s.calcSub}>Adjust your daily salon volume to see how much you save with Snepr's 0% cut.</Text>

                    {/* Interactive Steppers */}
                    <View style={s.calcControlsRow}>
                      <View style={s.calcControlBox}>
                        <Text style={s.calcControlLabel}>Daily Clients</Text>
                        <View style={s.stepperRow}>
                          <TouchableOpacity
                            style={s.stepperBtn}
                            onPress={() => setCalcDailyClients(Math.max(5, calcDailyClients - 5))}
                          >
                            <Text style={s.stepperBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={s.stepperValText}>{calcDailyClients}</Text>
                          <TouchableOpacity
                            style={s.stepperBtn}
                            onPress={() => setCalcDailyClients(Math.min(150, calcDailyClients + 5))}
                          >
                            <Text style={s.stepperBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={s.calcControlBox}>
                        <Text style={s.calcControlLabel}>Avg. Ticket (₹)</Text>
                        <View style={s.stepperRow}>
                          <TouchableOpacity
                            style={s.stepperBtn}
                            onPress={() => setCalcTicketSize(Math.max(100, calcTicketSize - 25))}
                          >
                            <Text style={s.stepperBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={s.stepperValText}>₹{calcTicketSize}</Text>
                          <TouchableOpacity
                            style={s.stepperBtn}
                            onPress={() => setCalcTicketSize(Math.min(2000, calcTicketSize + 25))}
                          >
                            <Text style={s.stepperBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Monthly Impact Results Box */}
                    <View style={s.calcResultsBox}>
                      <Text style={s.calcResultsHead}>MONTHLY FINANCIAL IMPACT</Text>
                      <View style={s.calcRow}>
                        <Text style={s.calcRowLabel}>Estimated Monthly Revenue:</Text>
                        <Text style={s.calcRowVal}>Rs. {monthlyRevenue.toLocaleString('en-IN')}</Text>
                      </View>
                      <View style={s.calcRow}>
                        <Text style={[s.calcRowLabel, { color: '#C2410C' }]}>25% Aggregator Commission Cut:</Text>
                        <Text style={[s.calcRowVal, { color: '#C2410C' }]}>− Rs. {commissionLoss.toLocaleString('en-IN')}</Text>
                      </View>
                      <View style={s.calcRow}>
                        <Text style={s.calcRowLabel}>Snepr Flat Subscription:</Text>
                        <Text style={s.calcRowVal}>− Rs. {sneprCost}</Text>
                      </View>
                      <View style={[s.cardHr, { backgroundColor: '#E0D4C5', marginVertical: 8 }]} />
                      <View style={s.calcRow}>
                        <Text style={[s.calcRowLabel, { fontWeight: '800', color: '#1B1410' }]}>Net Monthly Savings:</Text>
                        <Text style={[s.calcRowVal, { fontSize: 16, fontWeight: '900', color: '#1C5434' }]}>
                          + Rs. {netMonthlySavings.toLocaleString('en-IN')}
                        </Text>
                      </View>
                      <View style={s.keepAllBanner}>
                        <Text style={s.keepAllBannerText}>
                          🎉 Rs. {netMonthlySavings.toLocaleString('en-IN')} stays in your salon's bank account every month!
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ─── SUPPORT & HELP CENTRE ─── */}
                  <View style={s.supportCentreCard}>
                    <Text style={s.supportHead}>Help & Support Desk</Text>
                    <Text style={s.supportSub}>Need help with salon queues, hardware standees or custom plans?</Text>
                    <TouchableOpacity
                      style={s.raiseTicketBtn}
                      onPress={() => setShowSupportModal(true)}
                    >
                      <Text style={s.raiseTicketBtnText}>+ Create Support Ticket</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={s.footerVersionText}>Snepr SalonOS · Bhubaneswar Launch Edition · v1.0.4</Text>
                </ScrollView>
              );
            })()}"""

assert profile_tab_target in code, "profile_tab_target not found"
code = code.replace(profile_tab_target, profile_tab_replacement)

# 3. Add Support Modal before closing root View
modal_target = """    </View>
  );
}"""

modal_addition = """      {/* SUPPORT TICKET MODAL */}
      <Modal visible={showSupportModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.authCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={s.authTitle}>Submit Support Ticket</Text>
              <TouchableOpacity onPress={() => setShowSupportModal(false)}>
                <Text style={{ fontSize: 18, color: C.mute, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 11, color: C.text2, marginBottom: 10 }}>Our local Bhubaneswar technical team replies within 1 hour.</Text>
            <TextInput
              style={s.textInputBox}
              placeholder="Ticket Subject (e.g. Queue Standee QR)"
              value={ticketSubject}
              onChangeText={setTicketSubject}
            />
            <TextInput
              style={s.textInputBox}
              placeholder="Topic (Subscription / Barbers / Queue)"
              value={ticketTopic}
              onChangeText={setTicketTopic}
            />
            <TextInput
              style={[s.textInputBox, { height: 80, textAlignVertical: 'top', paddingTop: 8 }]}
              placeholder="Describe your issue or request in detail..."
              multiline
              numberOfLines={3}
              value={ticketDesc}
              onChangeText={setTicketDesc}
            />
            <TouchableOpacity
              style={s.signInSubmitBtn}
              onPress={() => {
                if (!ticketSubject.trim()) { Alert.alert('Error', 'Please enter a ticket subject.'); return; }
                Alert.alert('Ticket Submitted', `Ticket #${Math.floor(1000 + Math.random() * 9000)} created. We will reach you on WhatsApp.`);
                setTicketSubject('');
                setTicketDesc('');
                setShowSupportModal(false);
              }}
            >
              <Text style={s.signInSubmitBtnText}>Submit Support Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}"""

assert modal_target in code, "modal_target not found"
code = code.replace(modal_target, modal_addition)

# 4. Add luxury styles to StyleSheet
styles_target = "  locItemText: { fontSize: 13, color: C.espresso, fontWeight: '600' },"
styles_addition = """  locItemText: { fontSize: 13, color: C.espresso, fontWeight: '600' },

  // Luxury Editorial Pricing & Plans Styles
  ownerAccountCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#211912',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  ownerAccountName: { fontSize: 16, fontWeight: '800', color: '#1B1410' },
  ownerAccountSub: { fontSize: 11, color: '#6E6159', marginTop: 2 },
  ownerActivePill: { backgroundColor: '#EBF7EE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  ownerActivePillText: { fontSize: 10, fontWeight: '800', color: '#1C5434' },
  pricingEyebrowPill: {
    backgroundColor: '#F7EFE9',
    borderWidth: 1,
    borderColor: '#ECD9BE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pricingEyebrowText: { fontSize: 11, fontWeight: '800', color: '#8A4C24' },
  pricingMasterTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1B1410',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  pricingMasterSub: {
    fontSize: 12,
    color: '#6E6159',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
    paddingHorizontal: 10,
  },
  billingSwitcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 999,
    padding: 4,
    marginTop: 14,
    gap: 4,
  },
  billingToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  billingToggleBtnActive: { backgroundColor: '#1B1410' },
  billingToggleBtnAnnualActive: { backgroundColor: '#8A4C24' },
  billingToggleText: { fontSize: 11, fontWeight: '700', color: '#6E6159' },
  billingToggleTextActive: { color: '#FFFFFF' },
  saveBadge: {
    backgroundColor: '#FAF3E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 4,
  },
  saveBadgeActive: { backgroundColor: 'rgba(255,255,255,0.22)' },
  saveBadgeText: { fontSize: 9, fontWeight: '800', color: '#705217' },
  saveBadgeTextActive: { color: '#FFFFFF' },

  // Pricing Cards
  luxuryPricingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#211912',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  luxuryPricingCardFeatured: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#8A4C24',
    borderRadius: 26,
    padding: 20,
    paddingTop: 26,
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#8A4C24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  mostPopularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#8A4C24',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    elevation: 4,
  },
  mostPopularBadgeText: { fontSize: 10, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.8 },
  pricingCardHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planEyebrowLabel: { fontSize: 11, fontWeight: '800', color: '#6E6159', letterSpacing: 0.8 },
  planCapPill: { backgroundColor: '#F5EFEB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  planCapPillText: { fontSize: 10, fontWeight: '700', color: '#6E6159' },
  planHeading: { fontSize: 19, fontWeight: '800', color: '#1B1410', marginTop: 6 },
  planDescription: { fontSize: 11.5, color: '#6E6159', marginTop: 2, lineHeight: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 12 },
  priceNumberBig: { fontSize: 32, fontWeight: '900', color: '#1B1410', letterSpacing: -0.5 },
  pricePerMonth: { fontSize: 12, fontWeight: '700', color: '#6E6159' },
  priceBilledNote: { fontSize: 10, color: '#9C9089', marginTop: 1 },
  cardHr: { height: 1, backgroundColor: '#E8E1D7', marginVertical: 14 },
  featureSectionHead: { fontSize: 10, fontWeight: '800', color: '#1B1410', letterSpacing: 0.8, marginBottom: 10 },
  featureList: { gap: 9 },
  featureItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  greenCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EBF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  greenCheckChar: { fontSize: 11, fontWeight: 'bold', color: '#1C5434' },
  featureItemText: { flex: 1, fontSize: 11.5, color: '#51453E', lineHeight: 16 },
  planActionBtnOutlined: {
    borderWidth: 1,
    borderColor: '#E8E1D7',
    backgroundColor: '#FAF7F2',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  planActionBtnOutlinedText: { fontSize: 12, fontWeight: '800', color: '#1B1410' },
  planActionBtnFilled: {
    backgroundColor: '#8A4C24',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  planActionBtnFilledText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  planActionBtnActive: { backgroundColor: '#1B1410', borderColor: '#1B1410' },
  planActionBtnActiveText: { color: '#FFFFFF' },

  // Economics Calculator Styles
  calculatorCard: {
    backgroundColor: '#F7EFE9',
    borderWidth: 1,
    borderColor: '#ECD9BE',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  calcBadgeRow: { marginBottom: 6 },
  calcBadgeText: { fontSize: 11, fontWeight: '800', color: '#8A4C24' },
  calcHeading: { fontSize: 18, fontWeight: '900', color: '#1B1410', letterSpacing: -0.3 },
  calcSub: { fontSize: 11, color: '#6E6159', marginTop: 3, lineHeight: 15 },
  calcControlsRow: { flexDirection: 'row', gap: 10, marginVertical: 14 },
  calcControlBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  calcControlLabel: { fontSize: 10, fontWeight: '700', color: '#6E6159' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5EFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: { fontSize: 15, fontWeight: '900', color: '#1B1410' },
  stepperValText: { fontSize: 14, fontWeight: '800', color: '#1B1410' },
  calcResultsBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 16,
    padding: 14,
  },
  calcResultsHead: { fontSize: 10, fontWeight: '800', color: '#8A4C24', letterSpacing: 0.8, marginBottom: 8 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  calcRowLabel: { fontSize: 11.5, color: '#6E6159' },
  calcRowVal: { fontSize: 12, fontWeight: '700', color: '#1B1410' },
  keepAllBanner: {
    backgroundColor: '#EBF7EE',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  keepAllBannerText: { fontSize: 10.5, fontWeight: '800', color: '#1C5434', textAlign: 'center' },

  // Support Centre & Footer
  supportCentreCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D7',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  supportHead: { fontSize: 14, fontWeight: '800', color: '#1B1410' },
  supportSub: { fontSize: 11, color: '#6E6159', marginTop: 3 },
  raiseTicketBtn: {
    backgroundColor: '#1B1410',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  raiseTicketBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  footerVersionText: { textAlign: 'center', fontSize: 10, color: '#A18B76', paddingVertical: 16 }"""

assert styles_target in code, "styles_target not found"
code = code.replace(styles_target, styles_addition)

with open('app/app/(tabs)/index.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated app/app/(tabs)/index.tsx with Snepr Pricing and luxury design!")

