import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { QueryProvider } from '../src/providers/QueryProvider';
import { AnimatedSplashScreen } from '../src/components/SplashScreen';
import { theme } from '../src/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent splash screen from auto-hiding until ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Hide native splash once font is loaded or on error
    SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // Guaranteed Safety Timeout: Force hide native splash and finish overlay within 800ms
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      setSplashFinished(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryProvider>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>

        {!splashFinished && (
          <AnimatedSplashScreen onFinish={() => setSplashFinished(true)} />
        )}
      </View>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
