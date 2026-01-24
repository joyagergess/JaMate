import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { jamAnalyzeModalStyles as styles } from "../../styles/jamAnalyzeModal.styles";

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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Jam Compatibility</Text>

            <Text style={styles.scoreText}>
              Score:{" "}
              <Text style={styles.scoreValue}>
                {compatibility.compatibility_score}/100
              </Text>
            </Text>

            <Text style={styles.mutedText}>
              Similarity: {compatibility.similarity_percent}%
            </Text>

            <Text style={[styles.mutedText, { marginBottom: 12 }]}>
              {compatibility.label}
            </Text>

            {gpt_suggestions && (
              <>
                <Text style={styles.sectionTitle}>Jam Suggestions</Text>

                <Text style={styles.suggestionText}>
                  Suggested Key: {gpt_suggestions.suggested_key}
                </Text>

                <Text style={styles.suggestionText}>
                  Chord Progression:{" "}
                  {gpt_suggestions.chord_progression}
                </Text>

                <Text style={styles.suggestionText}>
                  Shared Style: {gpt_suggestions.shared_style}
                </Text>

                <Text style={styles.suggestionDescription}>
                  {gpt_suggestions.jam_focus}
                </Text>
              </>
            )}

            <Text style={styles.comparisonTitle}>
              Track Comparison
            </Text>

            <View style={styles.comparisonRow}>
              <View style={styles.comparisonColumn}>
                <Text style={styles.trackTitle}>Track A</Text>
                <Text style={styles.trackText}>Key: {track_a.key}</Text>
                <Text style={styles.trackText}>
                  Tempo: {Math.round(track_a.tempo)} BPM
                </Text>
                <Text style={styles.trackText}>
                  Energy: {track_a.energy?.energy_level}
                </Text>
                <Text style={styles.trackText}>
                  Brightness: {track_a.brightness?.brightness}
                </Text>
                <Text style={styles.trackText}>
                  Groove: {track_a.groove}
                </Text>
                <Text style={styles.trackText}>
                  Mood: {track_a.mood}
                </Text>
                <Text style={styles.trackText}>
                  Style: {track_a.style}
                </Text>
                <Text style={styles.trackText}>
                  Emotion: {track_a.emotion}
                </Text>
                <Text style={styles.trackText}>
                  Feel: {track_a.feel}
                </Text>
              </View>

              <View style={styles.comparisonColumn}>
                <Text style={styles.trackTitle}>Track B</Text>
                <Text style={styles.trackText}>Key: {track_b.key}</Text>
                <Text style={styles.trackText}>
                  Tempo: {Math.round(track_b.tempo)} BPM
                </Text>
                <Text style={styles.trackText}>
                  Energy: {track_b.energy?.energy_level}
                </Text>
                <Text style={styles.trackText}>
                  Brightness: {track_b.brightness?.brightness}
                </Text>
                <Text style={styles.trackText}>
                  Groove: {track_b.groove}
                </Text>
                <Text style={styles.trackText}>
                  Mood: {track_b.mood}
                </Text>
                <Text style={styles.trackText}>
                  Style: {track_b.style}
                </Text>
                <Text style={styles.trackText}>
                  Emotion: {track_b.emotion}
                </Text>
                <Text style={styles.trackText}>
                  Feel: {track_b.feel}
                </Text>
              </View>
            </View>

            {compatibility.why_it_works?.length > 0 && (
              <>
                <Text style={styles.whyTitle}>Why it works</Text>

                {compatibility.why_it_works.map(
                  (reason: string, i: number) => (
                    <Text key={i} style={styles.whyText}>
                      • {reason}
                    </Text>
                  )
                )}
              </>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
