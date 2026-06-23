import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from './Logo';
import LogoutModal from './LogoutModal';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';

export default function AdminHeader() {
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.panel}>Admin Panel</Text>
        </View>

        <View style={styles.center} pointerEvents="none">
          <Logo size="header" />
        </View>

        <Pressable
          onPress={() => setShowLogout(true)}
          style={styles.logoutBtn}
          hitSlop={8}
          accessibilityLabel="Logout"
        >
          <Ionicons name="log-out-outline" size={22} color={colors.gold} />
        </Pressable>
      </View>

      <LogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.dark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 64,
  },
  left: {
    flex: 1,
    zIndex: 1,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  panel: {
    fontFamily: fonts.heading,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(201, 168, 76, 0.75)',
  },
  logoutBtn: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
  },
});
