import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import ListingFormModal from '../../components/ListingFormModal';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import RemoteImage from '../../components/RemoteImage';
import TableHorizontalScroll from '../../components/TableHorizontalScroll';
import { GoldButton } from '../../components/AdminUI';
import { LISTING_STATUS_STYLES } from '../../constants/listings';
import { useBottomTabPadding } from '../../navigation/layout';
import { api } from '../../api';
import { adminStyles, colors, fonts } from '../../theme';

const COLS = [
  { key: 'reorder', label: '', width: 190 },
  { key: 'photo', label: 'Photo', width: 70 },
  { key: 'title', label: 'Title', width: 180 },
  { key: 'category', label: 'Category', width: 120 },
  { key: 'condition', label: 'Condition', width: 130 },
  { key: 'price', label: 'Internal ₹', width: 100 },
  { key: 'enquiries', label: 'Enquiries', width: 90 },
  { key: 'status', label: 'Status', width: 100 },
  { key: 'actions', label: 'Actions', width: 200 },
];

function ListingStatusBadge({ status }) {
  const style = LISTING_STATUS_STYLES[status] || LISTING_STATUS_STYLES.draft;
  const label = status === 'sold' ? 'Sold 🤍' : status;
  return (
    <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
      <Text style={[styles.statusText, { color: style.color }]}>{label}</Text>
    </View>
  );
}

function IconAction({ onPress, icon, danger, label }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      style={[styles.iconBtn, danger && styles.iconBtnDanger]}
    >
      <Ionicons name={icon} size={14} color={danger ? '#FCA5A5' : colors.gold} />
    </Pressable>
  );
}

export default function ListingsScreen() {
  const route = useRoute();
  const bottomPad = useBottomTabPadding();
  const [listings, setListings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.getAdminListings();
      setListings(data);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (route.params?.new) {
      setEditing('new');
    }
  }, [route.params?.new]);

  const setStatus = async (listing, status) => {
    try {
      await api.setListingStatus(listing._id, { status });
      await load();
    } catch (e) {
      setMessage(e.message);
    }
  };

  const toggleFeatured = async (listing) => {
    try {
      await api.setListingStatus(listing._id, { featured: !listing.featured });
      await load();
    } catch (e) {
      setMessage(e.message);
    }
  };

  const remove = (listing) => {
    Alert.alert('Delete listing', `Delete "${listing.title}" permanently?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteListing(listing._id);
            await load();
          } catch (e) {
            setMessage(e.message);
          }
        },
      },
    ]);
  };

  const moveListing = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= listings.length) return;
    const next = [...listings];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setListings(next);
    try {
      await api.reorderListings(next.map((l) => l._id));
    } catch (e) {
      setMessage(e.message);
      await load();
    }
  };

  return (
    <View style={adminStyles.screen}>
      <ScrollView
        contentContainerStyle={[adminStyles.screenPad, { paddingBottom: bottomPad }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.gold}
          />
        }
      >
        <View style={styles.headerRow}>
          <Text style={adminStyles.pageTitle}>Listings</Text>
          <GoldButton label="Add New" small onPress={() => setEditing('new')} />
        </View>

        {message ? <Text style={adminStyles.errorText}>{message}</Text> : null}
        <Text style={styles.hint}>Use Move up / Move down to reorder how pieces appear in the shop.</Text>

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

              {listings.map((l, index) => (
                <View key={l._id || `listing-${index}`} style={adminStyles.tableRow}>
                  <View style={[styles.reorderCell, { width: COLS[0].width }]}>
                    <Pressable
                      onPress={() => moveListing(index, -1)}
                      disabled={index === 0}
                      style={[styles.moveBtn, index === 0 && styles.moveBtnDisabled]}
                    >
                      <Ionicons
                        name="chevron-up"
                        size={14}
                        color={index === 0 ? colors.textDim : colors.gold}
                      />
                      <Text style={[styles.moveBtnText, index === 0 && styles.moveBtnTextDisabled]}>
                        Move up
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => moveListing(index, 1)}
                      disabled={index === listings.length - 1}
                      style={[
                        styles.moveBtn,
                        index === listings.length - 1 && styles.moveBtnDisabled,
                      ]}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={14}
                        color={index === listings.length - 1 ? colors.textDim : colors.gold}
                      />
                      <Text
                        style={[
                          styles.moveBtnText,
                          index === listings.length - 1 && styles.moveBtnTextDisabled,
                        ]}
                      >
                        Move down
                      </Text>
                    </Pressable>
                  </View>

                  <View style={[styles.photoCell, { width: COLS[1].width }]}>
                    {l.photos?.[0] ? (
                      <Pressable onPress={() => setPreviewPhoto(l.photos[0])}>
                        <RemoteImage photo={l.photos[0]} style={styles.thumb} contentFit="cover" />
                      </Pressable>
                    ) : (
                      <Text style={styles.dash}>—</Text>
                    )}
                  </View>

                  <View style={[styles.titleCell, { width: COLS[2].width }]}>
                    <Text style={adminStyles.tableCell} numberOfLines={2}>
                      {l.title}
                    </Text>
                    {l.featured ? (
                      <Ionicons name="star" size={14} color={colors.gold} style={styles.star} />
                    ) : null}
                  </View>

                  <Text style={[adminStyles.tableCell, { width: COLS[3].width }]}>{l.category}</Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[4].width }]}>{l.condition}</Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[5].width }]}>
                    {l.internalPrice ? `₹${Number(l.internalPrice).toLocaleString('en-IN')}` : '—'}
                  </Text>
                  <Text style={[adminStyles.tableCell, { width: COLS[6].width }]}>{l.enquiries || 0}</Text>

                  <View style={[styles.statusCell, { width: COLS[7].width }]}>
                    <ListingStatusBadge status={l.status} />
                  </View>

                  <View style={[styles.actionsCell, { width: COLS[8].width }]}>
                    <IconAction icon="pencil-outline" label="Edit" onPress={() => setEditing(l)} />
                    {l.status === 'live' ? (
                      <IconAction
                        icon="eye-off-outline"
                        label="Hide"
                        onPress={() => setStatus(l, 'hidden')}
                      />
                    ) : (
                      <IconAction icon="eye-outline" label="Make live" onPress={() => setStatus(l, 'live')} />
                    )}
                    {l.status !== 'sold' && (
                      <IconAction
                        icon="checkmark-circle-outline"
                        label="Mark sold"
                        onPress={() => setStatus(l, 'sold')}
                      />
                    )}
                    <IconAction
                      icon={l.featured ? 'star' : 'star-outline'}
                      label="Toggle featured"
                      onPress={() => toggleFeatured(l)}
                    />
                    <IconAction icon="trash-outline" label="Delete" danger onPress={() => remove(l)} />
                  </View>
                </View>
              ))}

              {!listings.length && (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>
                    No listings yet. Add one manually or approve a submission.
                  </Text>
                </View>
              )}
            </View>
          </TableHorizontalScroll>
        )}
      </ScrollView>

      {editing && (
        <ListingFormModal
          listing={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <ImagePreviewModal
        photo={previewPhoto}
        visible={Boolean(previewPhoto)}
        onClose={() => setPreviewPhoto(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  hint: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textDim,
  },
  loader: {
    marginTop: 40,
  },
  reorderCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  moveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  moveBtnDisabled: {
    borderColor: colors.borderLight,
    opacity: 0.6,
  },
  moveBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: colors.gold,
  },
  moveBtnTextDisabled: {
    color: colors.textDim,
  },
  photoCell: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dash: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textDim,
    paddingHorizontal: 12,
  },
  titleCell: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },
  star: {
    marginTop: 2,
  },
  statusCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  actionsCell: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  iconBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.4)',
    padding: 6,
  },
  iconBtnDanger: {
    borderColor: 'rgba(248, 113, 113, 0.5)',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
  },
});
