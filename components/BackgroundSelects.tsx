import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Easing,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  BACKGROUND_CATEGORIES,
  SAMPLE_BACKGROUNDS,
} from "@/constants/Backgrounds";
import { useTheme } from "@/contexts/ThemeContext";

interface BackgroundSelectsProps {
  showBackgroundPicker: boolean;
  backgroundPickerAnim: Animated.Value;
  activeCategory: string;
  selectedBackground: string | null;
  setActiveCategory: (category: string) => void;
  setSelectedBackground: (background: string | null) => void;
  toggleBackgroundPicker: () => void;
}

export default function BackgroundSelects({
  showBackgroundPicker,
  backgroundPickerAnim,
  activeCategory,
  selectedBackground,
  setActiveCategory,
  setSelectedBackground,
  toggleBackgroundPicker,
}: BackgroundSelectsProps) {
  const { isDarkMode } = useTheme();
  useEffect(() => {
    Animated.timing(backgroundPickerAnim, {
      toValue: showBackgroundPicker ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showBackgroundPicker]);

  return (
    <Animated.View
      className={`absolute left-0 right-0 bottom-0 ${
        isDarkMode ? "bg-[#2b2b2b]" : "bg-white"
      } border-t border-gray-100`}
      style={{
        transform: [
          {
            translateY: backgroundPickerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          },
        ],
        height: 220,
        zIndex: 10,
      }}
    >
      {/* Background Categories */}
      <View
        className={`flex-row items-center border-b ${
          isDarkMode ? "border-gray-600" : "border-gray-100"
        }`}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={toggleBackgroundPicker}
          className="px-3 py-3 items-center justify-center"
        >
          <View className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center">
            <IconSymbol name="chevron.down" size={20} color="#3D3D3D" />
          </View>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-2 flex-1"
        >
          {BACKGROUND_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              className={`px-4 py-2 mx-1 rounded-full flex-row items-center ${
                activeCategory === category.id
                  ? "bg-gray-100"
                  : "bg-transparent"
              }`}
            >
              <MaterialIcons
                name={category.icon as any}
                size={18}
                color={activeCategory === category.id ? "#3D3D3D" : "#9E9E9E"}
              />
              <Text
                className={`ml-1 ${
                  activeCategory === category.id
                    ? "text-gray-800 font-medium"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Background Options */}
      <View className="flex-row items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-3 flex-1"
          contentContainerStyle={{ paddingRight: 20, paddingLeft: 12 }}
        >
          {/* Original (No Background) Option */}
          {/* <TouchableOpacity
            onPress={() => setSelectedBackground(null)}
            className="mx-2"
          >
            <View
              className={`w-[80px] h-[120px] rounded-lg overflow-hidden border ${
                selectedBackground === null
                  ? "border-2 border-sky-500"
                  : "border-gray-200"
              }`}
            >
              <View className="w-full h-full bg-gray-100 items-center justify-center">
                <Text className="text-gray-400">원본</Text>
              </View>
            </View>
            <View
              className={`absolute top-2 right-2 w-5 h-5 rounded-full ${
                selectedBackground === null ? "bg-sky-500" : "bg-transparent"
              }`}
            >
              {selectedBackground === null && (
                <Feather name="check" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity> */}

          {/* Background Options */}
          {SAMPLE_BACKGROUNDS[
            activeCategory as keyof typeof SAMPLE_BACKGROUNDS
          ]?.map((bg, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedBackground(bg)}
              className="mx-2"
            >
              <View
                className={`w-[80px] h-[120px] rounded-lg overflow-hidden border ${
                  selectedBackground === bg
                    ? "border-2 border-sky-500"
                    : "border-gray-200"
                }`}
              >
                <Image
                  source={{ uri: bg }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View
                className={`absolute top-2 right-2 w-5 h-5 rounded-full ${
                  selectedBackground === bg ? "bg-sky-500" : "bg-transparent"
                }`}
              >
                {selectedBackground === bg && (
                  <Feather name="check" size={16} color="#fff" />
                )}
              </View>
              {index === 2 && (
                <View className="absolute top-0 right-0 bg-purple-500 px-1 rounded">
                  <Text className="text-white text-[10px]">VIP</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}
