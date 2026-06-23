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
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AdminSelect from '../../components/AdminSelect';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import RemoteImage from '../../components/RemoteImage';
import SubmissionDetailModal from '../../components/SubmissionDetailModal';
import TableHorizontalScroll from '../../components/TableHorizontalScroll';
import { StatusBadge, TIMES_WORN_LABELS } from '../../components/SubmissionUI';
import { useBottomTabPadding } from '../../navigation/layout';
import { api } from '../../api';
import { shortId } from '../../utils/doc';
import { adminStyles, colors, fonts } from '../../theme';

const FILTERS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'discussion', label: 'In Discussion' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const COLS = [
  { key: 'id', label: 'ID', width: 70 },
  { key: 'date', label: 'Date', width: 90 },
  { key: 'seller', label: 'Seller', width: 110 },
  { key: 'city', label: 'City', width: 90 },
  { key: 'brand', label: 'Brand', width: 100 },
  { key: 'category', label: 'Category', width: 100 },
  { key: 'purchase', label: 'Purchase ₹', width: 100 },
  { key: 'expected', label: 'Expected ₹', width: 100 },
  { key: 'condition', label: 'Condition', width: 120 },
  { key: 'photos', label: 'Photos', width: 70 },
  { key: 'status', label: 'Status', width: 140 },
  { key: 'actions', label: 'Actions', width: 90 },
];

export default function SubmissionsScreen() {
  const route = useRoute();
  const bottomPad = useBottomTabPadding();
  const [statusFilter, setStatusFilter] = useState(route.params?.status || '');
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (route.params != null && 'status' in route.params) {
        setStatusFilter(route.params.status ?? '');
      }
    }, [route.params])
  );

  const load = useCallback(async () => {
    try {
      const data = await api.getSubmissions(statusFilter);
      setSubmissions(data);
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

  const handleAction = async (action, submission, reason) => {
    setBusy(true);
    setMessage('');
    try {
      if (action === 'approve') {
        await api.approveSubmission(submission._id);
        setMessage('Approved — a draft listing was created. Open Listings to publish it.');
      } else {
        await api.setSubmissionStatus(submission._id, action, reason);
      }
      setSelected(null);
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={adminStyles.screen}>
      <ScrollView
        contentContainerStyle={[adminStyles.screenPad, { paddingBottom: bottomPad }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.gold} />
        }
      >
        <Text style={adminStyles.pageTitle}>Seller Submissions</Text>
        <View style={styles.filterSelect}>
          <AdminSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={FILTERS}
            placeholder="All statuses"
          />
        </View>

        {message ? (
          <View style={adminStyles.messageBanner}>
            <Text style={adminStyles.messageBannerText}>{message}</Text>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator color={colors.gold} style={styles.loader} />
        ) : (
          <TableHorizontalScroll>
            <View style={adminStyles.tableWrap}>
              <View style={adminStyles.tableHead}>
                {COLS.map((col) => (
                  <Text key={col.key} style={[adminStyles.tableHeadCell, { width: col.width }]}>
                    {col.label}
                  </Text>
                ))}
              </View>
              {submissions.map((s, index) => (
                <View key={s._id || `submission-${index}`} style={adminStyles.tableRow}>
                  <Text style={[adminStyles.tableCell, { width: COLS[0].width, fontFamily: fonts.bodyMedium }]}>
                    {shortId(s._id)}
                  </Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[1].width }]}>
                    {new Date(s.createdAt).toLocaleDateString('en-IN')}
                  </Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[2].width }]}>{s.fullName}</Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[3].width }]}>{s.city}</Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[4].width }]}>{s.designer}</Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[5].width }]}>{s.category}</Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[6].width }]}>
                    ₹{s.originalPrice?.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[7].width }]}>
                    ₹{s.expectedPrice?.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[8].width }]}>
                    {TIMES_WORN_LABELS[s.timesWorn] || s.timesWorn}
                  </Text>
                  <View style={[styles.photoCell, { width: COLS[9].width }]}>
                    {s.photos?.[0] ? (
                      <Pressable onPress={() => setPreviewPhoto(s.photos[0])}>
                        <RemoteImage photo={s.photos[0]} style={styles.thumb} contentFit="cover" />
                      </Pressable>
                    ) : (
                      <Text style={adminStyles.tableCell}>—</Text>
                    )}
                  </View>
                  <View style={[styles.statusCell, { width: COLS[10].width }]}>
                    <StatusBadge status={s.status} />
                  </View>
                  <View style={[styles.actionCell, { width: COLS[11].width }]}>
                    <Pressable onPress={() => setSelected(s)} style={styles.viewBtn}>
                      <Ionicons name="eye-outline" size={13} color={colors.gold} />
                      <Text style={styles.viewBtnText}>View</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              {!submissions.length && (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No submissions yet.</Text>
                </View>
              )}
            </View>
          </TableHorizontalScroll>
        )}
      </ScrollView>

      <SubmissionDetailModal
        submission={selected}
        onClose={() => setSelected(null)}
        onAction={handleAction}
        busy={busy}
      />

      <ImagePreviewModal
        photo={previewPhoto}
        visible={Boolean(previewPhoto)}
        onClose={() => setPreviewPhoto(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterSelect: {
    width: '100%',
    marginTop: 14,
    marginBottom: 4,
  },
  loader: {
    marginTop: 40,
  },
  photoCell: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.gold,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDim,
  },
});
