import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { Spinner } from "../ui/Spinner";

type Props = {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
};

export function VideoPreviewModal({
  visible,
  videoUrl,
  onClose,
}: Props) {
  const videoRef = useRef<Video>(null);
  const [token, setToken] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setVideoLoading(true);
      SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
    }
  }, [visible, videoUrl]);

  if (!visible || !videoUrl || !token) return null;

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {videoLoading && (
          <View style={styles.loader}>
            <Spinner size={42} />
          </View>
        )}

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

          /* RELIABLE PLAYBACK SIGNAL */
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded && status.isPlaying) {
              setVideoLoading(false);
            }
          }}

          /* SAFETY NETS */
          onReadyForDisplay={() => setVideoLoading(false)}
          onError={() => setVideoLoading(false)}
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
    zIndex: 20,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#000",
  },
});
