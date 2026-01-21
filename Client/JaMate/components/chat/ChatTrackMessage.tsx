import { View } from "react-native";
import { TrackListItem } from "@/components/tracks/TrackListItem";
import { useAudioPlayer } from "@/hooks/tracks/useAudioPlayer";

type Props = {
  item: {
    id: number;
    title: string;
    duration: number;
    created_at?: string;
  };
  isMe: boolean;
};

export function ChatTrackMessage({ item, isMe }: Props) {
  const {
    togglePlay,
    playingId,
    isPlaying,
    remainingSeconds,
    loadingTrackId,
    progress,
  } = useAudioPlayer();

  return (
    <View
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        width: "92%",
        maxWidth: 420,
      }}
    >
      <TrackListItem
        item={item}
        isAi={false}
        isPlaying={playingId === item.id && isPlaying}
        loading={loadingTrackId === item.id}
        remainingSeconds={remainingSeconds}
        progress={playingId === item.id ? progress : 0}
        onPlay={() => togglePlay(item)}
        onMenu={() => {}}
      />
    </View>
  );
}
