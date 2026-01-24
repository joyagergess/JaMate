import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { matchesStyles as styles } from "../../styles/matches.styles";
import { trackComponentsStyles as c } from "../../styles/trackComponents.styles";
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
      <View style={c.row}>
        <TouchableOpacity onPress={onPlay} disabled={loading}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={isAi ? "#6C63FF" : "#fff"}
            />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={22}
              color={isAi ? "#6C63FF" : "#fff"}
            />
          )}
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <View style={c.titleRow}>
            <Text
              style={[styles.name, { flex: 1 }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {item.ai_key && (
              <View style={c.keyBadge}>
                <Text style={c.keyText}>{item.ai_key}</Text>
              </View>
            )}
          </View>

          <Text style={styles.sub}>
            {isPlaying && remainingSeconds !== null
              ? `${remainingSeconds}s`
              : isAi
              ? "AI backing track"
              : `${item.duration}s`}
          </Text>

          <View style={c.progressBar}>
            <View
              style={[
                c.progressFill,
                {
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: isAi ? "#6C63FF" : "#7C7CFF",
                  opacity: isPlaying ? 1 : 0.6,
                },
              ]}
            />
          </View>

          {!!item.created_at && (
            <Text style={c.dateText}>
              {formatDate(item.created_at)}
            </Text>
          )}
        </View>

        <View style={c.row}>
          {!isAi && onGenerateAi && (
            <TouchableOpacity
              onPress={onGenerateAi}
              style={c.aiButton}
            >
              <Ionicons
                name="sparkles-outline"
                size={12}
                color="#6C63FF"
              />
              <Text style={c.aiButtonText}>AI track</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onMenu}
            style={c.menuTrigger}
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
}
