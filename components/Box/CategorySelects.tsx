import {
  Animated,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text,
  PanResponder,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import Box from ".";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";

export const CATEGORIES = [
  { id: "health", name: "Health", icon: "favorite" },
  { id: "fitness", name: "Fitness", icon: "fitness-center" },
  { id: "study", name: "Study", icon: "menu-book" },
  { id: "finance", name: "Finance", icon: "attach-money" },
  { id: "social", name: "Social", icon: "group" },
  { id: "selfcare", name: "Self-care", icon: "spa" },
  { id: "daily", name: "Daily", icon: "event-note" },
  { id: "shopping", name: "Shopping", icon: "shopping-cart" },
  { id: "spirituality", name: "Spirituality", icon: "self-improvement" },
  { id: "cleaning", name: "Cleaning", icon: "cleaning-services" },
  { id: "pet", name: "Pet", icon: "pets" },
  { id: "sleep", name: "Sleep", icon: "hotel" },
  { id: "travel", name: "Travel", icon: "flight" },
  { id: "food", name: "Food", icon: "restaurant" },
  { id: "family", name: "Family", icon: "people" },
  { id: "work", name: "Work", icon: "work" },
  { id: "hobby", name: "Hobby", icon: "sports" },
  { id: "memory", name: "Memory", icon: "photo" },
  { id: "other", name: "Other", icon: "more-horiz" },
] as const;
export type CategoryIconName = (typeof CATEGORIES)[number]["icon"];
// 색상 팔레트
const SELECTED_BG = "#F3F4F6"; // 연회색
const SELECTED_BORDER = "#BDBDBD"; // 중립 border
const SELECTED_ICON_BG = "#E0E0E0"; // 연회색 원
const SELECTED_ICON = "#222"; // 진회색
const SELECTED_TEXT = "#222";
const UNSELECTED_BG = "#FAFAFA"; // 더 밝은 회색
const UNSELECTED_BORDER = "#E0E0E0";
const UNSELECTED_ICON_BG = "#F3F4F6";
const UNSELECTED_ICON = "#888";
const UNSELECTED_TEXT = "#888";

interface CategorySelectsProps {
  setShowCategoryBox: React.Dispatch<React.SetStateAction<boolean>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategorySelects({
  setShowCategoryBox,
  category,
  setCategory,
}: CategorySelectsProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(1);
  const { height: screenHeight } = useWindowDimensions();
  const { isDarkMode } = useTheme();

  const handlePointChange = (index: number) => {
    setCurrentSnapPoint(index);
    if (index === -1) {
      setShowCategoryBox(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    setCategory(category);
    setShowCategoryBox(false);
  };

  return (
    <CustomBottomSheet
      snapPoints={["50%", "90%"]}
      index={0}
      onChange={handlePointChange}
      close
      isBackground
      onBackgroundPress={() => setShowCategoryBox(false)}
    >
      <Text
        className={`text-center text-lg font-bold ${
          isDarkMode ? "text-gray-300" : "text-gray-800"
        } mb-6`}
      >
        카테고리 선택
      </Text>
      <View
        style={{
          height:
            currentSnapPoint === 0
              ? screenHeight * 0.5 - 100
              : screenHeight * 0.9 - 100,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const selected = category === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat.name)}
                className="flex-row items-center px-4 py-3 rounded-2xl mb-3 border mx-2"
                style={{
                  backgroundColor: selected
                    ? isDarkMode
                      ? "#333333"
                      : SELECTED_BG
                    : isDarkMode
                    ? "#222222"
                    : UNSELECTED_BG,
                  borderWidth: 1,
                  borderColor: selected
                    ? isDarkMode
                      ? "#6b7280"
                      : SELECTED_BORDER
                    : isDarkMode
                    ? "#222222"
                    : UNSELECTED_BORDER,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: selected ? 0.08 : 0.03,
                  shadowRadius: 6,
                  elevation: selected ? 3 : 1,
                }}
              >
                <View
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: selected
                      ? SELECTED_ICON_BG
                      : isDarkMode
                      ? "#a9a9a9"
                      : UNSELECTED_ICON_BG,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 2,
                  }}
                >
                  <MaterialIcons
                    name={cat.icon as CategoryIconName}
                    size={22}
                    color={
                      selected
                        ? SELECTED_ICON
                        : isDarkMode
                        ? "#4d4c4c"
                        : UNSELECTED_ICON
                    }
                  />
                </View>
                <Text
                  className="ml-4 text-base font-medium"
                  style={{
                    color: selected
                      ? isDarkMode
                        ? "#E2DFD0"
                        : SELECTED_TEXT
                      : UNSELECTED_TEXT,
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </CustomBottomSheet>
  );
}
