import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },

  timer: {
    color: "#7C7CFF",
    fontSize: 42,
    marginBottom: 40,
    fontVariant: ["tabular-nums"],
  },

  mainButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#7C7CFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#7C7CFF55",
  },

  uploadText: {
    color: "#7C7CFF",
    fontSize: 14,
  },

  myTracksBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 28,
  },

  myTracksText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});
