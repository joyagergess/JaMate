import { Modal, View, Text, TouchableOpacity } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onViewTrack?: () => void;
};

export function AiReadyModal({
  visible,
  onClose,
  onViewTrack,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#111827",
            padding: 20,
            borderRadius: 14,
            width: "80%",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Your track is ready 🎶
          </Text>

          <Text style={{ color: "#9CA3AF", marginBottom: 20 }}>
            Your AI backing track has been generated.
          </Text>

          {/* PRIMARY ACTION */}
          {onViewTrack && (
            <TouchableOpacity
              onPress={onViewTrack}
              style={{
                backgroundColor: "#16C784",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#000", fontWeight: "700" }}>
                View AI track
              </Text>
            </TouchableOpacity>
          )}

          {/* SECONDARY ACTION */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#9CA3AF" }}>
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
