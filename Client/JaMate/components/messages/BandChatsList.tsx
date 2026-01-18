import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { buildImageUrl } from "../../utils/media";
import { ConversationItem } from "../../hooks/messages/useConversations";

type Props = {
  conversations: ConversationItem[];
};

export function BandChatsList({ conversations }: Props) {
  const bandChats = conversations.filter(
    (c) => c.type === "group" 
  );

  if (!bandChats.length) {
    return (
      <View style={{ paddingTop: 60, alignItems: "center" }}>
        <Text style={{ color: "#9CA3AF" }}>No band chats yet</Text>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.05)",
              }}
            >
              {/* GROUP AVATARS */}
              <View style={{ width: 52 }}>
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
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        position: "absolute",
                        left: i * 16,
                        borderWidth: 1,
                        borderColor: "#0B0E13",
                      }}
                    />
                  );
                })}
              </View>

              {/* INFO */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {item.name || "Band chat"}
                </Text>

                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {lastMessage?.body ?? members.map((m) => m.name).join(", ")}
                </Text>
              </View>

              {item.unread_count > 0 && (
                <View
                  style={{
                    backgroundColor: "#FF375F",
                    borderRadius: 12,
                    minWidth: 22,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "600",
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
