import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { useCreateProfile } from "../../../context/CreateProfileContext";
import { useSubmitProfile } from "../../../hooks/profile/useSubmitProfile";
import { AppButton } from "../../../components/ui/AppButton";


export default function CreateProfileSubmitScreen() {
  const router = useRouter();
  const { data } = useCreateProfile();
  const submitProfile = useSubmitProfile();

  const onSubmit = () => {
    console.log("📦 FINAL CONTEXT DATA:", data);

    submitProfile.mutate(data, {
      onSuccess: (res) => {
        console.log(" PROFILE CREATED SUCCESSFULLY");
        console.log(" RESPONSE:", res);

        router.replace("/");
      },
      onError: (error: any) => {
        console.log(" PROFILE CREATION FAILED");
        console.log(" ERROR:", error);

        if (error?.response) {
          console.log(" BACKEND STATUS:", error.response.status);
          console.log(" BACKEND DATA:", error.response.data);
        }
      },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end", padding: 24 }}>
    <AppButton
  title={submitProfile.isPending ? "Creating profile..." : "Create profile"}
  onPress={onSubmit}
  disabled={submitProfile.isPending}
/>

    </View>
  );
}
