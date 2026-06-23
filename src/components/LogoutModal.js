import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { GoldButton, OutlineGoldButton } from './AdminUI';
import { colors, fonts } from '../theme';

const LOGO = require('../assets/Taravee-logo.png');

export default function LogoutModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />
          <Text style={styles.title}>Do you really want to logout?</Text>
          <View style={styles.actions}>
            <OutlineGoldButton label="No" small onPress={onCancel} style={styles.btn} />
            <GoldButton label="Yes" small onPress={onConfirm} style={styles.btn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 24,
  },
  logo: {
    width: 160,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
  },
});
