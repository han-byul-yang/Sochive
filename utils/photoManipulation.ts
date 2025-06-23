import { Photo } from "@/types";
import { Animated } from "react-native";

// 사진 위치 업데이트 함수
export const updatePhotoPosition = (
  photos: Photo[],
  index: number,
  gestureState: { dx: number; dy: number }
) => {
  const newPhotos = [...photos];
  if (newPhotos[index]) {
    newPhotos[index] = {
      ...newPhotos[index],
      position: {
        x: newPhotos[index].position.x + gestureState.dx,
        y: newPhotos[index].position.y + gestureState.dy,
      },
    };
  }
  return newPhotos;
};

// 사진 회전 및 크기 조정 함수
export const updatePhotoTransform = (
  photos: Photo[],
  index: number,
  rotation: number,
  scale: number
) => {
  const newPhotos = [...photos];
  if (newPhotos[index]) {
    newPhotos[index] = {
      ...newPhotos[index],
      rotation,
      scale,
    };
  }
  return newPhotos;
};

// 사진 필터 적용 함수
export const applyFilterToPhoto = (
  photos: Photo[],
  index: number,
  filterId: string
) => {
  const newPhotos = [...photos];
  if (newPhotos[index]) {
    newPhotos[index] = {
      ...newPhotos[index],
      filter: filterId,
    };
  }
  return newPhotos;
};

// 애니메이션 토글 함수
export const toggleAnimation = (
  animValue: Animated.Value,
  toValue: number,
  duration: number = 300
) => {
  Animated.timing(animValue, {
    toValue,
    duration,
    useNativeDriver: true,
  }).start();
};

// 사진 메모 업데이트 함수
export const updatePhotoMemo = (
  photos: Photo[],
  index: number,
  memo: string
) => {
  const newPhotos = [...photos];
  if (newPhotos[index]) {
    newPhotos[index] = {
      ...newPhotos[index],
      memo,
    };
  }
  return newPhotos;
};

// 사진 크기 조정 함수
export const resizeByMaxDimension = (
  width: number,
  height: number,
  maxSize: number = 160
) => {
  const maxOriginal = Math.max(width, height);
  const scale = maxSize / maxOriginal;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};
