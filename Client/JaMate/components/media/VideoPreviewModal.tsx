import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AUTH_TOKEN_KEY } from "../../constants/auth";

type Props = {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
};

export function VideoPreviewModal({ visible, videoUrl, onClose }: Props) {
  const videoRef = useRef<Video>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
    }
  }, [visible]);

  if (!visible || !videoUrl || !token) return null;

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <Video
          ref={videoRef}
          key={videoUrl}
          source={{
            uri: videoUrl,
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          isLooping
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  close: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
