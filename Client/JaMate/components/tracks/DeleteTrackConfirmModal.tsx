import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteTrackConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#0B0E13",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Ionicons
              name="trash-outline"
              size={32}
              color="#EF4444"
            />
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Delete AI backing track?
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            This action cannot be undone.
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: "#1F2937",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#9CA3AF" }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: "#EF4444",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
