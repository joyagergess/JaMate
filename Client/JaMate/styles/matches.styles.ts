import { StyleSheet } from "react-native";

export const matchesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0E13",
    paddingHorizontal: 16,
  },

  loading: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },

  tabText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    marginRight: 24,
    paddingBottom: 10,
  },

  tabActive: {
    color: "#7C6CFF",
    borderBottomWidth: 2,
    borderBottomColor: "#7C6CFF",
  },

  /* Search */
  searchBox: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },

  /* Card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 20,
    marginTop: 16,
    backgroundColor: "#131722",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: "#222",
  },

  info: {
    flex: 1,
  },

  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  sub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 4,
  },

  actions: {
    justifyContent: "space-between",
    height: 60,
  },

  chatBtn: {
    backgroundColor: "#7C6CFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
     justifyContent: "center",
  alignItems: "center",
  },

  chatText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  profileBtn: {
    marginTop: 6,
    backgroundColor: "rgba(124,108,255,0.15)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  profileText: {
    color: "#7C6CFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
