import {
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spinner } from "../../components/ui/Spinner";

import { useProfileById } from "../../hooks/profile/useProfileById";
import { useProfileMediaById } from "../../hooks/profile/useProfileMediaById";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../components/profile/ProfileTabs";

export default function ProfileByIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profileId = Number(id);
  const insets = useSafeAreaInsets();

  const { data: profile, isLoading: loadingProfile } =
    useProfileById(profileId);

  const { data: media, isLoading: loadingMedia } =
    useProfileMediaById(profileId);

 if (loadingProfile || loadingMedia) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B0E13",
      }}
    >
      <Spinner size={44} />
    </View>
  );
}


  if (!profile) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0E13" }}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.replace("/matches")}
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 16,
          zIndex: 50,
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ProfileHeader profile={profile} media={media} readOnly />

      <ProfileTabs profile={profile} media={media ?? []} readOnly />
    </ScrollView>
  );
}
