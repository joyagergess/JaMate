import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function RecordSnippet() {
  const router = useRouter();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    setDuration(0);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
    });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await rec.startAsync();

    intervalRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    setRecording(rec);
  };

  const stopRecording = async () => {
    if (!recording) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (!uri) return;

    router.push({
      pathname: "/tracks/preview",
      params: { uri, duration: String(duration) },
    });
  };

  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    router.push({
      pathname: "/tracks/preview",
      params: { uri: asset.uri, duration: "0" },
    });
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record a Snippet</Text>
      <Text style={styles.timer}>{formatTime(duration)}</Text>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Ionicons name={recording ? "stop" : "mic"} size={30} color="white" />
      </TouchableOpacity>

      {!recording && (
        <TouchableOpacity style={styles.uploadBtn} onPress={pickAudioFile}>
          <Ionicons name="cloud-upload-outline" size={20} color="#7C7CFF" />
          <Text style={styles.uploadText}>Upload from phone</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },
  timer: {
    color: "#7C7CFF",
    fontSize: 42,
    marginBottom: 40,
    fontVariant: ["tabular-nums"],
  },
  mainButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#7C7CFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#7C7CFF55",
  },
  uploadText: {
    color: "#7C7CFF",
    fontSize: 14,
  },
});
