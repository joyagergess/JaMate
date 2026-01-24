import { StyleSheet } from "react-native";

export const trackModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },

  container: {
    backgroundColor: "#0B0E13",
    borderRadius: 14,
    padding: 20,
  },

  iconWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1F2937",
    alignItems: "center",
  },

  cancelText: {
    color: "#9CA3AF",
  },

  dangerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },

  dangerText: {
    color: "white",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#111827",
    color: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 20,
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#16C784",
    alignItems: "center",
  },

  saveText: {
    color: "#0B0E13",
    fontWeight: "600",
  },
});
