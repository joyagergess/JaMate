import { StyleSheet } from "react-native";

export const pillPickerModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    padding: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  pillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
