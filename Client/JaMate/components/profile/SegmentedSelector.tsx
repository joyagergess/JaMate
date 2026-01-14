import { View, TouchableOpacity, Text } from "react-native";

type Props = {
  options: string[];
  value: string[];
  single?: boolean;
  max?: number;
  onChange: (next: string[]) => void;
};

export function SegmentedSelector({
  options,
  value,
  onChange,
  single = false,
  max,
}: Props) {
  const toggle = (v: string) => {
    if (single) {
      onChange([v]);
      return;
    }

    if (value.includes(v)) {
      onChange(value.filter(x => x !== v));
      return;
    }

    if (!max || value.length < max) {
      onChange([...value, v]);
    }
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {options.map(o => {
        const selected = value.includes(o);
        return (
          <TouchableOpacity
            key={o}
            onPress={() => toggle(o)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: selected ? "#6D5DF6" : "#374151",
              backgroundColor: selected ? "#6D5DF6" : "transparent",
            }}
          >
            <Text
              style={{
                color: selected ? "#FFFFFF" : "#E5E7EB",
                fontWeight: "600",
              }}
            >
              {o}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
