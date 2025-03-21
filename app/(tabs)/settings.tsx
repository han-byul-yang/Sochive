import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuth from "@/contexts/AuthContext";
import ComingSoonModal from "@/components/Modals/ComingSoonModal";
import * as Linking from "expo-linking";
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingItemProps {
  icon: any;
  label: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
}

function SettingItem({
  icon,
  label,
  value,
  onValueChange,
  onPress,
  showArrow,
  color = "#000",
}: SettingItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center space-x-3">
          <MaterialIcons name={icon} size={24} color={color} />
          <ThemedText className="text-base">{label}</ThemedText>
        </View>
        {onValueChange && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={value ? Colors.light.tint : "#f4f3f4"}
          />
        )}
        {showArrow && (
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        )}
        {icon === "info" && <ThemedText>1.0.0</ThemedText>}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState({
    title: "",
    feature: "",
  });

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSubscriptionPress = () => {
    setComingSoonFeature({
      title: "프리미엄 서비스",
      feature: "프리미엄",
    });
    setShowComingSoonModal(true);
  };

  const handleFeedbackPress = () => {
    Linking.openURL("https://forms.gle/8YLAofdMPE9nmRGG8");
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 탈퇴하시겠습니까?\n모든 데이터가 영구적으로 삭제됩니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              if (!user) return;

              // 1. 사용자의 모든 앨범 조회
              const albumsQuery = query(
                collection(db, "albums"),
                where("userId", "==", user.uid)
              );
              const albumsSnapshot = await getDocs(albumsQuery);

              // 2. 각 앨범에 속한 이미지들 삭제
              for (const albumDoc of albumsSnapshot.docs) {
                const imagesQuery = query(
                  collection(db, "images"),
                  where("folderId", "==", albumDoc.id)
                );
                const imagesSnapshot = await getDocs(imagesQuery);

                // 이미지 문서 삭제
                for (const imageDoc of imagesSnapshot.docs) {
                  await deleteDoc(doc(db, "images", imageDoc.id));
                }

                // 앨범 문서 삭제
                await deleteDoc(doc(db, "albums", albumDoc.id));
              }

              // 3. 사용자 문서 삭제
              await deleteDoc(doc(db, "users", user.uid));

              // 4. Firebase Auth 사용자 삭제
              await deleteUser(user);

              // 5. 로그아웃 처리 (auth 리스너가 자동으로 처리)
            } catch (error) {
              console.error("Account deletion error:", error);
              Alert.alert(
                "오류",
                "회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요."
              );
            }
          },
        },
      ]
    );
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(
      "https://pickle-couch-586.notion.site/SCREENARY-19f71f64fee0802ca21de7e2a49e5a7f?pvs=73"
    );
  };

  const handleTermsOfServicePress = () => {
    Linking.openURL(
      "https://pickle-couch-586.notion.site/SCREENARY-19f71f64fee080edabc7f74dab7114c6"
    );
  };

  return (
    <View className="flex-1 bg-[#fcfcfc]">
      <ThemedView className="px-4 pb-2 pt-4">
        <ThemedText className="text-[20px] font-noto-bold">Settings</ThemedText>
      </ThemedView>

      <ScrollView className="px-4 mt-4">
        <View className="mb-6">
          <ThemedText className="text-sm text-[#3D3D3D] mb-2">구독</ThemedText>
          <ThemedView className="bg-white rounded-2xl px-4">
            <SettingItem
              icon="workspace-premium"
              showArrow
              label="프리미엄"
              onPress={handleSubscriptionPress}
            />
          </ThemedView>
        </View>

        <View className="mb-6">
          <ThemedText className="text-sm text-[#3D3D3D] mb-2">정보</ThemedText>
          <ThemedView className="bg-white rounded-2xl px-4">
            <SettingItem icon="info" label="앱 버전" onPress={() => {}} />
            <View className="h-[1px] bg-gray-100" />
            <SettingItem
              icon="mail"
              label="피드백 & 문의"
              showArrow
              onPress={handleFeedbackPress}
            />
            <View className="h-[1px] bg-gray-100" />
            <SettingItem
              icon="description"
              label="이용약관"
              showArrow
              onPress={handleTermsOfServicePress}
            />
            <View className="h-[1px] bg-gray-100" />
            <SettingItem
              icon="security"
              label="개인정보처리방침"
              showArrow
              onPress={handlePrivacyPolicyPress}
            />
          </ThemedView>
        </View>

        <ThemedView className="bg-white rounded-2xl p-4 mb-6">
          <SettingItem
            icon="logout"
            label="로그아웃"
            color="#FF3B30"
            onPress={handleLogout}
          />
          <View className="h-[1px] bg-gray-100" />
          <SettingItem
            icon="delete-forever"
            label="회원 탈퇴"
            color="#FF3B30"
            onPress={handleDeleteAccount}
          />
        </ThemedView>
      </ScrollView>
      <View className="w-full justify-center items-center"></View>
      <ComingSoonModal
        isVisible={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title={comingSoonFeature.title}
        feature={comingSoonFeature.feature}
      />
    </View>
  );
}
