import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    if (!user.emailVerified) {
      return {
        success: false,
        user: user,
        id: "email-verification-required",
        message: "이메일 인증이 필요합니다. 이메일을 확인해주세요.",
      };
    }

    return {
      success: true,
      user: user,
      id: "login-success",
      message: "로그인 성공",
    };
  } catch (error: any) {
    let message = "";
    switch (error.code) {
      case "auth/invalid-email":
        message = "유효하지 않은 이메일 형식입니다.";
        break;
      case "auth/user-disabled":
        message = "비활성화된 계정입니다.";
        break;
      case "auth/user-not-found":
        message = "등록되지 않은 이메일입니다.";
        break;
      case "auth/wrong-password":
        message = "잘못된 비밀번호입니다.";
        break;
      default:
        message = "로그인 중 오류가 발생했습니다.";
        break;
    }
    return {
      success: false,
      id: "login-error",
      message,
    };
  }
}
