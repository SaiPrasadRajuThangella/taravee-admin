import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 70;
const EXTRA_CLEARANCE = 36;

export function useBottomTabPadding() {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 16);
  return TAB_BAR_HEIGHT + bottomOffset + EXTRA_CLEARANCE;
}
