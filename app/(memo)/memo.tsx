import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
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
  const screenHeight = Dimensions.get("window").height;
  const scrollY = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;

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
            transform: [{ translateY: imageTranslateY }],
            width: screenWidth,
            height: screenWidth * 0.95,
          }}
          className="absolute z-[-1]"
        >
          <Image
            source={{
              uri: selectedPhotoUri as string,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
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
