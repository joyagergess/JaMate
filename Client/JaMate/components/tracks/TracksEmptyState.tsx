import { View, Text } from "react-native";
import { myTracksStyles as s } from "../../styles/myTracks.styles";

export function TracksEmptyState({ text }: { text: string }) {
  return (
    <View style={s.emptyStateContainer}>
      <Text style={s.emptyStateText}>{text}</Text>
    </View>
  );
}
