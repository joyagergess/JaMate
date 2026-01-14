import { Alert, Platform, Text, View, ScrollView } from "react-native";
import { ActionSheetIOS } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

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

const MAX_TOTAL = 4;
const MAX_VIDEOS = 2;
const MAX_VIDEO_SECONDS = 16;

function normalizeOrder(media: ProfileMedia[]): ProfileMedia[] {
  return media.map((m, i) => ({
    ...m,
    order_index: i + 1,
  }));
}

export default function CreateProfileMediaScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();
  const media = data.videos;

  const [feedIndex, setFeedIndex] = useState<number | null>(null);

  const addMedia = async (source: "camera" | "gallery") => {
    if (media.length >= MAX_TOTAL) {
      Alert.alert("Limit reached", "You can upload up to 4 media.");
      return;
    }

    const picked =
      source === "camera"
        ? await recordFromCamera()
        : await pickFromGallery();

    if (!picked) return;

    const videos = media.filter((m) => m.type === "video");

    if (picked.type === "video") {
      if (videos.length >= MAX_VIDEOS) {
        Alert.alert("Video limit", "You can upload only 2 videos.");
        return;
      }

      if (picked.duration && picked.duration > MAX_VIDEO_SECONDS) {
        Alert.alert(
          "Video too long",
          "Videos must be 16 seconds or less."
        );
        return;
      }
    }

    const next = normalizeOrder([
      ...media,
      {
        ...picked,
        id: Date.now(),
        order_index: media.length + 1, // temporary, normalized below
      } as ProfileMedia,
    ]);

    update({ videos: next });
  };

  const removeMedia = (index: number) => {
    const next = [...media];
    next.splice(index, 1);

    update({
      videos: normalizeOrder(next),
    });
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
    ...Array(Math.max(0, MAX_TOTAL - media.length)).fill(undefined),
  ];

  return (
    <CreateProfileLayout
      footer={
        <>
          <MediaProgressFooter current={media.length} min={1} />
          <AppButton
            title="Next"
            disabled={media.length === 0}
            onPress={() => router.push("/create-profile/bio")}
          />
        </>
      }
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <StepIndicator current={6} total={6} />

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.title}>Upload your media</Text>
          <Text style={styles.subtitle}>
            Max 4 media · up to 2 videos (16s max each)
          </Text>
        </View>

        <View style={gridStyles.grid}>
          {slots.map((item, index) => (
            <View key={index} style={gridStyles.cell}>
              <MediaSlot
                media={item}
                onAdd={openPicker}
                onRemove={() => removeMedia(index)}
                onPreview={() => item && setFeedIndex(index)}
              />
            </View>
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

const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  cell: {
    width: "48%",
  },
});
