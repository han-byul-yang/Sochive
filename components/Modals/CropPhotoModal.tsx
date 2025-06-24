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
  SafeAreaView,
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
  onSave: (
    croppedImageUri: string,
    touchPoints: Point[],
    cropInfo?: { x: number; y: number; width: number; height: number }
  ) => void;
  imageUri?: string | null;
  onOriginalChange: () => void;
}

interface Point {
  x: number;
  y: number;
}

export default function CropPhotoModal({
  visible,
  onClose,
  onSave,
  imageUri,
  onOriginalChange,
}: CropPhotoModalProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [touchPoints, setTouchPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height * 0.7;
  const canvasRef = useCanvasRef();
  // Skia 이미지 로드
  const skiaImage = useImage(imageUri || "");

  const handleOriginalChange = () => {
    onOriginalChange();
  };

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
      setTouchPoints([]);
    }
  }, [visible, imageUri]);

  const clearPaths = () => {
    setPaths([]);
    setCurrentPath("");
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => paths.length === 0,
    onMoveShouldSetPanResponder: () => paths.length === 0,
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setIsDrawing(true);
      setCurrentPath(`M ${locationX} ${locationY}`);
      setTouchPoints([{ x: locationX, y: locationY }]);
    },
    onPanResponderMove: (event) => {
      if (!isDrawing) return;
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath((prev) => `${prev} L ${locationX} ${locationY}`);
      setTouchPoints((prev) => [...prev, { x: locationX, y: locationY }]);
    },
    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths([...paths, currentPath]);
        setIsDrawing(false);
      }
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

      // 원본 이미지 크기와 화면에 표시된 이미지 크기의 비율 계산
      const scaleX = skiaImage.width() / imageSize.width;
      const scaleY = skiaImage.height() / imageSize.height;

      // 경계 상자 크기의 새 Surface 생성 (원본 이미지 크기 기준으로 조정)
      const width = Math.ceil(bounds.width * scaleX);
      const height = Math.ceil(bounds.height * scaleY);

      // 고해상도 Surface 생성
      const surface = Skia.Surface.Make(width, height);

      if (!surface) {
        Alert.alert("오류", "이미지 처리를 위한 표면을 생성할 수 없습니다.");
        return;
      }

      const canvas = surface.getCanvas();

      // 캔버스 원점을 경계 상자의 좌상단으로 이동 (원본 이미지 크기 기준으로 조정)
      canvas.translate(-bounds.x * scaleX, -bounds.y * scaleY);

      // 캔버스 스케일 조정
      canvas.scale(scaleX, scaleY);

      // 경로로 클리핑
      canvas.clipPath(skPath, 1, true); // 1은 Intersect 연산을 의미

      // 이미지 그리기
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

      // 고품질 페인트 설정 (대체 방법)
      const paint = Skia.Paint();
      paint.setAntiAlias(true);
      // 필터 품질 설정이 없는 경우 생략

      canvas.drawImageRect(skiaImage, src, dest, paint);

      // 이미지 추출
      const image = surface.makeImageSnapshot();

      // 스냅샷을 PNG로 인코딩 (최대 품질)
      const data = image.encodeToBase64(ImageFormat.PNG, 100);

      // 임시 파일 경로 생성
      const filePath = `${
        FileSystem.cacheDirectory
      }cropped_image_${Date.now()}.png`;

      // Base64 데이터를 파일로 저장
      await FileSystem.writeAsStringAsync(filePath, data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 크롭 정보 저장
      const cropInfo = {
        x: bounds.x / imageSize.width,
        y: bounds.y / imageSize.height,
        width: bounds.width / imageSize.width,
        height: bounds.height / imageSize.height,
      };

      onSave(filePath, touchPoints);
      onClose();
    } catch (error) {
      console.error("이미지 자르기 오류:", error);
      Alert.alert("오류", "이미지 자르기에 실패했습니다.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <SafeAreaView className="flex-1 bg-black">
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
                  clip={Skia.Path.MakeFromSVGString(paths[0]) || undefined}
                >
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
            <TouchableOpacity
              onPress={handleOriginalChange}
              className="items-center"
            >
              <View className="w-10 h-10 bg-amber-600 rounded-full items-center justify-center mb-1">
                <MaterialIcons name="restore" size={20} color="#fff" />
              </View>
              <Text className="text-white text-xs">원본</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
