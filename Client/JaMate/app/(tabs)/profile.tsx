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

import { useProfile } from "../../hooks/profile/useProfile";
import { useProfileMedia } from "../../hooks/profile/useProfileMedia";

import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../components/profile/ProfileTabs";
import { apiClient } from "../../api/client";
import { AUTH_TOKEN_KEY } from "../../constants/auth";

export default function ProfileScreen() {
  const router = useRouter();

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

            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
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

      {/* LOGOUT BUTTON */}
      <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
        <TouchableOpacity
          onPress={logout}
          style={{
            height: 48,
            borderRadius: 24,
            backgroundColor: "rgba(255,0,0,0.12)",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(255,0,0,0.35)",
          }}
        >
          <Text
            style={{
              color: "#FF5A5F",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
