import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useUpdateTrackTitle } from "../../hooks/tracks/useUpdateTrackTitle";
import { trackModalStyles as styles } from "../../styles/trackModals.styles";

type Props = {
  visible: boolean;
  track: any;
  onClose: () => void;
};

export function EditTrackTitleModal({
  visible,
  track,
  onClose,
}: Props) {
  const [title, setTitle] = useState(track?.title ?? "");
  const updateTitle = useUpdateTrackTitle();

  useEffect(() => {
    setTitle(track?.title ?? "");
  }, [track]);

  const submit = () => {
    if (!title.trim()) return;

    updateTitle.mutate(
      {
        trackId: track.id,
        title: title.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Edit track title
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Track title"
            placeholderTextColor="#6B7280"
            autoFocus
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={submit}
              disabled={updateTitle.isPending}
              style={[
                styles.saveButton,
                { opacity: updateTitle.isPending ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.saveText}>
                {updateTitle.isPending ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
