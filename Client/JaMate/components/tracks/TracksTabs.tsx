import { View, Text, TouchableOpacity } from "react-native";
import { matchesStyles as styles } from "../../styles/matches.styles";

type Tab = "tracks" | "ai" | "record";

type Props = {
  tab: Tab;
  onChange: (tab: Tab) => void;
};

export function TracksTabs({ tab, onChange }: Props) {
  return (
    <View style={styles.tabs}>
      {(["tracks", "ai", "record"] as Tab[]).map((t) => (
        <TouchableOpacity key={t} onPress={() => onChange(t)}>
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
  );
}
