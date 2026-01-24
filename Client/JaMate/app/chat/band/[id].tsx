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

import { apiClient } from "../../../api/client";
import { useMessages } from "../../../hooks/messages/useMessages";
import { useSendMessage } from "../../../hooks/messages/useSendMessage";
import { useConversations } from "../../../hooks/messages/useConversations";
import { useProfile } from "../../../hooks/profile/useProfile";
import { useRenameConversation } from "../../../hooks/messages/useRenameConversation";
import { buildImageUrl } from "../../../utils/media";
import { chatStyles } from "../../../styles/chat.styles";
import { styles } from "../../../styles/BandChatScreen.styles";
import { echo } from "../../../lib/echo";
import { Spinner } from "../../../components/ui/Spinner";
import { DraggableSetlistBubble } from "../../../components/ui/DraggableSetlistBubble";
import { useBandSetlist } from "../../../hooks/bands/useBandSetlist";
import { useGenerateBandSetlist } from "../../../hooks/bands/useGenerateBandSetlist";
import type { Message } from "../../../hooks/messages/useMessages";

export default function BandChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const queryClient = useQueryClient();
  const listRef = useRef<FlatList<Message>>(null);

  const { data: me } = useProfile();
  const { data: conversations } = useConversations();
  const { data, isLoading } = useMessages(conversationId);

  const conversation = useMemo(
    () => conversations?.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );

  const bandId = conversation?.band?.id;

  const { data: setlistData } = useBandSetlist(bandId);
  const generateSetlist = useGenerateBandSetlist(bandId);

  const messages = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const sendMessage = useSendMessage(conversationId);
  useRenameConversation(conversationId);

  const [text, setText] = useState("");

  const participants = conversation?.participants ?? [];

  useEffect(() => {
    if (!conversationId || !me) return;
    apiClient.post(`/conversations/${conversationId}/read`);
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [conversationId, me, queryClient]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (!conversationId || !me) return;

    const channel = echo.private(`conversation.${conversationId}`);

    channel.listen(".MessageSent", (e: { message: Message }) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        const firstPage = old.pages[0];

        if (firstPage.data.some((m: any) => m.id === e.message.id)) {
          return old;
        }

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: [...firstPage.data, e.message],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    return () => {
      echo.leave(`conversation.${conversationId}`);
    };
  }, [conversationId, me, queryClient]);

  if (isLoading || !me || !conversation) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size={42} />
      </View>
    );
  }

  const getProfile = (id: number) =>
    participants.find((p) => p.profile.id === id)?.profile;

  const onSend = () => {
    if (!text.trim()) return;

    sendMessage.mutate({
      type: "text",
      body: text,
    });

    setText("");
  };

  return (
    <SafeAreaView style={chatStyles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={chatStyles.header}>
          <TouchableOpacity onPress={() => router.replace("/messages")}>
            <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCenter}
            onPress={() =>
              router.push({
                pathname: "/chat/band/[id]/settings",
                params: { id: conversationId },
              })
            }
          >
            <Text style={chatStyles.headerTitle}>
              {conversation.name || "Band chat"}
            </Text>
            <Text style={styles.subTitle}>{participants.length} members</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id.toString()}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => {
            const isMe = item.sender_profile_id === me.id;
            const sender = getProfile(item.sender_profile_id);

            const avatarPath =
              sender?.media
                ?.slice()
                .sort((a, b) => a.order_index - b.order_index)
                .find((m) => m.media_type === "image")?.media_url ?? null;

            const avatarUrl = avatarPath ? buildImageUrl(avatarPath) : null;

            return (
              <View
                style={[
                  chatStyles.bubble,
                  isMe ? chatStyles.bubbleMe : chatStyles.bubbleOther,
                ]}
              >
                {!isMe && (
                  <View style={styles.senderRow}>
                    <Image
                      source={
                        avatarUrl
                          ? { uri: avatarUrl }
                          : require("../../../assets/images/unknow.jpg")
                      }
                      style={styles.senderAvatar}
                    />
                    <Text style={styles.senderName}>{sender?.name}</Text>
                  </View>
                )}

                {item.type === "text" && (
                  <Text style={chatStyles.bubbleText}>{item.body}</Text>
                )}

                {item.type === "track" && (
                  <Text style={chatStyles.bubbleText}>
                    🎵 {item.track_title}
                  </Text>
                )}

                <Text style={chatStyles.time}>
                  {new Date(item.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
        />

        <View style={chatStyles.inputBar}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor="#777"
            style={chatStyles.input}
            multiline
          />

          <TouchableOpacity onPress={onSend}>
            <Ionicons name="send" size={22} color="#7C7CFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {bandId && (
        <DraggableSetlistBubble
          status={setlistData?.status ?? "processing"}
          setlist={
            setlistData?.status === "ready" ? setlistData.setlist : undefined
          }
          isGenerating={generateSetlist.isPending}
          onGenerate={() => generateSetlist.mutate()}
        />
      )}
    </SafeAreaView>
  );
}
