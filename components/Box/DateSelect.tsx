import { Animated, Text, TouchableOpacity, View } from "react-native";
import Box from ".";
import { Picker } from "@react-native-picker/picker";
import CustomBottomSheet from "../BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";

interface DateSelectProps {
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  pan: Animated.Value;
  slideAnim: Animated.Value;
  tempYear: number;
  setTempYear: React.Dispatch<React.SetStateAction<number>>;
  tempMonth: number;
  setTempMonth: React.Dispatch<React.SetStateAction<number>>;
  tempDay: number;
  setTempDay: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function DateSelect({
  setShowDatePicker,
  pan,
  slideAnim,
  tempYear,
  setTempYear,
  tempMonth,
  setTempMonth,
  tempDay,
  setTempDay,
  setSelectedDate,
}: DateSelectProps) {
  const { isDarkMode } = useTheme();

  const handlePointChange = (index: number) => {
    if (index === -1) {
      setShowDatePicker(false);
    }
  };

  return (
    <CustomBottomSheet
      snapPoints={["50%"]}
      onChange={handlePointChange}
      close
      isBackground
      onBackgroundPress={() => setShowDatePicker(false)}
    >
      <View className="px-4">
        <Text
          className={`text-center text-lg font-bold ${
            isDarkMode ? "text-gray-300" : "text-gray-800"
          } mb-6`}
        >
          날짜 선택
        </Text>
        {/* 년, 월, 일 선택 */}
        <View className="flex-row justify-between mb-6">
          <View style={{ flex: 1, marginRight: 8 }}>
            <Picker
              selectedValue={tempYear}
              onValueChange={setTempYear}
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 12,
              }}
            >
              {Array.from({ length: 21 }, (_, i) => 2015 + i).map((y) => (
                <Picker.Item key={y} label={`${y}`} value={y} />
              ))}
            </Picker>
          </View>
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <Picker
              selectedValue={tempMonth}
              onValueChange={setTempMonth}
              style={{ backgroundColor: "#F3F4F6", borderRadius: 12 }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <Picker.Item key={m} label={`${m}월`} value={m} />
              ))}
            </Picker>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Picker
              selectedValue={tempDay}
              onValueChange={setTempDay}
              style={{ backgroundColor: "#F3F4F6", borderRadius: 12 }}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <Picker.Item key={d} label={`${d}일`} value={d} />
              ))}
            </Picker>
          </View>
        </View>

        {/* 하단 여백 추가 */}

        <TouchableOpacity
          className="w-full bg-gray-900 py-3 rounded-2xl"
          onPress={() => {
            // 날짜 유효성 체크
            const validDate = new Date(tempYear, tempMonth - 1, tempDay);
            setSelectedDate(validDate);
            setShowDatePicker(false);
          }}
          activeOpacity={0.85}
        >
          <Text className="text-white text-center text-base font-semibold">
            확인
          </Text>
        </TouchableOpacity>

        {/* 추가 하단 여백 */}
        <View className="h-4" />
      </View>
    </CustomBottomSheet>
  );
}
