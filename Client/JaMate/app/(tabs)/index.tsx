import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0B0F" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "600" }}>
          Feed
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
          Discover musicians and jams near you.
        </Text>
      </View>
    </SafeAreaView>
  );
}
