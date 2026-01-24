import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { trackModalStyles as styles } from "../../styles/trackModals.styles";

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
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name="trash-outline"
              size={32}
              color="#EF4444"
            />
          </View>

          <Text style={styles.title}>
            Delete AI backing track?
          </Text>

          <Text style={styles.subtitle}>
            This action cannot be undone.
          </Text>

          <View style={styles.row}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={styles.dangerButton}
            >
              <Text style={styles.dangerText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
