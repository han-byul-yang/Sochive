import React from "react";
import { Image, View, ViewStyle } from "react-native";
import { Photo } from "@/types";
import {
  Canvas,
  Group,
  Image as SkiaImage,
  Path,
  Mask,
  Skia,
  useImage,
  SkPath,
} from "@shopify/react-native-skia";
import { PhoneAuthProvider } from "firebase/auth/react-native";
import { resizeByMaxDimension } from "@/utils/photoManipulation";

interface FilterProps {
  photo: Photo;
}

// 필터 매트릭스 정의
const FILTER_MATRICES = {
  grayscale: [
    0.21, 0.72, 0.07, 0, 0, 0.21, 0.72, 0.07, 0, 0, 0.21, 0.72, 0.07, 0, 0, 0,
    0, 0, 1, 0,
  ],
  sepia: [
    0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
    0, 0, 0, 0, 0, 1, 0,
  ],
  highteen: [
    1.2, 0, 0, 0, 0, 0, 1.1, 0, 0, 10, 0, 0, 0.9, 0, 20, 0, 0, 0, 1, 0,
  ],
  oldfilm: [
    0.9, 0.1, 0.1, 0, 10, 0.1, 0.8, 0.1, 0, 10, 0.1, 0.1, 0.7, 0, 10, 0, 0, 0,
    1, 0,
  ],
  brightness: [
    1.2, 0, 0, 0, 20, 0, 1.2, 0, 0, 20, 0, 0, 1.2, 0, 20, 0, 0, 0, 1, 0,
  ],
  contrast: [
    1.5, 0, 0, 0, -30, 0, 1.5, 0, 0, -30, 0, 0, 1.5, 0, -30, 0, 0, 0, 1, 0,
  ],
};

// 필터 스타일 매핑
const getFilterStyle = (filterType: string) => {
  switch (filterType) {
    case "grayscale":
      return { opacity: 0.7, tintColor: "#808080" };
    case "sepia":
      return { opacity: 0.8, tintColor: "#704214" };
    case "highteen":
      return { opacity: 0.9, tintColor: "#FFE4E1" };
    case "oldfilm":
      return { opacity: 0.85, tintColor: "#8B4513" };
    case "brightness":
      return { opacity: 1.2 };
    case "contrast":
      return { opacity: 0.9, tintColor: "#404040" };
    default:
      return {};
  }
};

// 기본 필터 컴포넌트
const FilteredImage = ({
  photo,
  filterType,
}: {
  photo: Photo;
  filterType: string;
}) => {
  // 이미지 크기 계산
  const { width, height } = photo;
  const aspectRatio = width / height;
  const containerWidth = width;
  const containerHeight = height;

  // 크롭 정보가 있는 경우 스타일 계산
  const cropStyle = photo.cropPath
    ? {
        position: "absolute" as const,
        left: photo.cropPath.x * containerWidth,
        top: photo.cropPath.y * containerHeight,
        width: photo.cropPath.width * containerWidth,
        height: photo.cropPath.height * containerHeight,
        overflow: "hidden",
      }
    : {
        width: containerWidth,
        height: containerHeight,
      };

  const clipPath = React.useMemo(() => {
    if (!photo.touchPoints) return null;
    // 1. 원래 좌표들의 bounding box 구하기
    const xs = photo.touchPoints.map((p) => p.x);
    const ys = photo.touchPoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const originalWidth = maxX - minX;
    const originalHeight = maxY - minY;

    // 2. 비율 유지하며 container에 맞는 scale 계산
    const { width, height } = resizeByMaxDimension(photo.width, photo.height);
    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;
    const scale = Math.min(scaleX, scaleY); // 비율 유지용

    // 3. Path 생성 (원본 좌표 기준)
    const path = Skia.Path.Make();
    path.moveTo(photo.touchPoints[0].x, photo.touchPoints[0].y);
    photo.touchPoints.slice(1).forEach((p) => path.lineTo(p.x, p.y));
    path.close();

    // 4. 변환 행렬 만들기 (좌표를 0,0으로 이동 후 scale)
    const matrix = Skia.Matrix();
    matrix.translate(-minX * scaleX, -minY * scaleY); // 시작점을 (0,0)으로 이동
    matrix.scale(scaleX, scaleY); // 전체를 축소/확대

    // 5. 최종 Path 반환
    const normalizedPath = path.copy().transform(matrix);
    return normalizedPath;
  }, [photo.touchPoints]);

  return (
    <>
      {photo.touchPoints ? (
        <View
          className="relative"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Path
              path={clipPath as SkPath}
              color="red"
              style="fill"
              opacity={1}
            />
          </Canvas>
          <View className="absolute top-0 left-0 w-full h-full z-[-10]">
            <Image
              source={{ uri: photo.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
        </View>
      ) : (
        <View
          className="relative"
          style={{ width: photo.width, height: photo.height }}
        >
          <Image
            source={{ uri: photo.uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
          <View className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></View>
        </View>
      )}
    </>
  );
};

// 각 필터 컴포넌트 정의
export const GrayScaleFilter = ({ photo }: FilterProps) => (
  <FilteredImage photo={photo} filterType="grayscale" />
);

export const SepiaFilter = ({ photo }: FilterProps) => (
  <FilteredImage photo={photo} filterType="sepia" />
);

export const HighTeenFilter = ({ photo }: FilterProps) => (
  <FilteredImage photo={photo} filterType="highteen" />
);

export const OldFilmFilter = ({ photo }: FilterProps) => (
  <FilteredImage photo={photo} filterType="oldfilm" />
);

export const BrightnessFilter = ({ photo }: FilterProps) => (
  <FilteredImage photo={photo} filterType="brightness" />
);

export const ContrastFilter = ({ photo }: FilterProps) => (
  <FilteredImage photo={photo} filterType="contrast" />
);
