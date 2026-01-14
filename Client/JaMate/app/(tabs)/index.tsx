import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFeed } from "../../hooks/feed/useFeed";
import { useSwipe } from "../../hooks/feed/useSwipe";
import { ProfileMedia } from "../../hooks/profile/useProfileMedia";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { data: feed, isLoading } = useFeed();
  const swipe = useSwipe();

  const [mediaIndex, setMediaIndex] = useState(0);

  if (isLoading || !feed?.length) return null;

  const profile = feed[0];
  const media = profile.media as ProfileMedia[];
  const current = media[mediaIndex];

  const nextMedia = () => {
    if (mediaIndex < media.length - 1) {
      setMediaIndex(mediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (mediaIndex > 0) {
      setMediaIndex(mediaIndex - 1);
    }
  };

  const handleSkip = () => {
    swipe.mutate({
      swiped_profile_id: profile.id,
      direction: "skip",
    });
    setMediaIndex(0);
  };

  const handleJam = () => {
    swipe.mutate({
      swiped_profile_id: profile.id,
      direction: "like",
    });
    setMediaIndex(0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />

      {/* MEDIA */}
      {current.media_type === "image" ? (
        <Image
          source={{ uri: current.url }}
          style={{ width, height }}
          resizeMode="cover"
        />
      ) : (
        <Video
          source={{ uri: current.url }}
          style={{ width, height }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
        />
      )}

      {/* TAP ZONES */}
      <View
        style={{
          position: "absolute",
          inset: 0,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ width: "50%" }}
          onPress={prevMedia}
        />
        <TouchableOpacity
          style={{ width: "50%" }}
          onPress={nextMedia}
        />
      </View>

      {/* MEDIA PROGRESS */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 12,
          right: 12,
          flexDirection: "row",
          gap: 6,
        }}
      >
        {media.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 3,
              backgroundColor:
                i <= mediaIndex
                  ? "#fff"
                  : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </View>

      {/* PROFILE INFO */}
      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: 20,
          right: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>
          {profile.name} — {profile.age}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
            gap: 6,
          }}
        >
          <Ionicons name="location" size={14} color="#ccc" />
          <Text style={{ color: "#ccc" }}>{profile.location}</Text>
        </View>

        <Text style={{ color: "#aaa", marginTop: 6 }}>
          {profile.instruments.map((i) => i.name).join(" · ")}
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          {profile.genres.map((g) => (
            <View
              key={g.id}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>
                {g.name}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ color: "#aaa", marginTop: 10 }}>
          Looking for jam sessions / Forming a band
        </Text>
      </View>

      {/* ACTION BUTTONS */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 40,
          left: 20,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={handleSkip}
          style={{
            paddingHorizontal: 28,
            paddingVertical: 14,
            borderRadius: 30,
            backgroundColor: "#111",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={{ color: "#fff" }}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleJam}
          style={{
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 30,
            backgroundColor: "#6D5DF6",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons name="musical-notes" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Jam
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
