import { View, Text, Image } from "react-native";
import { buildImageUrl } from "../../utils/media";
import type { BandSuggestionMember } from "../../hooks/bands/useBandSuggestions";

type Props = {
  members: BandSuggestionMember[];
  status?: "waiting" | "rejected" | "formed";
};

export function BandSuggestionCard({ members, status }: Props) {
  const borderColor =
    status === "waiting"
      ? "#FACC15" // soft yellow
      : status === "rejected"
      ? "#7F1D1D" // deep red
      : status === "formed"
      ? "#6C63FF" // deep green
      : "rgba(255,255,255,0.08)";

  return (
    <View
      style={{
        backgroundColor: "#0B0E13",
        borderRadius: 24,
        paddingVertical: 18,
        paddingHorizontal: 14,
        marginHorizontal: 20,
        borderWidth: 1.5,
        borderColor,
        opacity: status === "rejected" ? 0.7 : 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {members.map((m) => {
          const media = m.profile.media ?? [];

          const primary =
            media.find(
              x => x.order === 0 || x.order_index === 0
            ) ?? media[0];

          const avatarPath =
            primary?.media_type === "image"
              ? primary.media_url
              : primary?.thumbnail_url;

          const avatarUrl = avatarPath
            ? buildImageUrl(avatarPath)
            : null;

          return (
            <View key={m.profile.id} style={{ alignItems: "center", width: 64 }}>
              <Image
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require("../../assets/images/unknow.jpg")
                }
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  marginBottom: 6,
                }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: "600",
                }}
                numberOfLines={1}
              >
                {m.profile.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
