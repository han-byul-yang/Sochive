import { Photo } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, View, TouchableOpacity, Image, Text, ScrollView } from "react-native";

interface PhotoModalProps {
  showPhotoModal: boolean;
  handleClosePhotoModal: () => void;
  activePhotoIndex: number | null;
  selectedPhotos: Photo[];
  handleEditMemo: (index: number) => void;
}

export default function PhotoModal({
  showPhotoModal,
  handleClosePhotoModal,
  activePhotoIndex,
  selectedPhotos,
  handleEditMemo,
}: PhotoModalProps) {
  return (
    <Modal
      visible={showPhotoModal}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClosePhotoModal}
    >
      <View className="relative flex-1 bg-white/70 items-center border-[2px] border-gray-300 rounded-lg">
        <TouchableOpacity
          className="absolute top-10 right-5 z-10"
          onPress={handleClosePhotoModal}
        >
          <MaterialIcons name="close" size={30} color="#000" />
        </TouchableOpacity>

        {activePhotoIndex !== null && (
          <View className="w-full h-[85%] items-center mt-14">
            {selectedPhotos[activePhotoIndex]?.originalUri ? (
              <Image
                source={{
                  uri: selectedPhotos[activePhotoIndex]?.originalUri,
                }}
                style={{ width: "90%", height: "70%" }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("@/assets/images/noImage.png")}
                style={{ width: "90%", height: "70%" }}
                resizeMode="contain"
              />
            )}

            {/* 메모 표시 영역 */}
            <View className="w-[90%] bg-white rounded-lg p-4 border-[2px] border-gray-300">
              {selectedPhotos[activePhotoIndex]?.memo ? (
                <View>
                  <Text className="text-gray-800 text-base font-medium mb-2">
                    메모
                  </Text>
                  <Text className="text-gray-800 text-xl font-gaegu">
                    {selectedPhotos[activePhotoIndex]?.memo}
                  </Text>
                </View>
              ) : (
                <Text className="text-gray-800 text-sm italic">
                  이 사진에 대한 메모가 없습니다.
                </Text>
              )}

              {/* 메모 추가/수정 버튼 */}
              <TouchableOpacity
                className="mt-4 bg-gray-200 py-2 px-4 rounded-full self-start"
                onPress={() => handleEditMemo(activePhotoIndex)}
              >
                <Text className="text-gray-800 text-sm">
                  {selectedPhotos[activePhotoIndex]?.memo
                    ? "메모 수정"
                    : "메모 추가"}
                </Text>
                </TouchableOpacity>
              </View>
          </View>
          )}
      </View>
    </Modal>
  );
}
