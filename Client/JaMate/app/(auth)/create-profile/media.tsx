import { Alert, Platform, Text, View, ScrollView } from "react-native";
import { ActionSheetIOS } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import {
  useCreateProfile,
  ProfileMedia,
} from "../../../context/CreateProfileContext";
import { pickFromGallery, recordFromCamera } from "../../../utils/mediaPicker";

import { MediaProgressFooter } from "../../../components/ui/MediaProgressFooter";
import { MediaSlot } from "../../../components/ui/MediaSlot";
import { FeedPreviewModal } from "../../../components/ui/FeedPreviewModal";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { AppButton } from "../../../components/ui/AppButton";
import { createProfileStyles as styles } from "../../../styles/create-profile.styles";

const MAX = 2;
const MIN = 2;

const MAX_VIDEOS = 1;
const MAX_IMAGES = 1;

const MAX_TOTAL_MB = 100;
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

export default function CreateProfileMediaScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();
  const media = data.videos;

  const [feedIndex, setFeedIndex] = useState<number | null>(null);

  const addMedia = async (source: "camera" | "gallery") => {
    const picked =
      source === "camera"
        ? await recordFromCamera()
        : await pickFromGallery();

    if (!picked) return;

    const videos = media.filter(m => m.type === "video");
    const images = media.filter(m => m.type === "image");
    const totalSize = media.reduce((sum, m) => sum + m.size, 0);

    if (picked.type === "video" && videos.length >= MAX_VIDEOS) {
      Alert.alert(
        "Video limit reached",
        "You can upload only one video."
      );
      return;
    }

    if (picked.type === "image" && images.length >= MAX_IMAGES) {
      Alert.alert(
        "Image limit reached",
        "You can upload only one photo."
      );
      return;
    }

    // ❌ total size limit
    if (totalSize + picked.size > MAX_TOTAL_BYTES) {
      Alert.alert(
        "Storage limit exceeded",
        "Total media size cannot exceed 100 MB."
      );
      return;
    }

    update({
      videos: [...media, { ...picked, id: Date.now() }],
    });
  };

  const removeMedia = (index: number) => {
    const next = [...media];
    next.splice(index, 1);
    update({ videos: next });
  };

  const openPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Camera", "Gallery"],
          cancelButtonIndex: 0,
        },
        (i) => {
          if (i === 1) addMedia("camera");
          if (i === 2) addMedia("gallery");
        }
      );
    } else {
      Alert.alert("Add media", "", [
        { text: "Camera", onPress: () => addMedia("camera") },
        { text: "Gallery", onPress: () => addMedia("gallery") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const slots: (ProfileMedia | undefined)[] = [
    ...media,
    ...Array(MAX - media.length).fill(undefined),
  ];

  const hasVideo = media.some(m => m.type === "video");
  const hasImage = media.some(m => m.type === "image");
  const canContinue = hasVideo && hasImage;

  return (
    <CreateProfileLayout
      footer={
        <>
          <MediaProgressFooter current={media.length} min={MIN} />
          <AppButton
            title="Next"
            disabled={!canContinue}
            onPress={() => router.push("/create-profile/bio")}
          />
        </>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <StepIndicator current={6} total={6} />

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.title}>
            Upload a video and a photo
          </Text>

          <Text style={styles.subtitle}>
            Add exactly one video and one photo to get started.
          </Text>
        </View>

        <View style={gridStyles.grid}>
          {slots.map((item, index) => (
            <MediaSlot
              key={index}
              media={item}
              onAdd={openPicker}
              onRemove={() => removeMedia(index)}
              onPreview={() => item && setFeedIndex(index)}
            />
          ))}
        </View>
      </ScrollView>

      <FeedPreviewModal
        visible={feedIndex !== null}
        media={media}
        startIndex={feedIndex ?? 0}
        onClose={() => setFeedIndex(null)}
      />
    </CreateProfileLayout>
  );
}

import { StyleSheet } from "react-native";

const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
});
