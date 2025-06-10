import React, { useRef, useState } from "react";
import { View, PanResponder, Animated } from "react-native";
import Svg, { Path, G, Defs, RadialGradient, Stop } from "react-native-svg";

interface DrawingCanvasProps {
  visible: boolean;
  penColor: string;
  penSize: number;
  penOpacity: number;
  penType: string;
  onDrawingComplete: (paths: any[]) => void;
  collageAreaBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface PathData {
  id: string;
  d: string;
  color: string;
  width: number;
  opacity: number;
  type: string;
}

export default function DrawingCanvas({
  visible,
  penColor,
  penSize,
  penOpacity,
  penType,
  onDrawingComplete,
  collageAreaBounds,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const pathRef = useRef<PathData[]>([]);

  // 펜 스타일에 따른 효과 설정
  const getPenStyle = (type: string) => {
    switch (type) {
      case "dot":
        return {
          strokeDasharray: [penSize / 2, penSize],
          strokeLinecap: "round" as const,
        };
      case "glitter":
        return {
          strokeLinecap: "round" as const,
          stroke: `url(#glitterGradient-${Date.now()})`,
        };
      case "brush":
        return {
          strokeLinecap: "round" as const,
          strokeLinejoin: "round" as const,
          strokeWidth: penSize * 1.5,
        };
      case "outline":
        return {
          stroke: "white",
          strokeWidth: penSize + 4,
          strokeLinecap: "round" as const,
        };
      case "neon":
        return {
          strokeLinecap: "round" as const,
          stroke: penColor,
          strokeWidth: penSize,
          shadowColor: penColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        };
      default:
        return {
          strokeLinecap: "round" as const,
        };
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setCurrentPath(`M ${locationX} ${locationY}`);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setCurrentPath((prev) => `${prev} L ${locationX} ${locationY}`);
      },
      onPanResponderRelease: () => {
        const newPath: PathData = {
          id: Date.now().toString(),
          d: currentPath,
          color: penColor,
          width: penSize,
          opacity: penOpacity,
          type: penType,
        };

        pathRef.current = [...pathRef.current, newPath];
        setPaths(pathRef.current);
        setCurrentPath("");
        onDrawingComplete(pathRef.current);
      },
    })
  ).current;

  // 반짝이 효과를 위한 그라데이션 생성
  const renderGlitterGradient = (pathId: string) => (
    <RadialGradient
      id={`glitterGradient-${pathId}`}
      cx="50%"
      cy="50%"
      r="50%"
      fx="50%"
      fy="50%"
    >
      <Stop offset="0%" stopColor={penColor} stopOpacity="1" />
      <Stop offset="50%" stopColor={penColor} stopOpacity="0.5" />
      <Stop offset="100%" stopColor={penColor} stopOpacity="0.1" />
    </RadialGradient>
  );

  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        width: collageAreaBounds.width,
        height: collageAreaBounds.height,
        zIndex: 2000,
      }}
      {...panResponder.panHandlers}
    >
      <Svg width="100%" height="100%">
        <Defs>
          {paths.map((path) =>
            path.type === "glitter" ? renderGlitterGradient(path.id) : null
          )}
          {currentPath &&
            penType === "glitter" &&
            renderGlitterGradient("current")}
        </Defs>

        {/* 아웃라인 펜의 경우 배경선 먼저 그리기 */}
        {paths.map((path) =>
          path.type === "outline" ? (
            <G key={`outline-${path.id}`}>
              <Path
                d={path.d}
                stroke="white"
                strokeWidth={path.width + 4}
                fill="none"
                opacity={path.opacity}
                strokeLinecap="round"
              />
              <Path
                d={path.d}
                stroke={path.color}
                strokeWidth={path.width}
                fill="none"
                opacity={path.opacity}
                strokeLinecap="round"
              />
            </G>
          ) : (
            <Path
              key={path.id}
              d={path.d}
              stroke={
                path.type === "glitter"
                  ? `url(#glitterGradient-${path.id})`
                  : path.color
              }
              strokeWidth={path.width}
              fill="none"
              opacity={path.opacity}
              {...getPenStyle(path.type)}
            />
          )
        )}

        {/* 현재 그리고 있는 경로 */}
        {currentPath && (
          <>
            {penType === "outline" && (
              <Path
                d={currentPath}
                stroke="white"
                strokeWidth={penSize + 4}
                fill="none"
                opacity={penOpacity}
                strokeLinecap="round"
              />
            )}
            <Path
              d={currentPath}
              stroke={
                penType === "glitter"
                  ? `url(#glitterGradient-current)`
                  : penColor
              }
              strokeWidth={penSize}
              fill="none"
              opacity={penOpacity}
              {...getPenStyle(penType)}
            />
          </>
        )}
      </Svg>
    </View>
  );
}
