import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated,
  PanResponder,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface DrawingModalProps {
  screenshotUri: string | undefined;
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const TOOLS = [
  { id: "pencil", icon: "edit", label: "연필", width: 2 },
  { id: "brush", icon: "brush", label: "브러시", width: 4 },
  { id: "marker", icon: "create", label: "마커", width: 6 },
  { id: "highlighter", icon: "highlight", label: "형광펜", width: 8 },
  { id: "pattern", icon: "grain", label: "패턴", width: 4 },
  { id: "eraser", icon: "auto-fix-high", label: "지우개", width: 20 },
];

const COLORS = [
  "#000000", // 검정
  "#FF69B4", // 핑크
  "#4169E1", // 파랑
  "#FFD700", // 노랑
  "#FF6347", // 주황
  "#9370DB", // 보라
  "#20B2AA", // 청록
  "#FF4500", // 빨강
];

const SIZES = [
  { id: "xs", size: 2, label: "얇게" },
  { id: "sm", size: 4, label: "보통" },
  { id: "md", size: 6, label: "굵게" },
  { id: "lg", size: 8, label: "매우 굵게" },
];

interface PenSettingsModalProps {
  visible: boolean;
  size: number;
  opacity: number;
  onSizeChange: (size: number) => void;
  onOpacityChange: (opacity: number) => void;
}

function PenSettingsModal({
  visible,
  size,
  opacity,
  onSizeChange,
  onOpacityChange,
}: PenSettingsModalProps) {
  if (!visible) return null;

  const sizeSliderAnim = useRef(new Animated.Value((size / 50) * 100)).current;
  const opacitySliderAnim = useRef(new Animated.Value(opacity * 100)).current;
  const sliderRef = useRef<View>(null);

  const updateSliderPosition = (
    evt: any,
    onUpdate: (value: number) => void,
    maxValue: number
  ) => {
    if (sliderRef.current) {
      const { locationX } = evt.nativeEvent;
      sliderRef.current.measure((x, y, width) => {
        const percentage = Math.max(0, Math.min(1, locationX / width));
        const value = percentage * maxValue;
        onUpdate(value);
      });
    }
  };

  const sizeSliderPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // 터치 시작 시 처리
    },
    onPanResponderMove: (evt) => {
      updateSliderPosition(
        evt,
        (value) => {
          const newSize = Math.max(1, Math.min(50, value));
          sizeSliderAnim.setValue((newSize / 50) * 100);
          onSizeChange(newSize);
        },
        50
      );
    },
  });

  const opacitySliderPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // 터치 시작 시 처리
    },
    onPanResponderMove: (evt) => {
      updateSliderPosition(
        evt,
        (value) => {
          const newOpacity = Math.max(0, Math.min(1, value));
          opacitySliderAnim.setValue(newOpacity * 100);
          onOpacityChange(newOpacity);
        },
        1
      );
    },
  });

  // 슬라이더 바의 너비를 위한 애니메이션 스타일
  const sizeBarStyle = {
    width: sizeSliderAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  const opacityBarStyle = {
    width: opacitySliderAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  // 슬라이더 핸들의 위치를 위한 애니메이션 스타일
  const sizeHandleStyle = {
    left: sizeSliderAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  const opacityHandleStyle = {
    left: opacitySliderAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View className="absolute bottom-28 left-4 right-4 bg-[#333333] rounded-2xl p-4">
        {/* Size Slider */}
        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-white text-sm">크기</Text>
            <Text className="text-gray-400 text-sm">{Math.round(size)}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="remove" size={20} color="#666" />
            <View
              ref={sliderRef}
              className="flex-1 mx-2 h-1 bg-gray-700 rounded-full"
            >
              <Animated.View
                className="absolute h-1 bg-blue-500 rounded-full"
                style={sizeBarStyle}
              />
              <Animated.View
                {...sizeSliderPanResponder.panHandlers}
                className="absolute w-5 h-5 bg-white rounded-full -top-2"
                style={[sizeHandleStyle, { marginLeft: -10 }]}
              />
              <View
                className="absolute w-full h-8 -top-4"
                {...sizeSliderPanResponder.panHandlers}
              />
            </View>
            <MaterialIcons name="add" size={20} color="#666" />
          </View>
        </View>

        {/* Opacity Slider */}
        <View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-white text-sm">투명도</Text>
            <Text className="text-gray-400 text-sm">
              {Math.round(opacity * 100)}%
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="format-color-reset" size={20} color="#666" />
            <View
              ref={sliderRef}
              className="flex-1 mx-2 h-1 bg-gray-700 rounded-full"
            >
              <Animated.View
                className="absolute h-1 bg-blue-500 rounded-full"
                style={opacityBarStyle}
              />
              <Animated.View
                {...opacitySliderPanResponder.panHandlers}
                className="absolute w-5 h-5 bg-white rounded-full -top-2"
                style={[opacityHandleStyle, { marginLeft: -10 }]}
              />
              <View
                className="absolute w-full h-8 -top-4"
                {...opacitySliderPanResponder.panHandlers}
              />
            </View>
            <MaterialIcons name="opacity" size={20} color="#666" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function DrawingModal({
  screenshotUri,
  visible,
  onClose,
  onSave,
}: DrawingModalProps) {
  const [selectedTool, setSelectedTool] = useState("pencil");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [showPenSettings, setShowPenSettings] = useState(false);
  const [penSize, setPenSize] = useState(10);
  const [penOpacity, setPenOpacity] = useState(1);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setShowPenSettings(true);
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={() => setShowPenSettings(false)}>
        <SafeAreaView className="flex-1 bg-black">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-medium">그리기</Text>
            <TouchableOpacity onPress={onSave}>
              <Text className="text-blue-400 font-medium">완료</Text>
            </TouchableOpacity>
          </View>

          {/* Drawing Area */}
          <View className="flex-1 bg-white rounded-2xl mb-4">
            <Image
              source={{ uri: screenshotUri }}
              className="flex-1 w-full h-full"
            />
          </View>

          {/* Pen Settings Modal */}
          <PenSettingsModal
            visible={showPenSettings}
            size={penSize}
            opacity={penOpacity}
            onSizeChange={setPenSize}
            onOpacityChange={setPenOpacity}
          />

          {/* Bottom Toolbar */}
          <View className="h-20 bg-[#222222] flex-row items-center px-4">
            {/* Tools */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1"
            >
              {TOOLS.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  onPress={() => handleToolSelect(tool.id)}
                  className="items-center mr-6"
                >
                  <View
                    className={`h-12 px-3 rounded-full items-center justify-center flex-row space-x-2 ${
                      selectedTool === tool.id ? "bg-blue-500" : "bg-gray-800"
                    }`}
                  >
                    <MaterialIcons
                      name={tool.icon as any}
                      size={20}
                      color={selectedTool === tool.id ? "#fff" : "#999"}
                    />
                    <Text
                      className={`text-sm ${
                        selectedTool === tool.id
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {tool.label}
                    </Text>
                  </View>
                  {/* Tool Width Indicator */}
                  <View
                    className="mt-1 bg-gray-400 rounded-full"
                    style={{
                      width: tool.width,
                      height: tool.width,
                      opacity: selectedTool === tool.id ? 1 : 0.5,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Color Picker */}
            <View className="ml-4">
              <TouchableOpacity
                onPress={() => {
                  const nextColorIndex =
                    (COLORS.indexOf(selectedColor) + 1) % COLORS.length;
                  setSelectedColor(COLORS[nextColorIndex]);
                }}
                className="w-12 h-12 rounded-full border-2 border-white p-1"
              >
                <View
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
