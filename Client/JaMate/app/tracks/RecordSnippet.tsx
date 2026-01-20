import { View, Text, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { styles } from "../../styles/recordSnippet.styles";

export default function RecordSnippet() {
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

    goToPreview(uri, duration);
  };

  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    goToPreview(asset.uri, 0);
  };

  const goToPreview = (uri: string, duration: number) => {
    router.push({
      pathname: "/tracks/preview",
      params: {
        uri,
        duration: String(duration),
      },
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
        <Ionicons
          name={recording ? "stop" : "mic"}
          size={30}
          color="white"
        />
      </TouchableOpacity>

      {!recording && (
        <TouchableOpacity style={styles.uploadBtn} onPress={pickAudioFile}>
          <Ionicons
            name="cloud-upload-outline"
            size={20}
            color="#7C7CFF"
          />
          <Text style={styles.uploadText}>Upload from phone</Text>
        </TouchableOpacity>
      )}

      
    </View>
  );
}
