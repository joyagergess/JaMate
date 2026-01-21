import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { chatStyles as styles } from "@/styles/chat.styles";

export function ChatInputBar({
  text,
  onChangeText,
  onSend,
  onOpenTracks,
}: any) {
  return (
    <View style={styles.inputBar}>
      <TouchableOpacity onPress={onOpenTracks}>
        <Ionicons name="musical-note" size={22} color="#7C7CFF" />
      </TouchableOpacity>

      <TextInput
        value={text}
        onChangeText={onChangeText}
        placeholder="Type a message"
        placeholderTextColor="#777"
        style={styles.input}
        multiline
      />

      <TouchableOpacity onPress={onSend}>
        <Ionicons name="send" size={22} color="#7C7CFF" />
      </TouchableOpacity>
    </View>
  );
}
