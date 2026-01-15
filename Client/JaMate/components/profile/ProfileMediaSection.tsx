import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Text,
  Modal,
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

/* ------------------ LAYOUT ------------------ */

const { width, height } = Dimensions.get("window");

const GAP = 20;
const MAX = 4;
const COLUMNS = 2;
const CARD_WIDTH = (width - GAP * 3) / COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

/* ------------------ TYPES ------------------ */

type Props = {
  media: ProfileMedia[];
  onUploaded?: () => void;
  readOnly?: boolean;
};

/* ------------------ COMPONENT ------------------ */

export function ProfileMediaSection({
  media,
  onUploaded,
  readOnly = false,
}: Props) {
  const upload = useUploadProfileMedia();
  const remove = useDeleteProfileMedia();

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /* 🔥 ONLY REAL MEDIA WHEN READ-ONLY */
  const gridMedia = media
    .filter((m) => m.order_index !== 0)
    .sort((a, b) => a.order_index - b.order_index);

  const slots: ProfileMedia[] = readOnly
    ? gridMedia
    : gridMedia.slice(0, MAX);

  /* ------------------ PICKER (EDIT MODE ONLY) ------------------ */

  const openPicker = () => {
    if (readOnly) return;
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
    if (readOnly) return;
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
        onSuccess: () => onUploaded?.(),
        onError: () =>
          Alert.alert("Upload failed", "Please try again."),
      }
    );
  };

  const confirmDelete = (id: number) => {
    if (readOnly) return;

    Alert.alert("Remove media", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          remove.mutate(id, {
            onSuccess: () => onUploaded?.(),
          }),
      },
    ]);
  };

  /* ------------------ RENDER ------------------ */

  return (
    <>
      {/* ❌ PREVIEW FEED ONLY FOR OWN PROFILE */}
      {!readOnly && gridMedia.length > 0 && (
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

      {/* GRID */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: GAP,
          paddingHorizontal: GAP,
        }}
      >
        {slots.map((item) => (
          <View
            key={item.id}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (item.media_type === "video") {
                  setVideoUrl(item.url);
                } else {
                  readOnly
                    ? setImageUrl(item.url)
                    : setPreviewIndex(
                        gridMedia.findIndex((m) => m.id === item.id)
                      );
                }
              }}
              style={{
                flex: 1,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.03)",
                overflow: "hidden",
              }}
            >
              {item.media_type === "image" && (
                <Image
                  source={{ uri: item.url }}
                  style={{ width: "100%", height: "100%" }}
                />
              )}

              {item.media_type === "video" && (
                <>
                  {item.thumbnail_url ? (
                    <Image
                      source={{ uri: item.thumbnail_url }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <View style={{ flex: 1, backgroundColor: "#000" }} />
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
              )}
            </TouchableOpacity>

            {/* ❌ DELETE ONLY FOR OWN PROFILE */}
            {!readOnly && (
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
                }}
              >
                {remove.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="close" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* ➕ ADD SLOT ONLY FOR OWN PROFILE */}
        {!readOnly && gridMedia.length < MAX && (
          <TouchableOpacity
            onPress={openPicker}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#6D5DF6",
              borderRadius: 20,
            }}
          />
        )}
      </View>

      {/* IMAGE VIEWER */}
      <Modal visible={!!imageUrl} transparent>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setImageUrl(null)}
        >
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{ width, height }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>

      {/* VIDEO VIEWER */}
      <VideoPreviewModal
        visible={!!videoUrl}
        videoUrl={videoUrl}
        onClose={() => setVideoUrl(null)}
      />

      {/* FEED PREVIEW (OWN PROFILE ONLY) */}
      {!readOnly && (
        <FeedPreviewModal
          visible={previewIndex !== null}
          media={gridMedia}
          startIndex={previewIndex ?? 0}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </>
  );
}
