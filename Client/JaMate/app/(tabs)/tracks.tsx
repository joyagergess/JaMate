import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

import { Spinner } from "../../components/ui/Spinner";
import { useMyTracks } from "../../hooks/tracks/useMyTracks";
import { useGenerateBackingTrack } from "../../hooks/tracks/useGenerateBackingTrack";
import { useDeleteTrack } from "../../hooks/tracks/useDeleteTrack";
import { matchesStyles as styles } from "../../styles/matches.styles";

import RecordSnippet from "../tracks/RecordSnippet";
import { EditTrackTitleModal } from "../../components/tracks/EditTrackTitleModal";
import { DeleteTrackConfirmModal } from "../../components/tracks/DeleteTrackConfirmModal";
import {
  TrackActionsMenu,
  MenuAnchor,
} from "../../components/tracks/TrackActionsMenu";

import { useAudioPlayer } from "../../hooks/tracks/useAudioPlayer";
import { TrackListItem } from "../../components/tracks/TrackListItem";
import { GeneratingCard } from "../../components/tracks/GeneratingCard";

import { useAiBacking } from "@/context/AiBackingContext";

type Tab = "tracks" | "ai" | "record";

export default function MyTracks() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: Tab }>();

  const { data: tracks, isLoading } = useMyTracks();
  const generateBacking = useGenerateBackingTrack();
  const deleteTrack = useDeleteTrack();
  const { setJobId } = useAiBacking();

  const [tab, setTab] = useState<Tab>("tracks");
  const [menuTrack, setMenuTrack] = useState<any | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const [editingTrack, setEditingTrack] = useState<any | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<any | null>(null);
  const [isGeneratingUi, setIsGeneratingUi] = useState(false);

  const {
    togglePlay,
    playingId,
    isPlaying,
    remainingSeconds,
    loadingTrackId,
    progress,
  } = useAudioPlayer();

  useEffect(() => {
    if (tabParam === "tracks" || tabParam === "ai" || tabParam === "record") {
      setTab(tabParam);
    }
  }, [tabParam]);

  const originals = useMemo(
    () => tracks?.filter((t: any) => t.track_type !== "ai_generated") ?? [],
    [tracks]
  );

  const aiTracks = useMemo(
    () => tracks?.filter((t: any) => t.track_type === "ai_generated") ?? [],
    [tracks]
  );

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

  return (
    <SafeAreaView style={styles.screen}>
      {/* TABS */}
      <View style={styles.tabs}>
        {["tracks", "ai", "record"].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t as Tab)}>
            <Text style={[styles.tabText, tab === t && styles.tabActive]}>
              {t === "tracks"
                ? "My Tracks"
                : t === "ai"
                ? "AI Backing Tracks"
                : "Record"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "record" ? (
        <RecordSnippet />
      ) : (
        <FlatList
          data={tab === "tracks" ? originals : aiTracks}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            tab === "ai" && isGeneratingUi ? <GeneratingCard /> : null
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TrackListItem
              item={item}
              isAi={tab === "ai"}
              isPlaying={playingId === item.id && isPlaying}
              loading={loadingTrackId === item.id}
              remainingSeconds={remainingSeconds}
              progress={playingId === item.id ? progress : 0}
              onPlay={() => togglePlay(item)}
              onMenu={(e) => openMenu(e, item)}
              onGenerateAi={
                tab === "tracks"
                  ? () => {
                      setTab("ai");
                      setIsGeneratingUi(true);

                      generateBacking.mutate(item.id, {
                        onSuccess: (data) => {
                          setIsGeneratingUi(false);
                          setJobId(data.job_id); 
                        },
                        onError: () => {
                          setIsGeneratingUi(false);
                        },
                      });
                    }
                  : undefined
              }
            />
          )}
        />
      )}

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

      {editingTrack && (
        <EditTrackTitleModal
          track={editingTrack}
          visible
          onClose={() => setEditingTrack(null)}
        />
      )}

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
