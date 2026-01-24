import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { buildImageUrl } from "../../utils/media";
import { ConversationItem } from "../../hooks/messages/useConversations";
import { directChatsListStyles as styles } from "../../styles/directChatsList.styles";

type Props = {
  conversations: ConversationItem[];
  me: { id: number };
  search: string;
};

export function DirectChatsList({ conversations, me, search }: Props) {
  const directChats = conversations
    .filter((c) => c.type === "direct")
    .map((c) => {
      const lastMessageAt = c.messages?.[0]?.sent_at
        ? new Date(c.messages[0].sent_at).getTime()
        : 0;

      return { ...c, _lastMessageAt: lastMessageAt };
    })
    .sort((a, b) => b._lastMessageAt - a._lastMessageAt);

  if (!directChats.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No chats yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={directChats}
      keyExtractor={(c) => c.id.toString()}
      renderItem={({ item }) => {
        const isUnread = item.unread_count > 0;

        const otherProfile = item.participants
          .map((p) => p.profile)
          .find((p) => p.id !== me.id);

        if (!otherProfile) return null;

        if (
          search &&
          !otherProfile.name
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          return null;
        }

        const avatarPath =
          otherProfile.media
            ?.slice()
            .sort((a, b) => a.order_index - b.order_index)
            .find((m) => m.media_type === "image")?.media_url ?? null;

        const avatarUrl = avatarPath
          ? buildImageUrl(avatarPath)
          : null;

        const lastMessage = item.messages?.[0];

        return (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.id },
              })
            }
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.row,
                isUnread && styles.unreadRow,
              ]}
            >
              <Image
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require("../../assets/images/unknow.jpg")
                }
                style={styles.avatar}
              />

              <View style={styles.content}>
                <Text
                  style={[
                    styles.name,
                    isUnread && styles.nameUnread,
                  ]}
                >
                  {otherProfile.name}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.preview,
                    isUnread && styles.previewUnread,
                  ]}
                >
                  {getMessagePreview(lastMessage)}
                </Text>
              </View>

              {isUnread && (
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

function getMessagePreview(message: any) {
  if (!message) return "No messages yet";

  switch (message.type) {
    case "text":
      return message.body;
    case "track":
      return message.track_title ?? "Shared a track";
    case "voice":
      return "Voice message";
    default:
      return "New message";
  }
}
