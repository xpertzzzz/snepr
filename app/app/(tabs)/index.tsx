import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// 100% Light-Themed Snepr Editorial Palette (Cream, Paper, Espresso, Cognac, Gold)
const C = {
  ivory: '#F7F3ED',
  paper: '#FFFDF9',
  creamSoft: '#F0E8DE',
  creamMid: '#EEE5DA',
  espresso: '#211912',
  brown: '#70472F',
  brown2: '#956746',
  gold: '#C69A5C',
  goldSoft: '#FAF3E1',
  goldInk: '#705217',
  text: '#211912',
  text2: '#8C8074',
  mute: '#A18B76',
  line: '#EEE5DA',
  green: '#477B5D',
  greenSoft: '#E8F3EB',
  greenInk: '#28734F',
  amber: '#D49A4D',
  amberSoft: '#FAF3E6',
};

// Verified Bhubaneswar Lead Database
const BHUBANESWAR_SALONS = [
  {
    id: 1,
    name: 'Lakmé Salon — For Him and Her',
    locality: 'KIIT Road, opp. Manyavar, Patia',
    area: 'Patia',
    wait: '0 mins',
    ahead: 0,
    price: '₹350',
    rating: '4.8 (850+)',
    chairs: [
      { no: 1, barber: 'Rahul Kumar', status: 'Free Now', busy: false },
      { no: 2, barber: 'Amit Dash', status: 'Free Now', busy: false },
      { no: 3, barber: 'Pooja Sen', status: 'Layer Cut (12m)', busy: true },
    ],
  },
  {
    id: 2,
    name: 'NVN Unisex Salon',
    locality: 'Plot 386, Patia Square, Nandankanan Rd',
    area: 'Patia',
    wait: '5 mins',
    ahead: 1,
    price: '₹250',
    rating: '5.0 (284)',
    chairs: [
      { no: 1, barber: 'Rakesh Barik', status: 'Beard Trim (5m)', busy: true },
      { no: 2, barber: 'Bikram Sahoo', status: 'Free Now', busy: false },
    ],
  },
  {
    id: 3,
    name: 'Green Trends Unisex Salon — Patia',
    locality: 'D1 Square, above Utkal Hyundai, Patia',
    area: 'Patia',
    wait: '15 mins',
    ahead: 2,
    price: '₹300',
    rating: '4.7 (4,887)',
    chairs: [
      { no: 1, barber: 'Subham Nayak', status: 'Haircut (15m)', busy: true },
      { no: 2, barber: 'Alok Panda', status: 'Free Now', busy: false },
    ],
  },
  {
    id: 4,
    name: 'MMT Premium Unisex Salon',
    locality: 'GPS Tower, opp. Koel Campus, Patia',
    area: 'Patia',
    wait: '8 mins',
    ahead: 1,
    price: '₹280',
    rating: '4.8 (309)',
    chairs: [
      { no: 1, barber: 'Manas Pradhan', status: 'Beard Sculpt', busy: true },
      { no: 2, barber: 'Deepak Sethi', status: 'Free Now', busy: false },
    ],
  },
  {
    id: 5,
    name: 'Level Up Studio Unisex Salon',
    locality: 'Sector 1, Niladri Vihar, Chandrasekharpur',
    area: 'Chandrasekharpur',
    wait: '0 mins',
    ahead: 0,
    price: '₹250',
    rating: '4.9 (22)',
    chairs: [
      { no: 1, barber: 'Debasish Rout', status: 'Free Now', busy: false },
      { no: 2, barber: 'Snehalata Jena', status: 'Free Now', busy: false },
    ],
  },
  {
    id: 6,
    name: 'Indulge The Salon — Pal Heights',
    locality: 'Pal Heights Mall, Jayadev Vihar',
    area: 'Jaydev Vihar',
    wait: '18 mins',
    ahead: 2,
    price: '₹500',
    rating: '4.6 (880)',
    chairs: [
      { no: 1, barber: 'Vikram Pattnaik', status: 'Creative Cut (18m)', busy: true },
      { no: 2, barber: 'Suman Roy', status: 'Free Now', busy: false },
    ],
  },
  {
    id: 7,
    name: '7Sense Unisex Salon — Saheed Nagar',
    locality: 'Saheed Nagar, Near Durga Mandap',
    area: 'Saheed Nagar',
    wait: '10 mins',
    ahead: 1,
    price: '₹300',
    rating: '4.8 (512)',
    chairs: [
      { no: 1, barber: 'Debashis Jena', status: 'Haircut (10m)', busy: true },
      { no: 2, barber: 'Mamata Dash', status: 'Free Now', busy: false },
    ],
  },
];

const BHUBANESWAR_LOCALITIES = [
  'Patia',
  'KIIT Road',
  'Saheed Nagar',
  'Jaydev Vihar',
  'Chandrasekharpur',
  'Rasulgarh',
  'Nayapalli',
  'Khandagiri',
];

export default function SneprApp() {
  // Authentication State & Initial Screen
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authSignupRole, setAuthSignupRole] = useState<'customer' | 'owner'>('customer');

  // Experience Mode: 'customer' | 'owner' | 'staff'
  const [role, setRole] = useState<'customer' | 'owner' | 'staff'>('customer');

  // Customer Navigation Tabs: 'explore' | 'queue' | 'studio' | 'profile'
  const [customerTab, setCustomerTab] = useState<'explore' | 'queue' | 'studio' | 'profile'>('explore');

  // SalonOS Owner Navigation Tabs: 'overview' | 'staff' | 'analytics' | 'profile'
  const [ownerTab, setOwnerTab] = useState<'overview' | 'staff' | 'analytics' | 'profile'>('overview');

  // Staff Navigation Tabs: 'queue' | 'scan' | 'walkin' | 'profile'
  const [staffTab, setStaffTab] = useState<'queue' | 'scan' | 'walkin' | 'profile'>('queue');

  // Locality & Search State
  const [selectedArea, setSelectedArea] = useState('Patia');
  const [localityModalVisible, setLocalityModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Active Queue State (5-Stage Visit Progression)
  const [hasPass, setHasPass] = useState(true);
  const [ticketToken, setTicketToken] = useState('#024');
  const [ticketSalon, setTicketSalon] = useState('Lakmé Salon — For Him and Her');
  const [ticketLocality, setTicketLocality] = useState('KIIT Road, Patia, Bhubaneswar');
  const [ticketStage, setTicketStage] = useState(2); // 1: Confirmed, 2: In Queue, 3: Head to Salon, 4: In Chair, 5: Completed
  const [ticketPosition, setTicketPosition] = useState(2);
  const [ticketWaitMins, setTicketWaitMins] = useState(14);
  const [ticketChair, setTicketChair] = useState('Station 1 (Rahul Kumar)');

  // SalonOS State
  const [ownerChairs, setOwnerChairs] = useState([
    { id: 1, name: 'Station 1', barber: 'Rahul Kumar', status: 'Busy', customer: 'Rohan Patel (Haircut)', elapsed: '14m' },
    { id: 2, name: 'Station 2', barber: 'Amit Dash', status: 'Free', customer: 'Ready for customer', elapsed: '' },
    { id: 3, name: 'Station 3', barber: 'Pooja Sen', status: 'Busy', customer: 'Aman Sharma (Beard)', elapsed: '8m' },
    { id: 4, name: 'Station 4', barber: 'Bikash Raut', status: 'Off', customer: 'Off duty', elapsed: '' },
  ]);

  const [ownerQueue, setOwnerQueue] = useState([
    { token: '#024', name: 'Rohan Patel', service: 'Haircut', status: 'SERVING', station: 'Station 1' },
    { token: '#025', name: 'Priya Mohapatra', service: 'Hair styling', status: 'WAITING', station: '~10m wait' },
    { token: '#026', name: 'Dev Anand', service: 'Haircut + Beard', status: 'WAITING', station: '~22m wait' },
  ]);

  const [ownerStaffList, setOwnerStaffList] = useState([
    { name: 'Rahul Kumar', role: 'Senior Barber', chair: 'Station 1', served: 12, onDuty: true },
    { name: 'Amit Dash', role: 'Master Stylist', chair: 'Station 2', served: 9, onDuty: true },
    { name: 'Pooja Sen', role: 'Grooming Specialist', chair: 'Station 3', served: 7, onDuty: true },
    { name: 'Bikash Raut', role: 'Junior Stylist', chair: 'Station 4', served: 0, onDuty: false },
  ]);

  const [currentPlan, setCurrentPlan] = useState<'base' | 'intermediate' | 'pro'>('intermediate');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [calcDailyClients, setCalcDailyClients] = useState(35);
  const [calcTicketSize, setCalcTicketSize] = useState(350);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketTopic, setTicketTopic] = useState('Subscription & Billing');
  const [ticketDesc, setTicketDesc] = useState('');

  // Staff State
  const [staffServing, setStaffServing] = useState<any>({
    token: '#024',
    name: 'Arjun Sharma',
    service: 'Haircut',
    time: 'Started 10:42 AM',
  });
  const [staffNextQueue, setStaffNextQueue] = useState([
    { token: '#025', name: 'Priya Mohapatra', service: 'Haircut · Joined 10:51 AM' },
    { token: '#026', name: 'Rohan Patel', service: 'Beard trim · Joined 11:04 AM' },
    { token: '#027', name: 'Dev Anand', service: 'Haircut + Beard · Joined 11:15 AM' },
  ]);

  // Modals & Inputs
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [pointsBalance, setPointsBalance] = useState(140);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteContact, setInviteContact] = useState('');
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinService, setWalkinService] = useState('Haircut');
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);

  // Sign Out Handler
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
      Alert.alert('Customer Interface Activated', 'Welcome Priya Mohapatra (customer@snepr.demo)\n\n• Explore Salons\n• Live 5-Stage Queue\n• GPS Route & Directions\n• AI Studio Lookbook');
    } else if (userRole === 'owner') {
      setOwnerTab('overview');
      Alert.alert('SalonOS Owner Interface Activated', 'Welcome Arjun Sharma (owner@snepr.demo)\n\n• Live Chairs & Overview\n• Staff Roster\n• Analytics\n• Flat SaaS Plans (₹199, ₹400, ₹449)');
    } else if (userRole === 'staff') {
      setStaffTab('queue');
      Alert.alert('Staff Interface Activated', 'Welcome Rahul Kumar (staff@snepr.demo)\n\n• Station 1 Queue\n• Now Serving #024\n• Scan QR Code\n• Walk-in Customer Intake');
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
  };

  // Join Queue Action
  const handleJoinQueue = (salonItem: typeof BHUBANESWAR_SALONS[0]) => {
    setTicketSalon(salonItem.name);
    setTicketLocality(salonItem.locality);
    setTicketToken('#028');
    setTicketStage(2);
    setTicketPosition(salonItem.ahead + 1);
    setTicketWaitMins(parseInt(salonItem.wait) || 12);
    setHasPass(true);
    setCustomerTab('queue');
    Alert.alert('Queue Joined', `Token #028 reserved at ${salonItem.name}. Estimated wait: ${salonItem.wait}.`);
  };

  // SalonOS Queue Operations
  const handleOwnerCallNext = () => {
    if (ownerQueue.filter(q => q.status === 'WAITING').length === 0) {
      Alert.alert('Queue Empty', 'No customers waiting in queue.');
      return;
    }
    const nextItem = ownerQueue.find(q => q.status === 'WAITING');
    if (nextItem) {
      setOwnerQueue(prev => prev.map(q => q.token === nextItem.token ? { ...q, status: 'SERVING', station: 'Station 2' } : q));
      Alert.alert('Next Called', `Token ${nextItem.token} (${nextItem.name}) called to Station 2.`);
    }
  };

  const handleOwnerComplete = (tok: string) => {
    setOwnerQueue(prev => prev.filter(q => q.token !== tok));
    Alert.alert('Service Completed', `Token ${tok} completed. +10 Snepr Points credited to customer.`);
  };

  // Staff Queue Operations
  const handleStaffCompleteService = () => {
    if (!staffServing) {
      Alert.alert('Station Idle', 'No service currently in progress.');
      return;
    }
    Alert.alert('Service Complete', `Completed service for ${staffServing.token} (${staffServing.name}).`);
    setStaffServing(null);
  };

  const handleStaffCallNext = () => {
    if (staffNextQueue.length === 0) {
      Alert.alert('Queue Empty', 'No customers waiting.');
      return;
    }
    const [next, ...remaining] = staffNextQueue;
    setStaffServing({ token: next.token, name: next.name.split(' · ')[0], service: 'Haircut', time: 'Started Just Now' });
    setStaffNextQueue(remaining);
    Alert.alert('Calling Customer', `Now calling ${next.token} to Station 1.`);
  };

  // Filtered Salons
  const filteredSalons = BHUBANESWAR_SALONS.filter(s => {
    const areaMatch = selectedArea === 'Patia' ? s.area === 'Patia' : s.area.toLowerCase().includes(selectedArea.toLowerCase());
    const searchMatch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.locality.toLowerCase().includes(search.toLowerCase());
    return areaMatch && searchMatch;
  });

  // If not logged in, display the dedicated Sign In / Sign Up screen
  if (!isLoggedIn) {
    return (
      <View style={[s.container, { backgroundColor: '#FAF7F2' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
        <ScrollView contentContainerStyle={s.authScreenScroll} showsVerticalScrollIndicator={false}>
          {/* Brand Vector Logo & Header */}
          <View style={s.authScreenBrandHeader}>
            <Image
              source={require('../../assets/images/snepr-logo-transparent.png')}
              style={s.authScreenLogoImg}
              resizeMode="contain"
            />
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
      <StatusBar barStyle="dark-content" backgroundColor="#F7F3ED" />

      {/* ─── TOP HEADER BAR ─── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image
            source={require('../../assets/images/snepr-logo-transparent.png')}
            style={s.headerLogoImg}
            resizeMode="contain"
          />

          {role === 'customer' ? (
            <TouchableOpacity
              style={s.areaPill}
              onPress={() => setLocalityModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={s.greenDot} />
              <Text style={s.areaPillText} numberOfLines={1}>
                {selectedArea}, Bhubaneswar ▼
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={s.roleBadgePill}>
              <Text style={s.roleBadgePillText}>
                {role === 'owner' ? 'SalonOS Owner Desk' : 'Barber Staff Desk'}
              </Text>
            </View>
          )}
        </View>

        <View style={s.headerRight}>
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
        </View>
      </View>

      {/* ─── BODY CONTAINER (3 SEPARATE WORKSPACES) ─── */}
      <View style={s.body}>

        {/* ═══════════════════════════════════════════════════ */}
        {/* EXPERIENCE 1: CUSTOMER APPLICATION (app-customer ui.html) */}
        {/* ═══════════════════════════════════════════════════ */}
        {role === 'customer' && (
          <View style={{ flex: 1 }}>
            {/* VIEW A: EXPLORE */}
            {customerTab === 'explore' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <View style={s.customerHero}>
                  <Text style={s.heroEyebrow}>FIND A SALON. SKIP THE WAIT.</Text>
                  <Text style={s.heroTitle}>Salons near you</Text>
                  <Text style={s.heroDesc}>Check the queue before you visit. Join when you're ready.</Text>
                  <View style={s.liveUpdateBadge}>
                    <View style={s.greenDot} />
                    <Text style={s.liveUpdateBadgeText}>Queue updates from salons</Text>
                  </View>
                </View>

                {/* Search Bar */}
                <View style={s.searchRow}>
                  <Text style={s.searchIcon}>⌕</Text>
                  <TextInput
                    style={s.searchInput}
                    placeholder="Search salon, stylist or service..."
                    placeholderTextColor={C.mute}
                    value={search}
                    onChangeText={setSearch}
                  />
                  {search ? (
                    <TouchableOpacity onPress={() => setSearch('')}>
                      <Text style={{ color: C.mute, fontSize: 16 }}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Area Quick Filter Chips */}
                <View style={s.chipRow}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {BHUBANESWAR_LOCALITIES.map(loc => {
                      const isActive = selectedArea === loc;
                      return (
                        <TouchableOpacity
                          key={loc}
                          style={[s.chip, isActive && s.chipActive]}
                          onPress={() => setSelectedArea(loc)}
                        >
                          <Text style={[s.chipText, isActive && s.chipTextActive]}>{loc}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Salon List Section */}
                <View style={s.sectionHeadRow}>
                  <Text style={s.sectionHeadTitle}>Salons in {selectedArea}</Text>
                  <Text style={s.sectionHeadCount}>{filteredSalons.length} salons</Text>
                </View>

                {filteredSalons.map(item => (
                  <View key={item.id} style={s.salonCard}>
                    <View style={s.cardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.salonCardName}>{item.name}</Text>
                        <Text style={s.salonCardLoc}>{item.locality}</Text>
                      </View>
                      <View style={s.waitBadge}>
                        <Text style={s.waitBadgeNum}>{item.wait}</Text>
                        <Text style={s.waitBadgeLabel}>EST WAIT</Text>
                      </View>
                    </View>

                    {/* Live Chair Telemetry */}
                    <View style={s.chairsRow}>
                      {item.chairs.map((ch, idx) => (
                        <View key={idx} style={[s.chairPill, ch.busy ? s.chairBusy : s.chairFree]}>
                          <View style={[s.chairDot, ch.busy ? s.dotBusy : s.dotFree]} />
                          <Text style={s.chairText}>Chair {ch.no}: {ch.status}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={s.cardBottom}>
                      <View>
                        <Text style={s.cardPrice}>Starts from {item.price}</Text>
                        <Text style={s.cardRating}>★ {item.rating}</Text>
                      </View>
                      <TouchableOpacity
                        style={s.joinBtn}
                        onPress={() => handleJoinQueue(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={s.joinBtnText}>Join Queue (₹0)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* VIEW B: MY QUEUE (5-STAGE PROGRESS & GPS ROUTE) */}
            {customerTab === 'queue' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.ticketCard}>
                  <View style={s.ticketHeader}>
                    <View>
                      <Text style={s.ticketEyebrow}>YOUR VERIFIED TICKET</Text>
                      <Text style={s.ticketSalonTitle}>{ticketSalon}</Text>
                      <Text style={s.ticketLocSub}>{ticketLocality}</Text>
                    </View>
                    <View style={s.ticketBigPill}>
                      <Text style={s.ticketBigNum}>{ticketToken}</Text>
                    </View>
                  </View>

                  <View style={s.waitSummaryBox}>
                    <Text style={s.waitSummaryNum}>~{ticketWaitMins} mins wait</Text>
                    <Text style={s.waitSummarySub}>{ticketPosition} customer(s) ahead in live queue</Text>
                  </View>

                  {/* 5-STAGE PROGRESS TIMELINE */}
                  <View style={s.timelineBox}>
                    <Text style={s.timelineTitle}>5-STAGE VISIT PROGRESS</Text>
                    {[
                      { step: 1, title: 'Ticket Confirmed', desc: 'Pass issued and verified by backend' },
                      { step: 2, title: `In Queue (#${ticketPosition} in line)`, desc: 'Live position locked in chair queue' },
                      { step: 3, title: 'Head to Salon', desc: 'GPS route prompt: Depart now to reach on time' },
                      { step: 4, title: 'In Chair', desc: 'Barber has called your token' },
                      { step: 5, title: 'Completed (+10 Points)', desc: 'Service completed & loyalty points awarded' },
                    ].map(st => {
                      const isDone = ticketStage > st.step;
                      const isCurrent = ticketStage === st.step;
                      return (
                        <View key={st.step} style={s.timelineRow}>
                          <View style={[s.timelineDot, isDone ? s.dotDone : isCurrent ? s.dotCurrent : s.dotPending]}>
                            <Text style={s.timelineDotText}>{isDone ? '✓' : st.step}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[s.timelineStepTitle, isCurrent && { color: C.brown }]}>{st.title}</Text>
                            <Text style={s.timelineStepDesc}>{st.desc}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* GPS ROUTE & DIRECTIONS CARD */}
                  <View style={s.gpsMapCard}>
                    <View style={s.gpsMapHead}>
                      <Text style={s.gpsMapHeadTitle}>GPS Route & Directions</Text>
                      <Text style={s.gpsMapHeadEta}>1.2 km · ~6 mins</Text>
                    </View>
                    <View style={s.mapPlaceholder}>
                      <Text style={{ fontSize: 24, marginBottom: 4 }}>🧭</Text>
                      <Text style={s.mapText}>Patia Square ➔ KIIT Road (opp. Manyavar)</Text>
                      <Text style={s.mapSubText}>Turn right at Union Bank junction. 400m straight.</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            {/* VIEW C: AI STUDIO */}
            {customerTab === 'studio' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.studioHero}>
                  <Text style={s.studioEyebrow}>AI HAIRSTYLE STUDIO</Text>
                  <Text style={s.studioTitle}>Smart Hairstyle Inspiration</Text>
                  <Text style={s.studioDesc}>Inspect precision clipper guards, texture blends, and millimeter scissor lengths.</Text>
                </View>

                {[
                  { name: 'Low Taper Textured Crop', match: '98% Oval & Square Match', specs: 'Guard #2 taper at sideburns & nape · 1.5 in scissor point cut top' },
                  { name: 'Classic Side Part Pompadour', match: '94% Square Match', specs: 'Scissor over comb graduating 1/2 to 1 in · 3.5 in top tapering to crown' },
                  { name: 'Textured Modern Quiff', match: '92% Diamond Match', specs: 'Mid skin drop fade · 2.5 in finger length upward fringe' },
                ].map((look, idx) => (
                  <View key={idx} style={s.lookCard}>
                    <Text style={s.lookName}>{look.name}</Text>
                    <Text style={s.lookMatch}>{look.match}</Text>
                    <Text style={s.lookSpecs}>{look.specs}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* VIEW D: PROFILE */}
            {customerTab === 'profile' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.profileCard}>
                  <View style={s.profileAvatar}>
                    <Text style={s.profileAvatarText}>PM</Text>
                  </View>
                  <Text style={s.profileName}>Priya Mohapatra</Text>
                  <Text style={s.profileEmail}>customer@snepr.demo</Text>
                  <Text style={s.profilePhone}>+91 94370 12345</Text>

                  <View style={s.pointsBalanceCard}>
                    <Text style={s.pointsBalanceNum}>{pointsBalance} Points</Text>
                    <Text style={s.pointsBalanceSub}>= ₹{pointsBalance} discount on your next visit</Text>
                  </View>

                  <TouchableOpacity
                    style={s.signOutBtn}
                    onPress={handleSignOut}
                  >
                    <Text style={s.signOutBtnText}>Log Out & Return to Sign In</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {/* CUSTOMER BOTTOM DRAGGABLE NAVIGATION (4 TABS) */}
            <View style={s.bottomNav}>
              <TouchableOpacity style={s.navItem} onPress={() => setCustomerTab('explore')}>
                <Text style={[s.navIcon, customerTab === 'explore' && s.navIconActive]}>⌂</Text>
                <Text style={[s.navLabel, customerTab === 'explore' && s.navLabelActive]}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setCustomerTab('queue')}>
                <Text style={[s.navIcon, customerTab === 'queue' && s.navIconActive]}>▱</Text>
                <Text style={[s.navLabel, customerTab === 'queue' && s.navLabelActive]}>My Queue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setCustomerTab('studio')}>
                <Text style={[s.navIcon, customerTab === 'studio' && s.navIconActive]}>✧</Text>
                <Text style={[s.navLabel, customerTab === 'studio' && s.navLabelActive]}>AI Studio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setCustomerTab('profile')}>
                <Text style={[s.navIcon, customerTab === 'profile' && s.navIconActive]}>♙</Text>
                <Text style={[s.navLabel, customerTab === 'profile' && s.navLabelActive]}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* EXPERIENCE 2: SALONOS OWNER (app-owner-snepros ui.html) */}
        {/* ═══════════════════════════════════════════════════ */}
        {role === 'owner' && (
          <View style={{ flex: 1 }}>
            {/* TAB A: OVERVIEW */}
            {ownerTab === 'overview' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.ownerHeadRow}>
                  <View>
                    <Text style={s.ownerHeadEyebrow}>LIVE DESK</Text>
                    <Text style={s.ownerHeadTitle}>Salon Overview</Text>
                  </View>
                  <TouchableOpacity style={s.callNextBtn} onPress={handleOwnerCallNext}>
                    <Text style={s.callNextBtnText}>▶ Call Next</Text>
                  </TouchableOpacity>
                </View>

                {/* 4 Stat Cards */}
                <View style={s.statsGrid}>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>Customers today</Text>
                    <Text style={s.statVal}>28</Text>
                    <Text style={s.statTrend}>↑ 14% vs yday</Text>
                  </View>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>Avg. service</Text>
                    <Text style={s.statVal}>26 min</Text>
                    <Text style={s.statSub}>Completed</Text>
                  </View>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>Queue completion</Text>
                    <Text style={s.statVal}>91%</Text>
                    <Text style={s.statTrend}>↑ 3.2%</Text>
                  </View>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>Repeat rate</Text>
                    <Text style={s.statVal}>34%</Text>
                    <Text style={s.statSub}>Loyalty pts</Text>
                  </View>
                </View>

                {/* Live Chair Status Grid */}
                <Text style={s.ownerSectionTitle}>Station Telemetry</Text>
                <View style={s.chairGrid}>
                  {ownerChairs.map(c => (
                    <View key={c.id} style={s.ownerChairCard}>
                      <View style={s.ownerChairTop}>
                        <Text style={s.ownerChairName}>{c.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <View style={[s.dotSmall, c.status === 'Busy' ? s.dotBusy : c.status === 'Free' ? s.dotFree : s.dotPending]} />
                          <Text style={{ fontSize: 10, fontWeight: '700' }}>{c.status}</Text>
                        </View>
                      </View>
                      <Text style={s.ownerChairBarber}>{c.barber}</Text>
                      <Text style={s.ownerChairCust} numberOfLines={1}>{c.customer} {c.elapsed ? `(${c.elapsed})` : ''}</Text>
                    </View>
                  ))}
                </View>

                {/* Live Queue Operations List */}
                <Text style={s.ownerSectionTitle}>Live Queue Tokens</Text>
                {ownerQueue.map((item, idx) => (
                  <View key={idx} style={s.ownerQueueRow}>
                    <View style={s.ownerQueueTokenBox}>
                      <Text style={s.ownerQueueTokenNum}>{item.token}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.ownerQueueName}>{item.name}</Text>
                      <Text style={s.ownerQueueSub}>{item.service} · {item.station}</Text>
                    </View>
                    {item.status === 'SERVING' ? (
                      <TouchableOpacity style={s.ownerDoneBtn} onPress={() => handleOwnerComplete(item.token)}>
                        <Text style={s.ownerDoneBtnText}>Complete</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={s.waitingTag}><Text style={s.waitingTagText}>Waiting</Text></View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            {/* TAB B: STAFF */}
            {ownerTab === 'staff' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.ownerHeadRow}>
                  <Text style={s.ownerHeadTitle}>Barber Roster</Text>
                  <TouchableOpacity style={s.callNextBtn} onPress={() => setShowInviteModal(true)}>
                    <Text style={s.callNextBtnText}>+ Invite Staff</Text>
                  </TouchableOpacity>
                </View>

                {ownerStaffList.map((st, idx) => (
                  <View key={idx} style={s.staffCard}>
                    <View style={s.staffCardLeft}>
                      <View style={s.staffAvatarBox}><Text style={{ fontWeight: 'bold', color: C.brown }}>{st.name[0]}</Text></View>
                      <View>
                        <Text style={s.staffCardName}>{st.name}</Text>
                        <Text style={s.staffCardRole}>{st.role} · {st.chair}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={s.staffServed}>{st.served} cuts</Text>
                      <Text style={[s.staffDuty, { color: st.onDuty ? C.green : C.text2 }]}>{st.onDuty ? 'On duty' : 'Off duty'}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* TAB C: ANALYTICS */}
            {ownerTab === 'analytics' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={s.ownerHeadTitle}>Salon Analytics</Text>

                {/* Customers Served Daily Bar Chart */}
                <View style={s.analyticsCard}>
                  <Text style={s.analyticsTitle}>Customers Served</Text>
                  <Text style={s.analyticsSub}>Daily completed cuts this week</Text>
                  <View style={s.chartBarsRow}>
                    {[
                      { day: 'M', val: 55 },
                      { day: 'T', val: 68 },
                      { day: 'W', val: 48 },
                      { day: 'T', val: 82 },
                      { day: 'F', val: 72 },
                      { day: 'S', val: 96, active: true },
                      { day: 'S', val: 62 },
                    ].map(b => (
                      <View key={b.day} style={s.barCol}>
                        <View style={[s.barFill, { height: `${b.val}%`, backgroundColor: b.active ? C.brown : '#D4C3B3' }]} />
                        <Text style={s.barDay}>{b.day}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Top Services Breakdown */}
                <View style={s.analyticsCard}>
                  <Text style={s.analyticsTitle}>Top Completed Services</Text>
                  <View style={{ marginTop: 12, gap: 10 }}>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '700' }}>Haircut (118)</Text>
                      <View style={s.progressTrack}><View style={[s.progressBar, { width: '86%' }]} /></View>
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '700' }}>Haircut + Beard (76)</Text>
                      <View style={s.progressTrack}><View style={[s.progressBar, { width: '62%' }]} /></View>
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '700' }}>Beard trim (52)</Text>
                      <View style={s.progressTrack}><View style={[s.progressBar, { width: '42%' }]} /></View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            {/* TAB D: PROFILE & PLANS — MATCHES SNEPR PRICING MASTER SPEC */}
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
            })()}

            {/* OWNER BOTTOM NAVIGATION (4 TABS) */}
            <View style={s.bottomNav}>
              <TouchableOpacity style={s.navItem} onPress={() => setOwnerTab('overview')}>
                <Text style={[s.navIcon, ownerTab === 'overview' && s.navIconActive]}>▱</Text>
                <Text style={[s.navLabel, ownerTab === 'overview' && s.navLabelActive]}>Overview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setOwnerTab('staff')}>
                <Text style={[s.navIcon, ownerTab === 'staff' && s.navIconActive]}>👥</Text>
                <Text style={[s.navLabel, ownerTab === 'staff' && s.navLabelActive]}>Staff</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setOwnerTab('analytics')}>
                <Text style={[s.navIcon, ownerTab === 'analytics' && s.navIconActive]}>📊</Text>
                <Text style={[s.navLabel, ownerTab === 'analytics' && s.navLabelActive]}>Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setOwnerTab('profile')}>
                <Text style={[s.navIcon, ownerTab === 'profile' && s.navIconActive]}>⚙</Text>
                <Text style={[s.navLabel, ownerTab === 'profile' && s.navLabelActive]}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* EXPERIENCE 3: STAFF DESK (app-staff ui .html) */}
        {/* ═══════════════════════════════════════════════════ */}
        {role === 'staff' && (
          <View style={{ flex: 1 }}>
            {/* VIEW A: MY QUEUE */}
            {staffTab === 'queue' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.staffStationHead}>
                  <View>
                    <Text style={s.staffStationEyebrow}>MY QUEUE</Text>
                    <Text style={s.staffStationTitle}>Chair 02 (Station 1)</Text>
                    <Text style={s.staffStationSub}>Lakmé Salon — KIIT Road</Text>
                  </View>
                  <View style={s.dutyBadge}><Text style={s.dutyBadgeText}>● On duty</Text></View>
                </View>

                {/* Now Serving Dark Brown Hero Card */}
                {staffServing ? (
                  <View style={s.staffServingHero}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={s.servingHeroEyebrow}>NOW SERVING</Text>
                      <Text style={s.servingHeroEyebrow}>STATION 1</Text>
                    </View>
                    <Text style={s.servingTokenBig}>{staffServing.token}</Text>
                    <Text style={s.servingCustName}>{staffServing.name} · {staffServing.service}</Text>
                    <Text style={s.servingTimeSub}>{staffServing.time}</Text>

                    <View style={s.servingBtnRow}>
                      <TouchableOpacity style={s.goldCompleteBtn} onPress={handleStaffCompleteService}>
                        <Text style={s.goldCompleteBtnText}>✓ Complete Service</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.ghostNextBtn} onPress={handleStaffCallNext}>
                        <Text style={s.ghostNextBtnText}>Call Next ▶</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={s.staffIdleBox}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.espresso }}>Station is Idle</Text>
                    <TouchableOpacity style={s.goldCompleteBtn} onPress={handleStaffCallNext}>
                      <Text style={s.goldCompleteBtnText}>Call Next Customer</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Up Next List */}
                <Text style={s.staffNextHead}>Up Next ({staffNextQueue.length} waiting)</Text>
                {staffNextQueue.map((item, idx) => (
                  <View key={idx} style={s.staffNextRow}>
                    <View style={s.staffNextPill}><Text style={{ fontWeight: 'bold', color: C.brown }}>{item.token}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.espresso }}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: C.text2 }}>{item.service}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* VIEW B: SCAN QR TICKET */}
            {staffTab === 'scan' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.scanCard}>
                  <Text style={s.scanTitle}>Scan Customer Ticket</Text>
                  <Text style={s.scanDesc}>Verify the QR on their Snepr digital ticket.</Text>
                  <View style={s.scannerFrame}>
                    <Text style={{ fontSize: 44, color: '#E3BF89' }}>📷</Text>
                    <Text style={{ color: '#E6D8C8', fontSize: 11, marginTop: 8 }}>Camera Scanner Active</Text>
                  </View>

                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.text2, marginBottom: 6 }}>OR ENTER TICKET CODE</Text>
                  <TextInput
                    style={s.textInputBox}
                    placeholder="e.g. SNP-024-8K2"
                    value={scanCodeInput}
                    onChangeText={setScanCodeInput}
                  />
                  <TouchableOpacity
                    style={s.goldCompleteBtn}
                    onPress={() => {
                      if (!scanCodeInput.trim()) { Alert.alert('Error', 'Enter code'); return; }
                      Alert.alert('Ticket Verified', `Ticket ${scanCodeInput.toUpperCase()} verified and checked in!`);
                      setScanCodeInput('');
                      setStaffTab('queue');
                    }}
                  >
                    <Text style={s.goldCompleteBtnText}>Verify Ticket</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {/* VIEW C: WALK-IN MANUAL INTAKE */}
            {staffTab === 'walkin' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.scanCard}>
                  <Text style={s.scanTitle}>Add Walk-in Customer</Text>
                  <Text style={s.scanDesc}>Issue manual queue token at salon counter.</Text>

                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.text2, marginBottom: 6 }}>CUSTOMER NAME *</Text>
                  <TextInput
                    style={s.textInputBox}
                    placeholder="Customer Name"
                    value={walkinName}
                    onChangeText={setWalkinName}
                  />

                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.text2, marginBottom: 6 }}>SERVICE</Text>
                  <TextInput
                    style={s.textInputBox}
                    placeholder="Haircut / Beard Trim"
                    value={walkinService}
                    onChangeText={setWalkinService}
                  />

                  <TouchableOpacity
                    style={s.goldCompleteBtn}
                    onPress={() => {
                      if (!walkinName.trim()) { Alert.alert('Name Required', 'Enter customer name'); return; }
                      setStaffNextQueue([...staffNextQueue, { token: '#028', name: walkinName, service: `${walkinService || 'Haircut'} · Counter Walk-in` }]);
                      Alert.alert('Walk-in Added', `Issued Token #028 for ${walkinName}.`);
                      setWalkinName('');
                      setStaffTab('queue');
                    }}
                  >
                    <Text style={s.goldCompleteBtnText}>Issue Token</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {/* VIEW D: STAFF PROFILE (READ-ONLY) */}
            {staffTab === 'profile' && (
              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={s.profileCard}>
                  <Text style={s.profileName}>Rahul Kumar</Text>
                  <Text style={s.profileEmail}>rahul@example.com · +91 98765 43210</Text>
                  <Text style={s.profilePhone}>Assigned: Chair 02 (Station 1) · Lakmé Salon</Text>
                  <Text style={{ fontSize: 11, color: C.text2, marginTop: 12, textAlign: 'center' }}>
                    Staff credentials are managed by salon owner Arjun Sharma.
                  </Text>
                  <TouchableOpacity
                    style={s.signOutBtn}
                    onPress={handleSignOut}
                  >
                    <Text style={s.signOutBtnText}>Log Out & Return to Sign In</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {/* STAFF BOTTOM NAVIGATION (4 TABS) */}
            <View style={s.bottomNav}>
              <TouchableOpacity style={s.navItem} onPress={() => setStaffTab('queue')}>
                <Text style={[s.navIcon, staffTab === 'queue' && s.navIconActive]}>✂</Text>
                <Text style={[s.navLabel, staffTab === 'queue' && s.navLabelActive]}>My Queue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setStaffTab('scan')}>
                <Text style={[s.navIcon, staffTab === 'scan' && s.navIconActive]}>📷</Text>
                <Text style={[s.navLabel, staffTab === 'scan' && s.navLabelActive]}>Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setStaffTab('walkin')}>
                <Text style={[s.navIcon, staffTab === 'walkin' && s.navIconActive]}>👤</Text>
                <Text style={[s.navLabel, staffTab === 'walkin' && s.navLabelActive]}>Walk in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navItem} onPress={() => setStaffTab('profile')}>
                <Text style={[s.navIcon, staffTab === 'profile' && s.navIconActive]}>♙</Text>
                <Text style={[s.navLabel, staffTab === 'profile' && s.navLabelActive]}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>

      {/* ─── AUTHENTICATION & DEMO LOGIN MODAL ─── */}
      <Modal visible={authModalVisible} transparent animationType="slide">
        <View style={s.modalBackdrop}>
          <View style={s.authCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={s.authTitle}>Snepr Account & Demo Switcher</Text>
              <TouchableOpacity onPress={() => setAuthModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ fontSize: 18, color: C.mute }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 1-Tap Demo Logins Bar */}
            <Text style={{ fontSize: 10, fontWeight: '800', color: C.brown, textTransform: 'uppercase', marginBottom: 6 }}>
              1-TAP DEMO LOGINS (SneprDemo@2026)
            </Text>
            <View style={{ gap: 6, marginBottom: 16 }}>
              <TouchableOpacity style={s.demoBtn} onPress={() => handleDemoLogin('customer')}>
                <Text style={s.demoBtnRole}>Customer Mode</Text>
                <Text style={s.demoBtnEmail}>customer@snepr.demo (Priya M.)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.demoBtn} onPress={() => handleDemoLogin('owner')}>
                <Text style={s.demoBtnRole}>SalonOS Owner Mode</Text>
                <Text style={s.demoBtnEmail}>owner@snepr.demo (Arjun S. — Lakmé)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.demoBtn} onPress={() => handleDemoLogin('staff')}>
                <Text style={s.demoBtnRole}>Barber Staff Mode</Text>
                <Text style={s.demoBtnEmail}>staff@snepr.demo (Rahul K. — Chair 02)</Text>
              </TouchableOpacity>
            </View>

            {/* Manual Email Input */}
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.espresso, marginBottom: 6 }}>OR ENTER CREDENTIALS</Text>
            <TextInput
              style={s.textInputBox}
              placeholder="Email address"
              autoCapitalize="none"
              value={authEmail}
              onChangeText={setAuthEmail}
            />
            <TextInput
              style={s.textInputBox}
              placeholder="Password (SneprDemo@2026)"
              secureTextEntry
              value={authPass}
              onChangeText={setAuthPass}
            />

            <TouchableOpacity style={s.signInSubmitBtn} onPress={handleManualAuth}>
              <Text style={s.signInSubmitBtnText}>Sign In / Switch Role</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── BHUBANESWAR LOCALITY SELECTOR MODAL ─── */}
      <Modal visible={localityModalVisible} transparent animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.authCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={s.authTitle}>Select Locality in Bhubaneswar</Text>
              <TouchableOpacity onPress={() => setLocalityModalVisible(false)}>
                <Text style={{ fontSize: 18, color: C.mute }}>✕</Text>
              </TouchableOpacity>
            </View>
            {BHUBANESWAR_LOCALITIES.map(loc => (
              <TouchableOpacity
                key={loc}
                style={[s.locItem, selectedArea === loc && s.locItemActive]}
                onPress={() => { setSelectedArea(loc); setLocalityModalVisible(false); }}
              >
                <Text style={[s.locItemText, selectedArea === loc && { color: C.brown, fontWeight: 'bold' }]}>{loc}</Text>
                {selectedArea === loc && <Text style={{ color: C.brown }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ─── INVITE STAFF MODAL ─── */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.authCard}>
            <Text style={s.authTitle}>Invite Staff to Station</Text>
            <TextInput
              style={s.textInputBox}
              placeholder="Staff Full Name"
              value={inviteName}
              onChangeText={setInviteName}
            />
            <TextInput
              style={s.textInputBox}
              placeholder="Phone or Email"
              value={inviteContact}
              onChangeText={setInviteContact}
            />
            <TouchableOpacity
              style={s.signInSubmitBtn}
              onPress={() => {
                if (!inviteName.trim()) { Alert.alert('Error', 'Enter name'); return; }
                setOwnerStaffList([...ownerStaffList, { name: inviteName, role: 'Stylist', chair: 'Station 4', served: 0, onDuty: true }]);
                Alert.alert('Invite Sent', `Invited ${inviteName} to Station 4.`);
                setInviteName('');
                setInviteContact('');
                setShowInviteModal(false);
              }}
            >
              <Text style={s.signInSubmitBtnText}>Send Staff Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUPPORT TICKET MODAL */}
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
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.ivory },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: C.ivory,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  wordmark: { fontSize: 26, fontWeight: '900', color: C.espresso, letterSpacing: -1 },
  headerLogoImg: { width: 92, height: 30 },
  authScreenLogoImg: { width: 170, height: 56, marginBottom: 6 },
  areaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.creamSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.line,
    maxWidth: 160,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green, marginRight: 5 },
  areaPillText: { fontSize: 11, color: C.text, fontWeight: '600' },
  roleBadgePill: { backgroundColor: C.creamSoft, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  roleBadgePillText: { fontSize: 11, fontWeight: 'bold', color: C.brown },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roleSwitcherBtn: { backgroundColor: C.creamSoft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: C.line },
  roleSwitcherBtnText: { fontSize: 10, fontWeight: '800', color: C.brown },
  avatarBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E7D6C3', alignItems: 'center', justifyContent: 'center' },
  avatarBtnText: { fontSize: 11, fontWeight: 'bold', color: C.brown },
  body: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 90 },

  // Customer Experience Styles
  customerHero: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  heroEyebrow: { fontSize: 10, fontWeight: '800', color: C.brown, letterSpacing: 1 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: C.espresso, marginTop: 4 },
  heroDesc: { fontSize: 12, color: C.text2, marginTop: 2 },
  liveUpdateBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  liveUpdateBadgeText: { fontSize: 10, fontWeight: '700', color: C.green },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: { fontSize: 18, color: C.mute, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: C.espresso },
  chipRow: { marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
  },
  chipActive: { backgroundColor: C.espresso, borderColor: C.espresso },
  chipText: { fontSize: 11, fontWeight: '600', color: C.text2 },
  chipTextActive: { color: '#FFF', fontWeight: '700' },
  sectionHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionHeadTitle: { fontSize: 15, fontWeight: '800', color: C.espresso },
  sectionHeadCount: { fontSize: 11, color: C.text2 },
  salonCard: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  salonCardName: { fontSize: 15, fontWeight: '800', color: C.espresso },
  salonCardLoc: { fontSize: 11, color: C.text2, marginTop: 2 },
  waitBadge: {
    backgroundColor: C.creamSoft,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  waitBadgeNum: { fontSize: 12, fontWeight: '800', color: C.brown },
  waitBadgeLabel: { fontSize: 8, fontWeight: '700', color: C.text2 },
  chairsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 10 },
  chairPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  chairFree: { backgroundColor: C.greenSoft },
  chairBusy: { backgroundColor: C.amberSoft },
  chairDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 4 },
  dotFree: { backgroundColor: C.green },
  dotBusy: { backgroundColor: C.amber },
  chairText: { fontSize: 10, fontWeight: '600', color: C.espresso },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  cardPrice: { fontSize: 12, fontWeight: '700', color: C.espresso },
  cardRating: { fontSize: 11, color: C.text2 },
  joinBtn: { backgroundColor: C.brown, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  joinBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  // Customer Queue Pass Styles
  ticketCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 18 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ticketEyebrow: { fontSize: 9, fontWeight: '800', color: C.brown, letterSpacing: 1 },
  ticketSalonTitle: { fontSize: 18, fontWeight: '800', color: C.espresso, marginTop: 2 },
  ticketLocSub: { fontSize: 11, color: C.text2 },
  ticketBigPill: { backgroundColor: C.creamSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ticketBigNum: { fontSize: 24, fontWeight: '900', color: C.brown },
  waitSummaryBox: {
    backgroundColor: C.creamSoft,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginVertical: 14,
  },
  waitSummaryNum: { fontSize: 18, fontWeight: '800', color: C.brown },
  waitSummarySub: { fontSize: 11, color: C.text2, marginTop: 2 },
  timelineBox: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line },
  timelineTitle: { fontSize: 10, fontWeight: '800', color: C.text2, letterSpacing: 1, marginBottom: 10 },
  timelineRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  timelineDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: C.green },
  dotCurrent: { backgroundColor: C.brown },
  dotPending: { backgroundColor: C.creamSoft },
  timelineDotText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  timelineStepTitle: { fontSize: 12, fontWeight: '700', color: C.espresso },
  timelineStepDesc: { fontSize: 10, color: C.text2 },
  gpsMapCard: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.line },
  gpsMapHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  gpsMapHeadTitle: { fontSize: 12, fontWeight: '800', color: C.espresso },
  gpsMapHeadEta: { fontSize: 11, fontWeight: '700', color: C.green },
  mapPlaceholder: { backgroundColor: C.creamSoft, borderRadius: 14, padding: 16, alignItems: 'center' },
  mapText: { fontSize: 12, fontWeight: '700', color: C.espresso },
  mapSubText: { fontSize: 10, color: C.text2, marginTop: 2 },

  // AI Studio Styles
  studioHero: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 16, marginBottom: 12 },
  studioEyebrow: { fontSize: 9, fontWeight: '800', color: C.brown, letterSpacing: 1 },
  studioTitle: { fontSize: 18, fontWeight: '800', color: C.espresso, marginTop: 2 },
  studioDesc: { fontSize: 11, color: C.text2, marginTop: 2 },
  lookCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 14, marginBottom: 10 },
  lookName: { fontSize: 14, fontWeight: '800', color: C.espresso },
  lookMatch: { fontSize: 11, color: C.brown, fontWeight: '600', marginVertical: 3 },
  lookSpecs: { fontSize: 11, color: C.text2 },

  // Profile Styles
  profileCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 18, alignItems: 'center', marginBottom: 14 },
  profileAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.creamSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  profileAvatarText: { fontSize: 18, fontWeight: 'bold', color: C.brown },
  profileName: { fontSize: 16, fontWeight: '800', color: C.espresso },
  profileEmail: { fontSize: 11, color: C.text2, marginTop: 2 },
  profilePhone: { fontSize: 11, color: C.text2 },
  pointsBalanceCard: { backgroundColor: C.goldSoft, borderWidth: 1, borderColor: '#ECD9BE', borderRadius: 12, padding: 12, alignItems: 'center', width: '100%', marginVertical: 14 },
  pointsBalanceNum: { fontSize: 20, fontWeight: '900', color: C.goldInk },
  pointsBalanceSub: { fontSize: 11, color: C.goldInk, marginTop: 2 },
  signOutBtn: { backgroundColor: C.creamSoft, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, width: '100%', alignItems: 'center' },
  signOutBtnText: { color: C.brown, fontWeight: '700', fontSize: 11 },

  // SalonOS Owner Styles
  ownerHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  ownerHeadEyebrow: { fontSize: 9, fontWeight: '800', color: C.brown, letterSpacing: 1 },
  ownerHeadTitle: { fontSize: 20, fontWeight: '800', color: C.espresso },
  callNextBtn: { backgroundColor: C.green, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  callNextBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  statBox: { width: (width - 40) / 2, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 10 },
  statLabel: { fontSize: 10, color: C.text2, fontWeight: '600' },
  statVal: { fontSize: 18, fontWeight: '800', color: C.espresso, marginVertical: 2 },
  statTrend: { fontSize: 9, fontWeight: '700', color: C.green },
  statSub: { fontSize: 9, color: C.text2 },
  ownerSectionTitle: { fontSize: 14, fontWeight: '800', color: C.espresso, marginVertical: 10 },
  chairGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  ownerChairCard: { width: (width - 40) / 2, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 10 },
  ownerChairTop: { flexDirection: 'row', justifyContent: 'space-between' },
  ownerChairName: { fontSize: 12, fontWeight: '800', color: C.espresso },
  dotSmall: { width: 6, height: 6, borderRadius: 3 },
  ownerChairBarber: { fontSize: 10, color: C.text2, marginTop: 4 },
  ownerChairCust: { fontSize: 10, color: C.brown, fontWeight: '600', marginTop: 2 },
  ownerQueueRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 10, marginBottom: 6 },
  ownerQueueTokenBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.creamSoft, alignItems: 'center', justifyContent: 'center' },
  ownerQueueTokenNum: { fontSize: 11, fontWeight: 'bold', color: C.brown },
  ownerQueueName: { fontSize: 12, fontWeight: '700', color: C.espresso },
  ownerQueueSub: { fontSize: 10, color: C.text2 },
  ownerDoneBtn: { backgroundColor: C.green, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  ownerDoneBtnText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  waitingTag: { backgroundColor: C.creamSoft, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  waitingTagText: { fontSize: 9, color: C.brown, fontWeight: '600' },

  // Staff Management Styles
  staffCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, marginBottom: 8 },
  staffCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  staffAvatarBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.creamSoft, alignItems: 'center', justifyContent: 'center' },
  staffCardName: { fontSize: 13, fontWeight: '700', color: C.espresso },
  staffCardRole: { fontSize: 10, color: C.text2 },
  staffServed: { fontSize: 12, fontWeight: '800', color: C.espresso },
  staffDuty: { fontSize: 10, fontWeight: '600' },

  // Analytics Styles
  analyticsCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 14, marginBottom: 12 },
  analyticsTitle: { fontSize: 13, fontWeight: '800', color: C.espresso },
  analyticsSub: { fontSize: 10, color: C.text2 },
  chartBarsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end', paddingTop: 20 },
  barCol: { alignItems: 'center', flex: 1 },
  barFill: { width: 14, borderRadius: 4 },
  barDay: { fontSize: 9, fontWeight: 'bold', color: C.text2, marginTop: 4 },
  progressTrack: { height: 6, backgroundColor: C.creamSoft, borderRadius: 3, marginTop: 3 },
  progressBar: { height: 6, backgroundColor: C.brown, borderRadius: 3 },

  // Plan Cards
  planCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 14, marginBottom: 8 },
  planCardActive: { borderColor: C.brown, backgroundColor: '#FFFDF9' },
  planTitle: { fontSize: 13, fontWeight: '800', color: C.espresso },
  planPrice: { fontSize: 13, fontWeight: '800', color: C.brown },
  planDesc: { fontSize: 10, color: C.text2, marginTop: 4 },
  planActiveTag: { fontSize: 10, fontWeight: 'bold', color: C.green, marginTop: 6 },

  // Staff Desk Styles
  staffStationHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  staffStationEyebrow: { fontSize: 9, fontWeight: '800', color: C.brown, letterSpacing: 1 },
  staffStationTitle: { fontSize: 18, fontWeight: '800', color: C.espresso },
  staffStationSub: { fontSize: 11, color: C.text2 },
  dutyBadge: { backgroundColor: C.greenSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  dutyBadgeText: { fontSize: 10, fontWeight: '700', color: C.green },
  staffServingHero: {
    backgroundColor: '#34271C',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  servingHeroEyebrow: { fontSize: 9, fontWeight: '800', color: '#E4D4C2', letterSpacing: 1 },
  servingTokenBig: { fontSize: 44, fontWeight: '900', color: '#FFF', marginVertical: 4 },
  servingCustName: { fontSize: 13, color: '#F4E9DC', fontWeight: '700' },
  servingTimeSub: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  servingBtnRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  goldCompleteBtn: { flex: 1, backgroundColor: C.gold, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  goldCompleteBtnText: { color: '#2D2116', fontSize: 11, fontWeight: 'bold' },
  ghostNextBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center' },
  ghostNextBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  staffIdleBox: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 18, alignItems: 'center', gap: 10, marginBottom: 14 },
  staffNextHead: { fontSize: 12, fontWeight: '800', color: C.espresso, marginBottom: 8 },
  staffNextRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 10, marginBottom: 6 },
  staffNextPill: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.creamSoft, alignItems: 'center', justifyContent: 'center' },
  scanCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 18 },
  scanTitle: { fontSize: 16, fontWeight: '800', color: C.espresso },
  scanDesc: { fontSize: 11, color: C.text2, marginBottom: 14 },
  scannerFrame: { height: 140, backgroundColor: '#282019', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },

  // Bottom Navigation (Liquid UI Floating Pill)
  bottomNav: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    height: 58,
    backgroundColor: 'rgba(255,253,249,0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#4B3320',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  navIcon: { fontSize: 18, color: C.mute },
  navIconActive: { color: C.brown, fontWeight: 'bold' },
  navLabel: { fontSize: 9, fontWeight: '600', color: C.mute, marginTop: 1 },
  navLabelActive: { color: C.brown, fontWeight: '800' },

  // Modals & Forms
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(33,25,18,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  authCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, width: '100%', maxWidth: 360 },
  authTitle: { fontSize: 15, fontWeight: '800', color: C.espresso },
  demoBtn: { backgroundColor: C.creamSoft, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  demoBtnRole: { fontSize: 11, fontWeight: '800', color: C.brown },
  demoBtnEmail: { fontSize: 10, color: C.text2, marginTop: 1 },
  textInputBox: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, height: 42, fontSize: 12, color: C.espresso, marginBottom: 10 },
  signInSubmitBtn: { backgroundColor: C.espresso, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  signInSubmitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  locItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  locItemActive: { backgroundColor: C.creamSoft, paddingHorizontal: 8, borderRadius: 8 },
  locItemText: { fontSize: 13, color: C.espresso, fontWeight: '600' },

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
  footerVersionText: { textAlign: 'center', fontSize: 10, color: '#A18B76', paddingVertical: 16 },

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
  signOutHeaderBtnText: { fontSize: 10, fontWeight: '800', color: '#8A4C24' }
});
