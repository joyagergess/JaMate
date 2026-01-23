import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { buildImageUrl } from "../../utils/media";
import { ConversationItem } from "../../hooks/messages/useConversations";

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
      <View style={{ paddingTop: 60, alignItems: "center" }}>
        <Text style={{ color: "#9CA3AF" }}>No chats yet</Text>
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
          !otherProfile.name.toLowerCase().includes(search.toLowerCase())
        ) {
          return null;
        }

        const avatarPath =
          otherProfile.media
            ?.slice()
            .sort((a, b) => a.order_index - b.order_index)
            .find((m) => m.media_type === "image")?.media_url ?? null;

        const avatarUrl = avatarPath ? buildImageUrl(avatarPath) : null;
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
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: isUnread
                  ? "rgba(108, 99, 255, 0.08)"
                  : "transparent",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Image
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require("../../assets/images/unknow.jpg")
                }
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                }}
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: isUnread ? "700" : "600",
                  }}
                >
                  {otherProfile.name}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: isUnread ? "#FFFFFF" : "#9CA3AF",
                    fontWeight: isUnread ? "500" : "400",
                    marginTop: 2,
                  }}
                >
                  {getMessagePreview(lastMessage)}
                </Text>
              </View>

              {isUnread && (
                <View
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "#FF375F",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 6,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
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
