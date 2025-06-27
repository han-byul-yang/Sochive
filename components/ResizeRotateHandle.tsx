import React, { useEffect, useRef, useState } from "react";
import { View, PanResponder, Animated, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Photo } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resizeByMaxDimension } from "@/utils/photoManipulation";

interface Props {
  photo: Photo;
  isActive: boolean;
  onUpdate: (rotation: number, scale: number) => void;
}

export default function ResizeRotateHandle({
  photo,
  isActive,
  onUpdate,
}: Props) {
  if (!isActive) return null;
  const { top: topInset } = useSafeAreaInsets();
  const { width, height } =
    photo.name === "sticker"
      ? { width: 80, height: 80 }
      : resizeByMaxDimension(photo.width || 0, photo.height || 0);

  const startRotation = useRef(0);
  const startScale = useRef(1);
  const lastRotation = useRef(photo.rotation || 0);
  const lastScale = useRef(photo.scale || 1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gesture) => {
      const centerX = photo.position.x + width / 2;
      const centerY = photo.position.y + height / 2;

      startRotation.current =
        Math.atan2(gesture.y0 - topInset - 60 - centerY, gesture.x0 - centerX) *
        (180 / Math.PI);

      lastRotation.current = photo.rotation || 0;
      lastScale.current = photo.scale || 1;

      const dx = gesture.x0 - centerX;
      const dy = gesture.y0 - topInset - 60 - centerY;
      startScale.current = Math.sqrt(dx * dx + dy * dy);
    },
    onPanResponderMove: (_, gesture) => {
      const centerX = photo.position.x + width / 2;
      const centerY = photo.position.y + height / 2;

      // 회전 계산 - 즉각적인 반응을 위해 직접 각도 차이 사용
      const currentAngle =
        Math.atan2(
          gesture.moveY - topInset - 60 - centerY,
          gesture.moveX - centerX
        ) *
        (180 / Math.PI);

      const deltaAngle = currentAngle - startRotation.current;
      const newRotation = lastRotation.current + deltaAngle; // 회전 속도 2배 증가

      // 크기 계산 - 더 민감한 반응을 위해 계산 방식 변경
      const dx = gesture.moveX - centerX;
      const dy = gesture.moveY - topInset - 60 - centerY;
      const currentScale = Math.sqrt(dx * dx + dy * dy);
      const scaleFactor = currentScale / startScale.current;

      // 크기 변화를 더 극적으로 만들기
      const scaleMultiplier = 1; // 크기 변화 3배 증가
      const newScale = Math.min(
        Math.max(
          lastScale.current * Math.pow(scaleFactor, scaleMultiplier),
          0.2
        ),
        4.0
      );

      // 즉시 업데이트
      onUpdate(newRotation, newScale);
    },
  });

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        right: -12,
        bottom: -12,
      }}
    >
      <View className="bg-white rounded-full p-2 shadow-lg">
        <MaterialCommunityIcons name="arrow-all" size={20} color="#3D3D3D" />
      </View>
    </View>
  );
}
