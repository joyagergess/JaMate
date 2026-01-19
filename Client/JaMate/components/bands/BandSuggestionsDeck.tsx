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

type CardStatus = "waiting" | "rejected" | "formed" | undefined;

export function BandSuggestionsDeck() {
  const router = useRouter();
  const { data, isLoading } = useBandSuggestions();
  const { data: me } = useProfile();
  const accept = useAcceptBandSuggestion();
  const reject = useRejectBandSuggestion();

  if (isLoading) {
    return (
      <View style={{ paddingTop: 80, alignItems: "center" }}>
        <Text style={{ color: "#9CA3AF" }}>Loading…</Text>
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={{ paddingTop: 80, alignItems: "center" }}>
        <Text style={{ color: "#9CA3AF" }}>No band suggestions yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
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
          <View key={suggestion.id} style={{ marginBottom: 44 }}>
            {/* CARD */}
            <BandSuggestionCard members={members} status={status} />

            {/* STATUS TEXT */}
            {helperText && (
              <Text
                style={{
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 13,
                  color: helperColor,
                }}
              >
                {helperText}
              </Text>
            )}

            {status === "formed" && (
              <TouchableOpacity
                onPress={() => router.push("/messages")}
                activeOpacity={0.7}
                style={{
                  alignSelf: "center", 
                  marginTop: 14,
                  paddingHorizontal: 10, 
                  paddingVertical: 8, 
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#16C784",
                  backgroundColor: "rgba(22,199,132,0.08)",
                }}
              >
                <Text
                  style={{
                    color: "#16C784",
                    fontSize: 13,
                    fontWeight: "600",
                    letterSpacing: 0.2,
                  }}
                >
                  Open group chat
                </Text>
              </TouchableOpacity>
            )}

            {/* ACTIONS (ONLY IF USER HASN’T DECIDED) */}
            {suggestion.status === "pending" && myDecision === "pending" && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 18,
                  marginHorizontal: 32,
                }}
              >
                <TouchableOpacity
                  onPress={() => reject.mutate(suggestion.id)}
                  style={{
                    flex: 1,
                    marginRight: 10,
                    paddingVertical: 12,
                    borderRadius: 14,
                    backgroundColor: "#1F2937",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#F87171" }}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => accept.mutate(suggestion.id)}
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    paddingVertical: 12,
                    borderRadius: 14,
                    backgroundColor: "#16C784",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#000", fontWeight: "800" }}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
