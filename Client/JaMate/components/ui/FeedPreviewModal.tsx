import { Modal, View, Pressable, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfileMedia } from "../../context/CreateProfileContext";
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  media: ProfileMedia[];
  startIndex: number;
  onClose: () => void;
};

export function FeedPreviewModal({
  visible,
  media,
  startIndex,
  onClose,
}: Props) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  if (!media.length) return null;

  const current = media[index];
  const isVideo = current.type === "video";

  const next = () => {
    if (index < media.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        {isVideo ? (
          <Video
            source={{ uri: current.localUri }}
            style={styles.media}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls 
            shouldPlay
          />
        ) : (
          <Image
            source={{ uri: current.localUri }}
            style={styles.media}
            resizeMode="contain"
          />
        )}

        {!isVideo && (
          <>
            <Pressable style={styles.left} onPress={prev} />
            <Pressable style={styles.right} onPress={next} />
          </>
        )}

        <Pressable style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
  },

  media: {
    width,
    height,
  },

  left: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width * 0.4,
    height,
    zIndex: 10,
  },

  right: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width * 0.6,
    height,
    zIndex: 10,
  },

  close: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 20,
  },
});
