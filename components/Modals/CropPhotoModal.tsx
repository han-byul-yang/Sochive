import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  PanResponder,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import {
  Canvas,
  Image as SkiaImage,
  Path as SkiaPath,
  useImage,
  Skia,
  Group,
  useCanvasRef,
  ImageFormat,
} from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system";

interface CropPhotoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (croppedImageUri: string) => void;
  imageUri: string | null;
}

export default function CropPhotoModal({
  visible,
  onClose,
  onSave,
  imageUri,
}: CropPhotoModalProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height * 0.7;
  const canvasRef = useCanvasRef();

  // Skia 이미지 로드
  const skiaImage = useImage(imageUri || "");

  const calculateImageSize = () => {
    if (!imageUri) return;

    Image.getSize(imageUri, (width, height) => {
      const aspectRatio = width / height;
      let newWidth = screenWidth;
      let newHeight = newWidth / aspectRatio;

      if (newHeight > screenHeight) {
        newHeight = screenHeight;
        newWidth = newHeight * aspectRatio;
      }

      setImageSize({ width: newWidth, height: newHeight });
    });
  };

  useEffect(() => {
    if (visible && imageUri) {
      calculateImageSize();
      setPaths([]);
      setCurrentPath("");
    }
  }, [visible, imageUri]);

  const clearPaths = () => {
    setPaths([]);
    setCurrentPath("");
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => paths.length === 0,
    onMoveShouldSetPanResponder: () => paths.length === 0,
    onPanResponderGrant: (evt) => {
      if (paths.length > 0) return;

      const { locationX, locationY } = evt.nativeEvent;
      setIsDrawing(true);
      setCurrentPath(`M ${locationX} ${locationY}`);
    },
    onPanResponderMove: (evt) => {
      if (!isDrawing || paths.length > 0) return;
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => `${prev} L ${locationX} ${locationY}`);
    },
    onPanResponderRelease: () => {
      if (currentPath && paths.length === 0) {
        setCurrentPath((prev) => `${prev} Z`);
        setPaths((prev) => [...prev, currentPath + " Z"]);
        setCurrentPath("");
      }
      setIsDrawing(false);
    },
  });

  const cropImage = async () => {
    if (!imageUri || paths.length === 0 || !skiaImage) {
      Alert.alert("알림", "선을 그려서 자를 영역을 지정해주세요.");
      return;
    }

    try {
      // Skia 경로 생성
      const skPath = Skia.Path.MakeFromSVGString(paths[0]);

      if (!skPath) {
        Alert.alert("오류", "경로를 생성할 수 없습니다.");
        return;
      }

      // Canvas 스냅샷 생성
      const snapshot = canvasRef.current?.makeImageSnapshot();

      if (!snapshot) {
        Alert.alert("오류", "이미지를 캡처할 수 없습니다.");
        return;
      }

      // 스냅샷을 PNG로 인코딩
      const data = snapshot.encodeToBase64(ImageFormat.PNG, 100);

      // 임시 파일 경로 생성
      const filePath = `${
        FileSystem.cacheDirectory
      }cropped_image_${Date.now()}.png`;

      // Base64 데이터를 파일로 저장
      await FileSystem.writeAsStringAsync(filePath, data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 저장된 이미지 URI를 콜백으로 전달
      onSave(filePath);
      onClose();
    } catch (error) {
      console.error("이미지 자르기 오류:", error);
      Alert.alert("오류", "이미지 자르기에 실패했습니다.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 bg-black">
        <View className="flex-row items-center justify-between p-4 bg-black">
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium">사진 오리기</Text>
          <TouchableOpacity onPress={cropImage}>
            <Text className="text-blue-400 font-medium">완료</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 py-2">
          <Text className="text-white text-sm text-center">
            {paths.length === 0
              ? "영역을 선택하려면 화면에 선을 그려주세요 (한 번만 가능)"
              : "선택된 영역이 자르기에 사용됩니다"}
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          {/* 이미지와 SVG 경로 표시 */}
          <View
            style={{
              width: imageSize.width,
              height: imageSize.height,
              position: "relative",
            }}
          >
            <Image
              source={{ uri: imageUri ?? "" }}
              style={{ width: imageSize.width, height: imageSize.height }}
              resizeMode="contain"
            />

            <Svg
              style={StyleSheet.absoluteFill}
              width={imageSize.width}
              height={imageSize.height}
              {...panResponder.panHandlers}
            >
              {paths.map((path, index) => (
                <Path
                  key={`path-${index}`}
                  d={path}
                  stroke="#8B4513" // 갈색 선
                  strokeWidth={5}
                  fill="rgba(139, 69, 19, 0.3)" // 반투명 갈색 채우기
                />
              ))}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke="#8B4513" // 갈색 선
                  strokeWidth={5}
                  fill="transparent"
                />
              ) : null}
            </Svg>
          </View>
        </View>

        {/* Skia Canvas - 화면 밖에 위치시켜 보이지 않게 함 */}
        <View
          style={{
            position: "absolute",
            left: -9999,
            top: -9999,
            width: imageSize.width,
            height: imageSize.height,
          }}
        >
          <Canvas
            ref={canvasRef}
            style={{ width: imageSize.width, height: imageSize.height }}
          >
            {skiaImage && paths.length > 0 && (
              <Group
                clip={Skia.Path.MakeFromSVGString(paths[0]) || Skia.Path.Make()}
              >
                <SkiaImage
                  image={skiaImage}
                  fit="contain"
                  x={0}
                  y={0}
                  width={imageSize.width}
                  height={imageSize.height}
                />
              </Group>
            )}
          </Canvas>
        </View>

        <View className="flex-row items-center justify-around p-4 bg-black">
          <TouchableOpacity
            onPress={clearPaths}
            className="items-center"
            disabled={paths.length === 0}
            style={{ opacity: paths.length === 0 ? 0.5 : 1 }}
          >
            <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mb-1">
              <MaterialIcons name="refresh" size={20} color="#fff" />
            </View>
            <Text className="text-white text-xs">초기화</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
