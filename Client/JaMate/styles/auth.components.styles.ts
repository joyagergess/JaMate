import { StyleSheet } from "react-native";

export const authHeaderStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const authInputStyles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#9CA3AF",
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#111827",
    color: "#FFFFFF",
    marginBottom: 16,
  },
});
