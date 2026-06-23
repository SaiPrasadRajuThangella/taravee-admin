import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GoldButton, OutlineGoldButton, StatCard } from '../../components/AdminUI';
import { useBottomTabPadding } from '../../navigation/layout';
import { api } from '../../api';
import { adminStyles, colors, fonts } from '../../theme';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const bottomPad = useBottomTabPadding();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <ScrollView
      style={adminStyles.screen}
      contentContainerStyle={[adminStyles.screenPad, { paddingBottom: bottomPad }]}
    >
      <Text style={styles.dashboardTitle}>Dashboard</Text>
      <Text style={adminStyles.pageSubtitle}>Welcome back to Taravee Studio.</Text>
      {error ? <Text style={adminStyles.errorText}>{error}</Text> : null}

      <View style={styles.statsGrid}>
        <StatCard
          icon={<Ionicons name="mail-unread-outline" size={18} color={colors.gold} />}
          label="Pending Submissions"
          value={stats?.pendingSubmissions}
        />
        <StatCard
          icon={<Ionicons name="pricetags-outline" size={18} color={colors.gold} />}
          label="Live Listings"
          value={stats?.liveListings}
        />
        <StatCard
          icon={<Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.gold} />}
          label="Total Enquiries"
          value={stats?.totalEnquiries}
        />
        <StatCard
          icon={<Ionicons name="sparkles-outline" size={18} color={colors.gold} />}
          label="New Submissions Today"
          value={stats?.newSubmissionsToday}
        />
      </View>

      <Text style={[adminStyles.sectionTitle, styles.sectionGap]}>Quick Actions</Text>
      <View style={styles.actions}>
        <GoldButton
          label="Review New Submissions"
          small
          onPress={() => navigation.navigate('Submissions', { status: 'pending' })}
        />
        <OutlineGoldButton
          label="Add New Listing"
          small
          onPress={() => navigation.navigate('Listings', { new: true })}
        />
        <OutlineGoldButton
          label="View All Listings"
          small
          onPress={() => navigation.navigate('Listings')}
        />
        <OutlineGoldButton
          label="View All Submissions"
          small
          onPress={() => navigation.navigate('Submissions', { status: '' })}
        />
      </View>

      {stats?.pageViews?.length > 0 && (
        <View style={styles.pageViews}>
          <View style={styles.pageViewsTitle}>
            <Ionicons name="eye-outline" size={18} color={colors.gold} style={styles.pageViewsIcon} />
            <Text style={styles.pageViewsHeading}>Page Views (cookie-free)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={adminStyles.tableWrap}>
              <View style={adminStyles.tableHead}>
                <Text style={[adminStyles.tableHeadCell, styles.colPage]}>Page</Text>
                <Text style={[adminStyles.tableHeadCell, styles.colViews]}>Views</Text>
              </View>
              {stats.pageViews.map((pv) => (
                <View key={pv._id} style={adminStyles.tableRow}>
                  <Text style={[adminStyles.tableCell, styles.colPage]}>{pv._id}</Text>
                  <Text style={[adminStyles.tableCell, styles.colViews]}>{pv.views}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dashboardTitle: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.gold,
  },
  statsGrid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  sectionGap: {
    marginTop: 28,
  },
  actions: {
    gap: 10,
  },
  pageViews: {
    marginTop: 28,
  },
  pageViewsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageViewsIcon: {
    marginRight: 8,
  },
  pageViewsHeading: {
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22,
    color: colors.text,
  },
  colPage: {
    width: 200,
  },
  colViews: {
    width: 80,
  },
});
