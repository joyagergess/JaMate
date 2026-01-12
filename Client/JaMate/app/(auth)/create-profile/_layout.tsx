import { Slot } from "expo-router";
import { CreateProfileProvider } from "../../../context/CreateProfileContext";

export default function CreateProfileRouteLayout() {
  return (
    <CreateProfileProvider>
      <Slot />
    </CreateProfileProvider>
  );
}
