import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { homeScreenStyles as s } from "../../styles/homeFeed.screen.styles";

type Props = {
  skipScale: Animated.Value;
  jamScale: Animated.Value;
  skipOpacity: Animated.Value;
  jamOpacity: Animated.Value;
  onSkip: () => void;
  onJam: () => void;
};

export function SwipeActions({
  skipScale,
  jamScale,
  skipOpacity,
  jamOpacity,
  onSkip,
  onJam,
}: Props) {
  return (
    <View style={s.actions}>
      <Animated.View
        style={{
          transform: [{ scale: skipScale }],
          opacity: skipOpacity,
        }}
      >
        <TouchableOpacity style={s.skipBtn} onPress={onSkip}>
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={s.btnText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ scale: jamScale }],
          opacity: jamOpacity,
        }}
      >
        <TouchableOpacity style={s.jamBtn} onPress={onJam}>
          <Ionicons name="musical-notes" size={20} color="#fff" />
          <Text style={s.btnTextBold}>Jam</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
