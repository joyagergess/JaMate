import { Modal, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { ProfileMedia } from "../../context/CreateProfileContext";

type Props = {
  visible: boolean;
  media?: ProfileMedia;
  onClose: () => void;
};

export function MediaPreviewModal({ visible, media, onClose }: Props) {
  if (!media) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        {media.type === "image" ? (
          <Image
            source={{ uri: media.localUri }}
            style={styles.media}
            resizeMode="contain"
          />
        ) : (
          <Video
            source={{ uri: media.localUri }}
            style={styles.media}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  close: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 10,
  },
});
