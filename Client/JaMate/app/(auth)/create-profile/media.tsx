import { Alert, Platform, Text, View, ScrollView } from "react-native";
import { ActionSheetIOS } from "react-native";
import { useState } from "react";

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

const MAX = 6;
const MIN = 3;

export default function CreateProfileMediaScreen() {
  const router = useRouter();

  const { data, update } = useCreateProfile();
  const videos = data.videos;

  const [feedIndex, setFeedIndex] = useState<number | null>(null);

  const addMedia = async (source: "camera" | "gallery") => {
    const media =
      source === "camera" ? await recordFromCamera() : await pickFromGallery();

    if (!media) return;

    update({
      videos: [...videos, { ...media, id: Date.now() }],
    });
  };

  const removeMedia = (index: number) => {
    const next = [...videos];
    next.splice(index, 1);
    update({ videos: next });
  };

  const openPicker = (index: number) => {
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
    ...videos,
    ...Array(MAX - videos.length).fill(undefined),
  ];

  return (
    <CreateProfileLayout
      footer={
        <>
          <MediaProgressFooter current={videos.length} min={MIN} />
          <AppButton
            title="Next"
            disabled={videos.length < MIN}
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
            Upload videos or photos of you playing
          </Text>

          <Text style={styles.subtitle}>
            These will appear on your public profile. Add at least 3 and arrange
            them in the order you want.
          </Text>
        </View>

        <View style={gridStyles.grid}>
          {slots.map((item, index) => (
            <MediaSlot
              key={index}
              media={item}
              onAdd={() => openPicker(index)}
              onRemove={() => removeMedia(index)}
              onPreview={() => item && setFeedIndex(index)}
            />
          ))}
        </View>
      </ScrollView>

      <FeedPreviewModal
        visible={feedIndex !== null}
        media={videos}
        startIndex={feedIndex ?? 0}
        onClose={() => setFeedIndex(null)}
      />
    </CreateProfileLayout>
  );
}

import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
});
