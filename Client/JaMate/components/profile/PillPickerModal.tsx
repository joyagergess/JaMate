import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SelectablePill } from "../ui/SelectablePill";
import { AppButton } from "../ui/AppButton";

type Props = {
  visible: boolean;
  title: string;
  items: string[];
  selected: string[];
  max?: number;
  onToggle: (value: string) => void;
  onClose: () => void;
};

export function PillPickerModal({
  visible,
  title,
  items,
  selected,
  onToggle,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = items.filter(i =>
    i.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#0B0E13", padding: 24 }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 16,
          }}
        >
          {title}
        </Text>

        <TextInput
          placeholder="Search..."
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: "#111827",
            color: "#FFFFFF",
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
          }}
        />

        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {filtered.map(item => (
              <SelectablePill
                key={item}
                label={item}
                selected={selected.includes(item)}
                onPress={() => onToggle(item)}
              />
            ))}
          </View>
        </ScrollView>

        <AppButton title="Done" onPress={onClose} />
      </View>
    </Modal>
  );
}
