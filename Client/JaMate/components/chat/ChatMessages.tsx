import { FlatList, View, Text } from "react-native";
import { useState, useEffect } from "react";

import { ChatTrackBubble } from "@/components/chat/ChatTrackBubble";
import { JamAnalyzeButton } from "@/components/chat/JamAnalyzeButton";
import { JamAnalyzeModal } from "@/components/chat/JamAnalyzeModal";

import { useJamAnalyze } from "@/hooks/jam/useJamAnalyze";
import { chatStyles as styles } from "@/styles/chat.styles";

export function ChatMessages({
  messages,
  me,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: any) {
  const { analyze, loading, result, reset } = useJamAnalyze();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setModalVisible(true);
    }
  }, [result]);
  const formatHour = (date: string) =>
    new Date(date)
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();

  return (
    <>
      <FlatList
        data={messages}
        keyExtractor={(m: any) => m.id.toString()}
        contentContainerStyle={{ paddingVertical: 16 }}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.y <= 0 &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const isMe = item.sender_profile_id === me.id;
          const next = messages[index + 1];

          const isTrack = item.type === "track";
          const nextIsTrack = next?.type === "track";

          const showAnalyze =
            isTrack &&
            nextIsTrack &&
            item.sender_profile_id !== next.sender_profile_id;

          return (
            <View>
              {isTrack ? (
                <ChatTrackBubble
                  isMe={isMe}
                  track={{
                    id: item.track_id,
                    title: item.track_title,
                    duration: item.track_duration,
                    audio_public_url: item.audio_public_url,
                    track_type: item.track_type,
                    created_at: item.sent_at,
                  }}
                />
              ) : (
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleOther,
                  ]}
                >
                  <Text style={styles.bubbleText}>{item.body}</Text>
                  <Text style={styles.bubbleTime}>
                    {formatHour(item.sent_at)}
                  </Text>
                </View>
              )}

              {showAnalyze && (
                <JamAnalyzeButton
                  loading={loading}
                  onPress={() => {
                    const aIsMe = item.sender_profile_id === me.id;
                    const bIsMe = next.sender_profile_id === me.id;

                    analyze(item.track_id, next.track_id, {
                      trackALabel: aIsMe ? "You" : "Them",
                      trackBLabel: bIsMe ? "You" : "Them",
                    });
                  }}
                />
              )}
            </View>
          );
        }}
      />

      <JamAnalyzeModal
        visible={modalVisible}
        result={result}
        onClose={() => {
          setModalVisible(false);
          reset();
        }}
      />
    </>
  );
}
