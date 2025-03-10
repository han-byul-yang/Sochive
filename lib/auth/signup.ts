import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

interface SignUpResult {
  success: boolean;
  message: string;
  user?: any;
  verificationCode?: string;
}

export async function signUp(
  email: string,
  password: string
): Promise<SignUpResult> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 이메일 인증 코드 생성 (실제 구현에서는 서버에서 생성)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 이메일 전송 (실제 구현에서는 서버에서 처리)
    // 여기서는 임시로 이메일 주소의 @ 앞부분을 인증코드로 사용

    return {
      success: true,
      message: "인증 이메일이 전송되었습니다.",
      user: userCredential.user,
      verificationCode: email.split("@")[0], // 실제 구현에서는 verificationCode 사용
    };
  } catch (error: any) {
    let message = "";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "이미 사용 중인 이메일입니다.";
        break;
      case "auth/invalid-email":
        message = "유효하지 않은 이메일 형식입니다.";
        break;
      case "auth/operation-not-allowed":
        message = "이메일/비밀번호 회원가입이 비활성화되어 있습니다.";
        break;
      case "auth/weak-password":
        message = "비밀번호는 최소 8자리 이상이어야 합니다.";
        break;
      default:
        message = "회원가입 중 오류가 발생했습니다.";
        console.error("Signup error:", error);
        break;
    }
    return {
      success: false,
      message,
    };
  }
}

export async function deleteUnverifiedUser() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      await deleteUser(currentUser);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
  return false;
}
