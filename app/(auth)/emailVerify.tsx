"use client";

import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { sendEmailVerification, reload, signOut } from "firebase/auth";
import { sendVerificationEmail } from "@/lib/auth/emailVerify";
import { auth } from "@/lib/firebase";
import { useRouter, useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import useAuth from "@/contexts/AuthContext";

export default function EmailVerify() {
  const router = useRouter();
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTimer, setStartTimer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // interval 참조를 위한 ref 추가

  // 이메일 인증 상태 확인을 위한 주기적인 체크
  useEffect(() => {
    const checkEmailVerification = async (userAuth: any) => {
      if (!userAuth) return;
      try {
        await reload(userAuth);
        if (userAuth.emailVerified) {
          // interval 정리
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (verifyError) {
        setError("이메일 인증 확인 중 오류가 발생하였습니다.");
      } finally {
        if (userAuth.emailVerified) {
          await signOut(auth);
          router.push("/(auth)/login");
        }
      }
    };

    // interval 설정
    intervalRef.current = setInterval(() => {
      checkEmailVerification(user);
    }, 3000);

    // cleanup 함수
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // ... 나머지 코드 유지

  // 타이머 설정
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTimer) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStartTimer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000 * 60);
    }
    return () => clearInterval(timer);
  }, [startTimer]);

  // 페이지 나가기 전 로그아웃 처리를 위한 useEffect 추가
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async () => {
      try {
        console.log("emailVerify useEffect");
        await signOut(auth);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });

    return () => {
      unsubscribe();
      // 컴포넌트 언마운트 시 로그아웃
      signOut(auth).catch((error) => {
        console.error("Logout failed:", error);
      });
    };
  }, [navigation]);

  // 이메일 재전송
  const handleResendEmail = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      await sendEmailVerification(user);
      setTimeLeft(60); // 타이머 리셋
      setStartTimer(true);
      Alert.alert(
        "알림",
        "인증 메일이 재전송되었습니다. 이메일을 확인해주세요."
      );
    } catch (err: any) {
      setError("이메일 재전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-4 bg-white">
      <View className="w-full max-w-md space-y-8">
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            이메일 인증
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            {user?.email}으로 인증 메일을 발송했습니다.{"\n"}
            이메일을 확인하여 인증을 완료해주세요.
          </Text>
        </View>

        <View className="mt-4 space-y-4">
          <View className="items-center space-y-2">
            <Text className="text-sm text-gray-500">
              인증 만료까지 남은 시간:{" "}
              <Text className="font-medium">{timeLeft}분</Text>
            </Text>
            <Pressable
              onPress={handleResendEmail}
              disabled={loading}
              className={`flex-row items-center px-6 py-3 rounded-full ${
                loading ? "bg-blue-100" : "bg-blue-50 active:bg-blue-100"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <Feather name="refresh-cw" size={16} color="#3B82F6" />
              )}
              <Text
                className={`ml-2 text-blue-600 font-medium ${
                  loading && "opacity-50"
                }`}
              >
                {loading ? "전송 중..." : "인증 메일 다시 보내기"}
              </Text>
            </Pressable>
          </View>

          {timeLeft === 0 && (
            <Text className="text-sm text-red-500 text-center">
              인증 시간이 만료되었습니다. 이메일을 다시 전송해주세요.
            </Text>
          )}
        </View>

        {error && (
          <Text className="text-sm text-red-500 text-center">{error}</Text>
        )}

        <View className="mt-4">
          <Text className="text-xs text-gray-500 text-center">
            이메일이 보이지 않나요? 스팸 메일함을 확인해주세요.{"\n"}
            페이지를 닫으면 회원가입이 취소됩니다.
          </Text>
        </View>
      </View>
    </View>
  );
}
