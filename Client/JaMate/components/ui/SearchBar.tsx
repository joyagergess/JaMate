import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any; 
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search…",
  style,
}: Props) {
  return (
    <View
      style={[
        {
          marginTop: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 24,
          paddingHorizontal: 16,
          height: 44,
        },
        style,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        style={{
          flex: 1,
          color: "#fff",
          fontSize: 14,
        }}
      />

      <Ionicons name="search" size={18} color="#aaa" />
    </View>
  );
}
