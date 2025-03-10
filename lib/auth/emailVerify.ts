import { sendEmailVerification, User } from "firebase/auth";

interface VerificationResult {
  success: boolean;
  message: string;
  verificationCode?: string;
}

export async function sendVerificationEmail(
  user: User | null
): Promise<VerificationResult> {
  try {
    if (!user) {
      throw new Error("사용자가 로그인되어 있지 않습니다.");
    }

    // 새로운 인증 코드 생성 (실제로는 서버에서 생성)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Firebase 이메일 인증 메일 전송
    await sendEmailVerification(user);

    return {
      success: true,
      message: "이메일 인증 발송 완료",
      verificationCode: user.email?.split("@")[0], // 실제 구현에서는 verificationCode 사용
    };
  } catch (error: any) {
    console.error("이메일 인증 발송 오류:", error);
    return {
      success: false,
      message: "이메일 인증 발송 오류가 발생했습니다.",
    };
  }
}
