import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityProvider } from '../context/ActivityContext';

export default function RootLayout() {
  return (
    <ActivityProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ActivityProvider>
  );
}