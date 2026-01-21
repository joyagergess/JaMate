import { View } from "react-native";
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
      </View>
    </View>
  );
}
