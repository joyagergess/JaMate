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
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Edit track title
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* INPUT */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Track title"
            placeholderTextColor="#6B7280"
            autoFocus
            style={{
              backgroundColor: "#111827",
              color: "white",
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 10,
              fontSize: 15,
              marginBottom: 20,
            }}
          />

          {/* ACTIONS */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onClose}
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
              onPress={submit}
              disabled={updateTitle.isPending}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: "#16C784",
                alignItems: "center",
                opacity: updateTitle.isPending ? 0.6 : 1,
              }}
            >
              <Text style={{ color: "#0B0E13", fontWeight: "600" }}>
                {updateTitle.isPending ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
