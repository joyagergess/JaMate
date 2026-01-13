import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useEffect, useRef, useState } from "react";

type Props = {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
};

export function VideoPreviewModal({ visible, videoUrl, onClose }: Props) {
  const videoRef = useRef<Video>(null);
  const [ready, setReady] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (visible) {
      setReady(false);
    }
  }, [visible, videoUrl]);

  if (!visible || !videoUrl) return null;

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <Video
          ref={videoRef}
          key={videoUrl} 
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={false}          
          isLooping
          isMuted={false}
          volume={1.0}
          rate={1.0}
          ignoreSilentSwitch="ignore" 
          onLoad={async () => {
            setReady(true);
            await videoRef.current?.playAsync(); 
          }}
          onError={(e) => {
            console.log("VIDEO ERROR:", e);
          }}
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
    backgroundColor: "#000",
  },
  close: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
