import { Modal, TouchableOpacity, View, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "../ui/IconSymbol";
import { useMemo } from "react";
import { MONTH_EMOJIS, MONTHS } from "@/constants/Months";
import { useTheme } from "@/contexts/ThemeContext";

interface DatePickerModalProps {
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  setMode: React.Dispatch<React.SetStateAction<"read" | "edit">>;
}

export default function DatePickerModal({
  showDatePicker,
  setShowDatePicker,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  setMode,
}: DatePickerModalProps) {
  const getMonthName = (month: number) => MONTHS[month - 1];
  const { isDarkMode } = useTheme();

  // 월 목록 생성
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  return (
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
        <View
          className={`mt-32 mx-4 bg-white rounded-2xl overflow-hidden ${
            isDarkMode ? "bg-[#121212]" : "bg-white"
          }`}
        >
          {/* Year Selector */}
          <View
            className={`flex-row items-center justify-between px-6 py-4 border-b ${
              isDarkMode ? "border-gray-600" : "border-gray-100"
            }`}
          >
            <TouchableOpacity
              onPress={() => setSelectedYear(selectedYear - 1)}
              className="p-2"
            >
              <IconSymbol
                name="chevron.left"
                size={18}
                color={isDarkMode ? "#E2DFD0" : "#212121"}
              />
            </TouchableOpacity>
            <ThemedText
              className={`text-2xl font-gaegu ${
                isDarkMode ? "text-[#E2DFD0]" : "text-key"
              }`}
            >
              {selectedYear}
            </ThemedText>
            <TouchableOpacity
              onPress={() => setSelectedYear(selectedYear + 1)}
              className="p-2"
            >
              <IconSymbol
                name="chevron.right"
                size={18}
                color={isDarkMode ? "#E2DFD0" : "#212121"}
              />
            </TouchableOpacity>
          </View>

          {/* Month Grid */}
          <View className="p-4">
            <View className="flex-row flex-wrap">
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  onPress={() => {
                    setMode("read");
                    setSelectedMonth(month);
                    setShowDatePicker(false);
                  }}
                  className={`w-1/3 p-2`}
                >
                  <View
                    className={`py-3 rounded-xl items-center flex-row justify-center ${
                      selectedMonth === month
                        ? `bg-${isDarkMode ? "white" : "key"}`
                        : `bg-${isDarkMode ? "key" : "white"}`
                    }`}
                  >
                    <ThemedText
                      className={`text-base font-dohyeon ${
                        selectedMonth === month
                          ? `text-${isDarkMode ? "key" : "white"}`
                          : `text-${isDarkMode ? "white" : "gray-50"}`
                      }`}
                    >
                      {getMonthName(month).slice(0, 3)}
                    </ThemedText>
                    <Image
                      source={{ uri: MONTH_EMOJIS[getMonthName(month)] }}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
