import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { STICKER_CATEGORIES, SAMPLE_STICKERS } from "@/constants/Stickers";
import { Photo } from "@/types";

interface StickerSelectsProps {
  showStickerPicker: boolean;
  stickerPickerAnim: Animated.Value;
  activeCategory: string;
  selectedSticker: string | null;
  collageAreaSize: { width: number; height: number };
  selectedPhotos: Photo[];
  setSelectedPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  setActiveCategory: (category: string) => void;
  setSelectedSticker: (sticker: string | null) => void;
  toggleStickerPicker: () => void;
}

export default function StickerSelects({
  showStickerPicker,
  stickerPickerAnim,
  activeCategory,
  selectedSticker,
  collageAreaSize,
  selectedPhotos,
  setSelectedPhotos,
  setActiveCategory,
  setSelectedSticker,
  toggleStickerPicker,
}: StickerSelectsProps) {
  const date = new Date();
  const dateNow = date.getTime();
  const centerX = collageAreaSize.width / 2 - 80;
  const centerY = collageAreaSize.height / 2 - 80;
  const maxZ =
    selectedPhotos.length > 0
      ? Math.max(...selectedPhotos.map((p) => p.zIndex))
      : 0;

  const handleStickerPress = (sticker: string, index: number) => {
    setSelectedSticker(sticker);
    const newStickerData = {
      name: "sticker",
      id: dateNow + index,
      createdAt: date,
      uri: sticker,
      originalUri: sticker,
      width: 10,
      height: 10,
      position: {
        x: centerX,
        y: centerY,
      },
      zIndex: maxZ + 100 + index, // 기존 최대값보다 훨씬 높은 z-index 부여
      rotation: 0,
      scale: 1,
    };
    setSelectedPhotos((prevPhotos) => [...prevPhotos, newStickerData]);
  };

  return (
    <Animated.View
      className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-100"
      style={{
        transform: [
          {
            translateY: stickerPickerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          },
        ],
        opacity: stickerPickerAnim,
        height: showStickerPicker ? "auto" : 0,
        zIndex: showStickerPicker ? 10 : -1,
      }}
    >
      {/* Sticker Categories */}
      <View className="flex-row items-center border-b border-gray-100">
        {/* Close Button */}
        <TouchableOpacity
          onPress={toggleStickerPicker}
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
          {STICKER_CATEGORIES.map((category) => (
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
                    : "text-gray-500"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sticker Options */}
      <View className="flex-row items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-3 flex-1"
          contentContainerStyle={{ paddingRight: 20, paddingLeft: 12 }}
        >
          {SAMPLE_STICKERS[activeCategory as keyof typeof SAMPLE_STICKERS]?.map(
            (sticker, index) => (
              <TouchableOpacity
                key={`${sticker}-${index}`}
                onPress={() => handleStickerPress(sticker, index)}
                className="mx-2"
              >
                <View
                  className={`w-[80px] h-[80px] rounded-lg overflow-hidden border ${
                    selectedSticker === sticker
                      ? "border-2 border-sky-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    source={{ uri: sticker }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}
