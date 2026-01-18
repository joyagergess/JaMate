import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151922",
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },

  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7C7CFF22",
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
  },

  title: {
    color: "white",
    fontSize: 14,
    marginBottom: 6,
  },

  progressBar: {
    height: 4,
    backgroundColor: "#2A2F3A",
    borderRadius: 2,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#7C7CFF",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },

  link: {
    color: "#9CA3AF",
    fontSize: 16,
  },

  linkPrimary: {
    color: "#7C7CFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
