import { StyleSheet } from "react-native";
import { colors, spacing } from "./theme";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

header: {
  paddingHorizontal: spacing.screen,
  paddingTop: spacing.screen,
},


  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
    marginBottom: 32,
  },

  errorText: {
    color: "#FF4D4F",
    fontSize: 13,
    marginBottom: 12,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  checkboxText: {
    marginLeft: 10,
    color: colors.muted,
    fontSize: 13,
  },

  link: {
    color: colors.primary,
    fontWeight: "600",
  },

  footer: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    color: "#999",
    fontSize: 13,
  },

  footerLink: {
    color: colors.primary,
    fontWeight: "600",
  },
  label: {
  color: "#9CA3AF",
  fontSize: 12,
  marginBottom: 6,
},

input: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 14,
  marginBottom: 16,
},

});
