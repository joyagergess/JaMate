import { StyleSheet } from "react-native";
import { colors, spacing } from "./theme";

export const createProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.screen,
    marginBottom: 24,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  sectionText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },

  guideline: {
    marginBottom: 18,
  },

  footer: {
    padding: spacing.screen,
  },

  inputLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  inputHint: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },

  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    color: colors.white,
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },

  doneDisabled: {
    opacity: 0.4,
  },
  levelButton: {
  height: 52,
  borderRadius: 26,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
},

levelButtonSelected: {
  backgroundColor: "#6D5DF6",
},

levelButtonUnselected: {
  borderWidth: 1,
  borderColor: "#6D5DF6",
  backgroundColor: "transparent",
},

levelButtonText: {
  fontSize: 16,
  fontWeight: "500",
  color: "#FFFFFF",
},

levelButtonTextSelected: {
  color: "#FFFFFF",
},
textArea: {
  minHeight: 120,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.3)",
  borderRadius: 14,
  padding: 14,
  color: "#FFFFFF",
  fontSize: 15,
  textAlignVertical: "top",
},


});
