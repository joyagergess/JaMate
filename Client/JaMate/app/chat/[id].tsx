import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { useMessages } from "@/hooks/messages/useMessages";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { useConversations } from "@/hooks/messages/useConversations";
import { useProfile } from "@/hooks/profile/useProfile";
import { chatStyles as styles } from "@/styles/chat.styles";
import { echo } from "@/lib/echo";
import { Spinner } from "@/components/ui/Spinner";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInputBar } from "@/components/chat/ChatInputBar";
import { TrackPickerModal } from "@/components/chat/TrackPickerModal";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const [text, setText] = useState("");
  const [showTracks, setShowTracks] = useState(false);

  const queryClient = useQueryClient();

  const { data: me } = useProfile();
  const { data: conversations } = useConversations();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);

  const messages = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const sendMessage = useSendMessage(conversationId);

  /* mark read */
  useEffect(() => {
    if (!conversationId || !me) return;
    apiClient.post(`/conversations/${conversationId}/read`);
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [conversationId, me]);

  /* echo */
  useEffect(() => {
    if (!conversationId || !me) return;

    const channel = echo.private(`conversation.${conversationId}`);

    channel.listen(".MessageSent", (e: any) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        const firstPage = old.pages[0];
        if (firstPage.data.some((m: any) => m.id === e.message.id)) return old;

        return {
          ...old,
          pages: [
            { ...firstPage, data: [...firstPage.data, e.message] },
            ...old.pages.slice(1),
          ],
        };
      });

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    return () => {
      echo.leave(`private-conversation.${conversationId}`);
    };
  }, [conversationId, me]);

  const conversation = conversations?.find((c) => c.id === conversationId);

  const onSendText = () => {
    if (!text.trim()) return;
    sendMessage.mutate({ type: "text", body: text });
    setText("");
  };

  const onSendTrack = (track: any) => {
    sendMessage.mutate({ type: "track", track_id: track.id });
    setShowTracks(false);
  };

  if (isLoading || !me) {
    return (
      <View style={styles.loading}>
        <Spinner size={42} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ChatHeader conversation={conversation} me={me} />

        <ChatMessages
          messages={messages}
          me={me}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />

        <ChatInputBar
          text={text}
          onChangeText={setText}
          onSend={onSendText}
          onOpenTracks={() => setShowTracks(true)}
        />

        <TrackPickerModal
          visible={showTracks}
          onClose={() => setShowTracks(false)}
          onSelect={onSendTrack}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
