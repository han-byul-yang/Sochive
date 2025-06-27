import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DrawingPaletteProps {
  visible: boolean;
  paletteAnim: Animated.Value;
  onClose: () => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onOpacityChange: (opacity: number) => void;
  onConfirm: () => void;
  onPenTypeChange: (type: string) => void;
}

const COLORS = [
  "#7ED957", // 연두색
  "#FF69B4", // 핫핑크
  "#4169E1", // 로얄블루
  "#FFD700", // 골드
  "#FF6347", // 토마토
  "#9370DB", // 보라
  "#20B2AA", // 청록색
  "#FF4500", // 오렌지레드
];

const PEN_TYPES = [
  {
    id: "normal",
    icon: "create",
    label: "기본",
  },
  {
    id: "dot",
    icon: "blur-on",
    label: "점선",
  },
  { id: "brush", icon: "brush", label: "브러시" },
  { id: "neon", icon: "lightbulb-outline", label: "네온" },
];

export default function DrawingPalette({
  visible,
  paletteAnim,
  onClose,
  onColorChange,
  onSizeChange,
  onOpacityChange,
  onConfirm,
  onPenTypeChange,
}: DrawingPaletteProps) {
  if (!visible) return null;

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl"
      style={{
        transform: [
          {
            translateY: paletteAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          },
        ],
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-lg font-medium">펜 설정</Text>
        <TouchableOpacity onPress={onConfirm}>
          <Text className="text-blue-500 font-medium">확인</Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker */}
      <View className="p-4 border-b border-gray-100">
        <Text className="text-sm text-gray-600 mb-3">색상</Text>
        <View className="flex-row flex-wrap justify-between">
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => onColorChange(color)}
              className="mb-2 p-1"
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: color,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pen Types */}
      <View className="p-4 border-b border-gray-100">
        <Text className="text-sm text-gray-600 mb-3">펜 종류</Text>
        <View className="flex-row justify-between">
          {PEN_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => onPenTypeChange(type.id)}
              className="items-center"
            >
              <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1">
                <MaterialIcons name={type.icon as any} size={24} color="#666" />
              </View>
              <Text className="text-xs text-gray-600">{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Size Slider */}
      <View className="p-4 border-b border-gray-100">
        <Text className="text-sm text-gray-600 mb-3">크기</Text>
      </View>

      {/* Opacity Slider */}
      <View className="p-4">
        <Text className="text-sm text-gray-600 mb-3">투명도</Text>
      </View>
    </Animated.View>
  );
}
