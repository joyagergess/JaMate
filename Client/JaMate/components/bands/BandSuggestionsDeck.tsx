import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  useBandSuggestions,
  useAcceptBandSuggestion,
  useRejectBandSuggestion,
  BandSuggestion,
} from "../../hooks/bands/useBandSuggestions";
import { BandSuggestionCard } from "./BandSuggestionCard";
import { useProfile } from "../../hooks/profile/useProfile";
import { bandSuggestionsDeckStyles as styles } from "../../styles/bandSuggestionsDeck.styles";

type CardStatus = "waiting" | "rejected" | "formed" | undefined;

export function BandSuggestionsDeck() {
  const router = useRouter();
  const { data, isLoading } = useBandSuggestions();
  const { data: me } = useProfile();
  const accept = useAcceptBandSuggestion();
  const reject = useRejectBandSuggestion();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No band suggestions yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {data.map((suggestion: BandSuggestion) => {
        const members = suggestion.members;

        const myDecision =
          members.find((m) => m.profile.id === me?.id)?.decision ?? "pending";

        const hasDeclined = members.some((m) => m.decision === "decline");

        const allAccepted =
          members.length > 0 && members.every((m) => m.decision === "jam");

        let status: CardStatus;
        let helperText: string | null = null;
        let helperColor = "#9CA3AF";

        if (hasDeclined || suggestion.status === "rejected") {
          status = "rejected";
          helperText = "Suggestion cancelled · A member declined";
          helperColor = "#F87171";
        } else if (allAccepted || suggestion.status === "accepted") {
          status = "formed";
          helperText = "Band formed · Everyone accepted";
          helperColor = "#6C63FF";
        } else if (myDecision === "jam") {
          status = "waiting";
          helperText = "You accepted · Waiting for others";
          helperColor = "#FACC15";
        }

        return (
          <View key={suggestion.id} style={styles.cardWrapper}>
            <BandSuggestionCard members={members} status={status} />

            {helperText && (
              <Text style={[styles.helperText, { color: helperColor }]}>
                {helperText}
              </Text>
            )}

            {status === "formed" && (
              <TouchableOpacity
                onPress={() => router.push("/messages")}
                activeOpacity={0.7}
                style={styles.openChatButton}
              >
                <Text style={styles.openChatText}>Open group chat</Text>
              </TouchableOpacity>
            )}

            {suggestion.status === "pending" && myDecision === "pending" && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={() => reject.mutate(suggestion.id)}
                  style={styles.declineButton}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => accept.mutate(suggestion.id)}
                  style={styles.acceptButton}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
