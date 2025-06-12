import { Stack, useLocalSearchParams } from "expo-router";

export default function MemoLayout() {
  const { index } = useLocalSearchParams();
  console.log(index);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="memo" />
    </Stack>
  );
}
