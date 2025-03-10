import React from "react";
import { Animated, PanResponder } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ResizeRotateHandleProps {
  isActive: boolean;
  photoIndex: number;
  photo: {
    rotation: number;
    scale: number;
    zIndex: number;
  };
  photoAnimations: {
    [key: number]: {
      rotation: Animated.Value;
      scale: Animated.Value;
    };
  };
  panResponder: any;
}

export default function ResizeRotateHandle({
  isActive,
  photoIndex,
  photo,
  photoAnimations,
  panResponder,
}: ResizeRotateHandleProps) {
  if (!isActive) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      className="absolute bottom-0 right-0 w-8 h-8 bg-white/80 rounded-full items-center justify-center shadow-md"
      style={{
        transform: [
          {
            rotate:
              photoAnimations[photoIndex]?.rotation.interpolate({
                inputRange: [-360, 360],
                outputRange: ["-360deg", "360deg"],
              }) || `${photo.rotation}deg`,
          },
          {
            translateX: Animated.multiply(
              photoAnimations[photoIndex]?.scale || photo.scale,
              15
            ),
          },
          {
            translateY: Animated.multiply(
              photoAnimations[photoIndex]?.scale || photo.scale,
              15
            ),
          },
        ],
        zIndex: photo.zIndex + 1,
      }}
    >
      <MaterialIcons name="open-with" size={16} color="#3498db" />
    </Animated.View>
  );
}
