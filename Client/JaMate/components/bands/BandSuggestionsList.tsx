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
import { bandSuggestionsListStyles as styles } from "../../styles/bandSuggestionsList.styles";

export function BandSuggestionsList() {
  const { data, isLoading } = useBandSuggestions();
  const { data: me } = useProfile();
  const accept = useAcceptBandSuggestion();
  const reject = useRejectBandSuggestion();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size={32} />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No band suggestions yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
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
          <View style={styles.card}>
            <View style={styles.avatarsRow}>
              {members.map((m) => {
                const avatar = m.profile.media?.[0]?.media_url;

                return (
                  <Image
                    key={m.profile.id}
                    source={
                      avatar
                        ? { uri: buildImageUrl(avatar) }
                        : require("../../assets/images/unknow.jpg")
                    }
                    style={styles.avatar}
                  />
                );
              })}
            </View>

            <Text style={styles.title}>Band suggestion</Text>

            <Text style={styles.subtitle}>
              {acceptedCount}/{members.length} accepted
            </Text>

            {statusLabel && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor },
                ]}
              >
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            )}

            {!statusLabel && myDecision === "pending" && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={() => reject.mutate(item.id)}
                  style={styles.declineButton}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => accept.mutate(item.id)}
                  style={styles.acceptButton}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
