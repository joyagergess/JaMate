import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { trackComponentsStyles as styles } from "../../styles/trackComponents.styles";

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
          style={[
            styles.menuContainer,
            {
              top,
              left,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              onClose();
              onEdit();
            }}
            style={styles.menuItem}
          >
            <Ionicons name="create-outline" size={16} color="#E5E7EB" />
            <Text style={styles.menuText}>Edit title</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            onPress={() => {
              onClose();
              onDelete();
            }}
            style={styles.menuItem}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={styles.menuDangerText}>Delete track</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
