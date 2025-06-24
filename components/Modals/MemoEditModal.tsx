import { useState, useRef, useEffect, createRef } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CategorySelects, {
  CATEGORIES,
  CategoryIconName,
} from "../Box/CategorySelects";
import DateSelect from "../Box/DateSelect";
import { useCreateMemo, useUpdateMemo } from "@/hooks/useGetMemos";
import { MemoDocData } from "@/types";

interface MemoEditModalProps {
  showMemoModal: boolean;
  setShowMemoModal: (show: boolean) => void;
  photoDocId: string;
  photoId: string;
  memoData: MemoDocData | undefined;
}

export default function MemoEditModal({
  showMemoModal,
  setShowMemoModal,
  photoDocId,
  photoId,
  memoData,
}: MemoEditModalProps) {
  const [category, setCategory] = useState(memoData?.category || "Health");
  const [location, setLocation] = useState(memoData?.location || "");
  const [rating, setRating] = useState(memoData?.rating || 0);
  const [title, setTitle] = useState(memoData?.title || "");
  const [content, setContent] = useState(memoData?.memo || "");
  const [tags, setTags] = useState<string[]>(memoData?.hashtags || []);
  const [tagInput, setTagInput] = useState("");
  const [showCategoryBox, setShowCategoryBox] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // 0: 닫힘, 1: 열림
  const pan = useRef(new Animated.Value(0)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    memoData?.date ? new Date(memoData.date) : new Date()
  );
  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(selectedDate.getMonth() + 1);
  const [tempDay, setTempDay] = useState(selectedDate.getDate());
  const { mutate: createMemoMutate } = useCreateMemo(photoDocId, photoId);
  const { mutate: updateMemoMutate } = useUpdateMemo(photoDocId, photoId);
  const starRefs = useRef(Array.from({ length: 5 }, () => createRef<View>()));

  useEffect(() => {
    if (memoData) {
      setSelectedDate(new Date(memoData.date));
      setCategory(memoData.category);
      setLocation(memoData.location);
      setRating(memoData.rating);
      setTitle(memoData.title);
      setContent(memoData.memo);
      setTags(memoData.hashtags);
    }
  }, [memoData]);

  // 열기
  const openCategoryBox = () => {
    setShowCategoryBox(true);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
    setTempYear(selectedDate.getFullYear());
    setTempMonth(selectedDate.getMonth() + 1);
    setTempDay(selectedDate.getDate());
    slideAnim.setValue(0);
    pan.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSaveMemo = () => {
    // 여기서 데이터 저장 로직 구현
    if (memoData) {
      updateMemoMutate({
        memoId: memoData.id,
        memoData: {
          photoId,
          category,
          date: selectedDate.toISOString(),
          location,
          rating,
          title,
          memo: content,
          hashtags: tags,
        },
      });
    } else {
      createMemoMutate({
        photoId,
        category,
        date: selectedDate.toISOString(),
        location,
        rating,
        title,
        memo: content,
        hashtags: tags,
      });
    }
    setShowMemoModal(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputSubmit = () => {
    handleAddTag();
  };

  // 별점 렌더링 및 선택 함수
  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(rating);
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
      stars.push(
        <Pressable
          key={i}
          onPress={(e) => {
            // width를 ref로 측정
            starRefs.current[i - 1]?.current?.measure(
              (x, y, width, height, pageX, pageY) => {
                const { locationX } = e.nativeEvent;
                if (locationX < width / 2) {
                  setRating(i - 0.5);
                } else {
                  setRating(i);
                }
              }
            );
          }}
          style={{ padding: 4 }}
        >
          <View ref={starRefs.current[i - 1]}>
            <MaterialIcons
              name={isFilled ? "star" : isHalf ? "star-half" : "star-border"}
              size={28}
              color="#FFD700"
            />
          </View>
        </Pressable>
      );
    }
    return stars;
  };

  // 날짜 포맷 함수
  function formatDate(date: Date) {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 (${days[date.getDay()]})`;
  }

  return (
    <Modal
      visible={showMemoModal}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={100}
        enableAutomaticScroll={true}
        bounces={false}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <TouchableOpacity
              onPress={() => setShowMemoModal(false)}
              className="p-2 -ml-2"
            >
              <Text className="text-blue-500 font-medium">취소</Text>
            </TouchableOpacity>

            <Text className="text-lg font-semibold text-gray-900">
              메모 편집
            </Text>

            <TouchableOpacity onPress={handleSaveMemo} className="p-2 -mr-2">
              <Text className="text-blue-500 font-medium">저장</Text>
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            className="flex-1 p-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* 카테고리 섹션 */}
            <View style={{ marginBottom: 24 }}>
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                카테고리
              </Text>
              <TouchableOpacity
                onPress={openCategoryBox}
                className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 justify-between"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name={
                      (CATEGORIES.find((c) => c.name === category)
                        ?.icon as CategoryIconName) || "category"
                    }
                    size={20}
                    color="#6B7280"
                  />
                  <Text style={{ marginLeft: 12, fontSize: 16, color: "#222" }}>
                    {category}
                  </Text>
                </View>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* 날짜 섹션 */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                날짜
              </Text>
              <TouchableOpacity
                onPress={openDatePicker}
                className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 justify-between"
                activeOpacity={0.8}
              >
                <Text className="text-base text-gray-900">
                  {formatDate(selectedDate)}
                </Text>
                <MaterialIcons
                  name="calendar-today"
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* 장소 섹션 */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                장소
              </Text>
              <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <MaterialIcons name="location-on" size={20} color="#6B7280" />
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="장소를 입력하세요"
                  className="flex-1 ml-3 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* 별점 섹션 */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                별점
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    {renderInteractiveStars()}
                  </View>
                  <Text className="text-gray-700 font-medium text-lg ml-3">
                    {rating.toFixed(1)}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-2">
                  별을 터치하여 평점을 선택하세요
                </Text>
              </View>
            </View>

            {/* 제목 섹션 */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                제목
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="제목을 입력하세요"
                className="p-4 bg-gray-50 rounded-2xl text-base border border-gray-200"
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>

            {/* 내용 섹션 */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                내용
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="소중한 순간에 대한 이야기를 적어보세요..."
                multiline
                className="p-4 bg-gray-50 rounded-2xl text-base leading-relaxed border border-gray-200"
                style={{
                  textAlignVertical: "top",
                  minHeight: 120,
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* 태그 섹션 */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base">
                태그
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center">
                  <MaterialIcons name="local-offer" size={20} color="#6B7280" />
                  <TextInput
                    value={tagInput}
                    onChangeText={setTagInput}
                    placeholder="태그를 입력하고 엔터를 누르세요"
                    className="flex-1 ml-3 text-base"
                    placeholderTextColor="#9CA3AF"
                    onSubmitEditing={handleTagInputSubmit}
                    returnKeyType="done"
                  />
                </View>

                {/* 태그 목록 */}
                <View className="flex-row flex-wrap mt-3">
                  {tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-[#e3e9e7] border border-blue-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center"
                    >
                      <Text className="text-[#122e26] font-medium text-sm -skew-x-12">
                        {tag}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveTag(tag)}
                        className="ml-2"
                      >
                        <MaterialIcons name="close" size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* 하단 여백 */}
            <View className="h-6" />
          </ScrollView>

          {/* 하단 카테고리 박스 */}
          {showCategoryBox && (
            <CategorySelects
              setShowCategoryBox={setShowCategoryBox}
              category={category}
              setCategory={setCategory}
            />
          )}

          {/* 날짜 선택 하단 모달 */}
          {showDatePicker && (
            <DateSelect
              setShowDatePicker={setShowDatePicker}
              pan={pan}
              slideAnim={slideAnim}
              tempYear={tempYear}
              setTempYear={setTempYear}
              tempMonth={tempMonth}
              setTempMonth={setTempMonth}
              tempDay={tempDay}
              setTempDay={setTempDay}
              setSelectedDate={setSelectedDate}
            />
          )}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
