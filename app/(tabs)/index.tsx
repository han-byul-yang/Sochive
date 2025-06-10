import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useMemo, useRef, useEffect } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import BackgroundSelects from "@/components/BackgroundSelects";
import {
  getImageSize,
  getScreenshot,
  pickMultipleImages,
  saveImagePermanently,
  saveScreenshot,
} from "@/utils/getPhotos";
import DatePickerModal from "@/components/Modals/DatePickerModal";
import { MONTH_EMOJIS, MONTHS } from "@/constants/Months";
import ResizeRotateHandle from "@/components/ResizeRotateHandle";
import PhotoActionSheet from "@/components/PhotoActionSheet";
import CropPhotoModal from "@/components/Modals/CropPhotoModal";
import FilterSelects from "@/components/FilterSelects";
import FilteredImage from "@/components/Filters";
import useAuth from "@/contexts/AuthContext";
import { serverTimestamp } from "firebase/firestore";
import { Photo } from "@/types";
import {
  useGetPhotos,
  useCreatePhoto,
  useUpdatePhoto,
} from "@/hooks/useGetPhotos";
import PhotoModal from "@/components/Modals/PhotoModal";
import MemoEditModal from "@/components/Modals/MemoEditModal";
import { cloneDeep, isEqual } from "lodash";
import { resizeByMaxDimension } from "@/utils/photoManipulation";
import { captureRef } from "react-native-view-shot";
import DrawingPalette from "@/components/DrawingPalette";
import { Point } from "react-native-gesture-handler/lib/typescript/web/interfaces";
import DrawingModal from "@/components/Modals/DrawingModal";
import { useGetDrawings } from "@/hooks/useGetDrawings";
import { Canvas } from "@shopify/react-native-skia";
import DrawingCanvas from "@/components/Archive/DrawingCanvas";
import { router } from "expo-router";

export default function ArchiveScreen() {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [resetPhotos, setResetPhotos] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("hot");
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [resizeMode, setResizeMode] = useState<"none" | "resize-rotate">(
    "none"
  );
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const actionSheetAnim = useRef(new Animated.Value(0)).current;

  // 콜라주 영역 크기 참조
  const collageAreaRef = useRef<View>(null);
  const [collageAreaSize, setCollageAreaSize] = useState({
    width: 0,
    height: 0,
  });
  const [collageAreaBounds, setCollageAreaBounds] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const currentDate = new Date();
  const [originalUri, setOriginalUri] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const {
    data: photos,
    isLoading: isPhotosLoading,
    error,
  } = useGetPhotos(selectedMonth, selectedYear);
  const { mutate: createPhotoMutate } = useCreatePhoto(
    selectedMonth,
    selectedYear
  );
  const { mutate: updatePhotoMutate } = useUpdatePhoto(
    selectedMonth,
    selectedYear
  );
  const { data: drawingsData } = useGetDrawings(selectedMonth, selectedYear);

  // 월 이름 가져오기 함수 추가
  const getMonthName = (month: number) => MONTHS[month - 1];
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (mode === "edit") {
      return;
    }

    const serverPhotos = photos?.[0]?.photos || [];
    const serverBackground = photos?.[0]?.background || null;
    // 깊은 복사 및 비교
    const deepCopiedServerPhotos = cloneDeep(serverPhotos);
    const deepCopiedSelectedPhotos = cloneDeep(selectedPhotos);

    // 현재 상태와 서버 데이터가 다를 경우에만 업데이트
    if (!isEqual(deepCopiedServerPhotos, deepCopiedSelectedPhotos)) {
      setSelectedPhotos(deepCopiedServerPhotos);
    }
    if (serverBackground !== selectedBackground) {
      console.log(serverBackground, selectedBackground);
      setSelectedBackground(serverBackground);
    }
  }, [photos]);

  useEffect(() => {
    console.log(selectedBackground, "selectedBackground");
  }, [selectedBackground]);

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
  useEffect(() => {
    if (resetPhotos) {
      setSelectedPhotos(photos?.[0]?.photos || []);
      setSelectedBackground(photos?.[0]?.background || null);
      setResetPhotos(false);
    }
  }, [resetPhotos]);

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

  const handleFilterPhoto = () => {
    toggleFilterPicker(true);
    toggleActionSheet(false);
  };

  useEffect(() => {
    toggleMode(mode);
  }, [mode]);

  const handleModeToggle = () => {
    setMode(mode === "edit" ? "read" : "edit");
    if (mode === "edit") {
      setShowActionSheet(false);
    }
  };

  // 모드 전환 애니메이션
  const toggleMode = (newMode: "read" | "edit") => {
    Animated.timing(fadeAnim, {
      toValue: newMode === "edit" ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    if (newMode === "read") {
      setResetPhotos(true);
    }

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

      // 현재 최대 z-index 찾기
      const maxZ =
        selectedPhotos.length > 0
          ? Math.max(...selectedPhotos.map((p) => p.zIndex))
          : 0;

      // 새 z-index 기준값 설정 (현재 최대값보다 100 더 높게 설정)
      const baseZIndex = maxZ + 100;

      const savedPaths = await Promise.all(
        result.assets.map(async (asset) => {
          const savedPath = await saveImagePermanently(asset.uri);
          const { width, height } = await getImageSize(savedPath);
          return { uri: savedPath, width, height };
        })
      );

      const newPhotos = savedPaths.map((asset, index) => {
        // 중앙에서 약간 랜덤하게 위치 조정
        const randomOffsetX = Math.random() * 60 - 30;
        const randomOffsetY = Math.random() * 60 - 30;
        const randomRotation = Math.random() * 20 - 10; // -10도 ~ 10도 회전

        return {
          uri: asset.uri,
          originalUri: asset.uri,
          width: asset.width,
          height: asset.height,
          position: {
            x: centerX + randomOffsetX,
            y: centerY + randomOffsetY,
          },
          zIndex: baseZIndex + index, // 기존 최대값보다 훨씬 높은 z-index 부여
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

        // 사진 선택 시 액션 시트 표시
        toggleActionSheet(true);
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

  // 크기 조절 및 회전을 위한 PanResponder 생성 함수
  const createResizeRotatePanResponder = (index: number) => {
    // 현재 회전 및 크기 값을 저장할 변수
    let currentRotation = 0;
    let currentScale = 1;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (activePhotoIndex === index) {
          const photo = selectedPhotos[index];

          // 현재 사진의 회전 및 크기 값 저장
          currentRotation = photo.rotation;
          currentScale = photo.scale;

          // 사진의 중심점 계산
          const centerX = photo.position.x + 90; // 180/2
          const centerY = photo.position.y + 90; // 180/2

          // 핸들의 위치 계산 (오른쪽 하단 코너)
          // 현재 회전과 크기를 고려하여 핸들 위치 계산
          const handleOffsetX = 90 * photo.scale; // 180/2 * scale
          const handleOffsetY = 90 * photo.scale; // 180/2 * scale

          // 회전 각도를 라디안으로 변환
          const rotationRad = photo.rotation * (Math.PI / 180);

          // 회전을 고려한 핸들 위치 계산
          const rotatedX =
            handleOffsetX * Math.cos(rotationRad) -
            handleOffsetY * Math.sin(rotationRad);
          const rotatedY =
            handleOffsetX * Math.sin(rotationRad) +
            handleOffsetY * Math.cos(rotationRad);

          const handleX = centerX + rotatedX;
          const handleY = centerY + rotatedY;

          // 드래그 시작 정보 저장
          dragStartRef.current = {
            x: handleX,
            y: handleY,
            centerX: centerX,
            centerY: centerY,
            initialRotation: photo.rotation,
            initialScale: photo.scale,
          };

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

          // 초기 각도에서 상대적인 변화를 계산
          // 핸들을 처음 잡았을 때의 각도를 기준으로 변화량 계산
          const initialAngle =
            Math.atan2(
              dragStartRef.current.y - dragStartRef.current.centerY,
              dragStartRef.current.x - dragStartRef.current.centerX
            ) *
            (180 / Math.PI);

          // 각도 변화량 계산
          const angleDelta = degrees - initialAngle;

          // 초기 회전 각도에 변화량을 더함
          const newRotation = dragStartRef.current.initialRotation + angleDelta;

          // 중심점과 드래그 포인트 사이의 거리 계산
          const distance = Math.sqrt(
            Math.pow(vectorX, 2) + Math.pow(vectorY, 2)
          );

          // 초기 거리 계산 (초기 크기에 기반)
          const initialDistance =
            90 * Math.sqrt(2) * dragStartRef.current.initialScale;

          // 크기 조절 (초기 크기에 상대적인 비율로 계산)
          const scaleFactor = distance / initialDistance;
          const newScale = Math.max(
            0.5,
            Math.min(2.0, dragStartRef.current.initialScale * scaleFactor)
          );

          // 현재 값 업데이트
          currentRotation = newRotation;
          currentScale = newScale;

          // 애니메이션 값 업데이트 - 실시간으로 UI 반영
          photoAnimations[index].rotation.setValue(newRotation);
          photoAnimations[index].scale.setValue(newScale);
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
      // 액션 시트 닫기
      toggleActionSheet(false);
    }
  };

  // 사진 삭제 함수 추가
  const handleDeletePhoto = (index: number) => {
    // 애니메이션 값 정리
    if (photoAnimations[index]) {
      photoAnimations[index].rotation.setValue(0);
      photoAnimations[index].scale.setValue(1);
    }

    // 선택된 사진 배열에서 해당 인덱스 제거
    setSelectedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos.splice(index, 1);
      return newPhotos;
    });

    // 활성 사진 인덱스 초기화
    setActivePhotoIndex(null);
  };

  // 액션 시트 표시/숨김 함수
  const toggleActionSheet = (show: boolean) => {
    setShowActionSheet(show);
    Animated.timing(actionSheetAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 사진 클릭 핸들러 수정
  const handlePhotoPress = (index: number) => {
    if (mode === "edit") {
      // 편집 모드일 때만 기존 동작 유지
      setActivePhotoIndex(index);

      // 최대 z-index 찾기
      const maxZ = Math.max(...selectedPhotos.map((p) => p.zIndex));

      // 선택된 사진의 z-index를 최대값 + 1로 설정
      setSelectedPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos];
        newPhotos[index].zIndex = maxZ + 1;
        return newPhotos;
      });

      toggleActionSheet(true);
    } else {
      // 읽기 모드일 때는 사진 모달만 표시
      setActivePhotoIndex(index);
      router.push({
        pathname: "/(memo)/memo",
        params: {
          selectedPhotoUri: selectedPhotos[index].originalUri,
          selectedPhotoMemo: selectedPhotos[index]?.memo,
        },
      });
      //setShowPhotoModal(true);
    }
  };

  // 사진 자르기 핸들러
  const handleCropPhoto = () => {
    setShowCropModal(true);
    toggleActionSheet(false);
  };

  // 자른 이미지 저장 핸들러 수정
  const handleSaveCroppedImage = (
    croppedImageUri: string,
    touchPoints: Point[]
  ) => {
    if (activePhotoIndex !== null) {
      // 크롭된 이미지의 크기 가져오기
      Image.getSize(croppedImageUri, (width, height) => {
        const updatedPhotos = [...selectedPhotos];
        updatedPhotos[activePhotoIndex] = {
          ...updatedPhotos[activePhotoIndex],
          uri: croppedImageUri,
          // 크롭된 이미지의 실제 크기 저장
          width: width,
          height: height,
          touchPoints: touchPoints,
        };
        setSelectedPhotos(updatedPhotos);
        setOriginalUri(false);
      });
    }
  };

  // 필터 관련 상태 추가
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [activeFilterCategory, setActiveFilterCategory] =
    useState<string>("basic");
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const filterPickerAnim = useRef(new Animated.Value(0)).current;

  // 필터 선택기 토글 함수 수정
  const toggleFilterPicker = (show?: boolean) => {
    const newValue = show !== undefined ? show : !showFilterPicker;
    setShowFilterPicker(newValue);

    Animated.timing(filterPickerAnim, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // 필터 선택기가 열릴 때 액션 시트 닫기
    if (newValue) {
      toggleActionSheet(false);
    }
  };

  // 필터 적용 함수 수정
  const applyFilter = (filterId: string) => {
    if (activePhotoIndex === null) return;
    try {
      // 선택된 사진에 필터 적용
      const updatedPhotos = [...selectedPhotos];
      updatedPhotos[activePhotoIndex] = {
        ...updatedPhotos[activePhotoIndex],
        filter: filterId, // 필터 ID 저장
      };
      setSelectedPhotos(updatedPhotos);
      setSelectedFilter(filterId);
    } catch (error) {
      console.error("필터 적용 오류:", error);
      // 오류 발생 시 기본 상태로 복원
      toggleFilterPicker(false);
    }
  };

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePhotos = async () => {
    if (!user || selectedPhotos.length === 0) return;

    try {
      setIsSaving(true);

      // 현재 선택된 월과 년도 정보
      const currentMonth = selectedMonth;
      const currentYear = selectedYear;

      // 저장할 데이터 구성
      const photoData = {
        photos: selectedPhotos,
        month: currentMonth, // 1~12 숫자로 저장
        year: currentYear,
        background: selectedBackground,
        createdAt: serverTimestamp(),
      };
      // Firestore에 저장
      createPhotoMutate(photoData);
      // 저장 성공 메시지 또는 액션
      Alert.alert("저장 완료", "콜라주가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("콜라주 저장 오류:", error);
      Alert.alert("저장 실패", "콜라주 저장 중 오류가 발생했습니다.");
    } finally {
      handleModeToggle();
      setIsSaving(false);
    }
  };

  const handleEditPhotos = () => {
    try {
      setIsSaving(true);
      updatePhotoMutate({
        photoData: {
          photos: selectedPhotos,
          background: selectedBackground,
        },
        photoId: photos?.[0]?.id || "",
      });
      Alert.alert("수정 완료", "콜라주가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error(error);
      Alert.alert("수정 실패", "콜라주 수정 중 오류가 발생했습니다.");
    } finally {
      handleModeToggle();
      setIsSaving(false);
    }
  };

  // 상태 변수 추가 (약 60-65줄)
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [editingMemoIndex, setEditingMemoIndex] = useState<number | null>(null);
  const [screenshotUri, setScreenshotUri] = useState<string | undefined>(
    undefined
  );

  // 사진 모달 닫기 핸들러
  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setActivePhotoIndex(null);
  };

  // 메모 관련 상태 추가
  const handleEditMemo = (index: number) => {
    setEditingMemoIndex(index);
    setMemoText(selectedPhotos[index]?.memo || "");
    setShowMemoModal(true);
  };

  const handleSaveMemo = () => {
    if (editingMemoIndex !== null) {
      const updatedPhotos = [...selectedPhotos];
      updatedPhotos[editingMemoIndex] = {
        ...updatedPhotos[editingMemoIndex],
        memo: memoText,
      };
      setSelectedPhotos(updatedPhotos);
      try {
        updatePhotoMutate({
          photoData: {
            photos: updatedPhotos,
          },
          photoId: photos?.[0]?.id || "",
        });
        Alert.alert("수정 완료", "메모가 성공적으로 수정되었습니다.");
      } catch (error) {
        console.error(error);
        Alert.alert("수정 실패", "메모 수정 중 오류가 발생했습니다.");
      } finally {
        setShowMemoModal(false);
      }
    }
  };

  const handleOriginalChange = () => {
    setOriginalUri(true);
  };

  const handleSaveScreenshot = async () => {
    saveScreenshot(mainContentRef);
  };

  // 그리기 관련 상태 추가
  const [showDrawingPalette, setShowDrawingPalette] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingPaletteAnim] = useState(new Animated.Value(0));
  const [penColor, setPenColor] = useState("#7ED957");
  const [penSize, setPenSize] = useState(33);
  const [penOpacity, setPenOpacity] = useState(1);
  const [penType, setPenType] = useState("normal");
  const [isClickedPencil, setIsClickedPencil] = useState(false);

  // 그리기 모드 토글 함수
  const toggleDrawingPalette = (show: boolean) => {
    console.log("Toggling drawing palette:", show); // 디버깅을 위한 로그 추가
    setShowDrawingPalette(show);
    Animated.timing(drawingPaletteAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 확인 버튼 핸들러
  const handleDrawingConfirm = () => {
    toggleDrawingPalette(false);
    setIsDrawingMode(true); // 캔버스 활성화
  };

  // 그리기 완료 핸들러
  const handleDrawingComplete = (paths: any[]) => {
    console.log("Drawing completed with paths:", paths);
    setIsDrawingMode(false); // 그리기 모드 비활성화
  };

  useEffect(() => {
    const runScreenshot = async () => {
      if (mode === "read" && isClickedPencil) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const uri = await getScreenshot(mainContentRef);
          setScreenshotUri(uri);
        } catch (error) {
          console.error(error);
        } finally {
          setIsClickedPencil(false);
          setShowDrawingModal(true);
        }
      }
    };

    runScreenshot();
  }, [mode]);

  const handleOpenPencilMode = async () => {
    setMode("read");
    setIsClickedPencil(true);
  };

  const handleSaveDrawing = () => {
    // 그리기 저장 로직 구현
    setShowDrawingModal(false);
  };

  // 상태 추가
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);

  const handleCloseCanvas = () => {
    console.log("close canvas");
    setShowCanvas(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* 로딩 인디케이터 */}
      {isPhotosLoading && (
        <View
          className="absolute inset-0 h-full w-full bg-transparent items-center justify-center z-50"
          style={{ elevation: 5 }}
        >
          <View className="bg-white p-5 rounded-xl items-center">
            <ActivityIndicator size="large" color="#3498db" />
            <Text className="mt-3 text-gray-700 font-medium">
              사진을 불러오는 중...
            </Text>
          </View>
        </View>
      )}

      <View className="flex-1 relative">
        {/* Header */}
        <TouchableWithoutFeedback onPress={() => toggleActionSheet(false)}>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.9}
              className="flex-row items-center"
            >
              <View className="flex-row items-center">
                <ThemedText className="text-2xl font-dohyeon text-key">
                  {getMonthName(selectedMonth)}
                </ThemedText>
                <Image
                  source={{ uri: MONTH_EMOJIS[getMonthName(selectedMonth)] }}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
                <ThemedText className="text-xl font-gaegu text-gray-400 ml-2">
                  {selectedYear}
                </ThemedText>
                <IconSymbol
                  name="chevron.right"
                  size={18}
                  color="#3D3D3D"
                  style={{
                    transform: [{ rotate: "90deg" }],
                    marginLeft: 8,
                  }}
                />
              </View>
            </TouchableOpacity>

            {/* Header Right Buttons */}
            <View className="flex-row items-center space-x-2">
              {/* Save Button (Edit Mode Only) */}
              {mode === "edit" && (
                <TouchableOpacity
                  onPress={
                    photos && photos.length > 0
                      ? handleEditPhotos
                      : handleSavePhotos
                  }
                  className="bg-[#DA6C6C] px-4 py-2 rounded-lg"
                  activeOpacity={0.9}
                  disabled={isSaving || selectedPhotos.length === 0}
                  style={{
                    opacity: isSaving || selectedPhotos.length === 0 ? 0.5 : 1,
                  }}
                >
                  <Text className="text-white font-medium">
                    {isSaving ? "저장 중..." : "저장"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Mode Toggle Button */}
              <TouchableOpacity
                onPress={handleModeToggle}
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
              <TouchableOpacity
                onPress={handleSaveScreenshot}
                activeOpacity={0.9}
                className={`p-[8px] rounded-full bg-gray-100`}
              >
                <IconSymbol
                  name="photo.on.rectangle"
                  size={22}
                  color="#3D3D3D"
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={handleOpenPencilMode}
                activeOpacity={0.9}
                className={`p-[8px] rounded-full bg-gray-100`}
                style={{
                  elevation: 5,
                  zIndex: 10000, // 다른 요소들보다 위에 표시되도록 zIndex 설정
                }}
              >
                <IconSymbol
                  name="pencil.and.ellipsis.rectangle"
                  size={22}
                  color="#3D3D3D"
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </TouchableWithoutFeedback>

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
            key={selectedBackground}
            source={
              selectedBackground ? { uri: selectedBackground } : undefined
            }
            className="flex-1 w-full h-full"
            imageStyle={{ opacity: 0.7 }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleBackgroundTap}
              style={{ flex: 1 }}
            >
              {/* Edit Mode Controls with Animation */}
              <Animated.View
                className="relative mb-4 z-[10001] mr-4 mt-2"
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
                  height: 40, // 버튼 컨테이너 높이 설정
                }}
              >
                {/* Background Button */}
                <TouchableOpacity
                  className="absolute right-12 bg-gray-100 p-[8px] rounded-full"
                  activeOpacity={0.9}
                  onPress={toggleBackgroundPicker}
                  style={{
                    elevation: 5, // Android에서 z-index 효과를 위해 추가
                  }}
                >
                  <IconSymbol
                    name="photo.on.rectangle"
                    size={24}
                    color="#3D3D3D"
                  />
                </TouchableOpacity>

                {/* Pencil Button - 새로 추가 */}
                <TouchableOpacity
                  className="absolute right-24 bg-gray-100 p-[8px] rounded-full"
                  activeOpacity={0.9}
                  onPress={handleOpenPencilMode}
                  style={{
                    elevation: 5, // Android에서 z-index 효과를 위해 추가
                  }}
                >
                  <IconSymbol name="pencil" size={24} color="#3D3D3D" />
                </TouchableOpacity>

                {/* Camera Button */}
                <TouchableOpacity
                  className="absolute right-0 bg-gray-100 p-[8px] rounded-full"
                  activeOpacity={0.9}
                  onPress={handlePickImages}
                  style={{
                    elevation: 5, // Android에서 z-index 효과를 위해 추가
                  }}
                >
                  <IconSymbol name="camera" size={24} color="#3D3D3D" />
                </TouchableOpacity>
              </Animated.View>

              {/* DrawingCanvas 컴포넌트 추가 */}
              {drawingsData && drawingsData.length > 0 && !isClickedPencil && (
                <>
                  <View
                    pointerEvents="none"
                    className="flex-1 absolute top-0 left-0 right-0 bottom-0 z-[10000] bg-transparent"
                  >
                    <Canvas style={{ flex: 1 }}>
                      {drawingsData[0].drawing.map(
                        (drawing: any, index: number) => (
                          <DrawingCanvas
                            key={index}
                            path={drawing}
                            index={index}
                          />
                        )
                      )}
                    </Canvas>
                  </View>
                </>
              )}

              {/* Collage Area */}
              <View
                ref={collageAreaRef}
                className={`bg-white/90 rounded-2xl relative ${
                  selectedPhotos.length > 0 ? "bg-transparent" : "bg-white/80"
                }`}
                style={{
                  height: 200,
                  zIndex: 1000,
                  elevation: 5,
                }}
                onLayout={(event) => {
                  const { width, height, x, y } = event.nativeEvent.layout;
                  setCollageAreaSize({ width, height });

                  // 콜라주 영역의 절대 위치 측정
                  if (collageAreaRef.current) {
                    collageAreaRef.current.measure(
                      (fx, fy, width, height, px, py) => {
                        setCollageAreaBounds({
                          x: px,
                          y: py,
                          width,
                          height,
                        });
                      }
                    );
                  }
                }}
              >
                {selectedPhotos.length > 0 ? (
                  <View className="w-full h-full">
                    {selectedPhotos.map((photo, index) => {
                      const panResponder = createPanResponder(index);
                      const resizeRotatePanResponder =
                        createResizeRotatePanResponder(index);
                      const isActive = activePhotoIndex === index;
                      const { width, height } = resizeByMaxDimension(
                        photo.width || 0,
                        photo.height || 0
                      );
                      return (
                        <View
                          key={index}
                          className="absolute"
                          style={{
                            width: width || 160,
                            height: height || 160,
                            left: photo.position.x,
                            top: photo.position.y,
                            zIndex: photo.zIndex,
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPressOut={() => handlePhotoPress(index)}
                          >
                            <Animated.View
                              {...(mode === "edit"
                                ? panResponder.panHandlers
                                : {})}
                              className="w-full h-full rounded-lg overflow-hidden"
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
                                width: width || 160,
                                height: height || 160,
                                borderWidth:
                                  isActive && mode === "edit" && showActionSheet
                                    ? 1.5
                                    : 0,
                                borderColor: "#6C4E31",
                                borderRadius: 8,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 3.84,
                              }}
                            >
                              {photo.filter ? (
                                <View style={{ width: "100%", height: "100%" }}>
                                  <FilteredImage
                                    photo={photo}
                                    filterType={photo.filter}
                                  />
                                </View>
                              ) : (
                                <Image
                                  source={{ uri: photo.uri }}
                                  style={{ width: "100%", height: "100%" }}
                                  resizeMode="contain"
                                />
                              )}
                            </Animated.View>
                          </TouchableOpacity>

                          {/* 크기 조절 및 회전 핸들 컴포넌트 - 편집 모드일 때만 표시 */}
                          {mode === "edit" && showActionSheet && (
                            <ResizeRotateHandle
                              isActive={isActive}
                              photoIndex={index}
                              photo={photo}
                              photoAnimations={photoAnimations}
                              panResponder={resizeRotatePanResponder}
                              onDelete={handleDeletePhoto}
                            />
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
          setMode={setMode}
        />

        {/* Photo Action Sheet */}
        <PhotoActionSheet
          visible={showActionSheet}
          actionSheetAnim={actionSheetAnim}
          onCrop={handleCropPhoto}
          onFilter={handleFilterPhoto}
          onClose={() => toggleActionSheet(false)}
        />

        {/* CropPhotoModal 추가 */}
        <CropPhotoModal
          visible={showCropModal}
          onClose={() => setShowCropModal(false)}
          onSave={handleSaveCroppedImage}
          imageUri={
            activePhotoIndex !== null
              ? originalUri
                ? selectedPhotos[activePhotoIndex]?.originalUri
                : selectedPhotos[activePhotoIndex]?.uri
              : null
          }
          onOriginalChange={handleOriginalChange}
        />

        {/* Filter Selector Component */}
        <FilterSelects
          showFilterPicker={showFilterPicker}
          filterPickerAnim={filterPickerAnim}
          activeCategory={activeFilterCategory}
          selectedFilter={selectedFilter}
          setActiveCategory={setActiveFilterCategory}
          toggleFilterPicker={toggleFilterPicker}
          onApplyFilter={applyFilter}
        />

        <PhotoModal
          showPhotoModal={showPhotoModal}
          handleClosePhotoModal={handleClosePhotoModal}
          activePhotoIndex={activePhotoIndex}
          selectedPhotos={selectedPhotos}
          handleEditMemo={handleEditMemo}
        />
        {/* 메모 편집 모달 */}
        <MemoEditModal
          showMemoModal={showMemoModal}
          setShowMemoModal={setShowMemoModal}
          memoText={memoText}
          setMemoText={setMemoText}
          handleSaveMemo={handleSaveMemo}
        />

        {/* DrawingPalette 컴포넌트 추가 */}
        <DrawingPalette
          visible={showDrawingPalette}
          paletteAnim={drawingPaletteAnim}
          onClose={() => toggleDrawingPalette(false)}
          onColorChange={setPenColor}
          onSizeChange={setPenSize}
          onOpacityChange={setPenOpacity}
          onConfirm={handleDrawingConfirm}
          onPenTypeChange={setPenType}
        />

        {/* DrawingModal 추가 */}
        <DrawingModal
          month={selectedMonth}
          year={selectedYear}
          screenshotUri={screenshotUri}
          visible={showDrawingModal}
          onClose={() => setShowDrawingModal(false)}
          onSave={handleSaveDrawing}
        />
      </View>
    </View>
  );
}
// 사진 테두리 조절
// crop 한 사진 원본 저장
