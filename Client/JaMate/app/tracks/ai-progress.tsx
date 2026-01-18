import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAiBackingJob } from "../../hooks/tracks/useAiBackingJob";
import { useGenerateBackingTrack } from "../../hooks/tracks/useGenerateBackingTrack";

export default function AiBackingProgress() {
  const router = useRouter();
  const { trackId } = useLocalSearchParams<{ trackId: string }>();

  const generateBacking = useGenerateBackingTrack();
  const [jobId, setJobId] = useState<number | null>(null);

  const { data: job } = useAiBackingJob(jobId);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!trackId) return;

    generateBacking.mutate(Number(trackId), {
      onSuccess: (res) => {
        setJobId(res.job_id);
      },
    });
  }, [trackId]);

  // ---------------- LOADING ----------------
  if (!job || job.status !== "done") {
    return (
      <View style={styles.center}>
        <Ionicons name="sparkles" size={42} color="#16C784" />
        <Text style={styles.status}>
          {job?.status === "queued"
            ? "Queued…"
            : job?.status === "analyzing"
            ? "AI analyzing your audio…"
            : "Generating backing track…"}
        </Text>
      </View>
    );
  }

  // ---------------- DONE ----------------
  const togglePlay = async () => {
    if (!job.track?.audio_url) return;

    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: job.track.audio_url },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      return;
    }

    const status = await soundRef.current.getStatusAsync();
    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Backing Track</Text>

      <TouchableOpacity style={styles.play} onPress={togglePlay}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={32}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/tracks")}>
        <Text style={styles.save}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    marginTop: 16,
    color: "#9CA3AF",
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 24,
  },
  play: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#16C784",
    justifyContent: "center",
    alignItems: "center",
  },
  save: {
    marginTop: 24,
    color: "#16C784",
    fontWeight: "600",
  },
});
