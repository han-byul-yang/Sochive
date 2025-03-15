import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { DoHyeon_400Regular } from "@expo-google-fonts/do-hyeon";
import { Gaegu_400Regular } from "@expo-google-fonts/gaegu";
import {
  NotoSerif_400Regular,
  NotoSerif_700Bold,
} from "@expo-google-fonts/noto-serif";

import { useColorScheme } from "@/hooks/useColorScheme";
import useAuth, { AuthProvider } from "@/contexts/AuthContext";
import { RecoilRoot } from "recoil";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/lib/firebase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { loading, verified } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      if (value === null) {
        console.log("first launch");
        setIsFirstLaunch(true);
        //router.replace("/(onBoarding)/onBoarding");
        // await AsyncStorage.setItem("hasSeenOnboarding", "true");
        return true;
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error("Error reading AsyncStorage:", error);
      setIsFirstLaunch(false);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await checkOnboarding(); // 예제 대기 시간
      } catch (e) {
        console.warn(e);
      } finally {
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 3000);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    const verified = user?.emailVerified;
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (isFirstLaunch) return;
    if (!user || !verified) {
      if (!inAuthGroup) {
        const redirectPath = !user ? "/(auth)/login" : "/(auth)/emailVerify";
        router.replace(redirectPath);
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [auth, verified, segments, loading, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { loading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    "Outfit-Regular": Outfit_400Regular,
    "Outfit-Medium": Outfit_500Medium,
    "Outfit-SemiBold": Outfit_600SemiBold,
    "Outfit-Bold": Outfit_700Bold,
    //Lora: Lora_400Regular,
    DoHyeon: DoHyeon_400Regular,
    Gaegu: Gaegu_400Regular,
    "Noto-Serif": NotoSerif_400Regular,
    "Noto-Serif-Bold": NotoSerif_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   MobileAds().initialize();
  // }, []);
  // useEffect(() => {
  //   MobileAds()
  //     .initialize()
  //     .then((adapterStatuses) => {
  //       console.log("Initialization complete!");
  //     });
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RecoilRoot>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaView className="flex-1 bg-[#fcfcfc]">
                <RootLayoutNav />
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              </SafeAreaView>
            </GestureHandlerRootView>
          </ThemeProvider>
        </RecoilRoot>
      </AuthProvider>
    </QueryClientProvider>
  );
}
