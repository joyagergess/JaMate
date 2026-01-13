import { View, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { ProfileMedia } from "../../hooks/profile/useProfileMedia";
import { VideoPreviewModal } from "../media/VideoPreviewModal";

const { width } = Dimensions.get("window");
const GAP = 6;
const COLUMNS = 3;
const ITEM_SIZE = (width - GAP * (COLUMNS + 1)) / COLUMNS;

export function ProfileMediaSection({ media }: { media: ProfileMedia[] }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Exclude avatar (order_index === 0)
  const gridMedia = media.filter((m) => m.order_index !== 0);

  if (gridMedia.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text style={{ color: "#9CA3AF" }}>No media uploaded yet</Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: GAP,
        }}
      >
        {gridMedia.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() => {
              if (item.media_type === "video") {
                setSelectedVideo(item.url); // ✅ MUST BE api/v0.1/media
              }
            }}
            style={{
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              margin: GAP / 2,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: "#111827",
            }}
          >
            {item.media_type === "image" ? (
              <Image
                source={{ uri: item.url }} // ✅ FULL URL FROM API
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View style={{ flex: 1 }}>
                {item.thumbnail_url ? (
                  <Image
                    source={{ uri: item.thumbnail_url }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="play-circle" size={36} color="#E5E7EB" />
                  </View>
                )}

                {/* ▶ overlay */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="play-circle" size={36} color="#FFFFFF" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <VideoPreviewModal
        visible={!!selectedVideo}
        videoUrl={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
