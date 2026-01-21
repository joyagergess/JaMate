import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type MenuAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  anchor: MenuAnchor | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TrackActionsMenu({
  visible,
  anchor,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!visible || !anchor) return null;

  const MENU_WIDTH = 200;
  const screen = Dimensions.get("window");

  const left = Math.min(
    anchor.x + anchor.width - MENU_WIDTH,
    screen.width - MENU_WIDTH - 8
  );

  const top = anchor.y + anchor.height + 6;

  return (
    <Modal transparent animationType="fade" visible>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1 }}
      >
        <View
          style={{
            position: "absolute",
            top,
            left,
            width: MENU_WIDTH,
            backgroundColor: "#0B0E13",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#1F2937",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 12,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onClose();
              onEdit();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 12,
            }}
          >
            <Ionicons name="create-outline" size={16} color="#E5E7EB" />
            <Text style={{ color: "#E5E7EB", fontSize: 14 }}>
              Edit title
            </Text>
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: "#1F2937" }} />

          <TouchableOpacity
            onPress={() => {
              onClose();
              onDelete();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 12,
            }}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={{ color: "#EF4444", fontSize: 14 }}>
              Delete track
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
