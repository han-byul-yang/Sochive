import { Modal, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "../ui/IconSymbol";
import { useMemo } from "react";
import { MONTHS } from "@/constants/Months";

interface DatePickerModalProps {
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
}

export default function DatePickerModal({
  showDatePicker,
  setShowDatePicker,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}: DatePickerModalProps) {
  const getMonthName = (month: number) => MONTHS[month - 1];

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
  );
}
