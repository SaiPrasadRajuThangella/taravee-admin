import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0F0F0F',
  dark: '#1A1A1A',
  card: '#141414',
  text: '#F5F0E8',
  textMuted: 'rgba(245, 240, 232, 0.6)',
  textDim: 'rgba(245, 240, 232, 0.5)',
  gold: '#C9A84C',
  goldLight: '#E8D5A3',
  goldDeep: '#8B6914',
  goldGradientStart: '#E8D5A3',
  goldGradientEnd: '#C9A84C',
  ivory: '#FFFFF0',
  border: 'rgba(201, 168, 76, 0.25)',
  borderLight: 'rgba(201, 168, 76, 0.1)',
  error: '#F87171',
  success: '#86EFAC',
  warning: '#FDE047',
  info: '#93C5FD',
};

export const fonts = {
  heading: 'Cinzel-Medium',
  headingRegular: 'Cinzel-Regular',
  body: 'PlusJakartaSans-Regular',
  bodyMedium: 'PlusJakartaSans-Medium',
  bodySemiBold: 'PlusJakartaSans-SemiBold',
  bodyBold: 'PlusJakartaSans-Bold',
  accent: 'Tangerine-Regular',
};

export const adminStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenPad: {
    padding: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.gold,
  },
  pageSubtitle: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.dark,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
  },
  messageBanner: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBannerText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.goldLight,
  },
  errorText: {
    marginTop: 16,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.error,
  },
  sectionTitle: {
    marginBottom: 14,
    fontFamily: fonts.heading,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  tableWrap: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableHeadCell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  tableCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(245, 240, 232, 0.85)',
  },
});
