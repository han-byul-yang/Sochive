import { View, Text, Image } from "react-native";

interface OnBoardingItemProps {
  title: string;
  subtitle?: string;
  image: any;
  height?: number;
}

export default function OnBoardingItem({
  title,
  subtitle,
  image,
  height,
}: OnBoardingItemProps) {
  return (
    <View className="mt-30">
      <View className="items-center justify-center rounded-2xl overflow-hidden">
        <Image
          source={image}
          className="rounded-2xl overflow-hidden w-full h-full"
          style={{ width: 290, height: height ? height : 280 }}
          resizeMode="cover"
        />
      </View>
      <View className="items-center mt-20 px-6 ">
        <View className="w-[230px] mb-4">
          <Text className="text-3xl font-dohyeon text-[#EEEEEE] text-center">
            {title}
          </Text>
        </View>
        <Text className="text-lg font-dohyeon text-[#dad7d7] text-center mt-2">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
