import React from "react";
import { Animated, TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface PhotoActionSheetProps {
  visible: boolean;
  actionSheetAnim: Animated.Value;
  onCrop: () => void;
  onFilter: () => void;
  onClose: () => void;
}

export default function PhotoActionSheet({
  visible,
  actionSheetAnim,
  onCrop,
  onFilter,
  onClose,
}: PhotoActionSheetProps) {
  if (!visible) return null;

  return (
    <Animated.View
      className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-100 rounded-t-2xl shadow-lg"
      style={{
        transform: [
          {
            translateY: actionSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [200, 0],
            }),
          },
        ],
        opacity: actionSheetAnim,
        zIndex: visible ? 20 : -1,
      }}
    >
      {/* <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <Text className="text-base font-medium text-gray-800">사진 편집</Text>
        <TouchableOpacity onPress={onClose} className="p-1">
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View> */}

      <View className="flex-row items-center justify-around py-2 px-4">
        <TouchableOpacity
          onPress={onCrop}
          className="items-center flex-row justify-center space-x-2"
        >
          <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-2">
            <MaterialIcons name="crop" size={20} color="#3498db" />
          </View>
          <Text className="text-gray-800 text-sm">사진 자르기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onFilter}
          className="items-center flex-row justify-center space-x-2"
        >
          <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center mb-2">
            <MaterialIcons name="auto-fix-high" size={20} color="#9b59b6" />
          </View>
          <Text className="text-gray-800 text-sm">사진 필터 적용</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
