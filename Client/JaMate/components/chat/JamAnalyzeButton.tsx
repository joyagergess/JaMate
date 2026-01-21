import { View, TouchableOpacity, Text } from "react-native";

type Props = {
  onPress: () => void;
};

export function JamAnalyzeButton({ onPress }: Props) {
  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#1F2937",
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: "#374151",
        }}
      >
        <Text
          style={{
            color: "#7C7CFF",
            fontWeight: "600",
            fontSize: 13,
          }}
        >
          🎧 Analyze Jam Compatibility
        </Text>
      </TouchableOpacity>
    </View>
  );
}
