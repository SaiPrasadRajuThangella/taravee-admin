import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export function GoldButton({ label, onPress, disabled, loading, style, small }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.gold,
        small && styles.small,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.bg} size="small" />
      ) : (
        <Text style={[styles.goldText, small && styles.smallText]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function OutlineGoldButton({ label, onPress, disabled, style, small }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outline,
        small && styles.small,
        disabled && styles.disabled,
        pressed && styles.pressedOutline,
        style,
      ]}
    >
      <Text style={[styles.outlineText, small && styles.smallText]}>{label}</Text>
    </Pressable>
  );
}

export function StatCard({ icon, label, value }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel} numberOfLines={2}>
          {label}
        </Text>
        <View style={styles.iconWrap}>{icon}</View>
      </View>
      <Text style={styles.cardValue}>{value ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gold: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  outline: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  small: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  goldText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.bg,
  },
  outlineText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
  },
  smallText: {
    fontSize: 13,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.9,
  },
  pressedOutline: {
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
  },
  card: {
    width: '47%',
    minHeight: 118,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.dark,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  cardLabel: {
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
    marginRight: 8,
    paddingTop: 2,
  },
  iconWrap: {
    paddingTop: 2,
  },
  cardValue: {
    marginTop: 12,
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.gold,
  },
});
