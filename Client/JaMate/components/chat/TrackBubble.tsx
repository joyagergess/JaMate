import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { trackBubbleStyles as styles } from "@/styles/trackBubble.styles";

type Props = {
  title: string;
  duration: number;
  isMe: boolean;
};

export function TrackBubble({ title, duration, isMe }: Props) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isMe ? "#2E2EFF" : "#1F1F2A" },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="musical-notes" size={18} color="white" />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.duration}>
        {Math.round(duration)} seconds
      </Text>

      <TouchableOpacity style={styles.playButton}>
        <Text style={styles.playText}>Play</Text>
      </TouchableOpacity>
    </View>
  );
}
