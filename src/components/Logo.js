import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const LOGO = require('../assets/Taravee-logo.png');

export default function Logo({ size = 'md' }) {
  const isSmall = size === 'sm';
  const isHeader = size === 'header';

  return (
    <View style={styles.wrap}>
      <Image
        source={LOGO}
        style={[
          styles.logo,
          isSmall && styles.logoSm,
          isHeader && styles.logoHeader,
        ]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 120,
  },
  logoSm: {
    width: 140,
    height: 84,
  },
  logoHeader: {
    width: 110,
    height: 56,
  },
});
