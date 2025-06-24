import React from "react";
import { TouchableOpacity, Animated, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PhotoActionButtonProps {
  visible: boolean;
  actionAnim: Animated.Value;
  onPress: () => void;
}

export default function PhotoActionButton({
  visible,
  actionAnim,
  onPress,
}: PhotoActionButtonProps) {
  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        transform: [
          {
            translateY: actionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
            }),
          },
        ],
        opacity: actionAnim,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-full p-3 flex-row items-center shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <MaterialCommunityIcons name="crop" size={20} color="#3D3D3D" />
        <Text className="ml-2 text-gray-800 text-sm font-dohyeon">자르기</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
