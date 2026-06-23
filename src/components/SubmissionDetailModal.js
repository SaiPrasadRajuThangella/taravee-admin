import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RemoteImage from './RemoteImage';
import { DetailRow, StatusBadge, TIMES_WORN_LABELS } from './SubmissionUI';
import { GoldButton, OutlineGoldButton } from './AdminUI';
import { getPhotoUri } from '../utils/media';
import { adminStyles, colors, fonts } from '../theme';

export default function SubmissionDetailModal({ submission, onClose, onAction, busy }) {
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const s = submission;

  if (!s) return null;

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modal}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {s.designer} — {s.category}
              </Text>
              <Text style={styles.meta}>
                Submitted {new Date(s.createdAt).toLocaleString('en-IN')}
              </Text>
              <View style={styles.badgeWrap}>
                <StatusBadge status={s.status} />
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </Pressable>
          </View>

          {s.photos?.length > 0 && (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Photos</Text>
              <View style={styles.photoGrid}>
                {s.photos.map((p, i) => (
                  <Pressable key={i} onPress={() => Linking.openURL(getPhotoUri(p))} style={styles.photoItem}>
                    <RemoteImage photo={p} style={styles.photo} contentFit="cover" />
                    <Text style={styles.photoLabel} numberOfLines={1}>
                      {p.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {s.video?.url && (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Video</Text>
              <Pressable onPress={() => Linking.openURL(getPhotoUri(s.video))}>
                <Text style={styles.link}>Open video</Text>
              </Pressable>
            </View>
          )}

          {s.billPhoto?.url && (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Original Bill</Text>
              <Pressable onPress={() => Linking.openURL(getPhotoUri(s.billPhoto))}>
                <RemoteImage photo={s.billPhoto} style={styles.billPhoto} contentFit="contain" />
              </Pressable>
            </View>
          )}

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Seller</Text>
            <DetailRow label="Name" value={s.fullName} />
            <DetailRow label="City" value={s.city} />
            <DetailRow label="Instagram" value={s.instagramHandle} />
            <DetailRow label="Preferred Contact" value={s.preferredContact} />
            <DetailRow label="WhatsApp" value={s.whatsappNumber} />
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Piece</Text>
            <DetailRow label="Category" value={s.category} />
            <DetailRow label="Designer" value={s.designer} />
            <DetailRow label="Fabric" value={s.fabricType} />
            <DetailRow label="Primary Colour" value={s.primaryColour} />
            <DetailRow label="Secondary Colour" value={s.secondaryColour} />
            <DetailRow label="Work Types" value={s.workTypes?.join(', ')} />
            <DetailRow label="Lining" value={s.hasLining} />
            <DetailRow label="Dupatta" value={s.includesDupatta} />
            <DetailRow label="Accessories" value={s.accessoriesIncluded?.join(', ')} />
            {s.measurements &&
              Object.entries(s.measurements).map(([k, v]) => (
                <DetailRow key={k} label={k} value={v} />
              ))}
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Condition</Text>
            <DetailRow label="Times Worn" value={TIMES_WORN_LABELS[s.timesWorn] || s.timesWorn} />
            <DetailRow label="Stains" value={s.hasStains} />
            <DetailRow label="Stains Detail" value={s.stainsDescription} />
            <DetailRow label="Damage" value={s.hasDamage} />
            <DetailRow label="Damage Detail" value={s.damageDescription} />
            <DetailRow label="Dry Cleaned" value={s.dryCleaned} />
            <DetailRow label="Original Packaging" value={s.originalPackaging} />
            <DetailRow label="Designer Label" value={s.designerLabel} />
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Purchase & Pricing</Text>
            <DetailRow
              label="Year of Purchase"
              value={s.yearOfPurchase}
            />
            <DetailRow
              label="Original Price"
              value={s.originalPrice ? `₹${s.originalPrice.toLocaleString('en-IN')}` : ''}
            />
            <DetailRow label="Bill Available" value={s.billAvailable} />
            <DetailRow label="Authenticity Certificate" value={s.authenticityCertificate} />
            <DetailRow
              label="Expected Price"
              value={s.expectedPrice ? `₹${s.expectedPrice.toLocaleString('en-IN')}` : ''}
            />
            <DetailRow label="Price Flexibility" value={s.priceFlexible} />
            <DetailRow label="Timeline" value={s.sellTimeline} />
            <DetailRow label="Rejection Reason" value={s.rejectionReason} />
          </View>

          <View style={styles.actions}>
            {s.status !== 'approved' && (
              <GoldButton
                label="Approve & Create Listing"
                small
                loading={busy}
                onPress={() => onAction('approve', s)}
              />
            )}
            {s.status !== 'discussion' && s.status !== 'approved' && (
              <OutlineGoldButton
                label="Send to Discussion"
                small
                onPress={() => onAction('discussion', s)}
                disabled={busy}
              />
            )}
            {s.status !== 'rejected' && s.status !== 'approved' && (
              <Pressable
                onPress={() => setShowReject((v) => !v)}
                disabled={busy}
                style={styles.rejectBtn}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </Pressable>
            )}
          </View>

          {showReject && (
            <View style={styles.rejectRow}>
              <TextInput
                style={[adminStyles.input, styles.rejectInput]}
                placeholder="Reason for rejection"
                placeholderTextColor={colors.textDim}
                value={rejectReason}
                onChangeText={setRejectReason}
              />
              <Pressable
                onPress={() => onAction('rejected', s, rejectReason)}
                disabled={busy || !rejectReason.trim()}
                style={[styles.confirmReject, (!rejectReason.trim() || busy) && styles.disabled]}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmRejectText}>Confirm</Text>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    color: colors.gold,
  },
  meta: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  badgeWrap: {
    marginTop: 8,
  },
  block: {
    marginTop: 20,
  },
  blockTitle: {
    marginBottom: 6,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    width: '30%',
    minWidth: 90,
  },
  photo: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoLabel: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textDim,
  },
  link: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
    textDecorationLine: 'underline',
  },
  billPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.dark,
  },
  actions: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  rejectBtn: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(248, 113, 113, 0.6)',
    paddingVertical: 10,
  },
  rejectText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FCA5A5',
  },
  rejectRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  rejectInput: {
    flex: 1,
  },
  confirmReject: {
    borderRadius: 999,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  confirmRejectText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
});
