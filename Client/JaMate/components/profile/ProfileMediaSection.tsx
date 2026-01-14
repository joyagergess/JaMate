import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActionSheetIOS } from "react-native";

import { ProfileMedia } from "../../hooks/profile/useProfileMedia";
import { FeedPreviewModal } from "../media/FeedPreviewModal";
import { VideoPreviewModal } from "../media/VideoPreviewModal";
import { pickFromGallery, recordFromCamera } from "../../utils/mediaPicker";
import { useUploadProfileMedia } from "../../hooks/profile/useUploadProfileMedia";
import { useDeleteProfileMedia } from "../../hooks/profile/useDeleteProfileMedia";

const { width } = Dimensions.get("window");

const GAP = 20;
const MAX = 4;
const COLUMNS = 2;
const CARD_WIDTH = (width - GAP * 3) / COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

type Props = {
  media: ProfileMedia[];
  onUploaded: () => void;
};

export function ProfileMediaSection({ media, onUploaded }: Props) {
  const upload = useUploadProfileMedia();
  const remove = useDeleteProfileMedia();

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const gridMedia = media.filter((m) => m.order_index !== 0);

  const slots: (ProfileMedia | undefined)[] = [
    ...gridMedia.slice(0, MAX),
    ...Array(Math.max(0, MAX - gridMedia.length)).fill(undefined),
  ];

  const openPicker = () => {
    if (upload.isPending || remove.isPending) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Camera", "Gallery"],
          cancelButtonIndex: 0,
        },
        (i) => {
          if (i === 1) handleAdd("camera");
          if (i === 2) handleAdd("gallery");
        }
      );
    } else {
      Alert.alert("Add media", "", [
        { text: "Camera", onPress: () => handleAdd("camera") },
        { text: "Gallery", onPress: () => handleAdd("gallery") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleAdd = async (source: "camera" | "gallery") => {
    if (gridMedia.length >= MAX) return;

    const picked =
      source === "camera"
        ? await recordFromCamera()
        : await pickFromGallery();

    if (!picked) return;

    upload.mutate(
      {
        id: Date.now(),
        localUri: picked.localUri,
        type: picked.type,
        mimeType: picked.mimeType,
        size: picked.size,
      } as any,
      {
        onSuccess: onUploaded,
        onError: () =>
          Alert.alert("Upload failed", "Please try again."),
      }
    );
  };

  const confirmDelete = (id: number) => {
    if (upload.isPending || remove.isPending) return;

    Alert.alert("Remove media", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          remove.mutate(id, {
            onSuccess: onUploaded,
            onError: () =>
              Alert.alert("Delete failed", "Could not remove media."),
          }),
      },
    ]);
  };

  return (
    <>
      {gridMedia.length > 0 && (
        <TouchableOpacity
          onPress={() => setPreviewIndex(0)}
          style={{
            alignSelf: "flex-end",
            marginRight: GAP,
            marginBottom: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: "#1F2937",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Preview feed
          </Text>
        </TouchableOpacity>
      )}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: GAP,
          paddingHorizontal: GAP,
        }}
      >
        {slots.map((item, index) => (
          <View
            key={index}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (!item) {
                  openPicker();
                } else if (item.media_type === "video") {
                  setVideoUrl(item.url);
                } else {
                  setPreviewIndex(index);
                }
              }}
              style={{
                flex: 1,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.03)",
                overflow: "hidden",
              }}
            >
              {item ? (
                item.media_type === "image" ? (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <>
                    {item.thumbnail_url ? (
                      <Image
                        source={{ uri: item.thumbnail_url }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "#000",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="play-circle"
                          size={48}
                          color="#fff"
                        />
                      </View>
                    )}

                    <View
                      style={{
                        position: "absolute",
                        inset: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="play-circle"
                        size={42}
                        color="#fff"
                      />
                    </View>
                  </>
                )
              ) : (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: "#6D5DF6",
                    borderRadius: 20,
                  }}
                />
              )}
            </TouchableOpacity>

            {item && (
              <TouchableOpacity
                onPress={() => confirmDelete(item.id)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 20,
                }}
              >
                {remove.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="close" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            )}

            {!item && (
              <TouchableOpacity
                onPress={openPicker}
                style={{
                  position: "absolute",
                  bottom: -14,
                  right: -14,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#6D5DF6",
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 6,
                }}
              >
                {upload.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="add" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <VideoPreviewModal
        visible={!!videoUrl}
        videoUrl={videoUrl}
        onClose={() => setVideoUrl(null)}
      />

      <FeedPreviewModal
        visible={previewIndex !== null}
        media={gridMedia}
        startIndex={previewIndex ?? 0}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  );
}
