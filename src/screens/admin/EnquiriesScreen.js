import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../api';
import { useBottomTabPadding } from '../../navigation/layout';
import { adminStyles, colors, fonts } from '../../theme';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

export default function EnquiriesScreen() {
  const bottomPad = useBottomTabPadding();
  const [statusFilter, setStatusFilter] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getEnquiries(statusFilter);
      setEnquiries(data);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  return (
    <ScrollView
      style={adminStyles.screen}
      contentContainerStyle={[adminStyles.screenPad, { paddingBottom: bottomPad }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.gold} />
      }
    >
      <Text style={adminStyles.pageTitle}>Enquiries</Text>
      <Text style={adminStyles.pageSubtitle}>Buyer price requests and messages.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <Pressable
              key={f.value || 'all'}
              onPress={() => setStatusFilter(f.value)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {message ? <Text style={adminStyles.errorText}>{message}</Text> : null}

      {loading ? (
        <ActivityIndicator color={colors.gold} style={styles.loader} />
      ) : enquiries.length === 0 ? (
        <Text style={styles.empty}>No enquiries yet.</Text>
      ) : (
        enquiries.map((e) => (
          <View key={e._id} style={styles.card}>
            <Text style={styles.cardTitle}>{e.pieceName || e.listingTitle || 'Enquiry'}</Text>
            <Text style={styles.cardMeta}>
              {e.name} · {e.email || e.phone || '—'}
            </Text>
            {e.message ? <Text style={styles.cardBody}>{e.message}</Text> : null}
            <Text style={styles.cardStatus}>Status: {e.status || 'new'}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginTop: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
    borderColor: colors.gold,
  },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.gold,
    fontFamily: fonts.bodySemiBold,
  },
  loader: {
    marginTop: 32,
  },
  empty: {
    marginTop: 24,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
  },
  card: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.dark,
    padding: 14,
  },
  cardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.gold,
  },
  cardMeta: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  cardBody: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  cardStatus: {
    marginTop: 8,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textDim,
    textTransform: 'capitalize',
  },
});
