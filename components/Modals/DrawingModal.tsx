import React, { useState, useRef, useEffect, Fragment } from "react";
import {
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  PanResponder,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/IconSymbol";
import WheelColorPicker from "react-native-wheel-color-picker";
import {
  Canvas,
  Path,
  SkPath,
  useCanvasRef,
  Skia,
  BlurMask,
  Circle,
  PathDef,
  BlurStyle,
  PaintStyle,
  Group,
} from "@shopify/react-native-skia";
import {
  generateSprayDots,
  jitterPoint,
  makeAngleBasedPath,
  makeDotLinePoints,
  makeDoubleLinePath,
  makeOutlinePath,
  makeSketchPath,
  makeSmokePath,
  makeWavePath,
  penStyles,
} from "@/utils/penStyles";
import { createDrawingStore } from "@/lib/firestore";
import {
  useCreateDrawing,
  useGetDrawings,
  useUpdateDrawing,
} from "@/hooks/useGetDrawings";
import { FontAwesome } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type PenTipStyle = "round" | "square" | "butt";

const TOOLS = [
  {
    id: "zigzag",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574968/085d590a-3a24-429f-8d1d-37eb6c472648_d5kpj2.png",
    label: "지그재그",
    width: 2,
  },
  {
    id: "smokeNormal",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "연기",
    width: 8,
  },
  {
    id: "smokeSolid",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "연기 굵게",
    width: 4,
  },
  {
    id: "smokeInner",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "연기 안쪽",
    width: 4,
  },
  {
    id: "smokeOuter",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "연기 바깥쪽",
    width: 4,
  },
  {
    id: "wave",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "파도",
    width: 4,
  },
  {
    id: "doubleLine",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "두줄",
    width: 4,
  },
  {
    id: "outlineWhite",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "흰 테두리",
    width: 4,
  },
  {
    id: "outlineColorThin",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "얇은 색 테두리",
    width: 4,
  },
  {
    id: "outlineColorThick",
    icon: "https://res.cloudinary.com/ddcuocopj/image/upload/v1749574970/96bfbeaa-18f9-4b18-80c6-fcbe2c5abc5a_fopbsl.png",
    label: "굵은 색 테두리",
    width: 4,
  },
];

const COLORS = [
  "#000000",
  "#FF69B4",
  "#4169E1",
  "#FFD700",
  "#FF6347",
  "#9370DB",
  "#20B2AA",
  "#FF4500",
];

const SIZES = [
  { id: "xs", size: 2, label: "얇게" },
  { id: "sm", size: 4, label: "보통" },
  { id: "md", size: 6, label: "굵게" },
  { id: "lg", size: 8, label: "매우 굵게" },
];

const PEN_TIP_STYLES = [
  { id: "round" as PenTipStyle, label: "둥근 끝" },
  { id: "square" as PenTipStyle, label: "각진 끝" },
  { id: "butt" as PenTipStyle, label: "평평한 끝" },
];

interface DrawingModalProps {
  month: number;
  year: number;
  screenshotUri: string | undefined;
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface PenSettingsModalProps {
  visible: boolean;
  size: number;
  opacity: number;
  penTipStyle: PenTipStyle;
  onSizeChange: (size: number) => void;
  onOpacityChange: (opacity: number) => void;
  onPenTipStyleChange: (style: PenTipStyle) => void;
}

interface Point {
  x: number;
  y: number;
}

function PenSettingsModal({
  visible,
  size,
  opacity,
  penTipStyle,
  onSizeChange,
  onOpacityChange,
  onPenTipStyleChange,
}: PenSettingsModalProps) {
  const sizeSliderAnim = useRef(new Animated.Value((size / 50) * 100)).current;
  const opacitySliderAnim = useRef(new Animated.Value(opacity * 100)).current;
  const sliderRef = useRef<View>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const insetsHeight = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 모달이 나타날 때 말풍선처럼 왼쪽 아래에서 커지면서 올라오는 애니메이션
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 모달이 사라질 때 왼쪽 아래쪽으로 들어가는 애니메이션
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 50,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 애니메이션 완료 후 컴포넌트 숨기기
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

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
      <Animated.View
        className="absolute left-4 right-4 rounded-2xl p-4"
        style={{
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
          transformOrigin: "bottom left",
          backgroundColor: "rgba(220, 225, 222, 0.9)",
          bottom: tabBarHeight + insetsHeight.bottom,
        }}
      >
        {/* Size Slider */}
        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-800 text-sm">크기</Text>
            <Text className="text-gray-500 text-sm">{Math.round(size)}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="remove" size={20} color="#666" />
            <View
              ref={sliderRef}
              className="flex-1 mx-2 h-1 bg-[#b7c6c2] rounded-full"
            >
              <Animated.View
                className="absolute h-1 bg-gray-700 rounded-full"
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
            <Text className="text-gray-800 text-sm">투명도</Text>
            <Text className="text-gray-500 text-sm">
              {Math.round(opacity * 100)}%
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="format-color-reset" size={20} color="#666" />
            <View
              ref={sliderRef}
              className="flex-1 mx-2 h-1 bg-[#b7c6c2] rounded-full"
            >
              <Animated.View
                className="absolute h-1 bg-gray-700 rounded-full"
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

        {/* Pen Tip Style */}
        <View className="mt-4">
          <Text className="text-gray-800 text-sm mb-2">펜 끝 모양</Text>
          <View className="flex-row justify-between">
            {PEN_TIP_STYLES.map((style) => (
              <TouchableOpacity
                key={style.id}
                onPress={() => onPenTipStyleChange(style.id)}
                className={`flex-1 mx-1 py-2 rounded-lg items-center ${
                  penTipStyle === style.id ? "bg-gray-700" : "bg-[#b7c6c2]"
                }`}
              >
                <Text
                  className={`text-sm ${
                    penTipStyle === style.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

interface ColorPickerModalProps {
  visible: boolean;
  color: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

function ColorPickerModal({
  visible,
  color,
  onColorChange,
  onClose,
}: ColorPickerModalProps) {
  const translateXAnim = useRef(new Animated.Value(50)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const insetsHeight = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 모달이 나타날 때 오른쪽 아래에서 크기가 커지면서 올라오는 애니메이션
      Animated.parallel([
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 모달이 사라질 때 오른쪽 아래쪽으로 작아지면서 들어가는 애니메이션
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 50,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 애니메이션 완료 후 컴포넌트 숨기기
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View
        className="absolute z-10 left-0 right-0"
        style={{
          bottom: tabBarHeight + insetsHeight.bottom,
        }}
      >
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
            transformOrigin: "bottom right",
          }}
        >
          <View
            className="relative rounded-t-2xl p-6"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-800 text-lg font-medium">색상</Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-[#578E7E] font-medium">완료</Text>
              </TouchableOpacity>
            </View>
            <WheelColorPicker
              color={color}
              onColorChange={onColorChange}
              thumbSize={30}
              sliderSize={30}
              gapSize={20}
              autoResetSlider
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

interface EraserSettingsModalProps {
  visible: boolean;
  size: number;
  onSizeChange: (size: number) => void;
  onClose: () => void;
}

function EraserSettingsModal({
  visible,
  size,
  onSizeChange,
  onClose,
}: EraserSettingsModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);

  const eraserSizes = [10, 15, 25, 35];

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 모달이 나타날 때 위에서 아래로 부드럽게 나타나는 애니메이션
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 모달이 사라질 때 위로 올라가면서 사라지는 애니메이션
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -10,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <Animated.View
        className="absolute top-0 right-2 bg-white rounded-xl p-3 z-20 shadow-lg"
        style={{
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
          transformOrigin: "top left",
          elevation: 5,
        }}
      >
        {/* Size Options */}
        <View className="flex-row items-center space-x-3">
          {eraserSizes.map((sizeOption, index) => (
            <TouchableOpacity
              key={sizeOption}
              onPress={() => onSizeChange(sizeOption)}
              className="items-center justify-center"
            >
              <View
                className={`rounded-full ${
                  size === sizeOption ? "bg-[#578E7E]" : "bg-gray-300"
                }`}
                style={{
                  width: 8 + index * 4,
                  height: 8 + index * 4,
                }}
              />
              <Text className="text-xs text-gray-600 mt-1">{sizeOption}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function DrawingModal({
  month,
  year,
  screenshotUri,
  visible,
  onClose,
  onSave,
}: DrawingModalProps) {
  const [selectedTool, setSelectedTool] = useState("zigzag");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [showPenSettings, setShowPenSettings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [penSize, setPenSize] = useState(10);
  const [penOpacity, setPenOpacity] = useState(1);
  const [penTipStyle, setPenTipStyle] = useState<PenTipStyle>("round");
  const [isEraser, setIsEraser] = useState(false);
  const [showEraserSettings, setShowEraserSettings] = useState(false);
  const [eraserSize, setEraserSize] = useState(15);
  const [dots, setDots] = useState<Point[]>([]);
  const [paths, setPaths] = useState<
    {
      //path: SkPath | { path1: SkPath; path2: SkPath };
      currentPath: Point[];
      color: string;
      opacity: number;
      strokeWidth: number;
      penTipStyle: PenTipStyle;
      selectedTool: string;
      isEraser: boolean;
    }[]
  >([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const canvasRef = useCanvasRef();
  const { mutate: createDrawingMutate } = useCreateDrawing(month, year);
  const { mutate: updateDrawingMutate } = useUpdateDrawing(month, year);
  const { data: drawingsPathData } = useGetDrawings(month, year);
  const [isCreate, setIsCreate] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const getStrokeWidth = () => {
    switch (selectedTool) {
      case "zigzag":
        return penSize * 0.5;
      case "spray":
        return penSize;
      case "dot":
        return penSize * 1.5;
      case "smokeNormal":
        return penSize * 2;
      case "smokeSolid":
        return penSize * 2;
      case "smokeInner":
        return penSize * 2;
      case "smokeOuter":
        return penSize * 2;
      case "wave":
        return penSize;
      case "doubleLine":
        return penSize;
      case "outlineWhite":
        return penSize;
      case "outlineColorThin":
        return penSize;
      case "outlineColorThick":
        return penSize;
      default:
        return penSize;
    }
  };

  const drawingPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath([{ x: locationX, y: locationY }]);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
    },
    onPanResponderRelease: () => {
      if (currentPath.length > 1) {
        //const path = makeSmokePath(currentPath);
        const outlinePath = makeOutlinePath(currentPath);
        const doubleLinePath = makeDoubleLinePath(currentPath);
        const wavePath = makeWavePath(currentPath);
        const path =
          penStyles[selectedTool as keyof typeof penStyles].style(currentPath);
        setPaths((prev) => [
          ...prev,
          {
            selectedTool: selectedTool,
            //path: selectedTool === "doubleLine" ? doubleLinePath : path,
            currentPath: currentPath,
            color: selectedColor,
            opacity: penOpacity,
            penTipStyle: penTipStyle,
            strokeWidth: isEraser ? eraserSize : getStrokeWidth(),
            isEraser: isEraser,
          },
        ]);
        setCurrentPath([]);
      }
    },
  });

  const sprayPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const spray = makeDotLinePoints(currentPath);
      setDots((prev) => [...prev, ...spray]);
    },
  });

  const handleToolSelect = (toolId: string) => {
    if (isEraser) return; // 지우개 모드에서는 도구 변경 불가
    setSelectedTool(toolId);
    setShowPenSettings((prevState) => !prevState);
  };

  const handleCloseModals = () => {
    setShowPenSettings(false);
    setShowColorPicker(false);
    setShowEraserSettings(false);
  };

  const handleEraserToggle = () => {
    const newEraserState = !isEraser;
    setIsEraser(newEraserState);

    if (newEraserState) {
      // 지우개 모드가 켜질 때 지우개 설정 모달 표시
      setShowEraserSettings(true);
      // 다른 모달들은 닫기
      setShowPenSettings(false);
      setShowColorPicker(false);
    } else {
      // 지우개 모드가 꺼질 때 지우개 설정 모달 닫기
      setShowEraserSettings(false);
    }
  };

  const handleUndo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const handleSave = () => {
    const drawingData = {
      month: month,
      year: year,
      drawing: paths,
    };
    try {
      if (isCreate) {
        createDrawingMutate(drawingData);
      } else {
        updateDrawingMutate({
          drawingData: drawingData,
          drawingId: drawingsPathData?.[0]?.id || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPaths([]);
      setCurrentPath([]);
      onClose();
    }
  };

  const handleCloseDrawingModal = () => {
    setPaths([]);
    setCurrentPath([]);
    onClose();
  };

  useEffect(() => {
    if (drawingsPathData && drawingsPathData?.length > 0 && visible) {
      setPaths(drawingsPathData[0].drawing);
      setIsCreate(false);
    } else {
      setPaths([]);
      setIsCreate(true);
    }
  }, [drawingsPathData, visible]);

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={handleCloseModals}>
        <SafeAreaView className="flex-1 bg-[#dce1de]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 h-[60px]">
            <TouchableOpacity onPress={handleCloseDrawingModal}>
              <IconSymbol name="xmark" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-gray-800 text-lg font-medium font-dohyeon">
              그리기
            </Text>
            <View className="flex-row items-center space-x-4">
              <TouchableWithoutFeedback onPress={() => {}}>
                <TouchableOpacity
                  onPress={handleEraserToggle}
                  className={`p-1 rounded ${isEraser ? "bg-[#578E7E]" : ""}`}
                >
                  <FontAwesome
                    name="eraser"
                    size={20}
                    color={isEraser ? "#ffffff" : "#3D3D3D"}
                  />
                </TouchableOpacity>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {}}>
                <TouchableOpacity
                  onPress={handleUndo}
                  disabled={paths?.length === 0}
                  className="p-1"
                >
                  <MaterialIcons
                    name="undo"
                    size={24}
                    color={paths?.length > 0 ? "#3D3D3D" : "#666666"}
                  />
                </TouchableOpacity>
              </TouchableWithoutFeedback>
              <TouchableOpacity onPress={handleSave} className="p-1">
                <Text className="text-[#578E7E] font-medium">완료</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Eraser Settings Modal */}
          <View className="relative z-10">
            <EraserSettingsModal
              visible={showEraserSettings}
              size={eraserSize}
              onSizeChange={setEraserSize}
              onClose={() => setShowEraserSettings(false)}
            />
          </View>

          {/* Drawing Area */}
          <View className="flex-1 relative bg-white rounded-2xl">
            {(showPenSettings || showEraserSettings || showColorPicker) && (
              <TouchableOpacity
                onPress={handleCloseModals}
                className="absolute top-0 left-0 right-0 bottom-0 bg-transparent z-10"
              />
            )}
            <Image
              source={{ uri: screenshotUri }}
              className="absolute inset-0 w-full h-full"
            />
            <Canvas
              ref={canvasRef}
              style={{ flex: 1 }}
              {...drawingPanResponder.panHandlers}
            >
              {paths.map((path: any, index) => {
                return (
                  <Group key={index}>
                    {penStyles[path.selectedTool as keyof typeof penStyles]
                      .path === "blur" ? (
                      <>
                        <BlurMask
                          blur={
                            penStyles[
                              path.selectedTool as keyof typeof penStyles
                            ].blur
                          }
                          style={
                            path.isEraser
                              ? "normal"
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].option
                          }
                        />
                        <Path
                          path={
                            path.selectedTool === "doubleLine"
                              ? makeDoubleLinePath(path.currentPath)
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].style(path.currentPath)
                          }
                          strokeWidth={
                            path.isEraser
                              ? eraserSize
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].path === "path2"
                              ? path.strokeWidth *
                                penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].width1
                              : path.strokeWidth
                          }
                          blendMode={path.isEraser ? "dstOut" : "src"}
                          color={
                            penStyles[
                              path.selectedTool as keyof typeof penStyles
                            ].path === "path2"
                              ? penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].color1 === "selectedColor"
                                ? path.color
                                : penStyles[
                                    path.selectedTool as keyof typeof penStyles
                                  ].color1
                              : path.color
                          }
                          strokeJoin="round"
                          strokeCap={path.penTipStyle}
                          style="stroke"
                          opacity={path.opacity}
                        />
                      </>
                    ) : (
                      <Group>
                        <Path
                          path={
                            path.selectedTool === "doubleLine"
                              ? makeDoubleLinePath(path.currentPath).path1
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].style(path.currentPath)
                          }
                          strokeWidth={
                            path.isEraser
                              ? eraserSize
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].path === "path2"
                              ? path.strokeWidth *
                                penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].width1
                              : path.strokeWidth
                          }
                          blendMode={path.isEraser ? "dstOut" : "src"}
                          color={
                            penStyles[
                              path.selectedTool as keyof typeof penStyles
                            ].path === "path2"
                              ? penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].color1 === "selectedColor"
                                ? path.color
                                : penStyles[
                                    path.selectedTool as keyof typeof penStyles
                                  ].color1
                              : path.color
                          }
                          strokeJoin="round"
                          strokeCap={path.penTipStyle}
                          style="stroke"
                          opacity={path.opacity}
                        />
                      </Group>
                    )}
                    {penStyles[path.selectedTool as keyof typeof penStyles]
                      .path === "path2" && (
                      <Group>
                        <Path
                          path={
                            path.selectedTool === "doubleLine"
                              ? makeDoubleLinePath(path.currentPath).path2
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].style(path.currentPath)
                          }
                          strokeWidth={
                            path.isEraser
                              ? eraserSize
                              : penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].path === "path2"
                              ? path.strokeWidth *
                                penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].width2
                              : path.strokeWidth
                          }
                          blendMode={path.isEraser ? "dstOut" : "src"}
                          strokeJoin="round"
                          strokeCap={path.penTipStyle}
                          color={
                            penStyles[
                              path.selectedTool as keyof typeof penStyles
                            ].path === "path2"
                              ? penStyles[
                                  path.selectedTool as keyof typeof penStyles
                                ].color2 === "selectedColor"
                                ? path.color
                                : penStyles[
                                    path.selectedTool as keyof typeof penStyles
                                  ].color2
                              : path.color
                          }
                          style="stroke"
                          opacity={path.opacity}
                        />
                        <BlurMask blur={3} style="solid" />
                      </Group>
                    )}
                  </Group>
                );
              })}
              {currentPath?.length > 1 &&
                (penStyles[selectedTool as keyof typeof penStyles].path ===
                "blur" ? (
                  <Group>
                    <BlurMask
                      blur={
                        penStyles[selectedTool as keyof typeof penStyles].blur
                      }
                      style={
                        isEraser
                          ? "normal"
                          : penStyles[selectedTool as keyof typeof penStyles]
                              .option
                      }
                    />
                    <Path
                      path={
                        selectedTool === "doubleLine"
                          ? (makeDoubleLinePath(currentPath).path1 as PathDef)
                          : (penStyles[
                              selectedTool as keyof typeof penStyles
                            ].style(currentPath) as PathDef)
                      }
                      strokeWidth={
                        isEraser
                          ? eraserSize
                          : penStyles[selectedTool as keyof typeof penStyles]
                              .path === "path2"
                          ? getStrokeWidth() *
                            penStyles[selectedTool as keyof typeof penStyles]
                              .width1
                          : getStrokeWidth()
                      }
                      color={
                        penStyles[selectedTool as keyof typeof penStyles]
                          .path === "path2"
                          ? penStyles[selectedTool as keyof typeof penStyles]
                              .color1 === "selectedColor"
                            ? selectedColor
                            : penStyles[selectedTool as keyof typeof penStyles]
                                .color1
                          : selectedColor
                      }
                      strokeJoin="round"
                      strokeCap={penTipStyle}
                      style="stroke"
                      opacity={penOpacity}
                      blendMode={isEraser ? "dstOut" : "src"}
                    />
                  </Group>
                ) : (
                  <Group>
                    <Path
                      path={
                        selectedTool === "doubleLine"
                          ? (makeDoubleLinePath(currentPath).path1 as PathDef)
                          : (penStyles[
                              selectedTool as keyof typeof penStyles
                            ].style(currentPath) as PathDef)
                      }
                      strokeWidth={
                        isEraser
                          ? eraserSize
                          : penStyles[selectedTool as keyof typeof penStyles]
                              .path === "path2"
                          ? getStrokeWidth() *
                            penStyles[selectedTool as keyof typeof penStyles]
                              .width1
                          : getStrokeWidth()
                      }
                      color={
                        penStyles[selectedTool as keyof typeof penStyles]
                          .path === "path2"
                          ? penStyles[selectedTool as keyof typeof penStyles]
                              .color1 === "selectedColor"
                            ? selectedColor
                            : penStyles[selectedTool as keyof typeof penStyles]
                                .color1
                          : selectedColor
                      }
                      strokeJoin="round"
                      strokeCap={penTipStyle}
                      style="stroke"
                      opacity={penOpacity}
                      blendMode={isEraser ? "dstOut" : "src"}
                    />
                  </Group>
                ))}
              {penStyles[selectedTool as keyof typeof penStyles].path ===
                "path2" && (
                <Group>
                  <Path
                    path={
                      selectedTool === "doubleLine"
                        ? (makeDoubleLinePath(currentPath).path2 as PathDef)
                        : (penStyles[
                            selectedTool as keyof typeof penStyles
                          ].style(currentPath) as PathDef)
                    }
                    strokeWidth={
                      isEraser
                        ? eraserSize
                        : getStrokeWidth() *
                          penStyles[selectedTool as keyof typeof penStyles]
                            .width2
                    }
                    color={
                      penStyles[selectedTool as keyof typeof penStyles].path ===
                      "path2"
                        ? penStyles[selectedTool as keyof typeof penStyles]
                            .color2 === "selectedColor"
                          ? selectedColor
                          : penStyles[selectedTool as keyof typeof penStyles]
                              .color2
                        : selectedColor
                    }
                    strokeJoin="round"
                    strokeCap={penTipStyle}
                    style="stroke"
                    opacity={penOpacity}
                    blendMode={isEraser ? "dstOut" : "src"}
                  />
                  <BlurMask blur={3} style="solid" />
                </Group>
              )}
            </Canvas>
          </View>

          {/* Pen Settings Modal */}
          <PenSettingsModal
            visible={showPenSettings}
            size={penSize}
            opacity={penOpacity}
            penTipStyle={penTipStyle}
            onSizeChange={setPenSize}
            onOpacityChange={setPenOpacity}
            onPenTipStyleChange={setPenTipStyle}
          />

          {/* Color Picker Modal */}
          <ColorPickerModal
            visible={showColorPicker}
            color={selectedColor}
            onColorChange={setSelectedColor}
            onClose={() => setShowColorPicker(false)}
          />

          {/* Bottom Toolbar */}
          <View
            className="bg-[#cdd6d1] flex-row items-center px-4"
            style={{
              height: tabBarHeight,
            }}
          >
            {/* Tools */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1"
            >
              {TOOLS.map((tool) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={tool.id}
                  onPress={() => handleToolSelect(tool.id)}
                  className="items-center mr-4"
                >
                  <View
                    className={`py-[2px] px-[2px] rounded-sm items-center justify-center flex-row space-x-2 ${
                      selectedTool === tool.id ? "bg-[#1c1e1c]" : "bg-slate-100"
                    }`}
                  >
                    <Image
                      source={{
                        uri: (tool.icon as any) || "",
                      }}
                      className="w-8 h-12"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Color Picker Button */}
            <View className="ml-4">
              <TouchableOpacity
                onPress={() =>
                  !isEraser && setShowColorPicker(!showColorPicker)
                }
                className={`w-10 h-10 rounded-full border-2 border-white p-1 ${
                  isEraser ? "opacity-50" : ""
                }`}
                disabled={isEraser}
              >
                <View
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: isEraser ? "#999999" : selectedColor,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
