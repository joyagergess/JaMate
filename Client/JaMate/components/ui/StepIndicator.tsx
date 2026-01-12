import { View, Text } from "react-native";

type Props = {
  current: number;
  total: number;
};

export function StepIndicator({ current, total }: Props) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
        Step {current} of {total}
      </Text>

      <View
        style={{
          height: 3,
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: 2,
          marginTop: 8,
        }}
      >
        <View
          style={{
            width: `${(current / total) * 100}%`,
            height: "100%",
            backgroundColor: "#6D5DF6",
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}
