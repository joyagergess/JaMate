import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
type SetlistMemberRole = {
  name: string;
  role: string;
  performance_notes?: string;
};

type SetlistItem = {
  order: number;
  song: string;
  artist: string;
  key?: string;
  chord_progression?: string;
  energy_level?: "Low" | "Medium" | "High";
  why_it_fits?: string;
  member_roles?: SetlistMemberRole[];
};

type Props = {
  status: "idle" | "processing" | "ready";
  setlist?: SetlistItem[];
  onGenerate: () => void;
  isGenerating: boolean;
};

const { width, height } = Dimensions.get("window");

export function DraggableSetlistBubble({
  status,
  setlist,
  onGenerate,
  isGenerating,
}: Props) {
  const [open, setOpen] = useState(false);

  const pan = useRef(
    new Animated.ValueXY({
      x: width - 90,
      y: height - 220,
    }),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[{ position: "absolute", zIndex: 100 }, pan.getLayout()]}
      >
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: "#6D5DF6",
            justifyContent: "center",
            alignItems: "center",
            elevation: 8,
          }}
        >
          <Ionicons name="musical-notes" size={26} color="#0B0E13" />
        </TouchableOpacity>
      </Animated.View>

      <Modal transparent visible={open} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#0B0E13",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "70%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                Band Setlist
              </Text>

              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}
            >
              {status === "processing" && (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <ActivityIndicator size="large" color="#6D5DF6" />
                  <Text style={{ color: "#9CA3AF", marginTop: 12 }}>
                    Generating setlist…
                  </Text>
                </View>
              )}

              {status === "ready" &&
                setlist?.map((item) => (
                  <View
                    key={item.order}
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}
                    >
                      {item.order}. {item.song}
                    </Text>

                    <Text
                      style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}
                    >
                      {item.artist}
                      {item.key ? ` • Key: ${item.key}` : ""}
                      {item.energy_level
                        ? ` • Energy: ${item.energy_level}`
                        : ""}
                    </Text>

                    {item.chord_progression && (
                      <Text
                        style={{ color: "#D1D5DB", fontSize: 12, marginTop: 6 }}
                      >
                        🎼 Chords: {item.chord_progression}
                      </Text>
                    )}

                    {item.why_it_fits && (
                      <Text
                        style={{
                          color: "#9CA3AF",
                          fontSize: 12,
                          marginTop: 6,
                          lineHeight: 16,
                        }}
                      >
                        💡 {item.why_it_fits}
                      </Text>
                    )}

                    {item.member_roles?.length > 0 && (
                      <View style={{ marginTop: 8 }}>
                        {item.member_roles.map((m, idx) => (
                          <Text
                            key={idx}
                            style={{ color: "#A5B4FC", fontSize: 12 }}
                          >
                            • {m.name}: {m.role}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
            </ScrollView>

            <View style={{ padding: 20 }}>
              <TouchableOpacity
                disabled={isGenerating || status === "processing"}
                onPress={onGenerate}
                style={{
                  backgroundColor:
                    isGenerating || status === "processing"
                      ? "#374151"
                      : "#6D5DF6",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#0B0E13", fontWeight: "700" }}>
                  Generate new setlist
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
