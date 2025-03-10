import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import { useState, useMemo, useRef } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_EMOJIS = {
  January: "❄️",
  February: "💝",
  March: "🌸",
  April: "🌷",
  May: "🌿",
  June: "☀️",
  July: "🌊",
  August: "🌻",
  September: "🍂",
  October: "🎃",
  November: "🍁",
  December: "⛄️",
} as const;

export default function ArchiveScreen() {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 현재 선택된 날짜 상태
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  // 월 목록 생성
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  // 월 이름 가져오기 함수 추가
  const getMonthName = (month: number) => MONTHS[month - 1];

  // 애니메이션 값 추가
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 모드 전환 애니메이션
  const toggleMode = () => {
    const newMode = mode === "read" ? "edit" : "read";
    setMode(newMode);

    Animated.timing(fadeAnim, {
      toValue: newMode === "edit" ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.9}
          className="flex-row items-center"
        >
          <View className="flex-row items-baseline">
            <ThemedText className="text-3xl font-gaegu text-key">
              {getMonthName(selectedMonth)}
            </ThemedText>
            <Text className="text-xl">
              {MONTH_EMOJIS[getMonthName(selectedMonth)]}
            </Text>
            <ThemedText className="text-xl font-gaegu text-gray-400 ml-2">
              {selectedYear}
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={18}
              color="#3D3D3D"
              style={{
                transform: [{ rotate: "90deg" }],
                marginLeft: 4,
              }}
            />
          </View>
        </TouchableOpacity>

        {/* Mode Toggle Button */}
        <TouchableOpacity
          onPress={toggleMode}
          activeOpacity={0.9}
          className={`p-[8px] rounded-full ${
            mode === "edit" ? "bg-key" : "bg-gray-100"
          }`}
        >
          <IconSymbol
            name={mode === "edit" ? "xmark" : "pencil"}
            size={22}
            color={mode === "edit" ? "#fff" : "#3D3D3D"}
          />
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/30"
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View className="mt-32 mx-4 bg-white rounded-2xl overflow-hidden">
            {/* Year Selector */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <TouchableOpacity
                onPress={() => setSelectedYear(selectedYear - 1)}
                className="p-2"
              >
                <IconSymbol
                  name="chevron.left"
                  size={24}
                  color="#3D3D3D"
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </TouchableOpacity>
              <ThemedText className="text-xl font-noto-bold">
                {selectedYear}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setSelectedYear(selectedYear + 1)}
                className="p-2"
              >
                <IconSymbol name="chevron.right" size={24} color="#3D3D3D" />
              </TouchableOpacity>
            </View>

            {/* Month Grid */}
            <View className="p-4">
              <View className="flex-row flex-wrap">
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    onPress={() => {
                      setSelectedMonth(month);
                      setShowDatePicker(false);
                    }}
                    className={`w-1/3 p-2`}
                  >
                    <View
                      className={`py-3 rounded-xl items-center ${
                        selectedMonth === month ? "bg-key" : "bg-gray-50"
                      }`}
                    >
                      <ThemedText
                        className={`text-base ${
                          selectedMonth === month ? "text-white" : "text-key"
                        }`}
                      >
                        {getMonthName(month).slice(0, 3)}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        {/* Edit Mode Controls with Animation */}
        <Animated.View
          className="flex-row justify-end space-x-2 mb-4"
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            className="bg-gray-100 p-[8px] rounded-full"
            activeOpacity={0.9}
          >
            <IconSymbol name="photo.on.rectangle" size={24} color="#3D3D3D" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-key p-[8px] rounded-full"
            activeOpacity={0.9}
          >
            <IconSymbol name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Collage Area */}
        <View className="bg-white rounded-2xl shadow-sm ">
          {/* 여기에 콜라주 컨텐츠가 들어갈 예정 */}
          <View className="items-center justify-center flex-1">
            <ThemedText className="text-gray-400">
              {mode === "edit"
                ? "사진을 추가하여 콜라주를 만들어보세요"
                : "이번 달 기록이 없습니다"}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Save Button (Edit Mode Only) */}
      {mode === "edit" && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity className="bg-key px-6 py-3 rounded-full shadow-lg">
            <Text className="text-white font-medium">저장하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
