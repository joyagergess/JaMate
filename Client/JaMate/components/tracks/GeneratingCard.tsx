import { View, Text } from "react-native";
import { Spinner } from "../../components/ui/Spinner";
import { matchesStyles as styles } from "../../styles/matches.styles";

export function GeneratingCard() {
  return (
    <View style={[styles.card, { opacity: 0.6 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Spinner size={18} />
        <View>
          <Text style={styles.name}>Generating backing track…</Text>
          <Text style={styles.sub}>Downloading AI audio 🎧</Text>
        </View>
      </View>
    </View>
  );
}
