import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const pickMultipleImages = async () => {
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  return new Promise<ImagePicker.ImagePickerResult | undefined>(
    async (resolve) => {
      if (status !== "granted") {
        Alert.alert(
          "사진 접근 권한이 필요합니다.",
          "사진 접근 권한은 아카이브 이미지 기록 생성을 위해 필요한 권한입니다.",
          [
            {
              text: "계속",
              onPress: async () => {
                const { status } =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                  alert("갤러리 접근 권한이 거부되었습니다.");
                  resolve(undefined);
                  return;
                }
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ["images"],
                  allowsEditing: false,
                  allowsMultipleSelection: true,
                  selectionLimit: 5,
                  quality: 1,
                  orderedSelection: true,
                });

                resolve(result);
              },
            },
          ]
        );
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          allowsMultipleSelection: true,
          selectionLimit: 5,
          quality: 1,
          orderedSelection: true,
        });

        resolve(result);
      }
    }
  );
};
