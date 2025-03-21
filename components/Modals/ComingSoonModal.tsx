import { Modal, View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface ComingSoonModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  feature: string;
}

export default function ComingSoonModal({
  isVisible,
  onClose,
  title,
  feature,
}: ComingSoonModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <ThemedView className="w-[85%] rounded-3xl p-6">
          <View className="items-center mb-4"></View>
          <ThemedText className="text-2xl font-noto-bold text-center mb-2">
            {title}
          </ThemedText>
          <ThemedText className="text-center text-gray-600 mb-6">
            {feature} 기능이 곧 추가될 예정입니다.{"\n"}조금만 기다려주세요!
          </ThemedText>
          <TouchableOpacity
            onPress={onClose}
            className="bg-[#3D3D3D] py-3 px-6 rounded-xl"
          >
            <ThemedText className="text-white text-center font-noto-bold">
              확인
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}
