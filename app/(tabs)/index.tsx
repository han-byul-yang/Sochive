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
  Dimensions,
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
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { Photo } from "@/types";
import {
  useGetPhotos,
  useCreatePhoto,
  useUpdatePhoto,
} from "@/hooks/useGetPhotos";
import PhotoModal from "@/components/Modals/PhotoModal";
import { cloneDeep, isEqual } from "lodash";
import { resizeByMaxDimension } from "@/utils/photoManipulation";
import { captureRef } from "react-native-view-shot";
import DrawingPalette from "@/components/DrawingPalette";
import { Point } from "react-native-gesture-handler/lib/typescript/web/interfaces";
import DrawingModal from "@/components/Modals/DrawingModal";
import {
  useCreateDrawing,
  useGetDrawings,
  useUpdateDrawing,
} from "@/hooks/useGetDrawings";
import { Canvas } from "@shopify/react-native-skia";
import DrawingCanvas from "@/components/Archive/DrawingCanvas";
import { router } from "expo-router";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getDateFromTimestamp } from "@/utils/getDates";
import StickerSelects from "@/components/StickerSelects";
import { STICKER_CATEGORIES, SAMPLE_STICKERS } from "@/constants/Stickers";
import PhotoActionButton from "@/components/PhotoActionButton";
import ResizeRotateHandle2 from "@/components/ResizeRotateHandle2";

export default function ArchiveScreen() {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [resetPhotos, setResetPhotos] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("lovely");
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
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
    isFetching: isPhotosFetching,
    isRefetching: isPhotosRefetching,
    error,
  } = useGetPhotos(selectedMonth, selectedYear);
  const { mutate: createPhotoMutate, isPending: isCreatePhotoPending } =
    useCreatePhoto(selectedMonth, selectedYear);
  const { mutate: updatePhotoMutate, isPending: isUpdatePhotoPending } =
    useUpdatePhoto(selectedMonth, selectedYear);
  const {
    data: drawingsData,
    isLoading: isDrawingsLoading,
    isFetching: isDrawingsFetching,
    isRefetching: isDrawingsRefetching,
  } = useGetDrawings(selectedMonth, selectedYear);
  const { isPending: isUpdateDrawingPending } = useUpdateDrawing(
    selectedMonth,
    selectedYear
  );
  const { isPending: isCreateDrawingPending } = useCreateDrawing(
    selectedMonth,
    selectedYear
  );
  const dateNow = Date.now();
  const date = new Date();

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
      setSelectedBackground(serverBackground);
    }
  }, [photos]);

  // 애니메이션 값 추가
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundPickerAnim = useRef(new Animated.Value(0)).current;
  const headerIconsAnim = useRef(new Animated.Value(0)).current;
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
      console.log("reset");
      const deepCopiedServerPhotos = cloneDeep(photos?.[0]?.photos || []);
      setSelectedPhotos(deepCopiedServerPhotos);
      setSelectedBackground(photos?.[0]?.background || null);
      setResetPhotos(false);
    }
  }, [resetPhotos, photos]);

  // 사진이 추가될 때마다 애니메이션 값 초기화
  // useEffect(() => {
  //   selectedPhotos.forEach((photo) => {
  //     if (!photoAnimations[photo.id]) {
  //       photoAnimations[photo.id] = {
  //         rotation: new Animated.Value(photo.rotation),
  //         scale: new Animated.Value(photo.scale),
  //       };
  //     } else {
  //       photoAnimations[photo.id].rotation.setValue(photo.rotation);
  //       photoAnimations[photo.id].scale.setValue(photo.scale);
  //     }
  //   });
  // }, [selectedPhotos]);

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
      setShowStickerPicker(false);
    }
  };

  // 모드 전환 애니메이션
  const toggleMode = (newMode: "read" | "edit") => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: newMode === "edit" ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(headerIconsAnim, {
        toValue: newMode === "edit" ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

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
    setShowStickerPicker(false);
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
    setShowStickerPicker(false);
    const result = await pickMultipleImages();

    if (result && !result.canceled && result.assets.length > 0) {
      const centerX = collageAreaSize.width / 2 - 80; // 사진 너비의 절반
      const centerY = collageAreaSize.height / 2 - 80; // 사진 높이의 절반
      console.log(collageAreaSize.width, collageAreaSize.height);
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
          name: "photo",
          id: dateNow + index,
          createdAt: date,
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
  const createPanResponder = (index: number, photo: Photo) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 드래그 시작 시 해당 사진을 최상위로 가져오기
        setActivePhotoIndex(index);
        setActivePhotoId(photo.id);
        setResizeMode("none");
        setSelectedPhotos((prev) => {
          const newPhotos = [...prev];
          const maxZ = Math.max(...newPhotos.map((p) => p.zIndex));
          newPhotos[index].zIndex = maxZ + 1;
          return newPhotos;
        });

        // 사진 선택 시 액션 시트 표시
        toggleActionSheet(false);
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
        if (photo.name !== "sticker") {
          toggleActionSheet(true);
        }
      },
    });
  };

  const handleResizeRotateUpdate = (
    id: number,
    rotation: number,
    scale: number
  ) => {
    setSelectedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[newPhotos.findIndex((photo) => photo.id === id)].rotation =
        rotation;
      newPhotos[newPhotos.findIndex((photo) => photo.id === id)].scale = scale;
      return newPhotos;
    });
  };

  const createResizeRotatePanResponder = (id: number, photo: Photo) => {
    // 현재 회전 및 크기 값을 저장할 변수
    let currentRotation = 0;
    let currentScale = 1;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (photo.id === id) {
          // 현재 사진의 회전 및 크기 값 저장
          currentRotation = photo.rotation;
          currentScale = photo.scale;

          // 사진의 중심점 계산
          const centerX = photo.position.x + (photo.width || 160) / 2; // 180/2
          const centerY = photo.position.y + (photo.height || 160) / 2; // 180/2

          // 핸들의 위치 계산 (오른쪽 하단 코너)
          const handleOffsetX = 90 * photo.scale;
          const handleOffsetY = 90 * photo.scale;

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
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (photo.id === id) {
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
            0.3,
            Math.min(3.0, dragStartRef.current.initialScale * scaleFactor)
          );

          // 현재 값 업데이트
          currentRotation = newRotation;
          currentScale = newScale;
          //handleResizeRotateUpdate(id, currentRotation, currentScale);
          // 애니메이션 값 업데이트 - 실시간으로 UI 반영
          //photoAnimations[id].rotation.setValue(newRotation);
          //photoAnimations[id].scale.setValue(newScale);
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
  const handleDeletePhoto = (id: number) => {
    // // 애니메이션 값 정리
    // if (photoAnimations[index]) {
    //   photoAnimations[index].rotation.setValue(0);
    //   photoAnimations[index].scale.setValue(1);
    // }

    // 선택된 사진 배열에서 해당 인덱스 제거
    setSelectedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos.splice(
        newPhotos.findIndex((photo) => photo.id === id),
        1
      );
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
  const handlePhotoPress = (index: number, photo: Photo) => {
    setActivePhotoIndex(index);
    if (mode === "edit") {
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
      if (photo.name === "sticker") {
        return;
      }
      // 읽기 모드일 때는 사진 모달만 표시
      router.push({
        pathname: "/(memo)/memo",
        params: {
          selectedPhotoId: photo.id,
          photoDocId: photos?.[0]?.id || "",
          selectedPhotoUri: photo.originalUri,
          selectedPhotoCreatedAt: getDateFromTimestamp(
            photo.createdAt as unknown as Timestamp
          ).toISOString(),
        },
      });
    }
    //setShowPhotoModal(true);
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

  const handleOriginalChange = () => {
    setOriginalUri(true);
  };

  const handleSaveScreenshot = async () => {
    if (mode === "read") {
      saveScreenshot(mainContentRef);
    } else {
      Alert.alert("읽기 모드에서만 스크린샷을 저장할 수 있습니다.");
    }
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
          await new Promise((resolve) => setTimeout(resolve, 300));
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
  }, [mode, isClickedPencil]);

  const handleOpenPencilMode = async () => {
    if (mode === "read") {
      setIsClickedPencil(true);
      //setMode("read");
    } else {
      Alert.alert("읽기 모드에서만 그리기 모드를 열 수 있습니다.");
    }
  };

  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [activeStickerCategory, setActiveStickerCategory] =
    useState<string>("kitschPop");
  const stickerPickerAnim = useRef(new Animated.Value(0)).current;

  const handleOpenSticker = () => {
    const newState = !showStickerPicker;
    setShowStickerPicker(newState);

    Animated.timing(stickerPickerAnim, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
      {(isPhotosLoading ||
        isPhotosFetching ||
        isPhotosRefetching ||
        isCreatePhotoPending ||
        isUpdatePhotoPending ||
        isDrawingsLoading ||
        isDrawingsFetching ||
        isDrawingsRefetching ||
        isUpdateDrawingPending ||
        isCreateDrawingPending) && (
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
          <View className="flex-row items-center justify-between h-[60px] px-4 border-b border-gray-100">
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
            <View className="flex-row items-center space-x-2 w-[130px]">
              {/* Save Button and Mode Toggle - move right in edit mode */}
              <Animated.View
                className="flex-row items-center space-x-2"
                style={{
                  transform: [
                    {
                      translateX: headerIconsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 28], // 76px right to fill the space
                      }),
                    },
                  ],
                }}
              >
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
                      opacity:
                        isSaving || selectedPhotos.length === 0 ? 0.5 : 1,
                    }}
                  >
                    <Text className="text-white font-medium font-dohyeon">
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
                  <Feather
                    name={mode === "edit" ? "x" : "file-plus"}
                    size={22}
                    color={mode === "edit" ? "#fff" : "#3D3D3D"}
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Screenshot and Drawing buttons - slide out in edit mode */}
              <Animated.View
                className="flex-row items-center space-x-2"
                style={{
                  transform: [
                    {
                      translateX: headerIconsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100],
                      }),
                    },
                  ],
                  opacity: headerIconsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                }}
              >
                <TouchableOpacity
                  onPress={handleOpenPencilMode}
                  activeOpacity={0.9}
                  className={`p-[8px] rounded-full bg-gray-100`}
                  style={{
                    elevation: 5,
                    zIndex: 10000,
                  }}
                >
                  <MaterialCommunityIcons
                    name="draw"
                    size={22}
                    color="#3D3D3D"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveScreenshot}
                  activeOpacity={0.9}
                  className={`p-[8px] rounded-full bg-gray-100`}
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={22}
                    color="#3D3D3D"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Main Content with Background */}
        <View
          ref={mainContentRef}
          className="flex-1 relative overflow-hidden"
          onLayout={(event) => {
            const { width, height, x, y } = event.nativeEvent.layout;
            setMainContentSize({ width, height, x, y });
          }}
        >
          {/* Edit Mode Controls with Animation */}
          <Animated.View
            className="relative mb-0 z-[10001] mr-4 mt-0"
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
              height: 0, // 버튼 컨테이너 높이 설정
            }}
          >
            {/* Background Button */}
            <TouchableOpacity
              className="absolute right-0 bg-gray-100 p-[8px] rounded-full"
              activeOpacity={0.9}
              onPress={toggleBackgroundPicker}
              style={{
                elevation: 5, // Android에서 z-index 효과를 위해 추가
              }}
            >
              <MaterialIcons name="wallpaper" size={24} color="#3D3D3D" />
            </TouchableOpacity>

            {/* Pencil Button - 새로 추가 */}
            <TouchableOpacity
              className="absolute right-24 bg-gray-100 p-[8px] rounded-full"
              activeOpacity={0.9}
              onPress={handleOpenSticker}
              style={{
                elevation: 5, // Android에서 z-index 효과를 위해 추가
              }}
            >
              <MaterialCommunityIcons
                name="flower-tulip"
                size={24}
                color="#3D3D3D"
              />
            </TouchableOpacity>

            {/* Camera Button */}
            <TouchableOpacity
              className="absolute right-12 bg-gray-100 p-[8px] rounded-full"
              activeOpacity={0.9}
              onPress={handlePickImages}
              style={{
                elevation: 5, // Android에서 z-index 효과를 위해 추가
              }}
            >
              <IconSymbol name="photo.on.rectangle" size={24} color="#3D3D3D" />
            </TouchableOpacity>
          </Animated.View>
          <ImageBackground
            key={selectedBackground}
            source={
              selectedBackground ? { uri: selectedBackground } : undefined
            }
            className="flex-1 absolute top-0 w-full h-full"
          >
            <View
              className="flex-1 absolute top-0 w-full h-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            />
          </ImageBackground>
          {/* DrawingCanvas 컴포넌트 추가 */}
          {drawingsData && drawingsData.length > 0 && !isClickedPencil && (
            <View
              pointerEvents="none"
              className="flex-1 absolute top-0 left-0 right-0 bottom-0 z-[10000] bg-transparent"
            >
              <Canvas style={{ flex: 1 }}>
                {drawingsData[0].drawing.map((drawing: any, index: number) => (
                  <DrawingCanvas key={index} path={drawing} index={index} />
                ))}
              </Canvas>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleBackgroundTap}
            style={{ flex: 1 }}
          >
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
                    const panResponder = createPanResponder(index, photo);
                    // const resizeRotatePanResponder =
                    //   createResizeRotatePanResponder(photo.id);
                    const isActive = activePhotoIndex === index;
                    const { width, height } =
                      photo.name === "sticker"
                        ? { width: 80, height: 80 }
                        : resizeByMaxDimension(
                            photo.width || 0,
                            photo.height || 0
                          );
                    return (
                      <View
                        key={photo.id}
                        className="absolute"
                        style={{
                          width: width || 160,
                          height: height || 160,
                          left: photo.position.x,
                          top: photo.position.y,
                          zIndex: photo.zIndex,
                          shadowColor: "#000",
                          shadowOffset: { width: 2, height: 2 },
                          shadowOpacity: 0.6,
                          shadowRadius: 3,
                          transform: [
                            {
                              rotate:
                                photoAnimations[photo.id]?.rotation.interpolate(
                                  {
                                    inputRange: [-360, 360],
                                    outputRange: ["-360deg", "360deg"],
                                  }
                                ) || `${photo.rotation}deg`,
                            },
                            {
                              scale:
                                photoAnimations[photo.id]?.scale || photo.scale,
                            },
                          ],
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPressOut={() => handlePhotoPress(index, photo)}
                        >
                          <Animated.View
                            {...(mode === "edit"
                              ? panResponder.panHandlers
                              : {})}
                            className="w-full h-full rounded-lg overflow-hidden"
                            style={{
                              width: width || 160,
                              height: height || 160,
                              borderWidth:
                                isActive && mode === "edit" && showActionSheet
                                  ? 1.5
                                  : 0,
                              borderColor: "#6C4E31",
                              borderRadius: 8,
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
                        {mode === "edit" && (
                          <ResizeRotateHandle
                            photo={photo}
                            isActive={isActive}
                            onDelete={() => handleDeletePhoto(photo.id)}
                            onUpdate={(rotation, scale) =>
                              handleResizeRotateUpdate(
                                photo.id,
                                rotation,
                                scale
                              )
                            }
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

        {/* Photo Action Button */}
        <PhotoActionButton
          visible={showActionSheet && mode === "edit"}
          actionAnim={actionSheetAnim}
          onPress={handleCropPhoto}
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
        {/*<FilterSelects
            showFilterPicker={showFilterPicker}
            filterPickerAnim={filterPickerAnim}
            activeCategory={activeFilterCategory}
            selectedFilter={selectedFilter}
            setActiveCategory={setActiveFilterCategory}
            toggleFilterPicker={toggleFilterPicker}
            onApplyFilter={applyFilter}
          />*/}

        <PhotoModal
          showPhotoModal={showPhotoModal}
          handleClosePhotoModal={handleClosePhotoModal}
          activePhotoIndex={activePhotoIndex}
          selectedPhotos={selectedPhotos}
          handleEditMemo={handleEditMemo}
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

        {showStickerPicker && (
          <StickerSelects
            activeCategory={activeStickerCategory}
            selectedSticker={selectedSticker}
            collageAreaSize={collageAreaSize}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            setActiveCategory={setActiveStickerCategory}
            setSelectedSticker={setSelectedSticker}
          />
        )}
      </View>
    </View>
  );
}
// 사진 테두리 조절
// crop 한 사진 원본 저장
