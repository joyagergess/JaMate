import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
};

export function ProfileHeader({ profile, media }: Props) {
  const avatarSource =
    media && media.length > 0
      ? { uri: media[0].url }
      : require("../../assets/images/unknow.jpg");
  console.log("AVATAR SOURCE:", media?.[0]?.url);

  return (
    <View style={{ alignItems: "center", paddingTop: 40 }}>
      <TouchableOpacity style={{ position: "absolute", right: 24, top: 40 }}>
        <Ionicons name="settings-outline" size={22} color="#fff" />
      </TouchableOpacity>

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

      <Text style={{ color: "#9CA3AF", marginTop: 4 }}>
        @{profile.username}
      </Text>

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
        <Text style={{ color: "#fff", fontWeight: "600" }}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
