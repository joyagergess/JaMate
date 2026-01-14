import * as ImagePicker from "expo-image-picker";
import { Platform, Alert } from "react-native";

const MAX_VIDEO_DURATION = 16;
export type PickedMedia = {
  localUri: string;
  type: "image" | "video";
  mimeType: string;
  size: number;
  duration?: number; 
};

function getDurationInSeconds(duration: number | null | undefined): number {
  if (duration == null) return 0;

  return duration > 100 ? duration / 1000 : duration;
}

export async function pickFromGallery(): Promise<PickedMedia | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) return null;

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: false,
    quality: 1,
    videoExportPreset:
      Platform.OS === "ios"
        ? ImagePicker.VideoExportPreset.Passthrough
        : undefined,
  });

  if (res.canceled) return null;

  const asset = res.assets[0];

  // ✅ FIXED DURATION CHECK
  if (asset.type === "video") {
    const durationSec = getDurationInSeconds(asset.duration);

    if (durationSec > MAX_VIDEO_DURATION) {
      Alert.alert(
        "Video too long",
        `Please select a video shorter than ${MAX_VIDEO_DURATION} seconds.`
      );
      return null;
    }
  }

  return {
    localUri: asset.uri,
    type: asset.type === "video" ? "video" : "image",
    mimeType:
      asset.mimeType ?? (asset.type === "video" ? "video/mp4" : "image/jpeg"),
    size: asset.fileSize ?? 0,
  };
}

export async function recordFromCamera(): Promise<PickedMedia | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) return null;

  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: false,
    quality: 1,
    videoExportPreset:
      Platform.OS === "ios"
        ? ImagePicker.VideoExportPreset.Passthrough
        : undefined,
  });

  if (res.canceled) return null;

  const asset = res.assets[0];

  // ✅ FIXED DURATION CHECK
  if (asset.type === "video") {
    const durationSec = getDurationInSeconds(asset.duration);

    if (durationSec > MAX_VIDEO_DURATION) {
      Alert.alert(
        "Video too long",
        `Please record a video shorter than ${MAX_VIDEO_DURATION} seconds.`
      );
      return null;
    }
  }

  return {
    localUri: asset.uri,
    type: asset.type === "video" ? "video" : "image",
    mimeType:
      asset.mimeType ?? (asset.type === "video" ? "video/mp4" : "image/jpeg"),
    size: asset.fileSize ?? 0,
  };
}
