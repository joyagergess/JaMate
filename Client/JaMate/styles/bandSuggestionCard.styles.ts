import { StyleSheet } from "react-native";

export const bandSuggestionCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#0B0E13",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    borderWidth: 1.5,
  },

  membersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  memberItem: {
    alignItems: "center",
    width: 64,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 6,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
