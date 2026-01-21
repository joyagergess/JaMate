import { FlatList, View, Text } from "react-native";
import { ChatTrackBubble } from "@/components/chat/ChatTrackBubble";
import { JamAnalyzeButton } from "@/components/chat/JamAnalyzeButton";
import { chatStyles as styles } from "@/styles/chat.styles";

export function ChatMessages({
  messages,
  me,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: any) {
  return (
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
              </View>
            )}

            {showAnalyze && (
              <JamAnalyzeButton
                onPress={() => {
                  console.log("Analyze jam", item.track_id, next.track_id);
                }}
              />
            )}
          </View>
        );
      }}
    />
  );
}
