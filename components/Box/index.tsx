import { useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { PanResponder } from "react-native";

export default function Box({
  children,
  closeBox,
  pan,
  slideAnim,
}: {
  children: React.ReactNode;
  closeBox: () => void;
  pan: Animated.Value;
  slideAnim: Animated.Value;
}) {
  const boxHeight = Math.round(Dimensions.get("window").height * 0.5);

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) pan.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 80) {
          closeBox();
          pan.setValue(0);
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  // 실제 translateY 계산
  const translateY = Animated.add(
    slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [boxHeight, 0],
    }),
    pan
  );
  return (
    <>
      <TouchableWithoutFeedback onPress={closeBox}>
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20" />
      </TouchableWithoutFeedback>
      <Animated.View
        className="absolute left-0 right-0 bottom-0"
        style={{
          transform: [{ translateY }],
          zIndex: 100,
        }}
      >
        <SafeAreaView
          className="bg-white rounded-t-3xl pt-0 pb-[32px] px-[16px]"
          style={{
            maxHeight: boxHeight,
          }}
        >
          {/* 드래그 핸들 */}
          <View
            {...panResponder.panHandlers}
            className="w-full p-4 pb-2 items-center"
          >
            <View className="w-14 h-1.5 bg-gray-200 rounded-full mb-2" />
          </View>

          {children}
        </SafeAreaView>
      </Animated.View>
    </>
  );
}
