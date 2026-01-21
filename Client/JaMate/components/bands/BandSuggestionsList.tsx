import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  useBandSuggestions,
  useAcceptBandSuggestion,
  useRejectBandSuggestion,
} from "../../hooks/bands/useBandSuggestions";
import { buildImageUrl } from "../../utils/media";
import { Spinner } from "../ui/Spinner";
import { useProfile } from "../../hooks/profile/useProfile";

export function BandSuggestionsList() {
  const { data, isLoading } = useBandSuggestions();
  const { data: me } = useProfile();
  const accept = useAcceptBandSuggestion();
  const reject = useRejectBandSuggestion();

  if (isLoading) {
    return (
      <View style={{ paddingTop: 60, alignItems: "center" }}>
        <Spinner size={32} />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={{ paddingTop: 60, alignItems: "center" }}>
        <Text style={{ color: "#9CA3AF" }}>
          No band suggestions yet 
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => {
        const members = item.members;

        const acceptedCount = members.filter(
          (m) => m.decision === "jam"
        ).length;

        const declined = members.some(
          (m) => m.decision === "decline"
        );

        const myDecision =
          members.find((m) => m.profile.id === me?.id)
            ?.decision ?? "pending";

        let statusLabel: string | null = null;
        let statusColor = "#1F2937";

        if (declined) {
          statusLabel = "Cancelled";
          statusColor = "#7F1D1D";
        } else if (acceptedCount === members.length) {
          statusLabel = "Band formed 🎉";
          statusColor = "#14532D";
        } else if (myDecision === "jam") {
          statusLabel = "You accepted · Waiting for others";
          statusColor = "#312E81";
        }

        return (
          <View
            style={{
              backgroundColor: "#111827",
              marginHorizontal: 16,
              marginBottom: 14,
              borderRadius: 18,
              padding: 14,
            }}
          >
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {members.map((m) => {
                const avatar =
                  m.profile.media?.[0]?.media_url;

                return (
                  <Image
                    key={m.profile.id}
                    source={
                      avatar
                        ? { uri: buildImageUrl(avatar) }
                        : require("../../assets/images/unknow.jpg")
                    }
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      marginRight: 8,
                    }}
                  />
                );
              })}
            </View>

            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Band suggestion
            </Text>

            <Text style={{ color: "#9CA3AF", marginTop: 4 }}>
              {acceptedCount}/{members.length} accepted
            </Text>

            {statusLabel && (
              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: statusColor,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  {statusLabel}
                </Text>
              </View>
            )}

            {!statusLabel && myDecision === "pending" && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 14,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => reject.mutate(item.id)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 14,
                    backgroundColor: "#1F2937",
                  }}
                >
                  <Text style={{ color: "#F87171", fontWeight: "600" }}>
                    Decline
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => accept.mutate(item.id)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 14,
                    backgroundColor: "#6C63FF",
                  }}
                >
                  <Text style={{ color: "#000", fontWeight: "700" }}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
