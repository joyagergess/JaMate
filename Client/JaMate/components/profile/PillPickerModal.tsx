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
import { pillPickerModalStyles as styles } from "../../styles/pillPickerModal.styles";

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

  const filtered = items.filter((i) =>
    i.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        <TextInput
          placeholder="Search..."
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />

        <ScrollView>
          <View style={styles.pillsWrapper}>
            {filtered.map((item) => (
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
