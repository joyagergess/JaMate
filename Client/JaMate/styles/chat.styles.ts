import { StyleSheet } from "react-native";

export const chatStyles = StyleSheet.create({
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  timestamp: {
    fontSize: 11,
    color: "#9CA3AF", 
    marginTop: 4,
  },
  bubbleTime: {
  fontSize: 11,
  color: "rgba(255,255,255,0.6)",
  alignSelf: "flex-end",
  marginTop: 4,
},


  timestampMe: {
    alignSelf: "flex-end",
  },

  timestampOther: {
    alignSelf: "flex-start",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  block: {
    color: "#FF4D4D",
    fontSize: 12,
  },

  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 12,
  },

  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#6D5DF6",
    borderBottomRightRadius: 4,
  },

  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#1F2937",
    borderBottomLeftRadius: 4,
  },

  bubbleText: {
    color: "#fff",
    fontSize: 14,
  },

  time: {
    marginTop: 4,
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    alignSelf: "flex-end",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  input: {
    flex: 1,
    color: "#fff",
    backgroundColor: "#111827",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
});
