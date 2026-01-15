import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useMessages } from "../../hooks/messages/useMessages";
import { useProfile } from "../../hooks/profile/useProfile";
import { useConversations } from "../../hooks/messages/useConversations";
import { buildImageUrl } from "../../utils/media";
import { chatStyles as styles } from "../../styles/chat.styles";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const { data: me } = useProfile();
  const { data: conversations } = useConversations();
  const { data, fetchNextPage } = useMessages(conversationId);

  const [text, setText] = useState("");

  if (!me || !conversations) return null;

  const conversation = conversations.find(
    (c) => c.id === conversationId
  );

  if (!conversation) return null;

  const other = conversation.participants
    .map((p) => p.profile)
    .find((p) => p.id !== me.id);

  const avatarPath =
    other?.media
      ?.slice()
      .sort((a, b) => a.order_index - b.order_index)[0]
      ?.url ?? null;

  const avatarUrl = buildImageUrl(avatarPath);

  const messages = useMemo(() => {
    return data?.pages.flat() ?? [];
  }, [data]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#8B7CFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../../assets/images/unknow.jpg")
            }
            style={styles.headerAvatar}
          />
          <Text style={styles.headerName}>{other?.name}</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.block}>Block</Text>
        </TouchableOpacity>
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messages}
        inverted
        keyExtractor={(m) => m.id.toString()}
        onEndReached={() => fetchNextPage()}
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => {
          const mine = item.sender_profile_id === me.id;

          return (
            <View
              style={[
                styles.bubble,
                mine ? styles.bubbleMine : styles.bubbleOther,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  mine && styles.bubbleTextMine,
                ]}
              >
                {item.body}
              </Text>

              <Text style={styles.time}>
                {new Date(item.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
      />

      {/* INPUT */}
      <View style={styles.inputBar}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          placeholderTextColor="#666"
          style={styles.input}
        />

        <TouchableOpacity style={styles.voiceBtn}>
          <Ionicons name="mic" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
