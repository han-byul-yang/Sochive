import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import auth, { getAuth, signInWithCredential } from "@firebase/auth";

export default function AppleLogin() {
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

  useEffect(() => {
    // 애플 인증이 가능한지 확인
    AppleAuthentication.isAvailableAsync().then((available) => {
      setIsAppleAuthAvailable(available);
    });
  }, []);

  const handleAppleSignUp = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken } = credential;

      if (identityToken) {
        const provider = new auth.OAuthProvider("apple.com");
        // nonce 없이 identityToken만 사용
        const authCredential = provider.credential({
          idToken: identityToken,
          // rawNonce 제거
        });
        // Firebase 로그인
        const firebaseAuth = getAuth();
        await signInWithCredential(firebaseAuth, authCredential);
      }
      console.log("Apple 로그인 성공:", credential);
    } catch (error) {
      console.error("Apple 로그인 오류:", error);
    }
  };

  // 애플 인증이 불가능한 경우 (안드로이드 등) 아무것도 렌더링하지 않음
  if (!isAppleAuthAvailable) {
    return null;
  }

  return (
    <View className="w-full items-center justify-center my-2">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        className="w-full h-10"
        onPress={handleAppleSignUp}
      />
    </View>
  );
}
