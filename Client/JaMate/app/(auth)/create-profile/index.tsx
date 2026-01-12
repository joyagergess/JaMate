import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AppButton } from "../../../components/ui/AppButton";
import { createProfileStyles as styles } from "../../../styles/create-profile.styles";

export default function CreateProfileWelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={{  marginVertical: 24 }}>
          <Image
            source={require("../../../assets/images/logo-jamate.png")}
            style={{ width: 56, height: 56 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome to JaMate.</Text>
        <Text style={styles.subtitle}>
          Please follow these community guidelines.
        </Text>

        <Guideline
          title="Be authentic."
          text="Use real photos, videos and share your true musical interests, skills and experience."
        />

        <Guideline
          title="Stay safe."
          text="Be mindful when sharing personal details or meeting collaborators."
        />

        <Guideline
          title="Keep it constructive."
          text="Give feedback with respect. Different styles and levels are welcome here."
        />

        <Guideline
          title="Speak up."
          text="Report inappropriate behavior so we can keep JaMate a safe space for creators."
        />
      </View>

      <View style={styles.footer}>
        <AppButton
          title="I agree"
          onPress={() => router.push("/create-profile/basics")}
        />
      </View>
    </SafeAreaView>
  );
}

function Guideline({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.guideline}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}
