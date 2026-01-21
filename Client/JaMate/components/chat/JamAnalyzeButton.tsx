import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";

type Props = {
  onPress: () => void;
  loading?: boolean;
};

export function JamAnalyzeButton({ onPress, loading }: Props) {
  return (
    <View style={{ alignItems: "center", marginVertical: 8 }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        style={{
          backgroundColor: "#1F2937",
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: "#374151",
          opacity: loading ? 0.6 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {loading && (
          <ActivityIndicator size="small" color="#7C7CFF" />
        )}

        <Text
          style={{
            color: "#7C7CFF",
            fontWeight: "600",
            fontSize: 13,
          }}
        >
          {loading ? "Analyzing..." : "Analyze Jam Compatibility"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
