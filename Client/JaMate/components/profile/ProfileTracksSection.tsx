import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Spinner } from "../../components/ui/Spinner";
import { TrackListItem } from "../../components/tracks/TrackListItem";
import { useTracksByProfileId } from "../../hooks/tracks/useTracksByProfileId";

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
      <View style={{ paddingVertical: 40 }}>
        <Spinner size={28} />
      </View>
    );
  }

  return (
    <View>
      {/* FILTER BAR */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 16,
          gap: 12,
        }}
      >
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

      {/* TRACKS */}
      {filteredTracks.length === 0 ? (
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
            }}
          >
            No tracks found
          </Text>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
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
      style={{
        paddingHorizontal: 14,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        backgroundColor: active
          ? "rgba(109,93,246,0.2)"
          : "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: active
          ? "#6D5DF6"
          : "rgba(255,255,255,0.1)",
      }}
    >
      <Text
        style={{
          color: active ? "#6D5DF6" : "#9CA3AF",
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
