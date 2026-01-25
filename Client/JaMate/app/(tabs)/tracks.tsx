import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { Spinner } from "../../components/ui/Spinner";
import { SearchBar } from "../../components/ui/SearchBar";
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
import { useAiBackingJob } from "@/hooks/tracks/useAiBackingJob";

import { TracksTabs } from "../../components/tracks/TracksTabs";
import { TracksEmptyState } from "../../components/tracks/TracksEmptyState";
import { TracksList } from "../../components/tracks/TracksList";
import { AiDoneOverlay } from "../../components/tracks/AiDoneOverlay";

type Tab = "tracks" | "ai" | "record";

export default function MyTracks() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: Tab }>();
  const queryClient = useQueryClient();

  const { data: tracks, isLoading } = useMyTracks();
  const generateBacking = useGenerateBackingTrack();
  const deleteTrack = useDeleteTrack();

  const [jobId, setJobId] = useState<number | null>(null);
  const [jobHandled, setJobHandled] = useState(false);

  const { data: aiJob } = useAiBackingJob(jobId);

  useEffect(() => {
    if (aiJob?.status === "done" || aiJob?.status === "failed") {
      setJobId(null); 
    }
  }, [aiJob]);


  useEffect(() => {
    if (!aiJob || jobHandled) return;

    if (aiJob.status === "done") {
      console.log("AI JOB DONE");

      setIsGeneratingUi(false);
      setAiDoneVisible(true);
      setJobHandled(true);

      queryClient.invalidateQueries({ queryKey: ["my-tracks"] });
    }
  }, [aiJob, jobHandled, queryClient]);

  const [tab, setTab] = useState<Tab>("tracks");
  const [menuTrack, setMenuTrack] = useState<any | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const [editingTrack, setEditingTrack] = useState<any | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<any | null>(null);

  const [isGeneratingUi, setIsGeneratingUi] = useState(false);
  const [aiDoneVisible, setAiDoneVisible] = useState(false);
  const [search, setSearch] = useState("");

  type Track = {
    id: number;
    title?: string;
    track_type: string;
  };

  const audio = useAudioPlayer();

  useEffect(() => {
    if (tabParam) setTab(tabParam);
  }, [tabParam]);

  const originals = useMemo(
    () => tracks?.filter((t: Track) => t.track_type !== "ai_generated") ?? [],
    [tracks],
  );

  const aiTracks = useMemo(
    () => tracks?.filter((t: Track) => t.track_type === "ai_generated") ?? [],
    [tracks],
  );

  const data =
    tab === "tracks"
      ? originals.filter((t: Track) =>
          t.title?.toLowerCase().includes(search.toLowerCase()),
        )
      : aiTracks.filter((t: Track) =>
          t.title?.toLowerCase().includes(search.toLowerCase()),
        );

  useEffect(() => {
    if (!aiJob || jobHandled) return;

    if (aiJob.status === "done") {
      console.log("AI JOB DONE");

      setIsGeneratingUi(false);
      setAiDoneVisible(true);
      setJobHandled(true);

      queryClient.invalidateQueries({ queryKey: ["my-tracks"] });
    }
  }, [aiJob, jobHandled, queryClient]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <Spinner size={40} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <TracksTabs tab={tab} onChange={setTab} />

      {tab !== "record" && (
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by title…"
        />
      )}

      {tab === "record" ? (
        <RecordSnippet />
      ) : data.length === 0 && !isGeneratingUi ? (
        <TracksEmptyState
          text={
            tab === "tracks" ? "No tracks found" : "No AI backing tracks found"
          }
        />
      ) : (
        <TracksList
          data={data}
          isAi={tab === "ai"}
          isGeneratingUi={isGeneratingUi}
          onPlay={audio.togglePlay}
          {...audio}
          onMenu={(e, item) => {
            e.currentTarget.measureInWindow(
              (x: number, y: number, width: number, height: number) => {
                setMenuAnchor({ x, y, width, height });
                setMenuTrack(item);
              },
            );
          }}
          onGenerateAi={(item) => {
            setTab("ai");
            setIsGeneratingUi(true);
            generateBacking.mutate(item.id, {
              onSuccess: (d) => setJobId(d.data.job_id),
              onError: () => setIsGeneratingUi(false),
            });
          }}
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

      {aiDoneVisible && (
        <AiDoneOverlay
          onClose={() => {
            setAiDoneVisible(false);
            setTab("ai");
          }}
        />
      )}
    </SafeAreaView>
  );
}
