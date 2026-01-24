import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { buildImageUrl } from "../../utils/media";
import { ConversationItem } from "../../hooks/messages/useConversations";
import { bandChatsListStyles as styles } from "../../styles/bandChatList.styles";

type Props = {
  conversations: ConversationItem[];
};

export function BandChatsList({ conversations }: Props) {
  const bandChats = conversations.filter(
    (c) => c.type === "group"
  );

  if (!bandChats.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No band chats yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bandChats}
      keyExtractor={(c) => c.id.toString()}
      renderItem={({ item }) => {
        const members = item.participants.map((p) => p.profile);
        const lastMessage = item.messages?.[0];

        return (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/chat/band/[id]",
                params: { id: item.id },
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.row}>
              <View style={styles.avatarsWrapper}>
                {members.slice(0, 3).map((m, i) => {
                  const avatarPath =
                    m.media
                      ?.slice()
                      .sort((a, b) => a.order_index - b.order_index)
                      .find((x) => x.media_type === "image")?.media_url ?? null;

                  const avatarUrl = avatarPath
                    ? buildImageUrl(avatarPath)
                    : null;

                  return (
                    <Image
                      key={m.id}
                      source={
                        avatarUrl
                          ? { uri: avatarUrl }
                          : require("../../assets/images/unknow.jpg")
                      }
                      style={[
                        styles.avatar,
                        { left: i * 16 },
                      ]}
                    />
                  );
                })}
              </View>

              <View style={styles.content}>
                <Text style={styles.title}>
                  {item.name || "Band chat"}
                </Text>

                <Text
                  style={styles.subtitle}
                  numberOfLines={1}
                >
                  {lastMessage?.body ??
                    members.map((m) => m.name).join(", ")}
                </Text>
              </View>

              {item.unread_count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.unread_count}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
