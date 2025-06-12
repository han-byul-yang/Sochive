import { useLocalSearchParams } from "expo-router";
import { useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

const HEADER_HEIGHT = 300;

export default function Memo() {
  const { selectedPhotoUri, selectedPhotoMemo } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

  // 애니메이션을 위한 값들
  const borderRadiusAnim = useRef(
    new Animated.Value(screenWidth * 0.475)
  ).current; // 초기값: 화면 너비의 절반 (rounded-full)
  const scaleAnim = useRef(new Animated.Value(0.9)).current; // 초기값: 작은 크기

  // 컴포넌트 마운트 시 애니메이션 실행
  useEffect(() => {
    Animated.parallel([
      Animated.timing(borderRadiusAnim, {
        toValue: 16, // rounded-2xl 정도
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // 원래 크기
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 이미지가 덜 올라가도록 translateY 줄이기
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 2], // 천천히 올라감
    extrapolate: "clamp",
  });

  // 텍스트 박스는 일반적으로 올라감
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT], // 더 빠르게 올라감
    extrapolate: "clamp",
  });

  // 스크롤할 때 이미지가 점차 어두워지도록 opacity 조절
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.2], // 완전히 보임 -> 30% 투명도
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 relative">
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* 헤더 이미지 */}
        <Animated.View
          style={{
            transform: [{ translateY: imageTranslateY }, { scale: scaleAnim }],
            width: screenWidth,
            height: screenWidth * 0.95,
            opacity: imageOpacity,
          }}
          className="absolute z-[-1] items-center justify-center"
        >
          <Animated.View
            style={{
              borderRadius: borderRadiusAnim,
              overflow: "hidden",
              width: screenWidth,
              height: screenWidth * 0.95,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Image
              source={{
                uri: selectedPhotoUri as string,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </Animated.View>
        </Animated.View>

        {/* 내용 박스 */}
        <Animated.View
          style={{
            transform: [{ translateY: contentTranslateY }],
            marginTop: screenWidth * 0.9,
          }}
          className="h-[500px]"
        >
          <View className="bg-white h-full rounded-2xl p-5 shadow-md shadow-black/20">
            <Text className="text-lg font-bold">
              Candidate Biden Called Saudi
            </Text>
            <Text className="mt-2 text-gray-600">
              Capture the beauty that catches your eye with a mirrorless
              camera...
            </Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
