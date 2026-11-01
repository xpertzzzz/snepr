import os

content = '''import React, { useState } from 'react';
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
} from 'react-native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Design Tokens from snepr_app_ui_designs.html
const C = {
  ivory: '#FAF7F2',
  paper: '#FFFFFF',
  creamSoft: '#F5EFEB',
  creamMid: '#E8E0D5',
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
  amber: '#D97706',
  amberSoft: '#FFFBEB',
  amberInk: '#92400E',
  danger: '#B43A2A',
  dangerSoft: '#FDEEEC',
};

// Font family constants (Space Grotesk loaded via RootLayout)
const FONT = {
  regular: 'SpaceGrotesk',
  medium: 'SpaceGrotesk-Medium',
  semiBold: 'SpaceGrotesk-SemiBold',
  bold: 'SpaceGrotesk-Bold',
};

type TabType = 'explore' | 'studio' | 'pass' | 'points' | 'salonos';

export default function SneprAppMain() {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dynamic state
  const [activeToken, setActiveToken] = useState<string>('#B-14');
  const [hasActivePass, setHasActivePass] = useState<boolean>(true);
  const [pointsBalance, setPointsBalance] = useState<number>(240);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [selectedTag, setSelectedTag] = useState<string>('Precise Fade');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Kanban state for SalonOS
  const [currentServing, setCurrentServing] = useState<string>('#B-13');
  const [nextInLine, setNextInLine] = useState<string>('#B-14');

  const handleJoinQueue = (salonName: string, token: string) => {
    setActiveToken(token);
    setHasActivePass(true);
    Alert.alert(
      'Queue Joined',
      'You have reserved Token ' + token + ' at ' + salonName + '. Your estimated wait time is 11 mins.',
      [
        { text: 'View Pass', onPress: () => setActiveTab('pass') },
        { text: 'Dismiss', style: 'cancel' }
      ]
    );
  };

  const handleCompleteCurrent = () => {
    setCurrentServing(nextInLine);
    setNextInLine('#B-15');
    Alert.alert('Queue Advanced', 'Chair 1 is now serving ' + nextInLine + '. Push notification dispatched.');
  };

  const handleDelayPass = () => {
    Alert.alert('Pass Rescheduled', 'Token ' + activeToken + ' deferred by 10 mins. Estimated arrival updated to 12:45 PM.');
  };

  const handleArrivalCheckIn = () => {
    Alert.alert('Arrival Confirmed', 'Salon desk notified. Please take a seat in the waiting lounge.');
  };

  const handleSubmitReview = () => {
    if (reviewSubmitted) return;
    setPointsBalance(prev => prev + 10);
    setReviewSubmitted(true);
    Alert.alert('Fair Review Reward', '+10 Snepr Points credited to your wallet (Fair Review Promise applied).');
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.ivory} />

      {/* TOP STATUS HEADER */}
      <View style={s.topHeader}>
        <View>
          <Text style={s.localitySub}>Indiranagar, Bangalore [v]</Text>
          <Text style={s.screenTitle}>
            {activeTab === 'explore' && 'Explore Salons'}
            {activeTab === 'studio' && 'Snepr Studio AI'}
            {activeTab === 'pass' && 'Live Queue Pass'}
            {activeTab === 'points' && 'Fair Points Wallet'}
            {activeTab === 'salonos' && 'SalonOS Partner Desk'}
          </Text>
        </View>

        <TouchableOpacity 
          style={s.pointsBadge}
          onPress={() => setActiveTab('points')}
          activeOpacity={0.8}
        >
          <Text style={s.pointsBadgeText}>{pointsBalance} Pts</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT VIEW */}
      <ScrollView 
        style={s.scrollView} 
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: EXPLORE SALONS & REAL-TIME QUEUES */}
        {activeTab === 'explore' && (
          <View style={s.tabWrapper}>
            {/* Search Box */}
            <View style={s.searchBox}>
              <View style={{ marginRight: 8 }}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.mute} strokeWidth={2}>
                  <Circle cx="11" cy="11" r="8" />
                  <Path d="m21 21-4.35-4.35" />
                </Svg>
              </View>
              <TextInput
                style={s.searchInput}
                placeholder="Search salons, stylists, or services..."
                placeholderTextColor={C.mute}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Category Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipsRow}>
              {[
                { id: 'all', label: 'All Salons' },
                { id: 'zero', label: '0-Wait Now' },
                { id: 'men', label: "Men's Grooming" },
                { id: 'spa', label: 'Hair Spa & Color' },
                { id: 'beard', label: 'Beard Sculpting' },
              ].map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.chip, activeCategory === cat.id && s.chipOn]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <Text style={[s.chipText, activeCategory === cat.id && s.chipTextOn]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Salon Card 1: Urban Blade Grooming Co. */}
            <View style={s.card}>
              <View style={s.cardHead}>
                <View>
                  <Text style={s.cardTitle}>Urban Blade Grooming Co.</Text>
                  <Text style={s.salonMeta}>100ft Road - 450m away</Text>
                </View>
                <View style={s.greenBadge}>
                  <Text style={s.greenBadgeText}>0 Wait Now</Text>
                </View>
              </View>

              {/* 3 Live Chair Status Telemetry */}
              <View style={s.chairsGrid}>
                <View style={s.chairBoxFree}>
                  <Text style={s.chairNum}>Chair 1</Text>
                  <Text style={s.chairStateFree}>Free Now</Text>
                </View>
                <View style={s.chairBoxBusy}>
                  <Text style={s.chairNum}>Chair 2</Text>
                  <Text style={s.chairStateBusy}>In Cut - 6m</Text>
                </View>
                <View style={s.chairBoxFree}>
                  <Text style={s.chairNum}>Chair 3</Text>
                  <Text style={s.chairStateFree}>Free Now</Text>
                </View>
              </View>

              <View style={s.cardFooter}>
                <Text style={s.ratingText}>* 4.9 (428 reviews)</Text>
                <TouchableOpacity
                  style={s.cognacBtn}
                  onPress={() => handleJoinQueue('Urban Blade Grooming Co.', '#B-15')}
                >
                  <Text style={s.cognacBtnText}>Take Token #B-15</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Salon Card 2: Toni & Edge Atelier */}
            <View style={s.card}>
              <View style={s.cardHead}>
                <View>
                  <Text style={s.cardTitle}>Toni & Edge Atelier</Text>
                  <Text style={s.salonMeta}>12th Main - 1.1 km away</Text>
                </View>
                <View style={s.amberBadge}>
                  <Text style={s.amberBadgeText}>3 in Queue - 18m</Text>
                </View>
              </View>

              {/* 3 Live Chair Status Telemetry */}
              <View style={s.chairsGrid}>
                <View style={s.chairBoxBusy}>
                  <Text style={s.chairNum}>Chair 1</Text>
                  <Text style={s.chairStateBusy}>In Cut - 12m</Text>
                </View>
                <View style={s.chairBoxBusy}>
                  <Text style={s.chairNum}>Chair 2</Text>
                  <Text style={s.chairStateBusy}>In Cut - 8m</Text>
                </View>
                <View style={s.chairBoxBusy}>
                  <Text style={s.chairNum}>Chair 3</Text>
                  <Text style={s.chairStateBusy}>Next: #T-08</Text>
                </View>
              </View>

              <View style={s.cardFooter}>
                <Text style={s.ratingText}>* 4.8 (312 reviews)</Text>
                <TouchableOpacity
                  style={s.cognacBtn}
                  onPress={() => handleJoinQueue('Toni & Edge Atelier', '#T-09')}
                >
                  <Text style={s.cognacBtnText}>Join Queue - Rs. 450</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: AI STUDIO (STYLE SCANNER & FACE SHAPE) */}
        {activeTab === 'studio' && (
          <View style={s.tabWrapper}>
            {/* AI Banner Card */}
            <View style={s.studioBanner}>
              <Text style={s.studioBadge}>Snepr Studio 2026</Text>
              <Text style={s.studioHead}>Face-Shape Style Match</Text>
              <Text style={s.studioSub}>
                Upload or analyze camera selfie to match your jawline geometry with ideal maintenance cuts.
              </Text>
              <TouchableOpacity
                style={s.whiteBtn}
                onPress={() => Alert.alert('Camera Scan', 'Camera alignment active: Oval & Square Face profile detected.')}
              >
                <Text style={s.whiteBtnText}>Scan Face Geometry</Text>
              </TouchableOpacity>
            </View>

            {/* Style Card 1 */}
            <View style={s.card}>
              <View style={s.styleMockBox}>
                <View style={s.styleTagPill}>
                  <Text style={s.styleTagText}>Oval & Square Match</Text>
                </View>
                <Text style={s.styleMonogram}>TC</Text>
              </View>
              <View style={{ paddingTop: 12 }}>
                <View style={s.rowBetween}>
                  <Text style={s.styleName}>Low Taper Textured Crop</Text>
                  <Text style={s.styleRating}>* 4.9</Text>
                </View>
                <Text style={s.styleDesc}>Clipper guard #2 sides - Matte paste finish</Text>
                <View style={[s.rowBetween, { marginTop: 10 }]}>
                  <Text style={s.maintText}>Maint: High (10-14 days)</Text>
                  <TouchableOpacity
                    style={s.cognacBtnSm}
                    onPress={() => Alert.alert('Barber Card', 'Show this preset to barber: Low taper fade with 1.5 inch scissor crop on top.')}
                  >
                    <Text style={s.cognacBtnTextSm}>Show to Barber</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Style Card 2 */}
            <View style={s.card}>
              <View style={[s.styleMockBox, { backgroundColor: '#2C1D16' }]}>
                <View style={s.styleTagPill}>
                  <Text style={s.styleTagText}>Round & Heart Match</Text>
                </View>
                <Text style={s.styleMonogram}>MP</Text>
              </View>
              <View style={{ paddingTop: 12 }}>
                <View style={s.rowBetween}>
                  <Text style={s.styleName}>Executive Modern Pompadour</Text>
                  <Text style={s.styleRating}>* 4.8</Text>
                </View>
                <Text style={s.styleDesc}>Scissor layered top - Natural volume blowout</Text>
                <View style={[s.rowBetween, { marginTop: 10 }]}>
                  <Text style={s.maintText}>Maint: Medium (2 wks)</Text>
                  <TouchableOpacity
                    style={s.cognacBtnSm}
                    onPress={() => Alert.alert('Barber Card', 'Show this preset to barber: Scissor tapered sides with natural textured volume on top.')}
                  >
                    <Text style={s.cognacBtnTextSm}>Show to Barber</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: DIGITAL PASS / LIVE QUEUE TICKET */}
        {activeTab === 'pass' && (
          <View style={s.tabWrapper}>
            {/* Perforated Ticket Pass */}
            <View style={s.ticketCard}>
              <View style={s.ticketTop}>
                <Text style={s.ticketSalon}>Urban Blade Grooming Co.</Text>
                <Text style={s.ticketToken}>{activeToken}</Text>
                <View style={s.amberBadge}>
                  <Text style={s.amberBadgeText}>Est. Wait: 11 mins</Text>
                </View>

                <View style={[s.rowCenter, { marginTop: 12, gap: 16 }]}>
                  <Text style={s.ticketMeta}>
                    Position: <Text style={s.boldText}>1 Ahead</Text>
                  </Text>
                  <Text style={s.ticketMeta}>
                    Chair: <Text style={s.boldText}>Chair 1 (Rajesh)</Text>
                  </Text>
                </View>
              </View>

              {/* Perforation Divider Line */}
              <View style={s.perforationLine} />

              <View style={s.ticketBottom}>
                <View style={s.qrRow}>
                  <View style={s.qrBox}>
                    <Text style={s.qrText}>SNEPR PASS</Text>
                    <Text style={s.qrSubText}>{activeToken}</Text>
                  </View>
                  <View style={{ flex: 1, paddingLeft: 14 }}>
                    <Text style={s.qrLabel}>Fast Check-In</Text>
                    <Text style={s.qrDesc}>Scan tablet camera at salon desk upon arrival.</Text>
                  </View>
                </View>

                {/* 3-Step Queue Timeline */}
                <View style={s.timeline}>
                  <View style={s.timelineStep}>
                    <View style={s.stepDotDone} />
                    <Text style={s.stepTextDone}>Token Reserved (12:15 PM)</Text>
                  </View>
                  <View style={s.timelineStep}>
                    <View style={s.stepDotActive} />
                    <Text style={s.stepTextActive}>You are Next - Head towards salon</Text>
                  </View>
                  <View style={s.timelineStep}>
                    <View style={s.stepDotPending} />
                    <Text style={s.stepTextPending}>Chair Ready (Est. 12:35 PM)</Text>
                  </View>
                </View>

                {/* Interactive Pass Controls */}
                <View style={[s.rowBetween, { marginTop: 14 }]}>
                  <TouchableOpacity style={s.delayBtn} onPress={handleDelayPass}>
                    <Text style={s.delayBtnText}>Delay 10 Mins</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.arrivedBtn} onPress={handleArrivalCheckIn}>
                    <Text style={s.arrivedBtnText}>I Have Arrived</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 4: FAIR POINTS WALLET & REVIEW SYSTEM */}
        {activeTab === 'points' && (
          <View style={s.tabWrapper}>
            {/* Points Balance Card */}
            <View style={s.pointsWalletCard}>
              <Text style={s.walletTitle}>Snepr Fair Points Wallet</Text>
              <Text style={s.pointsBigVal}>{pointsBalance} Pts</Text>
              <Text style={s.walletWorth}>Equivalent Value: Rs. {pointsBalance}</Text>
              <View style={s.walletPill}>
                <Text style={s.walletPillText}>Instant Bill Redemption: Max 20% bill deduction</Text>
              </View>
            </View>

            {/* Fair Review Promise Card */}
            <View style={s.promiseCard}>
              <View style={s.rowCenter}>
                <Text style={s.promiseTitle}>Snepr Fair Review Promise</Text>
              </View>
              <Text style={s.promiseText}>
                All ratings (1 to 5 stars) receive an equal{' '}
                <Text style={s.boldText}>+10 Snepr Points</Text> credit. Honest feedback helps salons improve.
              </Text>
            </View>

            {/* Interactive Review Form */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Rate Your Last Cut (Urban Blade)</Text>
              <Text style={s.salonMeta}>Haircut & Beard Trim with Rajesh</Text>

              {/* Star Rating Selector */}
              <View style={s.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setRatingStars(star)}>
                    <Text style={[s.starItem, ratingStars >= star && s.starItemOn]}>
                      *
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tag Chips */}
              <View style={s.tagsRow}>
                {['Precise Fade', 'Zero Wait', 'Clean Station', 'Great Advice'].map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[s.tagChip, selectedTag === tag && s.tagChipOn]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text style={[s.tagChipText, selectedTag === tag && s.tagChipTextOn]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[s.cognacBtnFull, reviewSubmitted && { backgroundColor: C.mute }]}
                onPress={handleSubmitReview}
                disabled={reviewSubmitted}
              >
                <Text style={s.cognacBtnText}>
                  {reviewSubmitted ? 'Review Submitted (+10 Pts Added)' : 'Submit Rating & Claim +10 Pts'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Transparent Points Ledger */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Points Ledger History</Text>
              <View style={s.ledgerItem}>
                <View>
                  <Text style={s.ledgerTitle}>Fair Review - Urban Blade</Text>
                  <Text style={s.ledgerMeta}>Yesterday - Verified Visit</Text>
                </View>
                <Text style={s.ledgerGreen}>+10 Pts</Text>
              </View>
              <View style={s.ledgerItem}>
                <View>
                  <Text style={s.ledgerTitle}>Checkout Bill Redemption</Text>
                  <Text style={s.ledgerMeta}>24 Oct - Toni & Edge</Text>
                </View>
                <Text style={s.ledgerRed}>-80 Pts</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 5: SALONOS PARTNER DESK & KANBAN */}
        {activeTab === 'salonos' && (
          <View style={s.tabWrapper}>
            {/* Live Counters */}
            <View style={s.deskGrid}>
              <View style={s.deskStatBox}>
                <Text style={s.deskStatVal}>4</Text>
                <Text style={s.deskStatLbl}>Waiting</Text>
              </View>
              <View style={s.deskStatBox}>
                <Text style={s.deskStatVal}>3</Text>
                <Text style={s.deskStatLbl}>In Chairs</Text>
              </View>
              <View style={s.deskStatBox}>
                <Text style={s.deskStatVal}>21</Text>
                <Text style={s.deskStatLbl}>Completed</Text>
              </View>
            </View>

            {/* Active Chair Serving Card */}
            <View style={s.card}>
              <View style={s.rowBetween}>
                <Text style={s.cardTitle}>Chair 1 - Barber Rajesh</Text>
                <View style={s.amberBadge}>
                  <Text style={s.amberBadgeText}>In Progress - 8m</Text>
                </View>
              </View>

              <View style={s.currentCustomerBox}>
                <Text style={s.customerToken}>{currentServing}</Text>
                <Text style={s.customerName}>Vikram Malhotra - Skin Fade</Text>
              </View>

              <TouchableOpacity style={s.advanceBtn} onPress={handleCompleteCurrent}>
                <Text style={s.advanceBtnText}>
                  Complete & Call Next ({nextInLine})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Waiting Queue List */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Lounge Waiting List</Text>
              <View style={s.queueRow}>
                <View>
                  <Text style={s.queueItemName}>Token #B-14 - Rahul S.</Text>
                  <Text style={s.queueItemGreen}>Arrived in waiting area</Text>
                </View>
                <View style={s.greenBadge}>
                  <Text style={s.greenBadgeText}>Ready Next</Text>
                </View>
              </View>
              <View style={s.queueRow}>
                <View>
                  <Text style={s.queueItemName}>Token #B-15 - Priya Sen</Text>
                  <Text style={s.salonMeta}>En Route - 4 mins away</Text>
                </View>
                <View style={s.amberBadge}>
                  <Text style={s.amberBadgeText}>Next</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FLOATING DOCK NAVBAR */}
      <View style={s.dockContainer}>
        <View style={s.dockBar}>
          {/* Tab 1: Explore */}
          <TouchableOpacity
            style={s.dockItem}
            onPress={() => setActiveTab('explore')}
            activeOpacity={0.7}
          >
            <View style={[s.dockIconBox, activeTab === 'explore' && s.dockIconBoxOn]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={activeTab === 'explore' ? C.ivory : C.mute} strokeWidth={2}>
                <Circle cx="12" cy="12" r="10" />
                <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={activeTab === 'explore' ? C.gold : 'none'} stroke={activeTab === 'explore' ? C.gold : C.mute} />
              </Svg>
            </View>
            <Text style={[s.dockLabel, activeTab === 'explore' && s.dockLabelOn]}>Explore</Text>
          </TouchableOpacity>

          {/* Tab 2: Studio */}
          <TouchableOpacity
            style={s.dockItem}
            onPress={() => setActiveTab('studio')}
            activeOpacity={0.7}
          >
            <View style={[s.dockIconBox, activeTab === 'studio' && s.dockIconBoxOn]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={activeTab === 'studio' ? C.ivory : C.mute} strokeWidth={2}>
                <Path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" fill={activeTab === 'studio' ? C.gold : 'none'} />
              </Svg>
            </View>
            <Text style={[s.dockLabel, activeTab === 'studio' && s.dockLabelOn]}>Studio</Text>
          </TouchableOpacity>

          {/* Tab 3: Center Elevated Pass Button */}
          <TouchableOpacity
            style={s.dockItemCenter}
            onPress={() => setActiveTab('pass')}
            activeOpacity={0.85}
          >
            <View style={s.dockFab}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2}>
                <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" fill="rgba(255,255,255,0.15)" />
              </Svg>
              {hasActivePass && <View style={s.dockPulse} />}
            </View>
            <Text style={[s.dockLabelCenter, activeTab === 'pass' && s.dockLabelOn]}>Pass</Text>
          </TouchableOpacity>

          {/* Tab 4: Points */}
          <TouchableOpacity
            style={s.dockItem}
            onPress={() => setActiveTab('points')}
            activeOpacity={0.7}
          >
            <View style={[s.dockIconBox, activeTab === 'points' && s.dockIconBoxOn]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={activeTab === 'points' ? C.ivory : C.mute} strokeWidth={2}>
                <Circle cx="12" cy="12" r="9" />
                <Path d="M12 7v5l3 3" />
              </Svg>
            </View>
            <Text style={[s.dockLabel, activeTab === 'points' && s.dockLabelOn]}>Points</Text>
          </TouchableOpacity>

          {/* Tab 5: SalonOS */}
          <TouchableOpacity
            style={s.dockItem}
            onPress={() => setActiveTab('salonos')}
            activeOpacity={0.7}
          >
            <View style={[s.dockIconBox, activeTab === 'salonos' && s.dockIconBoxOn]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={activeTab === 'salonos' ? C.ivory : C.mute} strokeWidth={2}>
                <Rect width="20" height="14" x="2" y="7" rx="2" />
                <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </Svg>
            </View>
            <Text style={[s.dockLabel, activeTab === 'salonos' && s.dockLabelOn]}>SalonOS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.ivory,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
    backgroundColor: C.ivory,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  localitySub: {
    fontSize: 12,
    fontWeight: '600',
    color: C.cognac,
    fontFamily: FONT.semiBold,
    marginBottom: 2,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  pointsBadge: {
    backgroundColor: C.goldSoft,
    borderColor: C.gold,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.goldInk,
    fontFamily: FONT.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabWrapper: {
    gap: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.text,
    fontFamily: FONT.regular,
  },
  chipsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  chip: {
    backgroundColor: C.creamSoft,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  chipOn: {
    backgroundColor: C.espresso,
    borderColor: C.espresso,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: C.text2,
    fontFamily: FONT.medium,
  },
  chipTextOn: {
    color: C.ivory,
    fontFamily: FONT.bold,
  },
  card: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
    padding: 16,
    shadowColor: C.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  salonMeta: {
    fontSize: 12,
    color: C.text2,
    marginTop: 2,
    fontFamily: FONT.regular,
  },
  greenBadge: {
    backgroundColor: C.greenSoft,
    borderColor: C.green,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  greenBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.greenInk,
    fontFamily: FONT.bold,
  },
  amberBadge: {
    backgroundColor: C.amberSoft,
    borderColor: C.amber,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  amberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.amberInk,
    fontFamily: FONT.bold,
  },
  chairsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chairBoxFree: {
    flex: 1,
    backgroundColor: C.greenSoft,
    borderColor: C.green,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chairBoxBusy: {
    flex: 1,
    backgroundColor: C.creamSoft,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chairNum: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text2,
    fontFamily: FONT.medium,
  },
  chairStateFree: {
    fontSize: 11,
    fontWeight: '700',
    color: C.greenInk,
    fontFamily: FONT.bold,
    marginTop: 2,
  },
  chairStateBusy: {
    fontSize: 11,
    fontWeight: '600',
    color: C.cognac,
    fontFamily: FONT.semiBold,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.creamSoft,
    paddingTop: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
    fontFamily: FONT.semiBold,
  },
  cognacBtn: {
    backgroundColor: C.cognac,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cognacBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONT.bold,
  },
  cognacBtnSm: {
    backgroundColor: C.cognac,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cognacBtnTextSm: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONT.bold,
  },
  cognacBtnFull: {
    backgroundColor: C.cognac,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  studioBanner: {
    backgroundColor: C.espresso,
    borderRadius: 18,
    padding: 18,
  },
  studioBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: C.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: FONT.bold,
  },
  studioHead: {
    fontSize: 18,
    fontWeight: '800',
    color: C.ivory,
    marginVertical: 6,
    fontFamily: FONT.bold,
  },
  studioSub: {
    fontSize: 12.5,
    color: C.mute,
    lineHeight: 18,
    marginBottom: 14,
    fontFamily: FONT.regular,
  },
  whiteBtn: {
    backgroundColor: C.ivory,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  whiteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  styleMockBox: {
    height: 120,
    backgroundColor: '#3D281E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  styleTagPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  styleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONT.bold,
  },
  styleMonogram: {
    fontSize: 32,
    fontWeight: '800',
    color: C.goldSoft,
    letterSpacing: 2,
    fontFamily: FONT.bold,
  },
  styleName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  styleRating: {
    fontSize: 12,
    fontWeight: '700',
    color: C.goldInk,
    fontFamily: FONT.bold,
  },
  styleDesc: {
    fontSize: 12,
    color: C.text2,
    marginTop: 2,
    fontFamily: FONT.regular,
  },
  maintText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.mute,
    fontFamily: FONT.medium,
  },
  ticketCard: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ticketTop: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: C.paper,
  },
  ticketSalon: {
    fontSize: 14,
    fontWeight: '600',
    color: C.cognac,
    fontFamily: FONT.semiBold,
  },
  ticketToken: {
    fontSize: 44,
    fontWeight: '800',
    color: C.espresso,
    fontFamily: FONT.bold,
    marginVertical: 4,
  },
  perforationLine: {
    height: 1,
    borderWidth: 1,
    borderColor: C.line,
    borderStyle: 'dashed',
    marginHorizontal: 12,
  },
  ticketBottom: {
    padding: 18,
    backgroundColor: C.creamSoft,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.paper,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  qrBox: {
    width: 68,
    height: 68,
    backgroundColor: C.espresso,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.gold,
    letterSpacing: 1,
    fontFamily: FONT.bold,
  },
  qrSubText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
    fontFamily: FONT.bold,
  },
  qrLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  qrDesc: {
    fontSize: 11,
    color: C.text2,
    marginTop: 2,
    lineHeight: 15,
    fontFamily: FONT.regular,
  },
  timeline: {
    marginTop: 14,
    gap: 10,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepDotDone: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.green,
  },
  stepDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.gold,
  },
  stepDotPending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.line,
  },
  stepTextDone: {
    fontSize: 11.5,
    color: C.text2,
    fontFamily: FONT.regular,
  },
  stepTextActive: {
    fontSize: 11.5,
    fontWeight: '700',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  stepTextPending: {
    fontSize: 11.5,
    color: C.mute,
    fontFamily: FONT.regular,
  },
  delayBtn: {
    flex: 1,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  delayBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
    fontFamily: FONT.semiBold,
  },
  arrivedBtn: {
    flex: 1,
    backgroundColor: C.green,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  arrivedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONT.bold,
  },
  ticketMeta: {
    fontSize: 12,
    color: C.text2,
    fontFamily: FONT.regular,
  },
  boldText: {
    fontWeight: '700',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  pointsWalletCard: {
    backgroundColor: C.espresso,
    borderRadius: 18,
    padding: 18,
  },
  walletTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: C.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: FONT.semiBold,
  },
  pointsBigVal: {
    fontSize: 40,
    fontWeight: '800',
    color: C.ivory,
    marginVertical: 4,
    fontFamily: FONT.bold,
  },
  walletWorth: {
    fontSize: 13,
    color: C.mute,
    fontFamily: FONT.medium,
  },
  walletPill: {
    marginTop: 12,
    backgroundColor: 'rgba(200, 153, 62, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  walletPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.gold,
    fontFamily: FONT.medium,
  },
  promiseCard: {
    backgroundColor: C.goldSoft,
    borderColor: C.gold,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  promiseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.goldInk,
    fontFamily: FONT.bold,
  },
  promiseText: {
    fontSize: 12,
    color: C.text,
    lineHeight: 17,
    marginTop: 4,
    fontFamily: FONT.regular,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  starItem: {
    fontSize: 28,
    fontWeight: '700',
    color: C.line,
    fontFamily: FONT.bold,
  },
  starItemOn: {
    color: C.gold,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tagChip: {
    backgroundColor: C.creamSoft,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.line,
  },
  tagChipOn: {
    backgroundColor: C.cognac,
    borderColor: C.cognac,
  },
  tagChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: C.text2,
    fontFamily: FONT.medium,
  },
  tagChipTextOn: {
    color: '#FFFFFF',
    fontFamily: FONT.bold,
  },
  ledgerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.creamSoft,
  },
  ledgerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
    fontFamily: FONT.semiBold,
  },
  ledgerMeta: {
    fontSize: 11,
    color: C.mute,
    marginTop: 2,
    fontFamily: FONT.regular,
  },
  ledgerGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: C.green,
    fontFamily: FONT.bold,
  },
  ledgerRed: {
    fontSize: 13,
    fontWeight: '700',
    color: C.danger,
    fontFamily: FONT.bold,
  },
  deskGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  deskStatBox: {
    flex: 1,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deskStatVal: {
    fontSize: 24,
    fontWeight: '800',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  deskStatLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: C.mute,
    marginTop: 2,
    fontFamily: FONT.medium,
  },
  currentCustomerBox: {
    backgroundColor: C.creamSoft,
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  customerToken: {
    fontSize: 26,
    fontWeight: '800',
    color: C.espresso,
    fontFamily: FONT.bold,
  },
  customerName: {
    fontSize: 12.5,
    color: C.text2,
    marginTop: 2,
    fontFamily: FONT.medium,
  },
  advanceBtn: {
    backgroundColor: C.green,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  advanceBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONT.bold,
  },
  queueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.creamSoft,
  },
  queueItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
    fontFamily: FONT.semiBold,
  },
  queueItemGreen: {
    fontSize: 11,
    color: C.green,
    marginTop: 2,
    fontWeight: '600',
    fontFamily: FONT.medium,
  },
  dockContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  dockBar: {
    width: '100%',
    maxWidth: 380,
    height: 64,
    backgroundColor: 'rgba(27, 20, 16, 0.96)',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 225, 215, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: 58,
  },
  dockIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockIconBoxOn: {
    backgroundColor: 'rgba(200, 153, 62, 0.25)',
  },
  dockLabel: {
    fontSize: 10,
    color: C.mute,
    marginTop: 2,
    fontFamily: FONT.medium,
  },
  dockLabelOn: {
    color: C.gold,
    fontFamily: FONT.bold,
  },
  dockItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
    width: 64,
  },
  dockFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.cognac,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.ivory,
    shadowColor: C.cognac,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  dockPulse: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: C.ivory,
  },
  dockLabelCenter: {
    fontSize: 10,
    color: C.mute,
    marginTop: 4,
    fontFamily: FONT.medium,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
'''

with open('d:/FL/snepr/app/app/(tabs)/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated index.tsx with Space Grotesk fonts, SVGs, and zero emojis.')

