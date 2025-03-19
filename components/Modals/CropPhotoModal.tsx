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

      // 경로의 경계 상자(bounding box) 계산
      const bounds = skPath.getBounds();

      // 경계 상자 크기의 새 Surface 생성
      const width = Math.ceil(bounds.width);
      const height = Math.ceil(bounds.height);
      const surface = Skia.Surface.Make(width, height);

      if (!surface) {
        Alert.alert("오류", "이미지 처리를 위한 표면을 생성할 수 없습니다.");
        return;
      }

      const canvas = surface.getCanvas();

      // 캔버스 원점을 경계 상자의 좌상단으로 이동
      canvas.translate(-bounds.x, -bounds.y);

      // 경로로 클리핑 (대체 방법)
      canvas.clipPath(skPath, 1, true); // 1은 Intersect 연산을 의미

      // 이미지 그리기 대체 방법
      const src = {
        x: 0,
        y: 0,
        width: skiaImage.width(),
        height: skiaImage.height(),
      };
      const dest = {
        x: 0,
        y: 0,
        width: imageSize.width,
        height: imageSize.height,
      };
      const paint = Skia.Paint();
      paint.setAntiAlias(true);
      canvas.drawImageRect(skiaImage, src, dest, paint);

      // 이미지 추출
      const image = surface.makeImageSnapshot();

      // 스냅샷을 PNG로 인코딩
      const data = image.encodeToBase64(ImageFormat.PNG, 100);

      // 임시 파일 경로 생성
      const filePath = `${
        FileSystem.cacheDirectory
      }cropped_image_${Date.now()}.png`;

      // Base64 데이터를 파일로 저장
      await FileSystem.writeAsStringAsync(filePath, data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 크롭된 이미지의 실제 크기 로깅
      Image.getSize(filePath, (width, height) => {
        console.log("Cropped image size:", width, height);
      });

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
              <Group clip={Skia.Path.MakeFromSVGString(paths[0]) || undefined}>
                <SkiaImage
                  image={skiaImage}
                  fit="cover"
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
