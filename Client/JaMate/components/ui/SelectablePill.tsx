import { Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectablePill({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.pill,
        selected ? styles.selected : styles.unselected,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 40,
    borderRadius: 20,

    paddingHorizontal: 16,         
    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,              
    marginBottom: 12,            
  },

  selected: {
    backgroundColor: "#6D5DF6",
  },

  unselected: {
    borderWidth: 1,
    borderColor: "#6D5DF6",
    backgroundColor: "transparent",
  },

  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
