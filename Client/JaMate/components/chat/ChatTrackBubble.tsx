import { View, Text } from "react-native";
import { TrackListItem } from "@/components/tracks/TrackListItem";
import { useAudioPlayer } from "@/hooks/tracks/useAudioPlayer";

type Props = {
  track: {
    id: number;
    title: string;
    duration: number;
    audio_public_url?: string;
    track_type?: string;
    created_at?: string;
  };
  isMe: boolean;
};
const formatHour = (date?: string) => {
  if (!date) return null;
  return new Date(date)
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

export function ChatTrackBubble({ track, isMe }: Props) {
  const {
    togglePlay,
    playingId,
    isPlaying,
    remainingSeconds,
    loadingTrackId,
    progress,
  } = useAudioPlayer();

  if (!track?.audio_public_url) return null;

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 12,
        alignItems: isMe ? "flex-end" : "flex-start",
        marginVertical: 6,
      }}
    >
      <View
        style={{
          width: "80%",
          maxWidth: 420,
          position: "relative",
        }}
      >
        <TrackListItem
          item={track}
          isAi={track.track_type === "ai_generated"}
          isPlaying={playingId === track.id && isPlaying}
          loading={loadingTrackId === track.id}
          remainingSeconds={remainingSeconds}
          progress={playingId === track.id ? progress : 0}
          onPlay={() => togglePlay(track)}
          onMenu={() => {}}
        />
        {track.created_at && (
          <Text
            style={{
              position: "absolute",
              bottom: 8,
              right: 10,
              fontSize: 11,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {formatHour(track.created_at)}
          </Text>
        )}
      </View>
    </View>
  );
}
