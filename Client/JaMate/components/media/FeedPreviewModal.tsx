import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProfileMedia } from "../../hooks/profile/useProfileMedia";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { feedPreviewModalStyles as styles } from "../../styles/feedPreviewModal.styles";

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
  const [token, setToken] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
    }
  }, [visible]);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  if (!visible || !media.length || !token) return null;

  const current = media[index];

  const next = () => {
    if (index < media.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar hidden />

      <View style={styles.container}>
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeButton,
            { top: insets.top + 12 },
          ]}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>

        {current.media_type === "image" ? (
          <Image
            key={current.id}
            source={{ uri: current.url }}
            style={styles.media}
            resizeMode="cover"
          />
        ) : (
          <Video
            key={current.id}
            source={{
              uri: current.url,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={false}
            useNativeControls={false}
          />
        )}

        <View style={styles.navigationOverlay}>
          <TouchableOpacity
            style={styles.navZone}
            onPress={prev}
          />
          <TouchableOpacity
            style={styles.navZone}
            onPress={next}
          />
        </View>

        <View
          style={[
            styles.progressContainer,
            { top: insets.top + 8 },
          ]}
        >
          {media.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressBar,
                {
                  backgroundColor:
                    i <= index
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.3)",
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}
