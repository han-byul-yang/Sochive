import React, { useCallback, useMemo, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  children: React.ReactNode;
  snapPoints?: string[];
  index?: number;
  onChange?: (index: number) => void;
  close?: boolean;
  onBackgroundPress?: () => void;
  isBackground?: boolean;
}

export default function CustomBottomSheet({
  children,
  snapPoints: customSnapPoints,
  index = 1,
  onChange,
  close,
  onBackgroundPress,
  isBackground,
}: Props) {
  const { isDarkMode } = useTheme();
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables
  const snapPoints = useMemo(
    () => customSnapPoints ?? ["5%", "25%", "50%", "90%"],
    [customSnapPoints]
  );

  // callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {
      onChange?.(index);
    },
    [onChange]
  );

  const SingleBottomSheet = useMemo(() => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        animationConfigs={{
          duration: 300,
        }}
        enablePanDownToClose={close}
        backgroundStyle={{
          backgroundColor: isDarkMode ? "#2b2b2b" : "white",
        }}
      >
        <BottomSheetView className="flex-1">{children}</BottomSheetView>
      </BottomSheet>
    );
  }, [bottomSheetRef, index, snapPoints, handleSheetChanges, close, children]);

  return (
    <>
      {isBackground && (
        <Pressable
          className="flex-1 absolute bottom-0 top-0 left-0 right-0 bg-black/20"
          onPress={onBackgroundPress}
        />
      )}
      {SingleBottomSheet}
    </>
  );
}
