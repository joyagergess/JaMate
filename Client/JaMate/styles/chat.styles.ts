import { StyleSheet } from "react-native";

export const chatStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginBottom: 4,
  },

  headerName: {
    color: "#fff",
    fontWeight: "600",
  },

  block: {
    color: "#FF4D4D",
    fontWeight: "600",
  },

  bubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 16,
  },

  bubbleMine: {
    backgroundColor: "#6D5DF6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  bubbleOther: {
    backgroundColor: "#1F2937",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  bubbleText: {
    color: "#fff",
    fontSize: 14,
  },

  bubbleTextMine: {
    fontWeight: "600",
  },

  time: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#111827",
    borderRadius: 22,
    paddingHorizontal: 16,
    color: "#fff",
  },

  voiceBtn: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6D5DF6",
    alignItems: "center",
    justifyContent: "center",
  },
});
