import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  duration: number;
  isMe: boolean;
};

export function TrackBubble({ title, duration, isMe }: Props) {
  return (
    <View
      style={{
        backgroundColor: isMe ? "#2E2EFF" : "#1F1F2A",
        padding: 12,
        borderRadius: 12,
        maxWidth: "75%",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name="musical-notes" size={18} color="white" />
        <Text style={{ color: "white", fontWeight: "600" }}>
          {title}
        </Text>
      </View>

      <Text style={{ color: "#DDD", fontSize: 12, marginTop: 4 }}>
        {Math.round(duration)} seconds
      </Text>

      <TouchableOpacity style={{ marginTop: 8 }}>
        <Text style={{ color: "#7C7CFF" }}>Play</Text>
      </TouchableOpacity>
    </View>
  );
}
