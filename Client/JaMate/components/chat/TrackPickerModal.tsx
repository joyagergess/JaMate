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
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#0B0E13",
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "60%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Select a track
            </Text>
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
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#1F1F2A",
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: "#777", fontSize: 12 }}>
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
