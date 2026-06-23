import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export default function PriceRequestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Price</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.gold,
  },
});
