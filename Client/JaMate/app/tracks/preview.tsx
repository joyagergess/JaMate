import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { styles } from "../../styles/trackPreview.styles";
import { useUploadTrack } from "../../hooks/tracks/useUploadTrack";

export default function TrackPreview() {
  const router = useRouter();

  const { uri, duration } = useLocalSearchParams<{
    uri: string;
    duration?: string;
  }>();

  const uploadTrack = useUploadTrack();
  const soundRef = useRef<Audio.Sound | null>(null);

  const initialDurationMs = duration ? Number(duration) * 1000 : 0;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 → 1
  const [durationMs, setDurationMs] = useState(initialDurationMs);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const loadSound = async () => {
    if (!uri) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      {
        shouldPlay: false,
        progressUpdateIntervalMillis: 50,
      },
      onPlaybackStatusUpdate,
    );

    soundRef.current = sound;
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (status.durationMillis) {
      setDurationMs(status.durationMillis);
      setProgress(status.positionMillis / status.durationMillis);
    }

    if (status.didJustFinish) {
      setIsPlaying(false);
      setProgress(1);
    }
  };

  const togglePlay = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
    });

    if (!soundRef.current) {
      await loadSound();
    }

    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const replay = async () => {
    if (!soundRef.current) return;

    await soundRef.current.setPositionAsync(0);
    await soundRef.current.playAsync();
    setIsPlaying(true);
  };

  const handleConfirm = () => {
    if (!uri) return;

    const finalDurationSeconds = Math.max(1, Math.round(durationMs / 1000));

    uploadTrack.mutate(
      {
        uri,
        duration: finalDurationSeconds,
        trackType: "snippet",
      },
      {
        onSuccess: () => {
          router.replace("/tracks");
        },
        onError: (error: any) => {
          console.log("UPLOAD ERROR:", error);

          Alert.alert(
            "Upload failed",
            error?.response?.data?.message ?? "Check console logs",
          );
        },
      },
    );
  };

  const isUploading = uploadTrack.isPending;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.icon}>
          <Ionicons name="musical-notes" size={20} color="#7C7CFF" />
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>Snippet</Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress * 100, 100)}%` },
              ]}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={progress === 1 ? replay : togglePlay}
          disabled={isUploading}
        >
          <Ionicons
            name={progress === 1 ? "refresh" : isPlaying ? "pause" : "play"}
            size={22}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: "/tracks",
              params: { tab: "record" },
            })
          }
          disabled={isUploading}
        >
          <Text style={styles.link}>Re-record</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleConfirm} disabled={isUploading}>
          <Text style={styles.linkPrimary}>
            {isUploading ? "Uploading…" : "Confirm"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
