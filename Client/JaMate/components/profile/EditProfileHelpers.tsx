import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { uiPrimitivesStyles as styles } from "@/styles/uiPrimitives.styles";

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Input(props: any) {
  return (
    <TextInput
      {...props}
      style={styles.input}
      placeholderTextColor="#6B7280"
    />
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function Row({
  children,
  wrap,
}: {
  children: React.ReactNode;
  wrap?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        wrap && styles.rowWrap,
      ]}
    >
      {children}
    </View>
  );
}

export function Segment({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.segment,
        selected
          ? styles.segmentSelected
          : styles.segmentUnselected,
      ]}
    >
      <Text
        style={[
          styles.segmentText,
          selected
            ? styles.segmentTextSelected
            : styles.segmentTextUnselected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
