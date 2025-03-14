import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FILTER_CATEGORIES, FILTERS } from "@/constants/Filters";

interface FilterSelectsProps {
  showFilterPicker: boolean;
  filterPickerAnim: Animated.Value;
  activeCategory: string;
  selectedFilter: string | null;
  setActiveCategory: (category: string) => void;
  toggleFilterPicker: (show: boolean) => void;
  onApplyFilter: (filterId: string, filterValue: string) => void;
}

export default function FilterSelects({
  showFilterPicker,
  filterPickerAnim,
  activeCategory,
  selectedFilter,
  setActiveCategory,
  toggleFilterPicker,
  onApplyFilter,
}: FilterSelectsProps) {
  // 디버깅용 로그 추가
  console.log("FilterSelects 렌더링: ", showFilterPicker);

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl"
      style={{
        transform: [
          {
            translateY: filterPickerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [500, 0],
            }),
          },
        ],
        opacity: filterPickerAnim,
        zIndex: showFilterPicker ? 2000 : -1,
        display: showFilterPicker ? "flex" : "none",
      }}
    >
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <Text className="text-lg font-medium text-gray-800">필터 선택</Text>
        <TouchableOpacity onPress={() => toggleFilterPicker(false)}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 선택 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-2 border-b border-gray-100"
      >
        {FILTER_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setActiveCategory(category.id)}
            className={`px-4 py-2 mx-1 rounded-full ${
              activeCategory === category.id ? "bg-blue-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`${
                activeCategory === category.id ? "text-white" : "text-gray-800"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 필터 목록 */}
      <ScrollView className="p-4" style={{ maxHeight: 300 }}>
        <View className="flex-row flex-wrap justify-between">
          {FILTERS[activeCategory as keyof typeof FILTERS].map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onApplyFilter(filter.id, filter.value)}
              className="w-[30%] mb-4 items-center"
            >
              <View
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedFilter === filter.value
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {/* 필터 미리보기 이미지 */}
                  <Text className="text-center text-xs mt-8">
                    {filter.name}
                  </Text>
                </View>
              </View>
              <Text className="text-xs mt-1">{filter.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}
