import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { matchesStyles as styles } from "../../styles/matches.styles";
import { formatDate } from "../../utils/formatDate";

type Props = {
  item: any;
  isAi: boolean;
  isPlaying: boolean;
  loading: boolean;
  remainingSeconds: number | null;
  progress: number;
  onPlay: () => void;
  onMenu: (e: any) => void;
  onGenerateAi?: () => void;
};

export function TrackListItem({
  item,
  isAi,
  isPlaying,
  loading,
  remainingSeconds,
  progress,
  onPlay,
  onMenu,
  onGenerateAi,
}: Props) {
  return (
    <View style={[styles.card, { flexDirection: "column" }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity onPress={onPlay} disabled={loading}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={isAi ? "#16C784" : "#fff"}
            />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={22}
              color={isAi ? "#16C784" : "#fff"}
            />
          )}
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          {/* TITLE */}
          <Text style={styles.name}>{item.title}</Text>

          {/* SUBTITLE */}
          <Text style={styles.sub}>
            {isPlaying && remainingSeconds !== null
              ? `${remainingSeconds}s`
              : isAi
              ? "AI backing track"
              : `${item.duration}s`}
          </Text>

          {/* PROGRESS BAR */}
          <View
            style={{
              height: 4,
              backgroundColor: "#1F2937",
              borderRadius: 999,
              marginTop: 6,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: isAi ? "#16C784" : "#7C7CFF",
                opacity: isPlaying ? 1 : 0.6,
              }}
            />
          </View>

          {/* CREATED AT (NOW UNDER PROGRESS BAR) */}
          {!!item.created_at && (
            <Text
              style={{
                color: "#6B7280",
                fontSize: 11,
                marginTop: 4,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {!isAi && onGenerateAi && (
            <TouchableOpacity
              onPress={onGenerateAi}
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

          <TouchableOpacity onPress={onMenu} style={{ padding: 6 }}>
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
}
