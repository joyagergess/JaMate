import { StyleSheet } from "react-native";

export const trackPickerModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#0B0E13",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  trackItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F2A",
  },

  trackTitle: {
    color: "#FFFFFF",
  },

  trackDuration: {
    color: "#777777",
    fontSize: 12,
  },
});
