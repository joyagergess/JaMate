import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Audio } from "expo-av";

import { Spinner } from "../../components/ui/Spinner";
import { useMyTracks } from "../../hooks/tracks/useMyTracks";
import { useGenerateBackingTrack } from "../../hooks/tracks/useGenerateBackingTrack";
import { useDeleteTrack } from "../../hooks/tracks/useDeleteTrack";
import { matchesStyles as styles } from "../../styles/matches.styles";

import { RecordSnippet } from "../tracks/RecordSnippet";
import { EditTrackTitleModal } from "../../components/tracks/EditTrackTitleModal";
import { DeleteTrackConfirmModal } from "../../components/tracks/DeleteTrackConfirmModal";
import {
  TrackActionsMenu,
  MenuAnchor,
} from "../../components/tracks/TrackActionsMenu";

/* ------------------ TYPES ------------------ */
type Tab = "tracks" | "ai" | "record";

/* ------------------ COMPONENT ------------------ */
export default function MyTracks() {
  const { data: tracks, isLoading } = useMyTracks();
  const generateBacking = useGenerateBackingTrack();
  const deleteTrack = useDeleteTrack();

  const [tab, setTab] = useState<Tab>("tracks");

  const [menuTrack, setMenuTrack] = useState<any | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const [editingTrack, setEditingTrack] = useState<any | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<any | null>(null);

  /* ------------------ AUDIO STATE ------------------ */
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentTrackIdRef = useRef<number | null>(null);

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const originals = useMemo(
    () => tracks?.filter((t: any) => t.track_type !== "ai_generated") ?? [],
    [tracks]
  );

  const aiTracks = useMemo(
    () => tracks?.filter((t: any) => t.track_type === "ai_generated") ?? [],
    [tracks]
  );

  /* ------------------ AUDIO ------------------ */
  const togglePlay = async (track: any) => {
    if (!track.audio_public_url) return;

    // 🔊 FORCE MAIN SPEAKER
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
    });

    const isSameTrack = currentTrackIdRef.current === track.id;

    // 🔥 ALWAYS discard old sound when switching tracks
    if (soundRef.current && !isSameTrack) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      currentTrackIdRef.current = null;
      setPlayingId(null);
      setRemainingSeconds(null);
    }

    // ▶️ CREATE NEW SOUND
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio_public_url },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        if (status.durationMillis && status.positionMillis) {
          const remaining = Math.ceil(
            (status.durationMillis - status.positionMillis) / 1000
          );
          setRemainingSeconds(Math.max(remaining, 0));
        }

        if (status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          currentTrackIdRef.current = null;
          setPlayingId(null);
          setRemainingSeconds(null);
        }
      });

      soundRef.current = sound;
      currentTrackIdRef.current = track.id;
      setPlayingId(track.id);
      setRemainingSeconds(track.duration ?? null);
      return;
    }

    // ⏯ TOGGLE SAME TRACK
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setPlayingId(null);
    } else {
      await soundRef.current.playAsync();
      setPlayingId(track.id);
    }
  };

  const openMenu = (event: any, track: any) => {
    event.currentTarget.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setMenuAnchor({ x, y, width, height });
        setMenuTrack(track);
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <Spinner size={40} />
      </SafeAreaView>
    );
  }

  /* ------------------ RENDER TRACK ------------------ */
  const renderTrack = (item: any, isAi: boolean) => {
    const isPlaying = playingId === item.id;

    return (
      <View style={[styles.card, { flexDirection: "column" }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* PLAY */}
          <TouchableOpacity onPress={() => togglePlay(item)}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={22}
              color={isAi ? "#16C784" : "#fff"}
            />
          </TouchableOpacity>

          {/* INFO */}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.title}</Text>

            <Text style={styles.sub}>
              {isPlaying && remainingSeconds !== null
                ? `${remainingSeconds}s`
                : isAi
                ? "AI backing track"
                : `${item.duration}s`}
            </Text>

            <Text
              style={{
                marginTop: 2,
                color: "#6B7280",
                fontSize: 11,
              }}
            >
              {new Date(item.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* ACTIONS */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {!isAi && (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/tracks/ai-progress",
                    params: { trackId: String(item.id) },
                  });
                  generateBacking.mutate(item.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#1F2937",
                  borderWidth: 1,
                  borderColor: "#374151",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={12}
                  color="#16C784"
                />
                <Text
                  style={{
                    color: "#16C784",
                    fontSize: 11,
                    fontWeight: "600",
                  }}
                >
                  AI track
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={(e) => openMenu(e, item)}
              style={{ padding: 6 }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("tracks")}>
          <Text style={[styles.tabText, tab === "tracks" && styles.tabActive]}>
            My Tracks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("ai")}>
          <Text style={[styles.tabText, tab === "ai" && styles.tabActive]}>
            AI Backing Tracks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("record")}>
          <Text style={[styles.tabText, tab === "record" && styles.tabActive]}>
            Record
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      {tab === "record" ? (
        <RecordSnippet />
      ) : (
        <FlatList
          data={tab === "tracks" ? originals : aiTracks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => renderTrack(item, tab === "ai")}
        />
      )}

      {/* CONTEXT MENU */}
      {menuTrack && (
        <TrackActionsMenu
          visible
          anchor={menuAnchor}
          onClose={() => {
            setMenuTrack(null);
            setMenuAnchor(null);
          }}
          onEdit={() => setEditingTrack(menuTrack)}
          onDelete={() => setDeletingTrack(menuTrack)}
        />
      )}

      {/* EDIT MODAL */}
      {editingTrack && (
        <EditTrackTitleModal
          track={editingTrack}
          visible
          onClose={() => setEditingTrack(null)}
        />
      )}

      {/* DELETE CONFIRM */}
      {deletingTrack && (
        <DeleteTrackConfirmModal
          visible
          onCancel={() => setDeletingTrack(null)}
          onConfirm={() => {
            deleteTrack.mutate(deletingTrack.id);
            setDeletingTrack(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}
