import { Alert, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  useCreateProfile,
  ProfileMedia,
} from "../../../context/CreateProfileContext";
import { pickFromGallery } from "../../../utils/mediaPicker";

import { MediaSlot } from "../../../components/ui/MediaSlot";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { AppButton } from "../../../components/ui/AppButton";
import { createProfileStyles as styles } from "../../../styles/create-profile.styles";

/* ===================== HELPERS ===================== */

function normalizeAvatar(media: ProfileMedia[]): ProfileMedia[] {
  return media.map((m) => ({
    ...m,
    order_index: 1, // always avatar
  }));
}

/* ===================== SCREEN ===================== */

export default function CreateProfileMediaScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();
  const media = data.videos ?? [];

  const avatar = media[0];

  const pickAvatar = async () => {
    const picked = await pickFromGallery();

    if (!picked || picked.type !== "image") {
      Alert.alert("Invalid", "Please select an image.");
      return;
    }

    update({
      videos: normalizeAvatar([
        {
          ...picked,
          id: Date.now(),
        } as ProfileMedia,
      ]),
    });
  };

  const removeAvatar = () => {
    update({ videos: [] });
  };

  /* ===================== UI ===================== */

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title="Next"
          disabled={!avatar}
          onPress={() => router.push("/create-profile/bio")}
        />
      }
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <StepIndicator current={8} />

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.title}>Add a profile picture</Text>
          <Text style={styles.subtitle}>
            This will be shown on your profile
          </Text>
        </View>

        <View style={styles.avatarFrame}>
          <MediaSlot
            media={avatar}
            rounded
            resizeMode="cover"
            centerEmpty
            onAdd={pickAvatar}
            onRemove={removeAvatar}
          />
        </View>
      </ScrollView>
    </CreateProfileLayout>
  );
}
