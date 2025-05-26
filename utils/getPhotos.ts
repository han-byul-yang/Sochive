import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Alert, Image, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

export const saveImagePermanently = async (tempUri: string) => {
  const fileName = tempUri.split("/").pop();
  const newPath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.copyAsync({
    from: tempUri,
    to: newPath,
  });

  return newPath; // 영구 저장 경로
};

export const getImageSize = (uri: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
};

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
                  selectionLimit: 10,
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
          selectionLimit: 10,
          quality: 1,
          orderedSelection: true,
        });

        resolve(result);
      }
    }
  );
};

export const saveScreenshot = async (viewRef: React.RefObject<View>) => {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한이 필요해요", "사진을 저장하려면 권한이 필요합니다.");
      return;
    }

    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
    });

    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("MyApp", asset, false);

    Alert.alert("저장 완료", "이미지가 사진첩에 저장되었어요!");
  } catch (error) {
    console.error("스크린샷 저장 실패:", error);
  }
};

export const getScreenshot = async (viewRef: React.RefObject<View>) => {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한이 필요해요", "사진을 저장하려면 권한이 필요합니다.");
      return;
    }

    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
    });

    return uri;
  } catch (error) {
    console.error("스크린샷 실패:", error);
  }
};
