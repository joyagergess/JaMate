import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { buildImageUrl } from "../../utils/media";
import type { BandSuggestionMember } from "../../hooks/bands/useBandSuggestions";
import { bandSuggestionCardStyles as styles } from "../../styles/bandSuggestionCard.styles";

type Props = {
  members: BandSuggestionMember[];
  status?: "waiting" | "rejected" | "formed";
};

export function BandSuggestionCard({ members, status }: Props) {
  const router = useRouter();

  const borderColor =
    status === "waiting"
      ? "#FACC15"
      : status === "rejected"
      ? "#7F1D1D"
      : status === "formed"
      ? "#6C63FF"
      : "rgba(255,255,255,0.08)";

  return (
    <View
      style={[
        styles.container,
        {
          borderColor,
          opacity: status === "rejected" ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.membersRow}>
        {members.map((m) => {
          const media = m.profile.media ?? [];

          const primary =
            media.find(
              (x: any) => x.order === 0 || x.order_index === 0
            ) ?? media[0];

          const avatarPath =
            primary?.media_type === "image"
              ? primary.media_url
              : primary?.thumbnail_url;

          const avatarUrl = avatarPath
            ? buildImageUrl(avatarPath)
            : null;

          return (
            <TouchableOpacity
              key={m.profile.id}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/profile/[id]",
                  params: { id: String(m.profile.id) },
                } as unknown as Href)
              }
              style={styles.memberItem}
            >
              <Image
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require("../../assets/images/unknow.jpg")
                }
                style={styles.avatar}
              />

              <Text style={styles.name} numberOfLines={1}>
                {m.profile.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
