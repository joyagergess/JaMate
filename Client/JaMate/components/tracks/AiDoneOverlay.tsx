import { View, Text, TouchableOpacity } from "react-native";
import { myTracksStyles as s } from "../../styles/myTracks.styles";

type Props = {
  onClose: () => void;
};

export function AiDoneOverlay({ onClose }: Props) {
  return (
    <View style={s.aiDoneOverlay}>
      <View style={s.aiDoneCard}>
        <Text style={s.aiDoneTitle}>AI Track Ready</Text>

        <Text style={s.aiDoneText}>
          Your AI backing track has finished generating.
        </Text>

        <TouchableOpacity style={s.aiDoneAction} onPress={onClose}>
          <Text style={s.aiDoneActionText}>View AI Track</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
