import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { HouseProvider } from '../contexts/HouseThemeContext';

SplashScreen.preventAutoHideAsync();

const theme = {
  roundness: 12,
};

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);


  return (
    <PaperProvider theme={theme}>
      <HouseProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </HouseProvider>
    </PaperProvider>
  );
}