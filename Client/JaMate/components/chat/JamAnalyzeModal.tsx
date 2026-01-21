import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  result: any;
};

export function JamAnalyzeModal({ visible, onClose, result }: Props) {
  if (!result) return null;

  const {
    compatibility,
    track_a,
    track_b,
    gpt_suggestions,
  } = result;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "#0B0E13",
            borderRadius: 16,
            padding: 16,
            maxHeight: "85%",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                color: "#7C7CFF",
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              Jam Compatibility
            </Text>

            <Text style={{ color: "#E5E7EB", marginBottom: 4 }}>
              Score:{" "}
              <Text style={{ fontWeight: "700" }}>
                {compatibility.compatibility_score}/100
              </Text>
            </Text>

            <Text style={{ color: "#9CA3AF" }}>
              Similarity: {compatibility.similarity_percent}%
            </Text>

            <Text style={{ color: "#9CA3AF", marginBottom: 12 }}>
              {compatibility.label}
            </Text>

            {gpt_suggestions && (
              <>
                <Text
                  style={{
                    color: "#A5B4FC",
                    fontSize: 15,
                    fontWeight: "600",
                    marginTop: 16,
                    marginBottom: 6,
                  }}
                >
                  Jam Suggestions
                </Text>

                <Text style={{ color: "#E5E7EB", marginBottom: 4 }}>
                  Suggested Key: {gpt_suggestions.suggested_key}
                </Text>

                <Text style={{ color: "#E5E7EB", marginBottom: 4 }}>
                  Chord Progression: {gpt_suggestions.chord_progression}
                </Text>

                <Text style={{ color: "#E5E7EB", marginBottom: 4 }}>
                  Shared Style: {gpt_suggestions.shared_style}
                </Text>

                <Text
                  style={{
                    color: "#9CA3AF",
                    marginTop: 6,
                  }}
                >
                  {gpt_suggestions.jam_focus}
                </Text>
              </>
            )}

            <Text
              style={{
                color: "#A5B4FC",
                fontSize: 15,
                fontWeight: "600",
                marginTop: 20,
                marginBottom: 8,
              }}
            >
              Track Comparison
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text
                  style={{
                    color: "#7C7CFF",
                    fontWeight: "700",
                    marginBottom: 4,
                  }}
                >
                  Track A
                </Text>

                <Text style={{ color: "#E5E7EB" }}>
                  Key: {track_a.key}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Tempo: {Math.round(track_a.tempo)} BPM
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Energy: {track_a.energy?.energy_level}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Brightness: {track_a.brightness?.brightness}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Groove: {track_a.groove}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Mood: {track_a.mood}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Style: {track_a.style}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Emotion: {track_a.emotion}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Feel: {track_a.feel}
                </Text>
              </View>

              <View style={{ width: "48%" }}>
                <Text
                  style={{
                    color: "#7C7CFF",
                    fontWeight: "700",
                    marginBottom: 4,
                  }}
                >
                  Track B
                </Text>

                <Text style={{ color: "#E5E7EB" }}>
                  Key: {track_b.key}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Tempo: {Math.round(track_b.tempo)} BPM
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Energy: {track_b.energy?.energy_level}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Brightness: {track_b.brightness?.brightness}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Groove: {track_b.groove}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Mood: {track_b.mood}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Style: {track_b.style}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Emotion: {track_b.emotion}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>
                  Feel: {track_b.feel}
                </Text>
              </View>
            </View>

            {compatibility.why_it_works?.length > 0 && (
              <>
                <Text
                  style={{
                    color: "#A5B4FC",
                    fontSize: 15,
                    fontWeight: "600",
                    marginTop: 16,
                  }}
                >
                  Why it works
                </Text>

                {compatibility.why_it_works.map(
                  (reason: string, i: number) => (
                    <Text
                      key={i}
                      style={{ color: "#E5E7EB", marginTop: 4 }}
                    >
                      • {reason}
                    </Text>
                  )
                )}
              </>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 16,
              alignSelf: "center",
              paddingVertical: 10,
              paddingHorizontal: 28,
              borderRadius: 999,
              backgroundColor: "#1F2937",
              borderWidth: 1,
              borderColor: "#374151",
            }}
          >
            <Text style={{ color: "#7C7CFF", fontWeight: "600" }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
