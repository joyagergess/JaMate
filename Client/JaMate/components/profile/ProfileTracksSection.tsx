import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Spinner } from "../../components/ui/Spinner";
import { TrackListItem } from "../../components/tracks/TrackListItem";
import { useTracksByProfileId } from "../../hooks/tracks/useTracksByProfileId";
import { profileTracksSectionStyles as styles } from "../../styles/profileTracksSection.styles";

type Filter = "all" | "originals" | "ai";

type Props = {
  profileId: number;
};

export function ProfileTracksSection({ profileId }: Props) {
  const { data: tracks, isLoading } =
    useTracksByProfileId(profileId);

  const [filter, setFilter] = useState<Filter>("all");

  const filteredTracks = useMemo(() => {
    if (!tracks || !tracks.length) return [];

    switch (filter) {
      case "originals":
        return tracks.filter(
          (t: any) => t.track_type !== "ai_generated"
        );
      case "ai":
        return tracks.filter(
          (t: any) => t.track_type === "ai_generated"
        );
      default:
        return tracks;
    }
  }, [tracks, filter]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Spinner size={28} />
      </View>
    );
  }

  return (
    <View>
      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <FilterButton
          label="All"
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterButton
          label="Originals"
          active={filter === "originals"}
          onPress={() => setFilter("originals")}
        />
        <FilterButton
          label="AI"
          active={filter === "ai"}
          onPress={() => setFilter("ai")}
        />
      </View>

      {filteredTracks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No tracks found
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredTracks.map((track: any) => (
            <TrackListItem
              key={track.id}
              item={track}
              isAi={track.track_type === "ai_generated"}
              isPlaying={false}
              loading={false}
              remainingSeconds={null}
              progress={0}
              onPlay={() => {}}
              onMenu={() => {}}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterButton,
        active
          ? styles.filterButtonActive
          : styles.filterButtonInactive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active
            ? styles.filterTextActive
            : styles.filterTextInactive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
