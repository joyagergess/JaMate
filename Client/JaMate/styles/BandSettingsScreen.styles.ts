import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },

  section: {
    padding: 16,
  },

  sectionLabel: {
    color: "#9CA3AF",
    fontSize: 13,
  },

  bandNameButton: {
    marginTop: 6,
    paddingVertical: 10,
  },

  bandNameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  membersSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  membersLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 10,
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  memberName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  leaveButton: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
  },

  leaveText: {
    color: "#F87171",
    fontSize: 15,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#0B0E13",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelButton: {
    marginRight: 16,
  },

  cancelText: {
    color: "#9CA3AF",
  },

  saveText: {
    color: "#16C784",
    fontWeight: "700",
  },
});
