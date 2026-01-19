import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";

import { ProfileMedia } from "../../context/CreateProfileContext";
import { mediaGridStyles } from "../../styles/create-profile-media.styles";

type Props = {
  media?: ProfileMedia;
  onAdd: () => void;
  onRemove: () => void;
  onPreview: () => void;
  rounded?: boolean;
  resizeMode?: "cover" | "contain";
  centerEmpty?: boolean;
};

export function MediaSlot({ media, onAdd, onRemove, onPreview }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={media ? onPreview : onAdd}
      style={[mediaGridStyles.slot, media && mediaGridStyles.filled]}
    >
      {media ? (
        <>
          {media.type === "image" ? (
            <Image
              source={{ uri: media.localUri }}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            <Video
              source={{ uri: media.localUri }}
              style={StyleSheet.absoluteFillObject}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
            />
          )}

          {/* Remove */}
          <TouchableOpacity onPress={onRemove} style={mediaGridStyles.remove}>
            <Ionicons name="close" size={14} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Dashed placeholder */}
          <View style={mediaGridStyles.placeholder} />

          {/* Floating + */}
          <View style={mediaGridStyles.plus}>
            <Ionicons name="add" size={20} color="#fff" />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
