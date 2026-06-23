import React from 'react';
import { ActivityIndicator, StyleSheet, View, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';
import AdminHeader from '../components/AdminHeader';
import { TAB_BAR_HEIGHT } from './layout';

import LoginScreen from '../screens/admin/LoginScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';
import SubmissionsScreen from '../screens/admin/SubmissionsScreen';
import ListingsScreen from '../screens/admin/ListingsScreen';
import EnquiriesScreen from '../screens/admin/EnquiriesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: 'grid',
  Submissions: 'mail-unread',
  Listings: 'pricetags',
  Enquiries: 'chatbubble-ellipses',
};

const TAB_ICON_SIZE = 28;
const TAB_SLOT_SIZE = 40;

function GoldTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 16);

  return (
    <View style={[tabStyles.tabBarWrap, { bottom: bottomOffset }]}>
      <LinearGradient
        colors={[colors.goldGradientStart, colors.goldGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tabStyles.tabBarGradient}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const base = ICONS[route.name] || 'ellipse';
          const iconName = focused ? base : `${base}-outline`;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
              onPress={onPress}
              style={tabStyles.tabItem}
            >
              <View style={tabStyles.iconSlot}>
                {focused ? (
                  <View style={tabStyles.activeIcon}>
                    <Ionicons name={iconName} size={TAB_ICON_SIZE} color={colors.goldDeep} />
                  </View>
                ) : (
                  <Ionicons name={iconName} size={TAB_ICON_SIZE} color={colors.ivory} style={tabStyles.inactiveIcon} />
                )}
              </View>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

function AdminTabs() {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 16);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AdminHeader />
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          tabBar={(props) => <GoldTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            sceneContainerStyle: { paddingBottom: TAB_BAR_HEIGHT + bottomOffset + 36 },
          }}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Submissions" component={SubmissionsScreen} />
          <Tab.Screen name="Listings" component={ListingsScreen} />
          <Tab.Screen name="Enquiries" component={EnquiriesScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

function AuthGate() {
  const { isAuthenticated, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      {isAuthenticated ? (
        <Stack.Screen name="AdminMain" component={AdminTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return <AuthGate />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});

const tabStyles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: '3%',
    shadowColor: colors.goldDeep,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  tabBarGradient: {
    width: '100%',
    maxWidth: 420,
    minHeight: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_SLOT_SIZE,
  },
  iconSlot: {
    width: TAB_SLOT_SIZE,
    height: TAB_SLOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    width: TAB_SLOT_SIZE,
    height: TAB_SLOT_SIZE,
    borderRadius: TAB_SLOT_SIZE / 2,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  inactiveIcon: {
    opacity: 0.9,
  },
});
