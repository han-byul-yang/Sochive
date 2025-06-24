import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  useWindowDimensions,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { STICKER_CATEGORIES, SAMPLE_STICKERS } from "@/constants/Stickers";
import { Photo } from "@/types";
import CustomBottomSheet from "./BottomSheet";

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
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const { height: screenHeight } = useWindowDimensions();
  const date = new Date();
  const dateNow = date.getTime();
  const centerX = collageAreaSize.width / 2 - 80;
  const centerY = collageAreaSize.height / 2 - 80;
  const maxZ =
    selectedPhotos.length > 0
      ? Math.max(...selectedPhotos.map((p) => p.zIndex))
      : 0;
  const GAP = 8;
  const NUM_COLUMNS = 4;
  const STICKER_SIZE =
    (collageAreaSize.width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

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
    <CustomBottomSheet
      snapPoints={["5%", "25%", "50%", "90%"]}
      onChange={(index) => setCurrentSnapPoint(index)}
    >
      <View className="flex-row items-center border-b border-gray-100">
        {/* Close Button */}
        {/*<TouchableOpacity
          onPress={toggleStickerPicker}
          className="px-3 py-3 items-center justify-center"
        >
          <View className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center">
            <IconSymbol name="chevron.down" size={20} color="#3D3D3D" />
          </View>
        </TouchableOpacity>*/}

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
      <View
        className="mt-2"
        style={{
          height:
            currentSnapPoint === 2
              ? screenHeight * 0.5 - 200
              : screenHeight * 0.9 - 200,
        }}
      >
        <ScrollView
          horizontal={currentSnapPoint === 1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          className="h-full"
          style={{ flex: 1 }}
          contentContainerStyle={
            currentSnapPoint === 1
              ? {
                  paddingHorizontal: 8,
                }
              : {
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  paddingHorizontal: 8,
                }
          }
        >
          {SAMPLE_STICKERS[activeCategory as keyof typeof SAMPLE_STICKERS]?.map(
            (sticker, index) => (
              <TouchableOpacity
                key={`${sticker}-${index}`}
                onPress={() => handleStickerPress(sticker, index)}
                style={{
                  width: STICKER_SIZE,
                  height: STICKER_SIZE,
                  marginBottom: 8,
                }}
              >
                <View
                  className={`${
                    currentSnapPoint === 1
                      ? "w-[80px] h-[80px]"
                      : "aspect-square"
                  } rounded-lg overflow-hidden border ${
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
    </CustomBottomSheet>
  );
}
