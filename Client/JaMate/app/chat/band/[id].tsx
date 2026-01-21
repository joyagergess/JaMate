import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
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
import { chatStyles as styles } from "../../../styles/chat.styles";
import { echo } from "../../../lib/echo";
import { Spinner } from "../../../components/ui/Spinner";

type Message = {
  id: number;
  body: string | null;
  sent_at: string;
  sender_profile_id: number;
};

export default function BandChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const queryClient = useQueryClient();
  const listRef = useRef<FlatList<Message>>(null);

  const { data: me } = useProfile();
  const { data: conversations } = useConversations();


  const {
    data,
    isLoading,
  } = useMessages(conversationId);

  const messages = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const sendMessage = useSendMessage(conversationId);
  const rename = useRenameConversation(conversationId);

  const [text, setText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState("");


  const conversation = useMemo(
    () => conversations?.find((c) => c.id === conversationId),
    [conversations, conversationId]
  );

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
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: any) => {
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
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    });

    return () => {
      echo.leave(`conversation.${conversationId}`);
    };
  }, [conversationId, me, queryClient]);


  if (isLoading || !me || !conversation) {
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
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/messages")}>
            <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, marginLeft: 10 }}
            onPress={() =>
              router.push({
                pathname: "/chat/band/[id]/settings",
                params: { id: conversationId },
              })
            }
          >
            <Text style={styles.headerTitle}>
              {conversation.name || "Band chat"}
            </Text>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
              {participants.length} members
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Ionicons name="ellipsis-vertical" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
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
                  styles.bubble,
                  isMe ? styles.bubbleMe : styles.bubbleOther,
                ]}
              >
                {!isMe && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Image
                      source={
                        avatarUrl
                          ? { uri: avatarUrl }
                          : require("../../../assets/images/unknow.jpg")
                      }
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        marginRight: 6,
                      }}
                    />
                    <Text
                      style={{
                        color: "#9CA3AF",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {sender?.name}
                    </Text>
                  </View>
                )}

                <Text style={styles.bubbleText}>{item.body}</Text>

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

      <Modal transparent visible={showMenu} animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={{
              backgroundColor: "#0B0E13",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                setShowRename(true);
                setNewName(conversation.name ?? "");
              }}
              style={{ padding: 16 }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Rename band</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* RENAME MODAL */}
      <Modal transparent visible={showRename} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#111827",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              Rename band
            </Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Band name"
              placeholderTextColor="#6B7280"
              style={{
                backgroundColor: "#0B0E13",
                color: "#fff",
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setShowRename(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: "#9CA3AF" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!newName.trim()) return;

                  rename.mutate(newName.trim(), {
                    onSuccess: () => setShowRename(false),
                  });
                }}
              >
                <Text style={{ color: "#16C784", fontWeight: "700" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
