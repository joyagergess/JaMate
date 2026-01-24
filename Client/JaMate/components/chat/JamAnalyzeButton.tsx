import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { jamAnalyzeButtonStyles as styles } from "@/styles/jamAnalyzeButton.styles";

type Props = {
  onPress: () => void;
  loading?: boolean;
};

export function JamAnalyzeButton({ onPress, loading }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        style={[
          styles.button,
          { opacity: loading ? 0.6 : 1 },
        ]}
      >
        {loading && (
          <ActivityIndicator size="small" color="#7C7CFF" />
        )}

        <Text style={styles.text}>
          {loading ? "Analyzing..." : "Analyze Jam Compatibility"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
