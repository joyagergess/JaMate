import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { apiClient } from "../../api/client";
import { AUTH_TOKEN_KEY } from "../../constants/auth";

type Media = {
  id: number;
  url: string;
  order_index: number;
};

type Props = {
  profile: {
    name: string;
    username: string | null;
    bio?: string | null;
  };
  media?: Media[];
  readOnly?: boolean;
};

export function ProfileHeader({
  profile,
  media,
  readOnly = false,
}: Props) {
  const avatarSource =
    media && media.length > 0 && media[0]?.url
      ? { uri: media[0].url }
      : require("../../assets/images/unknow.jpg");

  const logout = () => {
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

  return (
    <View style={{ alignItems: "center", paddingTop: 40 }}>
      {!readOnly && (
        <TouchableOpacity
          style={{ position: "absolute", right: 24, top: 40 }}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={22} color="#6C63FF" />
        </TouchableOpacity>
      )}

      <Image
        source={avatarSource}
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          marginBottom: 16,
          backgroundColor: "#1F2937",
        }}
      />

      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "600" }}>
        {profile.name}
      </Text>

      {!!profile.username && (
        <Text style={{ color: "#9CA3AF", marginTop: 4 }}>
          @{profile.username}
        </Text>
      )}

      {!!profile.bio && (
        <Text
          style={{
            color: "#D1D5DB",
            textAlign: "center",
            marginTop: 12,
            paddingHorizontal: 32,
            lineHeight: 20,
          }}
        >
          {profile.bio}
        </Text>
      )}

      {!readOnly && (
        <TouchableOpacity
          onPress={() => router.push("/edit")}
          style={{
            marginTop: 20,
            backgroundColor: "#6D5DF6",
            paddingHorizontal: 28,
            paddingVertical: 10,
            borderRadius: 24,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
