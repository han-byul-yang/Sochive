import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  GestureResponderEvent,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/lib/auth/login";
import { sendVerificationEmail } from "@/lib/auth/emailVerify";
import { User } from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showError = (message: string) => {
    setError(message);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000), // 2초 동안 표시
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setError("")); // 애니메이션 완료 후 에러 메시지 초기화
  };

  const handleSubmit = async (e: GestureResponderEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      setIsLoading(true);
      const result = await login(email, password);
      if (result?.success) {
        router.push("/(tabs)");
        return;
      }
      if (result.id === "email-verification-required") {
        console.log("email-verification-required");
        sendVerificationEmail(result.user as User).then((result) => {
          if (!result.success) {
            router.push("/(auth)/verifyFailed");
          }
        });
        router.push("/(auth)/emailVerify");
        return;
      }
      throw new Error(result.message);
    } catch (err: any) {
      showError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {error ? (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: "absolute",
            top: 60,
            left: 20,
            right: 20,
            zIndex: 50,
          }}
          className="bg-red-50 border border-red-200 rounded-xl p-3"
        >
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </Animated.View>
      ) : null}

      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
          로그인
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm text-gray-600 mb-1">이메일</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3"
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View>
            <Text className="text-sm text-gray-600 mb-1">비밀번호</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            className={`p-4 rounded-xl mt-6 ${
              isLoading ? "bg-gray-400" : "bg-[#3D3D3D]"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                로그인
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/signup")}
            disabled={isLoading}
            className="mt-4"
          >
            <Text className="text-center text-[#3D3D3D]">
              계정이 없으신가요? 회원가입
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
