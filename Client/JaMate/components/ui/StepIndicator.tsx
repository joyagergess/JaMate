import { View, Text } from "react-native";
import { TOTAL_CREATE_PROFILE_STEPS } from "../../constants/createProfileSteps";

type Props = {
  current: number; // 1-based index
};

export function StepIndicator({ current }: Props) {
  const progress = (current / TOTAL_CREATE_PROFILE_STEPS) * 100;

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
        Step {current} of {TOTAL_CREATE_PROFILE_STEPS}
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
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#6D5DF6",
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}
