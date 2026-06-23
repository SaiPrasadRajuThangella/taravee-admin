import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import RootNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import { colors } from './src/theme';

const localFonts = {
  'Tangerine-Regular': require('./src/assets/fonts/Tangerine-Regular.ttf'),
  'Tangerine-Bold': require('./src/assets/fonts/Tangerine-Bold.ttf'),
  'PlusJakartaSans-Light': require('./src/assets/fonts/PlusJakartaSans-Light.ttf'),
  'PlusJakartaSans-Regular': require('./src/assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Medium': require('./src/assets/fonts/PlusJakartaSans-Medium.ttf'),
  'PlusJakartaSans-SemiBold': require('./src/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  'PlusJakartaSans-Bold': require('./src/assets/fonts/PlusJakartaSans-Bold.ttf'),
  'PlusJakartaSans-ExtraBold': require('./src/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  'Cinzel-Regular': require('./src/assets/fonts/Cinzel-Regular.ttf'),
  'Cinzel-Medium': require('./src/assets/fonts/Cinzel-Medium.ttf'),
};

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.gold,
    border: colors.border,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts(localFonts);

  // Keep the native splash feel until fonts are ready
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <AuthProvider>
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
