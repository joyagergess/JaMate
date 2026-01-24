import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { apiClient } from "../../api/client";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { profileHeaderStyles as styles } from "../../styles/profileHeader.styles";

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
    <View style={styles.container}>
      {!readOnly && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#6C63FF"
          />
        </TouchableOpacity>
      )}

      <Image source={avatarSource} style={styles.avatar} />

      <Text style={styles.name}>{profile.name}</Text>

      {!!profile.username && (
        <Text style={styles.username}>
          @{profile.username}
        </Text>
      )}

      {!!profile.bio && (
        <Text style={styles.bio}>{profile.bio}</Text>
      )}

      {!readOnly && (
        <TouchableOpacity
          onPress={() => router.push("/edit")}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
