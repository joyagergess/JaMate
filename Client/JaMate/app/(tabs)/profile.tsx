import {
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { Spinner } from "../../components/ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";

import { useProfile } from "../../hooks/profile/useProfile";
import { useProfileMedia } from "../../hooks/profile/useProfileMedia";
import { useAuthRefresh } from "../../context/AuthRefreshContext";

import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../components/profile/ProfileTabs";
import { apiClient } from "../../api/client";
import { AUTH_TOKEN_KEY } from "../../constants/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { triggerRefresh } = useAuthRefresh();

  const { data: profile, isLoading: loadingProfile } = useProfile();
  const {
    data: media,
    isLoading: loadingMedia,
    refetch: refetchMedia,
  } = useProfileMedia();

  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.post("/auth/logout");
            } catch {}

            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);

            apiClient.defaults.headers.common.Authorization = undefined;

            queryClient.clear();

            triggerRefresh();

            router.replace("/(auth)/login");
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loadingProfile || loadingMedia) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0E13",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size={42} />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0E13" }}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <ProfileHeader profile={profile} media={media} />

      <ProfileTabs
        profile={profile}
        media={media ?? []}
        onMediaUploaded={refetchMedia}
      />
    </ScrollView>
  );
}
