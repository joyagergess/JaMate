import * as ImagePicker from "expo-image-picker";
import { ProfileMedia } from "../context/CreateProfileContext";

type PickedMedia = Omit<ProfileMedia, "id">;

export async function pickFromGallery(): Promise<PickedMedia | null> {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) return null;

  const res = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  quality: 1,
  allowsEditing: false,
  videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
});


  if (res.canceled) return null;

  const a = res.assets[0];

  return {
    localUri: a.uri,
    type: a.type === "image" ? "image" : "video",
    mimeType: a.mimeType ?? "video/mp4",
  };
}

export async function recordFromCamera(): Promise<PickedMedia | null> {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) return null;

  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    quality: 1,
  });

  if (res.canceled) return null;

  const a = res.assets[0];

  return {
    localUri: a.uri,
    type: a.type === "image" ? "image" : "video", 
    mimeType: a.mimeType ?? "video/mp4",
  };
}
