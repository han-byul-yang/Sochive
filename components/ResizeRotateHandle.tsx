import React from "react";
import { Animated, PanResponder, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ResizeRotateHandleProps {
  isActive: boolean;
  photoIndex: number;
  photo: {
    rotation: number;
    scale: number;
    zIndex: number;
    id: number;
  };
  width: number;
  height: number;
  photoAnimations: {
    [key: number]: {
      rotation: Animated.Value;
      scale: Animated.Value;
    };
  };
  panResponder: any;
  onDelete?: (index: number) => void;
}

export default function ResizeRotateHandle({
  isActive,
  photoIndex,
  photo,
  width,
  height,
  photoAnimations,
  panResponder,
  onDelete,
}: ResizeRotateHandleProps) {
  if (!isActive) return null;

  // 회전 애니메이션 보간 설정
  const rotateInterpolation =
    photoAnimations[photo.id]?.rotation.interpolate({
      inputRange: [-360, 360],
      outputRange: ["-360deg", "360deg"],
    }) || `${photo.rotation}deg`;

  // 크기 애니메이션 값
  const scaleValue = photoAnimations[photo.id]?.scale || photo.scale;
  console.log(scaleValue);
  return (
    <>
      {/* 크기 조절 및 회전 핸들 */}
      <Animated.View
        {...panResponder.panHandlers}
        className="absolute bottom-0 right-0 w-8 h-8 bg-white/80 rounded-full items-center justify-center shadow-md"
        style={{
          transform: [
            { rotate: rotateInterpolation },
            {
              translateX: scaleValue.interpolate({
                inputRange: [1, 2],
                outputRange: [1, 50],
              }),
            },
            {
              translateY: scaleValue.interpolate({
                inputRange: [1, 2],
                outputRange: [1, 50],
              }),
            },
          ],
          zIndex: photo.zIndex + 1,
        }}
      >
        <MaterialIcons name="open-with" size={16} color="#3498db" />
      </Animated.View>

      {/* 삭제 버튼 */}
      <Animated.View
        className="absolute top-0 right-0"
        style={{
          zIndex: photo.zIndex + 1,
          transform: [
            { rotate: rotateInterpolation },
            // 삭제 버튼은 오른쪽 상단에 위치하므로 translateX는 양수, translateY는 음수
            {
              translateX: scaleValue.interpolate({
                inputRange: [1, 2],
                outputRange: [1, 50],
              }),
            },
            {
              translateY: scaleValue.interpolate({
                inputRange: [1, 2],
                outputRange: [1, -50],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          onPress={() => onDelete && onDelete(photo.id)}
          className="w-8 h-8 bg-red-500/90 rounded-full items-center justify-center shadow-md"
        >
          <MaterialIcons name="delete" size={16} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
