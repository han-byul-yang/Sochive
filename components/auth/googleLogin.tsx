import { View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import * as Google from "expo-auth-session/providers/google";
import { useState, useEffect } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const scheme = Constants.expoConfig?.extra?.scheme;
  const redirectUri = AuthSession.makeRedirectUri({ scheme });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Constants.expoConfig?.extra?.androidClientId,
    iosClientId: Constants.expoConfig?.extra?.iosClientId,
    webClientId: Constants.expoConfig?.extra?.webClientId,
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (token: string) => {
    try {
      setLoading(true);
      const credential = GoogleAuthProvider.credential(token);
      const userCredential = await signInWithCredential(auth, credential);

      // 로그인 성공 시 사용자 정보 저장
      await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));

      // tabs로 이동
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-12">
          <IconSymbol name="photo.on.rectangle" size={80} color="#0a7ea4" />
          <ThemedText className="text-3xl font-bold mt-4">
            Photo Gallery
          </ThemedText>
        </View>

        <TouchableOpacity
          className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 flex-row items-center justify-center"
          onPress={() => promptAsync()}
          disabled={loading}
        >
          <Image
            source={require("@/assets/images/google.png")}
            className="w-8 h-8 mr-3"
          />
          <ThemedText className="text-base font-medium">
            {loading ? "로그인 중..." : "Google로 계속하기"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
