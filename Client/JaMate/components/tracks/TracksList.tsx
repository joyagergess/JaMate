import { FlatList } from "react-native";
import { TrackListItem } from "./TrackListItem";
import { GeneratingCard } from "./GeneratingCard";
import { myTracksStyles as s } from "../../styles/myTracks.styles";

type Props = {
  data: any[];
  isAi: boolean;
  isGeneratingUi: boolean;
  playingId: number | null;
  isPlaying: boolean;
  loadingTrackId: number | null;
  remainingSeconds: number | null;
  progress: number;
  onPlay: (item: any) => void;
  onMenu: (e: any, item: any) => void;
  onGenerateAi?: (item: any) => void;
};

export function TracksList({
  data,
  isAi,
  isGeneratingUi,
  playingId,
  isPlaying,
  loadingTrackId,
  remainingSeconds,
  progress,
  onPlay,
  onMenu,
  onGenerateAi,
}: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        isAi && isGeneratingUi ? <GeneratingCard /> : null
      }
      contentContainerStyle={s.listContent}
      renderItem={({ item }) => (
        <TrackListItem
          item={item}
          isAi={isAi}
          isPlaying={playingId === item.id && isPlaying}
          loading={loadingTrackId === item.id}
          remainingSeconds={remainingSeconds}
          progress={playingId === item.id ? progress : 0}
          onPlay={() => onPlay(item)}
          onMenu={(e) => onMenu(e, item)}
          onGenerateAi={
            !isAi && onGenerateAi
              ? () => onGenerateAi(item)
              : undefined
          }
        />
      )}
    />
  );
}
