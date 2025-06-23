import { useLocalSearchParams } from "expo-router";
import { useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import MemoEditModal from "@/components/Modals/MemoEditModal";
import { useGetMemos } from "@/hooks/useGetMemos";
import { getDates } from "@/utils/getDates";
import { MemoDocData } from "@/types";

const HEADER_HEIGHT = 300;

export default function Memo() {
  const {
    selectedPhotoUri,
    selectedPhotoCreatedAt,
    selectedPhotoId,
    photoDocId,
  } = useLocalSearchParams();
  const [showMemoModal, setShowMemoModal] = useState(false);
  const {
    data: memoData,
    isLoading,
    isFetching,
  } = useGetMemos(selectedPhotoId as string, photoDocId as string);
  const scrollY = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  // 애니메이션을 위한 값들
  const borderRadiusAnim = useRef(
    new Animated.Value(screenWidth * 0.475)
  ).current; // 초기값: 화면 너비의 절반 (rounded-full)
  const scaleAnim = useRef(new Animated.Value(0.9)).current; // 초기값: 작은 크기
  const { year, month, day, weekday } = getDates(
    (memoData?.[0]?.date as string) || (selectedPhotoCreatedAt as string)
  );
  const monthName = [
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
  ][month - 1];

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
    inputRange: [0, screenWidth * 0.6],
    outputRange: [1, 0], // 완전히 보임 -> 30% 투명도
    extrapolate: "clamp",
  });

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    if (rating === 0) {
      return (
        <View className="flex-row items-center">
          <MaterialIcons name="star-border" size={16} color="#E0E0E0" />
          <Text className="text-gray-400 text-sm ml-1">평가 없음</Text>
        </View>
      );
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MaterialIcons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialIcons
          key={`empty-${i}`}
          name="star-border"
          size={16}
          color="#E0E0E0"
        />
      );
    }

    return stars;
  };

  const handleSaveMemo = () => {
    setShowMemoModal(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleOpenMemoEdit = () => {
    setShowMemoModal(true);
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <View className="flex-1 h-full relative">
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
              transform: [
                { translateY: imageTranslateY },
                { scale: scaleAnim },
              ],
              width: screenWidth,
              height: screenWidth * 1.2,
              opacity: imageOpacity,
            }}
            className="absolute z-[-1] items-center justify-center"
          >
            <Animated.View
              style={{
                borderRadius: borderRadiusAnim,
                overflow: "hidden",
                width: screenWidth,
                height: screenWidth * 1.15,
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

              {/* 상단 헤더 버튼들 */}
              <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 pt-4 pb-4">
                {/* 뒤로가기 버튼 */}
                <TouchableOpacity
                  onPress={handleGoBack}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-sm"
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>

                {/* 메모 편집 버튼 */}
                <TouchableOpacity
                  onPress={handleOpenMemoEdit}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-sm"
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="edit" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* 사진 위 오버레이 정보 */}
              <View className="absolute mb-4 py-6 px-3 bottom-0 items-start">
                {/* 상단 카테고리 */}
                {memoData?.[0]?.category ? (
                  <View className="bg-black/30 px-3 py-[6px] rounded-xl backdrop-blur-sm mb-1">
                    <Text className="text-white font-semibold text-sm">
                      {memoData?.[0]?.category}
                    </Text>
                  </View>
                ) : (
                  <View className="bg-black/30 px-3 py-[6px] rounded-xl backdrop-blur-sm mb-1">
                    <Text className="text-white font-semibold text-sm">
                      카테고리 없음
                    </Text>
                  </View>
                )}
                {/* 하단 날짜 정보 */}
                <View className="bg-white/40 px-4 py-[6px] backdrop-blur-sm mb-2">
                  <Text className="text-3xl font-bold text-gray-900 mb-1">
                    {day} {weekday}
                  </Text>
                  <Text className="text-lg text-gray-800">
                    {monthName}, {year}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </Animated.View>

          <>
            {/* 내용 박스 */}
            <Animated.View
              style={{
                transform: [{ translateY: contentTranslateY }],
                marginTop: screenWidth * 1.1,
              }}
              className="h-[500px]"
            >
              <View
                className="bg-white h-full rounded-3xl p-5 shadow-md shadow-black/20"
                style={{
                  shadowOffset: { width: 0, height: -40 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                }}
              >
                {isLoading || isFetching ? (
                  <View className="mt-10 items-center justify-center">
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text className="mt-3 text-gray-700 font-medium">
                      메모를 불러오는 중...
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* 장소와 별점 정보 */}
                    <View className="space-x-2 flex-row justify-between pb-2 mb-1">
                      {/* 장소 정보 */}
                      {memoData?.[0]?.location ? (
                        <View className="rounded-xl backdrop-blur-sm flex-row items-center">
                          <MaterialIcons
                            name="location-on"
                            size={14}
                            color="#122e26"
                          />
                          <Text className="text-[#122e26] font-medium text-base font-dohyeon ml-1">
                            {memoData?.[0]?.location}
                          </Text>
                        </View>
                      ) : (
                        <View className="rounded-xl backdrop-blur-sm flex-row items-center">
                          <MaterialIcons
                            name="location-off"
                            size={14}
                            color="#9CA3AF"
                          />
                          <Text className="text-gray-400 font-medium text-base font-dohyeon ml-1">
                            위치 정보 없음
                          </Text>
                        </View>
                      )}

                      {/* 별점 정보 */}
                      <View className="py-2 rounded-xl backdrop-blur-sm flex-row items-center">
                        {renderStars(memoData?.[0]?.rating || 0)}
                      </View>
                    </View>

                    {/* 해시태그 섹션 */}
                    {memoData?.[0]?.hashtags &&
                    memoData?.[0]?.hashtags.length > 0 ? (
                      <View className="mb-4">
                        <View className="flex-row flex-wrap">
                          {memoData?.[0]?.hashtags.map((tag, index) => (
                            <View
                              key={index}
                              className="bg-[#e3e9e7] border border-blue-100 px-3 py-1.5 rounded-full mr-2 mb-2"
                            >
                              <Text className="text-[#122e26] font-medium text-sm -skew-x-12">
                                {tag}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View className="mb-4">
                        <View className="flex-row flex-wrap">
                          <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                            <Text className="text-gray-400 font-medium text-sm">
                              태그 없음
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* 메모 내용 */}
                    {memoData?.[0]?.memo ? (
                      <View className="border-t-[1px] border-gray-200 pt-4">
                        <Text className="text-xl font-bold text-gray-900 mb-3">
                          {memoData?.[0]?.title}
                        </Text>
                        <Text className="text-gray-600 text-base leading-relaxed mb-4">
                          {memoData?.[0]?.memo}
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <MaterialIcons
                          name="note-add"
                          size={48}
                          color="#E5E7EB"
                        />
                        <Text className="text-gray-400 mt-2 text-base">
                          메모를 작성해보세요
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </Animated.View>
          </>
        </Animated.ScrollView>
      </View>
      <MemoEditModal
        showMemoModal={showMemoModal}
        setShowMemoModal={setShowMemoModal}
        photoDocId={photoDocId as string}
        photoId={selectedPhotoId as string}
        memoData={memoData?.[0]}
      />
    </SafeAreaView>
  );
}
