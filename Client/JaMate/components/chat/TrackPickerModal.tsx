import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useMyTracks } from "@/hooks/tracks/useMyTracks";
import { Spinner } from "@/components/ui/Spinner";
import { Ionicons } from "@expo/vector-icons";
import { trackPickerModalStyles as styles } from "@/styles/trackPickerModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (track: any) => void;
};

export function TrackPickerModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const { data: tracks, isLoading } = useMyTracks();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a track</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#777" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Spinner />
          ) : (
            <FlatList
              data={tracks}
              keyExtractor={(t) => t.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelect(item)}
                  style={styles.trackItem}
                >
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <Text style={styles.trackDuration}>
                    {Math.round(item.duration)}s
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
