import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useMemo, useState } from "react";
import { SelectablePill } from "./SelectablePill";
import { AppButton } from "./AppButton";

type Props = {
  visible: boolean;
  title: string;
  items: string[];
  selected: string[];
  max?: number;
  onChange: (next: string[]) => void;
  onClose: () => void;
};

export function SearchablePickerModal({
  visible,
  title,
  items,
  selected,
  max,
  onChange,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");

  /* ===================== ORDER LOGIC ===================== */

  const orderedItems = useMemo(() => {
    const selectedSet = new Set(selected);

    return [
      ...selected, // 👈 selected first
      ...items.filter((i) => !selectedSet.has(i)),
    ];
  }, [items, selected]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return orderedItems;

    const q = query.toLowerCase();
    return orderedItems.filter((i) =>
      i.toLowerCase().includes(q)
    );
  }, [orderedItems, query]);

  /* ===================== TOGGLE ===================== */

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((x) => x !== item));
    } else {
      if (!max || selected.length < max) {
        onChange([...selected, item]);
      }
    }
  };

  /* ===================== UI ===================== */

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#0B0E13", padding: 24 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 16,
          }}
        >
          {title}
        </Text>

        {/* Search */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search…"
          placeholderTextColor="#9CA3AF"
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            padding: 14,
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        {/* Pills */}
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {filteredItems.map((item) => (
              <SelectablePill
                key={item}
                label={item}
                selected={selected.includes(item)}
                onPress={() => toggle(item)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{ marginTop: 16 }}>
          <AppButton title="Done" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
