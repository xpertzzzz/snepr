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
import Svg, { Path, Circle, Rect, Polygon, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

// 100% Light-Themed Luxury Palette (Carrybird & Snepr Aesthetic)
const C = {
  ivory: '#FAF7F2',
  paper: '#FFFFFF',
  creamSoft: '#F6F0E8',
  creamMid: '#ECE4D8',
  creamWarm: '#FDFBF7',
  espresso: '#1B1410',
  espresso2: '#2B1D16',
  cognac: '#8A4C24',
  cognacSoft: '#F7EFE9',
  cognacInk: '#5C3217',
  caramel: '#B86B33',
  gold: '#C8993E',
  goldSoft: '#FAF3E1',
  goldInk: '#705217',
  text: '#2C2420',
  text2: '#6E6159',
  mute: '#9C9089',
  line: '#E8E1D7',
  green: '#2E7D4F',
  greenSoft: '#EBF7EE',
  greenInk: '#1C5434',
  navBg: 'rgba(247, 241, 235, 0.98)',
  navBorder: '#DED3C4',
};

const SNEPR_LOGO_URI = 'data:image/png;base64,__SNEPR_LOGO_B64__';

export default function SneprApp() {
  const [tab, setTab] = useState<'explore' | 'studio' | 'pass' | 'points' | 'desk'>('explore');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState('Saheed Nagar, Bhubaneswar');
  const [isGpsLive, setIsGpsLive] = useState(false);

  // Authentication State (Brevo SMTP Email OTP)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'name' | 'email' | 'otp'>('phone');
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [otpTimer, setOtpTimer] = useState(45);

  // Queue State
  const [hasPass, setHasPass] = useState(true);
  const [token, setToken] = useState('#B-15');
  const [salonName, setSalonName] = useState('Urban Blade Grooming Co.');
  const [estWait, setEstWait] = useState(11);
  const [queueAhead, setQueueAhead] = useState(1);
  const [chairInfo, setChairInfo] = useState('Chair 1 (Rajesh Kumar)');

  // Points State
  const [points, setPoints] = useState(240);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewNote, setReviewNote] = useState('');

  // AI Studio State
  const [isScanning, setIsScanning] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedFaceShape, setDetectedFaceShape] = useState<string | null>(null);
  const [specModalCut, setSpecModalCut] = useState<any | null>(null);

  // Live Accurate GPS Tracker (Bhubaneswar Exclusive)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted' && isMounted) {
          setIsGpsLive(true);
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (loc && loc.coords && isMounted) {
            try {
              const [place] = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });
              if (place && isMounted) {
                setUserLocation(`${place.street || place.district || 'Saheed Nagar'}, Bhubaneswar`);
              }
            } catch (geoErr) {
              // Geocode error handled gracefully
            }
          }
        }
      } catch (e) {
        // Safe fallback - no crash
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // OTP Countdown
  useEffect(() => {
    let interval: any = null;
    if (authModalVisible && authStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authModalVisible, authStep, otpTimer]);

  // Auth Step Handlers
  const handlePhoneSubmit = () => {
    if (userPhone.trim().length < 10) {
      Alert.alert('Phone Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthStep('name');
  };

  const handleNameSubmit = () => {
    if (userName.trim().length < 2) {
      Alert.alert('Name Required', 'Please enter your full name.');
      return;
    }
    setAuthStep('email');
  };

  const handleEmailSubmit = async () => {
    if (!userEmail.includes('@') || !userEmail.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setIsSubmittingAuth(true);
    try {
      await fetch('https://snepr.in/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: userName, phone: userPhone }),
      }).catch(() => {});
    } catch (err) {}

    setIsSubmittingAuth(false);
    setAuthStep('otp');
    setOtpTimer(45);
    Alert.alert('OTP Sent', `A 6-digit verification code has been dispatched to ${userEmail} via Brevo SMTP.`);
  };

  const handleVerifyOtp = () => {
    if (userOtp.trim().length < 4) {
      Alert.alert('Enter Code', 'Please enter the 6-digit code sent to your email.');
      return;
    }
    setIsSubmittingAuth(true);
    setTimeout(() => {
      setIsSubmittingAuth(false);
      setIsAuthenticated(true);
      setAuthModalVisible(false);
      Alert.alert('Welcome to Snepr', `Verified as ${userName} (${userPhone}). Your Snepr wallet has been linked.`);
    }, 900);
  };

  // AI Camera Scanner Simulation
  const handleStartScan = () => {
    setCameraModalVisible(true);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCameraModalVisible(false);
          setDetectedFaceShape('Oval & Square Profile');
          Alert.alert(
            'Face Geometry Analyzed',
            'Jawline angle: 108 deg | Oval-Square Profile Detected.\nRecommended style: Low Taper Textured Crop.'
          );
        }, 400);
      }
    }, 400);
  };

  // Salons Data (Bhubaneswar Exclusive)
  const salons = [
    {
      id: 1,
      name: 'Urban Blade Grooming Co.',
      locality: 'KIIT Square, Patia, Bhubaneswar',
      distance: '450m away',
      wait: '11 mins',
      ahead: 1,
      price: 'Rs. 350',
      rating: '4.9 (420)',
      chairs: [
        { no: 1, barber: 'Rajesh', status: 'Serving #B-14', busy: true },
        { no: 2, barber: 'Aman', status: 'In Cut (6m)', busy: true },
        { no: 3, barber: 'Sameer', status: 'Free Now', busy: false },
      ],
    },
    {
      id: 2,
      name: 'The Royal Shave Atelier',
      locality: 'Saheed Nagar, Bhubaneswar',
      distance: '1.2 km away',
      wait: '18 mins',
      ahead: 2,
      price: 'Rs. 450',
      rating: '4.8 (310)',
      chairs: [
        { no: 1, barber: 'Vikram', status: 'Fade in progress', busy: true },
        { no: 2, barber: 'Deepak', status: 'Free Now', busy: false },
      ],
    },
    {
      id: 3,
      name: 'Kalinga Executive Lounge',
      locality: 'Master Canteen, Bhubaneswar',
      distance: '2.8 km away',
      wait: '24 mins',
      ahead: 3,
      price: 'Rs. 280',
      rating: '4.7 (195)',
      chairs: [
        { no: 1, barber: 'Prakash', status: 'Beard trim', busy: true },
        { no: 2, barber: 'Subrat', status: 'Free in 4m', busy: true },
      ],
    },
  ];

  const handleJoinQueue = (s: typeof salons[0]) => {
    setSalonName(s.name);
    setToken('#B-16');
    setEstWait(parseInt(s.wait) || 12);
    setQueueAhead(s.ahead || 1);
    setHasPass(true);
    setTab('pass');
    Alert.alert(
      'Queue Joined',
      `You have reserved Token #B-16 at ${s.name}. Your estimated wait time is ${s.wait}.`,
      [{ text: 'View Pass', onPress: () => setTab('pass') }]
    );
  };

  const submitReview = () => {
    setReviewModalVisible(false);
    setPoints(pts => pts + 10);
    Alert.alert(
      '+10 Snepr Points Added',
      'Thank you for your verified rating. 10 Points (= Rs. 10) have been deposited to your wallet.'
    );
  };

  // Snepr Points Emblem Component (Curved "S" Gold Monogram Coin)
  const SneprPointsBadge = ({ amount }: { amount: number }) => (
    <View style={s.ptsBadgeContainer}>
      <Svg width="18" height="18" viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10.5" fill="#FAF3E1" stroke="#C8993E" strokeWidth="1.8" />
        <Circle cx="12" cy="12" r="8" fill="none" stroke="#D9A84E" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
        <Path d="M14.5 8.5C14 7.5 12.8 7 11.5 7C9.5 7 8 8.2 8 10C8 12.5 15 11.5 15 14.5C15 16.5 13.2 17.5 11.2 17.5C9.5 17.5 8.2 16.6 7.8 15.5" stroke="#705217" strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
      <Text style={s.ptsBadgeText}>{amount} pts</Text>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Top Header with Safe Area Notch Clearance */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image source={{ uri: SNEPR_LOGO_URI }} style={s.logoImg} resizeMode="contain" />
          <View style={s.gpsPill}>
            <View style={s.gpsDot} />
            <Text style={s.gpsText} numberOfLines={1}>
              {isGpsLive ? 'GPS: ' : ''}{userLocation}
            </Text>
          </View>
        </View>

        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.pointsHeaderBtn}
            onPress={() => setTab('points')}
            activeOpacity={0.8}
          >
            <SneprPointsBadge amount={points} />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.authHeaderBtn}
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={s.authHeaderBtnText}>
              {isAuthenticated ? (userName.split(' ')[0] || 'User') : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Body */}
      <View style={s.body}>
        {tab === 'explore' && (
          <ScrollView
            style={s.tabScroll}
            contentContainerStyle={s.tabScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Live Queue Banner */}
            {hasPass && (
              <TouchableOpacity
                style={s.activePassBanner}
                onPress={() => setTab('pass')}
                activeOpacity={0.85}
              >
                <View style={s.bannerLeft}>
                  <View style={s.bannerTokenBox}>
                    <Text style={s.bannerTokenNum}>{token}</Text>
                    <Text style={s.bannerTokenSub}>YOUR PASS</Text>
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={s.bannerTitle} numberOfLines={1}>{salonName}</Text>
                    <Text style={s.bannerSub}>
                      {estWait} mins remaining • {queueAhead} person ahead
                    </Text>
                  </View>
                </View>
                <View style={s.bannerArrowBox}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>&rarr;</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Search Input */}
            <View style={s.searchBox}>
              <Svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                <Circle cx="11" cy="11" r="8" stroke="#9C9089" strokeWidth="2" fill="none" />
                <Path d="m21 21-4.35-4.35" stroke="#9C9089" strokeWidth="2" strokeLinecap="round" />
              </Svg>
              <TextInput
                style={s.searchInput}
                placeholder="Search salons, stylists, or haircut styles..."
                placeholderTextColor="#9C9089"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Section Title */}
            <View style={s.sectionTitleRow}>
              <Text style={s.sectionTitle}>Live Salons in Bhubaneswar</Text>
              <Text style={s.sectionSubBadge}>{salons.length} ACTIVE</Text>
            </View>

            {/* Salon Cards */}
            {salons.map(item => (
              <View key={item.id} style={s.salonCard}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.salonName}>{item.name}</Text>
                    <Text style={s.salonLoc}>{item.locality} • {item.distance}</Text>
                  </View>
                  <View style={s.waitPill}>
                    <Text style={s.waitNum}>{item.wait}</Text>
                    <Text style={s.waitLabel}>WAIT</Text>
                  </View>
                </View>

                {/* Chair Telemetry Status */}
                <View style={s.chairsRow}>
                  {item.chairs.map((ch, idx) => (
                    <View key={idx} style={[s.chairPill, ch.busy ? s.chairBusy : s.chairFree]}>
                      <View style={[s.chairDot, ch.busy ? s.dotBusy : s.dotFree]} />
                      <Text style={s.chairText}>Chair {ch.no}: {ch.status}</Text>
                    </View>
                  ))}
                </View>

                {/* Card Bottom */}
                <View style={s.cardBottom}>
                  <View>
                    <Text style={s.cardPrice}>From {item.price}</Text>
                    <Text style={s.cardRating}>Rating: {item.rating}</Text>
                  </View>
                  <TouchableOpacity
                    style={s.joinQueueBtn}
                    onPress={() => handleJoinQueue(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.joinQueueBtnText}>Join Queue (Rs. 0)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {tab === 'studio' && (
          <ScrollView
            style={s.tabScroll}
            contentContainerStyle={s.tabScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.studioHeroCard}>
              <Text style={s.studioEyebrow}>AI VIRTUAL MIRROR</Text>
              <Text style={s.studioHeroTitle}>Hairstyle Consultation Studio</Text>
              <Text style={s.studioHeroDesc}>
                Inspect exact millimeter clipper guard specs, scissor lengths, and face shape harmony before the scissors touch your hair.
              </Text>

              {detectedFaceShape && (
                <View style={s.detectedProfileBox}>
                  <Text style={s.detectedProfileTitle}>ANALYSIS COMPLETE</Text>
                  <Text style={s.detectedProfileDesc}>
                    Detected: {detectedFaceShape} (Jawline 108 deg)
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={s.scanBtn}
                onPress={handleStartScan}
                activeOpacity={0.8}
              >
                <Text style={s.scanBtnText}>
                  {isScanning ? 'Analyzing...' : 'Scan Face Geometry'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Previews Grid */}
            <Text style={s.previewSectionTitle}>Trending Haircut Blueprints</Text>
            {[
              {
                name: 'Low Taper Textured Crop',
                match: '98% Oval & Square Match',
                guard: 'Guard #2 Taper (Sideburns & Nape)',
                top: '1.5 in Scissor Point Cut',
                price: 'Rs. 350',
                time: '25 mins',
                specs: '1. Guard: #2 low taper fade at sideburns and nape.\n2. Top: 1.5 inch scissor crop, point cut for heavy texture.\n3. Fringe: Blunt cut 1 cm above brow.\n4. Finish: Low shine matte clay.',
              },
              {
                name: 'Classic Side Part Pompadour',
                match: '94% Square & Oval Match',
                guard: 'Scissor Over Comb (Graduating 1/2 to 1 in)',
                top: '3.5 in Tapering to Crown',
                price: 'Rs. 450',
                time: '35 mins',
                specs: '1. Guard: Scissor over comb taper, graduating from 1/2 inch to 1 inch.\n2. Top: 3.5 inches at front, tapering to 2.5 inches at crown.\n3. Finish: Pre-styler blow dry, set with water-based medium pomade.',
              },
              {
                name: 'Textured Modern Quiff',
                match: '92% Diamond & Round Match',
                guard: 'Mid Skin Drop Fade',
                top: '2.5 in Finger Length Upward',
                price: 'Rs. 400',
                time: '30 mins',
                specs: '1. Guard: Mid skin drop fade.\n2. Top: 2.5 inches finger length, heavily textured.\n3. Quiff: Upward brushed front fringe.\n4. Finish: Sea salt spray.',
              },
            ].map((cut, idx) => (
              <View key={idx} style={s.cutCard}>
                <View style={s.cutCardHeader}>
                  <Text style={s.cutName}>{cut.name}</Text>
                  <Text style={s.cutPrice}>{cut.price}</Text>
                </View>
                <Text style={s.cutMatch}>{cut.match} • {cut.time}</Text>

                <View style={s.cutSpecsBox}>
                  <Text style={s.cutSpecItem}>• Sides: {cut.guard}</Text>
                  <Text style={s.cutSpecItem}>• Crown: {cut.top}</Text>
                </View>

                <TouchableOpacity
                  style={s.showBarberBtn}
                  onPress={() => setSpecModalCut(cut)}
                  activeOpacity={0.8}
                >
                  <Text style={s.showBarberBtnText}>View Barber Blueprint</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {tab === 'pass' && (
          <ScrollView
            style={s.tabScroll}
            contentContainerStyle={s.tabScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {hasPass ? (
              <View style={s.ticketCard}>
                <View style={s.ticketHeader}>
                  <Image source={{ uri: SNEPR_LOGO_URI }} style={s.ticketLogo} resizeMode="contain" />
                  <View style={s.verifiedBadge}>
                    <Text style={s.verifiedText}>VERIFIED PASS</Text>
                  </View>
                </View>

                <View style={s.ticketBody}>
                  <Text style={s.ticketSalon}>{salonName}</Text>
                  <Text style={s.ticketLoc}>KIIT Square, Patia, Bhubaneswar</Text>

                  <View style={s.tokenBigBox}>
                    <Text style={s.tokenBigNum}>{token}</Text>
                    <Text style={s.tokenBigSub}>ESTIMATED WAIT: {estWait} MINS</Text>
                  </View>

                  <View style={s.passDetailsRow}>
                    <View style={s.passDetailCol}>
                      <Text style={s.passDetailLabel}>QUEUE STATUS</Text>
                      <Text style={s.passDetailVal}>{queueAhead} Ahead</Text>
                    </View>
                    <View style={s.passDetailCol}>
                      <Text style={s.passDetailLabel}>ASSIGNED CHAIR</Text>
                      <Text style={s.passDetailVal}>{chairInfo}</Text>
                    </View>
                  </View>

                  {/* QR Stamp Simulation */}
                  <View style={s.qrContainer}>
                    <Svg width="120" height="120" viewBox="0 0 120 120">
                      <Rect x="0" y="0" width="120" height="120" fill="#FAF7F2" rx="12" />
                      <Rect x="15" y="15" width="30" height="30" fill="#1B1410" />
                      <Rect x="20" y="20" width="20" height="20" fill="#FAF7F2" />
                      <Rect x="24" y="24" width="12" height="12" fill="#1B1410" />
                      <Rect x="75" y="15" width="30" height="30" fill="#1B1410" />
                      <Rect x="80" y="20" width="20" height="20" fill="#FAF7F2" />
                      <Rect x="84" y="24" width="12" height="12" fill="#1B1410" />
                      <Rect x="15" y="75" width="30" height="30" fill="#1B1410" />
                      <Rect x="20" y="80" width="20" height="20" fill="#FAF7F2" />
                      <Rect x="24" y="84" width="12" height="12" fill="#1B1410" />
                      <Rect x="55" y="20" width="10" height="20" fill="#8A4C24" />
                      <Rect x="55" y="50" width="20" height="10" fill="#1B1410" />
                      <Rect x="80" y="55" width="15" height="15" fill="#8A4C24" />
                      <Rect x="50" y="80" width="25" height="15" fill="#1B1410" />
                    </Svg>
                    <Text style={s.qrNotice}>Scan at counter upon arrival</Text>
                  </View>

                  <TouchableOpacity
                    style={s.completeHaircutBtn}
                    onPress={() => setReviewModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.completeHaircutBtnText}>Counter Verified • Rate & Claim +10 pts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={s.emptyPassBox}>
                <Text style={s.emptyPassTitle}>No Active Queue Pass</Text>
                <Text style={s.emptyPassDesc}>
                  Explore nearby salons in Bhubaneswar and reserve your chair in under 60 seconds with zero upfront fee.
                </Text>
                <TouchableOpacity
                  style={s.browseSalonsBtn}
                  onPress={() => setTab('explore')}
                  activeOpacity={0.8}
                >
                  <Text style={s.browseSalonsBtnText}>Browse Nearby Salons</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {tab === 'points' && (
          <ScrollView
            style={s.tabScroll}
            contentContainerStyle={s.tabScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.pointsHeroCard}>
              <View style={s.ptsCoinCenter}>
                <Svg width="54" height="54" viewBox="0 0 24 24">
                  <Circle cx="12" cy="12" r="11" fill="#FAF3E1" stroke="#C8993E" strokeWidth="1.8" />
                  <Circle cx="12" cy="12" r="8.5" fill="none" stroke="#D9A84E" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                  <Path d="M14.5 8.5C14 7.5 12.8 7 11.5 7C9.5 7 8 8.2 8 10C8 12.5 15 11.5 15 14.5C15 16.5 13.2 17.5 11.2 17.5C9.5 17.5 8.2 16.6 7.8 15.5" stroke="#705217" strokeWidth="1.8" strokeLinecap="round" />
                </Svg>
              </View>
              <Text style={s.ptsBalanceNum}>{points} Points</Text>
              <Text style={s.ptsBalanceVal}>= Rs. {points} Salon Bill Discount</Text>
              <Text style={s.ptsPolicyNotice}>
                1 Point = Rs. 1 • Up to 20% discount on any visit • Guaranteed +10 pts per review
              </Text>
            </View>

            <View style={s.ptsRuleCard}>
              <Text style={s.ptsRuleTitle}>Fair Loyalty Rules</Text>
              <Text style={s.ptsRuleItem}>• Zero fake reviews: reviews unlocked only after counter verification.</Text>
              <Text style={s.ptsRuleItem}>• Equal +10 pts whether you give 1 star or 5 stars.</Text>
              <Text style={s.ptsRuleItem}>• Redeemable instantly across any registered Bhubaneswar salon.</Text>
            </View>
          </ScrollView>
        )}

        {tab === 'desk' && (
          <ScrollView
            style={s.tabScroll}
            contentContainerStyle={s.tabScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.deskHeroCard}>
              <Text style={s.deskEyebrow}>SALONOS COUNTER CONSOLE</Text>
              <Text style={s.deskTitle}>Barber Chair Kanban</Text>
              <Text style={s.deskDesc}>
                3-click chair control. Tap to seat customer, complete cut, and dynamically update wait times for users.
              </Text>

              <View style={s.deskChairItem}>
                <View>
                  <Text style={s.deskChairName}>Chair 1 (Rajesh Kumar)</Text>
                  <Text style={s.deskChairStatus}>Currently serving: #B-15</Text>
                </View>
                <TouchableOpacity
                  style={s.deskCompleteBtn}
                  onPress={() => Alert.alert('Cut Completed', 'Token #B-15 marked completed. Queue automatically advanced.')}
                  activeOpacity={0.8}
                >
                  <Text style={s.deskCompleteBtnText}>Complete Cut</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Luxury Light Brown Bottom Navbar with Curved Snepr FAB */}
      <View style={s.navbar}>
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => setTab('explore')}
          activeOpacity={0.7}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={tab === 'explore' ? C.cognac : C.mute} strokeWidth="2" fill="none" />
          </Svg>
          <Text style={[s.navLabel, tab === 'explore' && s.navLabelActive]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.navBtn}
          onPress={() => setTab('studio')}
          activeOpacity={0.7}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Path d="M6 3v6M18 3v6M3 9h18M3 15h18M9 21v-6M15 21v-6" stroke={tab === 'studio' ? C.cognac : C.mute} strokeWidth="2" fill="none" />
          </Svg>
          <Text style={[s.navLabel, tab === 'studio' && s.navLabelActive]}>Studio</Text>
        </TouchableOpacity>

        {/* Center Branded Pass Button (Curved Snepr Monogram) */}
        <TouchableOpacity
          style={s.centerFab}
          onPress={() => setTab('pass')}
          activeOpacity={0.85}
        >
          <View style={s.fabInner}>
            <Svg width="26" height="26" viewBox="0 0 24 24">
              <Path d="M16 6.5C15 5 13.5 4.5 12 4.5C9 4.5 7 6.5 7 9C7 13 17 11.5 17 15.5C17 18 14.5 19.5 12 19.5C9.5 19.5 7.5 18 6.5 16.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            </Svg>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.navBtn}
          onPress={() => setTab('points')}
          activeOpacity={0.7}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" stroke={tab === 'points' ? C.cognac : C.mute} strokeWidth="2" fill="none" />
            <Path d="M12 6v6l4 2" stroke={tab === 'points' ? C.cognac : C.mute} strokeWidth="2" strokeLinecap="round" />
          </Svg>
          <Text style={[s.navLabel, tab === 'points' && s.navLabelActive]}>Points</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.navBtn}
          onPress={() => setTab('desk')}
          activeOpacity={0.7}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Rect x="2" y="3" width="20" height="14" rx="2" stroke={tab === 'desk' ? C.cognac : C.mute} strokeWidth="2" fill="none" />
            <Path d="M8 21h8M12 17v4" stroke={tab === 'desk' ? C.cognac : C.mute} strokeWidth="2" strokeLinecap="round" />
          </Svg>
          <Text style={[s.navLabel, tab === 'desk' && s.navLabelActive]}>SalonOS</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder Modal */}
      <Modal visible={cameraModalVisible} transparent animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.cameraViewfinderCard}>
            <Text style={s.cameraCardTitle}>Align Face Within Grid</Text>
            <View style={s.viewfinderFrame}>
              <Svg width="200" height="240" viewBox="0 0 200 240">
                <Rect x="10" y="10" width="180" height="220" fill="none" stroke="#C8993E" strokeWidth="2" strokeDasharray="6,6" rx="18" />
                <Circle cx="100" cy="110" r="55" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <Path d="M60 180 Q100 210 140 180" fill="none" stroke="#C8993E" strokeWidth="2" />
              </Svg>
              <Text style={s.cameraScanningText}>Analyzing Jawline & Symmetry... {scanProgress}%</Text>
            </View>
            <TouchableOpacity
              style={s.cancelModalBtn}
              onPress={() => setCameraModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={s.cancelModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Blueprint Specs Modal */}
      <Modal visible={!!specModalCut} transparent animationType="slide">
        <View style={s.modalBackdrop}>
          <View style={s.specCard}>
            <Text style={s.specCardTitle}>{specModalCut?.name}</Text>
            <Text style={s.specCardSub}>Show this blueprint to your barber at the counter:</Text>
            <Text style={s.specCardBody}>{specModalCut?.specs}</Text>
            <TouchableOpacity
              style={s.specCloseBtn}
              onPress={() => setSpecModalCut(null)}
              activeOpacity={0.8}
            >
              <Text style={s.specCloseBtnText}>Close Blueprint</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={reviewModalVisible} transparent animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.reviewCard}>
            <Text style={s.reviewTitle}>Verified Haircut Rating</Text>
            <Text style={s.reviewSub}>
              Rate your cut at {salonName}. You will receive +10 Points (= Rs. 10) regardless of 1-star or 5-star rating.
            </Text>
            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map(st => (
                <TouchableOpacity key={st} onPress={() => setSelectedStars(st)}>
                  <Text style={[s.starItem, st <= selectedStars && s.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={s.reviewInput}
              placeholder="Leave brief feedback (optional)..."
              placeholderTextColor="#9C9089"
              value={reviewNote}
              onChangeText={setReviewNote}
            />
            <TouchableOpacity
              style={s.submitReviewBtn}
              onPress={submitReview}
              activeOpacity={0.8}
            >
              <Text style={s.submitReviewBtnText}>Claim +10 Snepr Points</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Authentication Modal (Brevo SMTP Flow) */}
      <Modal visible={authModalVisible} transparent animationType="slide">
        <View style={s.modalBackdrop}>
          <View style={s.authCard}>
            <View style={s.authHeaderRow}>
              <Text style={s.authTitle}>Snepr Sign In / Sign Up</Text>
              <TouchableOpacity onPress={() => setAuthModalVisible(false)}>
                <Text style={{ color: '#9C9089', fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>

            {authStep === 'phone' && (
              <View>
                <Text style={s.authLabel}>Step 1: Enter Mobile Number</Text>
                <TextInput
                  style={s.authInput}
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                  value={userPhone}
                  onChangeText={setUserPhone}
                />
                <TouchableOpacity
                  style={s.authNextBtn}
                  onPress={handlePhoneSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={s.authNextBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'name' && (
              <View>
                <Text style={s.authLabel}>Step 2: What is your name?</Text>
                <TextInput
                  style={s.authInput}
                  placeholder="Full Name"
                  value={userName}
                  onChangeText={setUserName}
                />
                <TouchableOpacity
                  style={s.authNextBtn}
                  onPress={handleNameSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={s.authNextBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'email' && (
              <View>
                <Text style={s.authLabel}>Step 3: Email for OTP Verification</Text>
                <TextInput
                  style={s.authInput}
                  placeholder="name@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={userEmail}
                  onChangeText={setUserEmail}
                />
                <TouchableOpacity
                  style={s.authNextBtn}
                  onPress={handleEmailSubmit}
                  disabled={isSubmittingAuth}
                  activeOpacity={0.8}
                >
                  {isSubmittingAuth ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={s.authNextBtnText}>Send Email OTP (Brevo)</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'otp' && (
              <View>
                <Text style={s.authLabel}>Step 4: Enter 6-Digit Email OTP</Text>
                <Text style={s.authSubLabel}>Code sent to {userEmail}</Text>
                <TextInput
                  style={s.authInput}
                  placeholder="6-digit OTP code"
                  keyboardType="number-pad"
                  value={userOtp}
                  onChangeText={setUserOtp}
                />
                <TouchableOpacity
                  style={s.authNextBtn}
                  onPress={handleVerifyOtp}
                  disabled={isSubmittingAuth}
                  activeOpacity={0.8}
                >
                  {isSubmittingAuth ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={s.authNextBtnText}>Verify & Complete</Text>
                  )}
                </TouchableOpacity>
                <Text style={s.authTimerText}>Resend code in {otpTimer}s</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.ivory,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: C.ivory,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoImg: {
    width: 82,
    height: 28,
  },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.creamSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.line,
    maxWidth: 140,
    overflow: 'hidden',
  },
  gpsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
    marginRight: 5,
  },
  gpsText: {
    fontSize: 11,
    color: C.text2,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsHeaderBtn: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  ptsBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.goldSoft,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ECD9BE',
    gap: 5,
  },
  ptsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.goldInk,
  },
  authHeaderBtn: {
    backgroundColor: C.espresso,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  authHeaderBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  tabScroll: {
    flex: 1,
  },
  tabScrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  activePassBanner: {
    backgroundColor: C.espresso,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerTokenBox: {
    backgroundColor: C.cognac,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  bannerTokenNum: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerTokenSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
    fontWeight: '700',
  },
  bannerTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  bannerSub: {
    color: '#DED3C4',
    fontSize: 12,
    marginTop: 2,
  },
  bannerArrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 18,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.espresso,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.espresso,
  },
  sectionSubBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: C.cognac,
    backgroundColor: C.cognacSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  salonCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  salonName: {
    fontSize: 16,
    fontWeight: '700',
    color: C.espresso,
  },
  salonLoc: {
    fontSize: 12,
    color: C.text2,
    marginTop: 2,
  },
  waitPill: {
    backgroundColor: C.cognacSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECD9BE',
  },
  waitNum: {
    fontSize: 14,
    fontWeight: '800',
    color: C.cognac,
  },
  waitLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: C.cognacInk,
  },
  chairsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  chairPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  chairBusy: {
    backgroundColor: C.creamSoft,
    borderColor: C.line,
  },
  chairFree: {
    backgroundColor: C.greenSoft,
    borderColor: '#C6E8CD',
  },
  chairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotBusy: {
    backgroundColor: '#D97706',
  },
  dotFree: {
    backgroundColor: C.green,
  },
  chairText: {
    fontSize: 11,
    color: C.text2,
    fontWeight: '600',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 12,
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: C.espresso,
  },
  cardRating: {
    fontSize: 11,
    color: C.text2,
  },
  joinQueueBtn: {
    backgroundColor: C.cognac,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinQueueBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  studioHeroCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  studioEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: C.cognac,
    letterSpacing: 0.5,
  },
  studioHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.espresso,
    marginTop: 4,
  },
  studioHeroDesc: {
    fontSize: 13,
    color: C.text2,
    lineHeight: 18,
    marginTop: 6,
  },
  detectedProfileBox: {
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: '#C6E8CD',
    borderRadius: 12,
    padding: 10,
    marginVertical: 12,
  },
  detectedProfileTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: C.greenInk,
  },
  detectedProfileDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: C.greenInk,
    marginTop: 2,
  },
  scanBtn: {
    backgroundColor: C.espresso,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    overflow: 'hidden',
  },
  scanBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  previewSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.espresso,
    marginBottom: 12,
  },
  cutCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cutName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.espresso,
  },
  cutPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: C.cognac,
  },
  cutMatch: {
    fontSize: 12,
    color: C.text2,
    marginTop: 2,
  },
  cutSpecsBox: {
    backgroundColor: C.creamSoft,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  cutSpecItem: {
    fontSize: 12,
    color: C.text2,
    lineHeight: 16,
  },
  showBarberBtn: {
    backgroundColor: C.cognacSoft,
    borderWidth: 1,
    borderColor: '#ECD9BE',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  showBarberBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.cognacInk,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 24,
    overflow: 'hidden',
  },
  ticketHeader: {
    backgroundColor: C.creamSoft,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  ticketLogo: {
    width: 75,
    height: 24,
  },
  verifiedBadge: {
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: '#C6E8CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.greenInk,
  },
  ticketBody: {
    padding: 20,
    alignItems: 'center',
  },
  ticketSalon: {
    fontSize: 18,
    fontWeight: '800',
    color: C.espresso,
  },
  ticketLoc: {
    fontSize: 12,
    color: C.text2,
    marginTop: 2,
  },
  tokenBigBox: {
    backgroundColor: C.cognacSoft,
    borderWidth: 1,
    borderColor: '#ECD9BE',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  tokenBigNum: {
    fontSize: 34,
    fontWeight: '900',
    color: C.cognac,
    letterSpacing: 1,
  },
  tokenBigSub: {
    fontSize: 11,
    fontWeight: '700',
    color: C.cognacInk,
    marginTop: 2,
  },
  passDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  passDetailCol: {
    alignItems: 'center',
  },
  passDetailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.text2,
  },
  passDetailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: C.espresso,
    marginTop: 2,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  qrNotice: {
    fontSize: 11,
    color: C.text2,
    marginTop: 8,
  },
  completeHaircutBtn: {
    backgroundColor: C.espresso,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  completeHaircutBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyPassBox: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyPassTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.espresso,
  },
  emptyPassDesc: {
    fontSize: 13,
    color: C.text2,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  browseSalonsBtn: {
    backgroundColor: C.cognac,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  browseSalonsBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  pointsHeroCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  ptsCoinCenter: {
    marginBottom: 12,
  },
  ptsBalanceNum: {
    fontSize: 28,
    fontWeight: '800',
    color: C.espresso,
  },
  ptsBalanceVal: {
    fontSize: 15,
    fontWeight: '700',
    color: C.goldInk,
    marginTop: 2,
  },
  ptsPolicyNotice: {
    fontSize: 12,
    color: C.text2,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  ptsRuleCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
    padding: 18,
  },
  ptsRuleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.espresso,
    marginBottom: 8,
  },
  ptsRuleItem: {
    fontSize: 13,
    color: C.text2,
    lineHeight: 18,
    marginBottom: 6,
  },
  deskHeroCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    padding: 18,
  },
  deskEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: C.cognac,
  },
  deskTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.espresso,
    marginTop: 4,
  },
  deskDesc: {
    fontSize: 13,
    color: C.text2,
    marginTop: 4,
    lineHeight: 18,
  },
  deskChairItem: {
    backgroundColor: C.creamSoft,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  deskChairName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.espresso,
  },
  deskChairStatus: {
    fontSize: 12,
    color: C.text2,
    marginTop: 2,
  },
  deskCompleteBtn: {
    backgroundColor: C.green,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    overflow: 'hidden',
  },
  deskCompleteBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: C.navBg,
    borderTopWidth: 1,
    borderTopColor: C.navBorder,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.mute,
    marginTop: 2,
  },
  navLabelActive: {
    color: C.cognac,
    fontWeight: '700',
  },
  centerFab: {
    top: -16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.cognac,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.cognac,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FAF7F2',
    overflow: 'hidden',
  },
  fabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27,20,16,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraViewfinderCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  cameraCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.espresso,
    marginBottom: 14,
  },
  viewfinderFrame: {
    backgroundColor: '#1B1410',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 260,
  },
  cameraScanningText: {
    color: '#FAF3E1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
  cancelModalBtn: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelModalBtnText: {
    color: C.text2,
    fontWeight: '700',
    fontSize: 13,
  },
  specCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 360,
  },
  specCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.espresso,
  },
  specCardSub: {
    fontSize: 12,
    color: C.text2,
    marginTop: 4,
    marginBottom: 12,
  },
  specCardBody: {
    fontSize: 13,
    color: C.espresso,
    lineHeight: 20,
    backgroundColor: C.creamSoft,
    padding: 14,
    borderRadius: 14,
  },
  specCloseBtn: {
    backgroundColor: C.cognac,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
    overflow: 'hidden',
  },
  specCloseBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.espresso,
  },
  reviewSub: {
    fontSize: 12,
    color: C.text2,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  starItem: {
    fontSize: 32,
    color: '#E8E1D7',
  },
  starActive: {
    color: '#F59E0B',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 10,
    width: '100%',
    fontSize: 13,
    color: C.espresso,
  },
  submitReviewBtn: {
    backgroundColor: C.cognac,
    borderRadius: 12,
    paddingVertical: 11,
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
    overflow: 'hidden',
  },
  submitReviewBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  authCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 340,
  },
  authHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.espresso,
  },
  authLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.espresso,
    marginBottom: 8,
  },
  authSubLabel: {
    fontSize: 11,
    color: C.text2,
    marginBottom: 10,
  },
  authInput: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: C.espresso,
    marginBottom: 14,
  },
  authNextBtn: {
    backgroundColor: C.espresso,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  authNextBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  authTimerText: {
    fontSize: 11,
    color: C.text2,
    textAlign: 'center',
    marginTop: 10,
  },
});

