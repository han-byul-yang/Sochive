import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Animated,
  Image,
  ImageBackground,
  PanResponder,
} from "react-native";
import { useState, useMemo, useRef, useEffect } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import BackgroundSelects from "@/components/BackgroundSelects";
import { pickMultipleImages } from "@/utils/getPhotos";
import DatePickerModal from "@/components/Modals/DatePickerModal";
import { MaterialIcons } from "@expo/vector-icons";
import { MONTH_EMOJIS, MONTHS } from "@/constants/Months";

const { width } = Dimensions.get("window");

export default function ArchiveScreen() {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<string>("hot");
  const [selectedPhotos, setSelectedPhotos] = useState<
    Array<{
      uri: string;
      position: { x: number; y: number };
      zIndex: number;
      rotation: number;
      scale: number;
    }>
  >([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [resizeMode, setResizeMode] = useState<"none" | "resize-rotate">(
    "none"
  );

  // 콜라주 영역 크기 참조
  const collageAreaRef = useRef<View>(null);
  const [collageAreaSize, setCollageAreaSize] = useState({
    width: 0,
    height: 0,
  });

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
  const backgroundPickerAnim = useRef(new Animated.Value(0)).current;
  const photoAnimations = useRef<{
    [key: number]: {
      rotation: Animated.Value;
      scale: Animated.Value;
    };
  }>({}).current;

  // 드래그 시작 위치 저장
  const dragStartRef = useRef({
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0,
    initialRotation: 0,
    initialScale: 1,
  });

  // 사진이 추가될 때마다 애니메이션 값 초기화
  useEffect(() => {
    selectedPhotos.forEach((photo, index) => {
      if (!photoAnimations[index]) {
        photoAnimations[index] = {
          rotation: new Animated.Value(photo.rotation),
          scale: new Animated.Value(photo.scale),
        };
      } else {
        photoAnimations[index].rotation.setValue(photo.rotation);
        photoAnimations[index].scale.setValue(photo.scale);
      }
    });
  }, [selectedPhotos.length]);

  // 모드 전환 애니메이션
  const toggleMode = () => {
    const newMode = mode === "read" ? "edit" : "read";
    setMode(newMode);

    Animated.timing(fadeAnim, {
      toValue: newMode === "edit" ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // 편집 모드를 종료하면 배경 선택기도 닫기
    if (newMode === "read" && showBackgroundPicker) {
      toggleBackgroundPicker();
    }
  };

  // 배경 선택기 토글
  const toggleBackgroundPicker = () => {
    const newState = !showBackgroundPicker;
    setShowBackgroundPicker(newState);

    Animated.timing(backgroundPickerAnim, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 사진 선택 함수 수정
  const handlePickImages = async () => {
    const result = await pickMultipleImages();

    if (result && !result.canceled && result.assets.length > 0) {
      const centerX = collageAreaSize.width / 2 - 80; // 사진 너비의 절반
      const centerY = collageAreaSize.height / 2 - 80; // 사진 높이의 절반

      const newPhotos = result.assets.map((asset, index) => {
        // 중앙에서 약간 랜덤하게 위치 조정
        const randomOffsetX = Math.random() * 60 - 30;
        const randomOffsetY = Math.random() * 60 - 30;
        const randomRotation = Math.random() * 20 - 10; // -10도 ~ 10도 회전

        return {
          uri: asset.uri,
          position: {
            x: centerX + randomOffsetX,
            y: centerY + randomOffsetY,
          },
          zIndex: selectedPhotos.length + index + 1,
          rotation: randomRotation,
          scale: 1,
        };
      });

      setSelectedPhotos([...selectedPhotos, ...newPhotos]);
    }
  };

  // 메인 콘텐츠 영역 크기 참조 추가
  const mainContentRef = useRef<View>(null);
  const [mainContentSize, setMainContentSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  // 드래그 이벤트 처리를 위한 PanResponder 생성 함수
  const createPanResponder = (index: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 드래그 시작 시 해당 사진을 최상위로 가져오기
        setActivePhotoIndex(index);
        setResizeMode("none");
        setSelectedPhotos((prev) => {
          const newPhotos = [...prev];
          const maxZ = Math.max(...newPhotos.map((p) => p.zIndex));
          newPhotos[index].zIndex = maxZ + 1;
          return newPhotos;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        setSelectedPhotos((prev) => {
          const newPhotos = [...prev];
          // 새 위치 계산
          const newX = newPhotos[index].position.x + gestureState.dx;
          const newY = newPhotos[index].position.y + gestureState.dy;

          // 위치 업데이트
          newPhotos[index].position = {
            x: newX,
            y: newY,
          };
          return newPhotos;
        });
      },
      onPanResponderRelease: () => {
        // 드래그 종료 시 activePhotoIndex를 유지
      },
    });
  };

  // 크기 조절 및 회전을 위한 PanResponder 최적화
  const createResizeRotatePanResponder = (index: number) => {
    // 현재 회전 및 크기 값을 저장할 변수
    let currentRotation = 0;
    let currentScale = 1;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (activePhotoIndex === index) {
          const photo = selectedPhotos[index];

          // 사진의 중심점 계산
          const centerX = photo.position.x + 90; // 180/2
          const centerY = photo.position.y + 90; // 180/2

          // 핸들의 위치 계산 (오른쪽 하단)
          const handleX = photo.position.x + 180;
          const handleY = photo.position.y + 180;

          // 드래그 시작 정보 저장
          dragStartRef.current = {
            x: handleX,
            y: handleY,
            centerX: centerX,
            centerY: centerY,
            initialRotation: photo.rotation,
            initialScale: photo.scale,
          };

          // 현재 값 저장
          currentRotation = photo.rotation;
          currentScale = photo.scale;

          setResizeMode("resize-rotate");
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (activePhotoIndex === index && photoAnimations[index]) {
          // 현재 드래그 위치
          const dragX = dragStartRef.current.x + gestureState.dx;
          const dragY = dragStartRef.current.y + gestureState.dy;

          // 중심점과 현재 드래그 위치 사이의 벡터
          const vectorX = dragX - dragStartRef.current.centerX;
          const vectorY = dragY - dragStartRef.current.centerY;

          // 각도 계산 (라디안)
          const angle = Math.atan2(vectorY, vectorX);
          // 각도를 도(degree)로 변환
          const degrees = angle * (180 / Math.PI);

          // 중심점과 드래그 포인트 사이의 거리 계산
          const distance = Math.sqrt(
            Math.pow(vectorX, 2) + Math.pow(vectorY, 2)
          );

          // 크기 조절 (기준 거리에 대한 비율)
          const baseDistance = 90 * Math.sqrt(2); // 대각선 길이
          const scale = Math.max(0.5, Math.min(2.0, distance / baseDistance));

          // 현재 값 업데이트
          currentRotation = degrees;
          currentScale = scale;

          // 애니메이션 값 업데이트 - 실시간으로 UI 반영
          photoAnimations[index].rotation.setValue(degrees);
          photoAnimations[index].scale.setValue(scale);
        }
      },
      onPanResponderRelease: () => {
        if (activePhotoIndex === index && photoAnimations[index]) {
          // 드래그 종료 시 최종 상태 업데이트 (저장된 값 사용)
          setSelectedPhotos((prev) => {
            const newPhotos = [...prev];
            newPhotos[index].rotation = currentRotation;
            newPhotos[index].scale = currentScale;
            return newPhotos;
          });

          setResizeMode("none");
        }
      },
    });
  };

  // 배경 탭 시 선택 해제
  const handleBackgroundTap = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(null);
    }
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

        {/* Header Right Buttons */}
        <View className="flex-row items-center space-x-2">
          {/* Save Button (Edit Mode Only) */}
          {mode === "edit" && (
            <TouchableOpacity
              className="bg-key px-4 py-2 rounded-full"
              activeOpacity={0.9}
            >
              <Text className="text-white font-medium">저장</Text>
            </TouchableOpacity>
          )}

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
      </View>

      {/* Main Content with Background */}
      <View
        ref={mainContentRef}
        className="flex-1 overflow-hidden"
        onLayout={(event) => {
          const { width, height, x, y } = event.nativeEvent.layout;
          setMainContentSize({ width, height, x, y });
        }}
      >
        <ImageBackground
          source={selectedBackground ? { uri: selectedBackground } : undefined}
          style={{ flex: 1 }}
          imageStyle={{ opacity: 0.65 }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleBackgroundTap}
            style={{ flex: 1 }}
          >
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
                {/* Background Button */}
                <TouchableOpacity
                  className="bg-gray-100 p-[8px] rounded-full"
                  activeOpacity={0.9}
                  onPress={toggleBackgroundPicker}
                >
                  <IconSymbol
                    name="photo.on.rectangle"
                    size={24}
                    color="#3D3D3D"
                  />
                </TouchableOpacity>

                {/* Camera Button */}
                <TouchableOpacity
                  className="bg-key p-[8px] rounded-full"
                  activeOpacity={0.9}
                  onPress={handlePickImages}
                >
                  <IconSymbol name="camera" size={24} color="#fff" />
                </TouchableOpacity>
              </Animated.View>

              {/* Collage Area */}
              <View
                ref={collageAreaRef}
                className={`bg-white/90 rounded-2xl shadow-sm ${
                  selectedPhotos.length > 0 ? "bg-transparent" : "bg-white/80"
                }`}
                style={{ height: 200 }} // 고정 높이 설정
                onLayout={(event) => {
                  const { width, height } = event.nativeEvent.layout;
                  setCollageAreaSize({ width, height });
                }}
              >
                {selectedPhotos.length > 0 ? (
                  <View className="w-full h-full">
                    {selectedPhotos.map((photo, index) => {
                      const panResponder = createPanResponder(index);
                      const resizeRotatePanResponder =
                        createResizeRotatePanResponder(index);
                      const isActive = activePhotoIndex === index;

                      return (
                        <View
                          key={index}
                          className="absolute"
                          style={{
                            width: 180,
                            height: 180,
                            left: photo.position.x,
                            top: photo.position.y,
                            zIndex: photo.zIndex,
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              setActivePhotoIndex(index);
                            }}
                          >
                            <Animated.View
                              {...panResponder.panHandlers}
                              className="w-full h-full rounded-lg overflow-hidden shadow-md"
                              style={{
                                transform: [
                                  {
                                    rotate:
                                      photoAnimations[
                                        index
                                      ]?.rotation.interpolate({
                                        inputRange: [-360, 360],
                                        outputRange: ["-360deg", "360deg"],
                                      }) || `${photo.rotation}deg`,
                                  },
                                  {
                                    scale:
                                      photoAnimations[index]?.scale ||
                                      photo.scale,
                                  },
                                ],
                                borderWidth: isActive ? 2 : 0,
                                borderColor: "#3498db",
                              }}
                            >
                              <Image
                                source={{ uri: photo.uri }}
                                className="w-full h-full"
                                resizeMode="contain"
                              />
                            </Animated.View>
                          </TouchableOpacity>

                          {/* 크기 조절 및 회전 핸들 */}
                          {isActive && (
                            <Animated.View
                              {...resizeRotatePanResponder.panHandlers}
                              className="absolute bottom-0 right-0 w-8 h-8 bg-white/80 rounded-full items-center justify-center shadow-md"
                              style={{
                                transform: [
                                  {
                                    rotate:
                                      photoAnimations[
                                        index
                                      ]?.rotation.interpolate({
                                        inputRange: [-360, 360],
                                        outputRange: ["-360deg", "360deg"],
                                      }) || `${photo.rotation}deg`,
                                  },
                                  {
                                    translateX: Animated.multiply(
                                      photoAnimations[index]?.scale ||
                                        photo.scale,
                                      15
                                    ),
                                  },
                                  {
                                    translateY: Animated.multiply(
                                      photoAnimations[index]?.scale ||
                                        photo.scale,
                                      15
                                    ),
                                  },
                                ],
                                zIndex: photo.zIndex + 1,
                              }}
                            >
                              <MaterialIcons
                                name="open-with"
                                size={16}
                                color="#3498db"
                              />
                            </Animated.View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View className="items-center justify-center p-8 h-full">
                    <ThemedText className="text-gray-400">
                      {mode === "edit"
                        ? "사진을 추가하여 콜라주를 만들어보세요"
                        : "이번 달 기록이 없습니다"}
                    </ThemedText>
                  </View>
                )}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* Background Selector Component */}
      <BackgroundSelects
        showBackgroundPicker={showBackgroundPicker}
        backgroundPickerAnim={backgroundPickerAnim}
        activeCategory={activeCategory}
        selectedBackground={selectedBackground}
        setActiveCategory={setActiveCategory}
        setSelectedBackground={setSelectedBackground}
        toggleBackgroundPicker={toggleBackgroundPicker}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </View>
  );
}
