import React, { useCallback, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

interface Props {
  children: React.ReactNode;
  snapPoints?: string[];
  index?: number;
  onChange?: (index: number) => void;
}

export default function CustomBottomSheet({
  children,
  snapPoints: customSnapPoints,
  index = 1,
  onChange,
}: Props) {
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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={index}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView className="flex-1">{children}</BottomSheetView>
    </BottomSheet>
  );
}
