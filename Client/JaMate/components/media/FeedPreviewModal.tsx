import {
  Modal,
  View,
  Dimensions,
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
  const [token, setToken] = useState<string | null>(null);
  const insets = useSafeAreaInsets(); // 🔥 KEY FIX

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

      <View
        style={{
          width,
          height,
          backgroundColor: "#000",
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: insets.top + 12,
            right: 20,
            zIndex: 50,
          }}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>

        {current.media_type === "image" ? (
          <Image
            key={current.id}
            source={{ uri: current.url }}
            style={{ width, height }}
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
            style={{ width, height }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={false}
            useNativeControls={false}
          />
        )}

        <View
          style={{
            position: "absolute",
            inset: 0,
            flexDirection: "row",
            zIndex: 20,
          }}
        >
          <TouchableOpacity
            style={{ width: "50%", height: "100%" }}
            onPress={prev}
          />
          <TouchableOpacity
            style={{ width: "50%", height: "100%" }}
            onPress={next}
          />
        </View>

        <View
          style={{
            position: "absolute",
            top: insets.top + 8, 
            left: 0,
            right: 0,
            flexDirection: "row",
            gap: 6,
            paddingHorizontal: 12,
            zIndex: 30,
          }}
        >
          {media.map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 3,
                backgroundColor:
                  i <= index
                    ? "#fff"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}
