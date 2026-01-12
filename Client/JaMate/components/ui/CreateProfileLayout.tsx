import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { createProfileStyles as styles } from "../../styles/create-profile.styles";

type Props = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function CreateProfileLayout({ children, footer }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {children}
      </View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
}
