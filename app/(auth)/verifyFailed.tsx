import { View, Text } from "react-native";

export default function VerifyFailed() {
  return (
    <View className="flex-1 bg-white">
      <Text>인증 메일 전송 실패하였습니다. 앱을 다시 시도해주세요.</Text>
    </View>
  );
}
