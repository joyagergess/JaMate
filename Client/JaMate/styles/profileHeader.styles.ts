import { StyleSheet } from "react-native";

export const profileHeaderStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 40,
  },

  logoutButton: {
    position: "absolute",
    right: 24,
    top: 40,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    backgroundColor: "#1F2937",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },

  username: {
    color: "#9CA3AF",
    marginTop: 4,
  },

  bio: {
    color: "#D1D5DB",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 32,
    lineHeight: 20,
  },

  editButton: {
    marginTop: 20,
    backgroundColor: "#6D5DF6",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
