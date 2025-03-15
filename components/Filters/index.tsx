import { View, Image } from "react-native";

interface GrayScaleFilterProps {
  photo: {
    uri: string;
    position: {
      x: number;
      y: number;
    };
    zIndex: number;
    rotation: number;
    scale: number;
    filter?: string;
    memo?: string;
  };
}

export function GrayScaleFilter({ photo }: GrayScaleFilterProps) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />
    </View>
  );
}

export function SepiaFilter({ photo }: GrayScaleFilterProps) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(112, 66, 20, 0.4)",
        }}
      />
    </View>
  );
}

export function OldFilmFilter({ photo }: GrayScaleFilterProps) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 209, 128, 0.1)",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(130, 90, 50, 0.1)",
        }}
      />
    </View>
  );
}

export function BrightnessFilter({ photo }: GrayScaleFilterProps) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        }}
      />
    </View>
  );
}

export function ContrastFilter({ photo }: GrayScaleFilterProps) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      />
    </View>
  );
}

export function HighTeenFilter({ photo }: GrayScaleFilterProps) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
      {/* 밝은 핑크색 오버레이 */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 105, 180, 0.15)",
        }}
      />
      {/* 밝기 증가 레이어 */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      />
      {/* 대비 증가 레이어 */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        }}
      />
    </View>
  );
}
