import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '../theme';

export const STATUS_BADGES = {
  pending: { label: '🟡 Pending Review', bg: 'rgba(234, 179, 8, 0.15)', color: '#FDE68A' },
  approved: { label: '🟢 Approved — Listed', bg: 'rgba(34, 197, 94, 0.15)', color: '#86EFAC' },
  rejected: { label: '🔴 Rejected', bg: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5' },
  discussion: { label: '🔵 In Discussion', bg: 'rgba(59, 130, 246, 0.15)', color: '#93C5FD' },
};

export const TIMES_WORN_LABELS = {
  never: 'Never worn (with tags)',
  once: 'Worn once',
  twice: 'Worn twice',
  '3-5': 'Worn 3-5 times',
  '5+': 'Worn more than 5 times',
};

export function StatusBadge({ status }) {
  const badge = STATUS_BADGES[status] || STATUS_BADGES.pending;
  return (
    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
    </View>
  );
}

export function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 168, 76, 0.1)',
    paddingVertical: 8,
  },
  label: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(245, 240, 232, 0.5)',
  },
  value: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(245, 240, 232, 0.9)',
    textAlign: 'right',
  },
});
