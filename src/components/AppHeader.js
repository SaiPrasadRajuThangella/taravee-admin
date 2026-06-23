import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Taravee</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.gold,
    textAlign: 'center',
  },
});
