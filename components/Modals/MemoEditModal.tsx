import { Modal, TextInput, TouchableOpacity, View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

interface MemoEditModalProps {
  showMemoModal: boolean;
  setShowMemoModal: React.Dispatch<React.SetStateAction<boolean>>;
  memoText: string;
  setMemoText: React.Dispatch<React.SetStateAction<string>>;
  handleSaveMemo: () => void;
}

export default function MemoEditModal({
  showMemoModal,
  setShowMemoModal,
  memoText,
  setMemoText,
  handleSaveMemo,
}: MemoEditModalProps) {
  return (
    <Modal
      visible={showMemoModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMemoModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-white/30 justify-center items-center p-4">
          <View className="bg-white w-full rounded-lg p-4">
            <Text className="text-2xl mb-4 font-gaegu">
              메모 {memoText ? "수정" : "추가"}
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 min-h-[100px] text-base font-gaegu"
              multiline
              placeholder="이 사진에 대한 메모를 입력하세요..."
              value={memoText}
              onChangeText={setMemoText}
            />

            <View className="flex-row justify-end mt-4 space-x-2">
              <TouchableOpacity
                className="py-2 px-4 rounded-lg bg-gray-200"
                onPress={() => setShowMemoModal(false)}
              >
                <Text>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="py-2 px-4 rounded-lg bg-[#3D3D3D]"
                onPress={handleSaveMemo}
              >
                <Text className="text-white">저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
