import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
  },

  headerCenter: {
    flex: 1,
    marginLeft: 10,
  },

  subTitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  listPadding: {
    paddingVertical: 16,
  },

  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  senderAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
  },

  senderName: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },
});
