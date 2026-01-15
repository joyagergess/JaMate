import { StyleSheet } from "react-native";

export const messagesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0E13",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  tabText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    paddingBottom: 12,
    marginHorizontal: 24,
  },

  tabActive: {
    color: "#7C6DFF",
    borderBottomWidth: 2,
    borderBottomColor: "#7C6DFF",
  },

  searchBox: {
    marginTop: 16,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F2937",
  },

  info: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  message: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 2,
  },
});
