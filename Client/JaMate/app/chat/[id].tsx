import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../api/client";
import { useMessages } from "../../hooks/messages/useMessages";
import { useSendMessage } from "../../hooks/messages/useSendMessage";
import { useConversations } from "../../hooks/messages/useConversations";
import { useProfile } from "../../hooks/profile/useProfile";
import { buildImageUrl } from "../../utils/media";
import { chatStyles as styles } from "../../styles/chat.styles";
import { echo } from "../../lib/echo";
import { Spinner } from "@/components/ui/Spinner";

/* ------------------ TYPES ------------------ */

type Message = {
  id: number;
  body: string | null;
  sent_at: string;
  sender_profile_id: number;
  conversation_id: number;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const queryClient = useQueryClient();

  const { data: me } = useProfile();
  const { data: conversations } = useConversations();
  const { data: messages = [], isLoading } =
    useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);

  const [text, setText] = useState("");
  const listRef = useRef<FlatList<Message>>(null);

  /* ------------------ MARK AS READ (CRITICAL) ------------------ */

  useEffect(() => {
    if (!conversationId || !me) return;

    apiClient.post(`/conversations/${conversationId}/read`);

    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });
  }, [conversationId, me, queryClient]);

  /* ------------------ AUTO SCROLL ------------------ */

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  /* ------------------ REALTIME LISTENER ------------------ */

  useEffect(() => {
    if (!conversationId || !me) return;

    const channel = echo.private(
      `conversation.${conversationId}`
    );

    channel.listen(".MessageSent", (e: { message: Message }) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: Message[] = []) => {
          if (old.some((m) => m.id === e.message.id)) {
            return old;
          }
          return [...old, e.message];
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    });

    return () => {
      echo.leave(`private-conversation.${conversationId}`);
    };
  }, [conversationId, me, queryClient]);

  /* ------------------ CONVERSATION ------------------ */

  const conversation = useMemo(() => {
    return conversations?.find((c) => c.id === conversationId);
  }, [conversations, conversationId]);

  /* ------------------ OTHER PROFILE ------------------ */

  const otherProfile = useMemo(() => {
    if (!conversation || !me) return null;

    return conversation.participants
      .map((p) => p.profile)
      .find((p) => p.id !== me.id);
  }, [conversation, me]);

  const avatarPath =
    otherProfile?.media
      ?.slice()
      .sort((a, b) => a.order_index - b.order_index)
      .find((m) => m.media_type === "image")
      ?.url ?? null;

  const avatarUrl = buildImageUrl(avatarPath);

  /* ------------------ LOADING ------------------ */

  if (isLoading || !me) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0E13",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner size={42} />
    </View>
  );
}


  /* ------------------ SEND ------------------ */

  const onSend = () => {
    if (!text.trim()) return;
    sendMessage.mutate(text);
    setText("");
  };

  /* ------------------ RENDER ------------------ */

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/messages")}>
            <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
            onPress={() =>
              otherProfile &&
              router.push({
                pathname: "/profile/[id]",
                params: { id: otherProfile.id },
              })
            }
          >
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require("../../assets/images/unknow.jpg")
              }
              style={{ width: 34, height: 34, borderRadius: 17 }}
            />

            <Text style={styles.headerTitle}>
              {otherProfile?.name ?? "Chat"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.block}>Block</Text>
          </TouchableOpacity>
        </View>

        {/* MESSAGES */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
          keyboardDismissMode="interactive"
          renderItem={({ item }) => {
            const isMe = item.sender_profile_id === me.id;

            return (
              <View
                style={[
                  styles.bubble,
                  isMe
                    ? styles.bubbleMe
                    : styles.bubbleOther,
                ]}
              >
                <Text style={styles.bubbleText}>
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
            placeholderTextColor="#777"
            style={styles.input}
            multiline
          />

          <TouchableOpacity onPress={onSend}>
            <Ionicons name="send" size={22} color="#7C7CFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
