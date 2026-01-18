import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { useCreateProfile } from "../../../context/CreateProfileContext";
import { AppButton } from "../../../components/ui/AppButton";
import { StepIndicator } from "@/components/ui/StepIndicator";

const TOTAL_STEPS = 5;
const CURRENT_STEP = 3;

export default function CreateProfileBirthdayScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const [date, setDate] = useState<Date | null>(
    data.birthDate ? new Date(data.birthDate) : null
  );
  const [showPicker, setShowPicker] = useState(false);

  const isValid = !!date;

  const handleNext = () => {
    if (!date) return;

    update({ birthDate: date.toISOString() });
    router.push("/create-profile/instruments");
  };

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

        <StepIndicator current={3} />

        <Text style={styles.title}>Your birthday?</Text>

        {/* WEB */}
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={date ? toInputDate(date) : ""}
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) setDate(new Date(selected));
            }}
            style={{
              height: 48,
              borderRadius: 12,
              padding: "0 14px",
              backgroundColor: "#1F2937",
              color: "#FFFFFF",
              border: "none",
              fontSize: 16,
              marginTop: 12,
            }}
          />
        ) : (
          <>
            {/*  MOBILE */}
            <TouchableOpacity
              style={styles.textInput}
              activeOpacity={0.7}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: date ? "#FFFFFF" : "#9CA3AF" }}>
                {date ? formatDate(date) : "Select your birthday"}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={date ?? new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(Platform.OS === "ios");
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </>
        )}

        <Text style={styles.inputHint}>
          Your profile shows your age, not your birth date.
        </Text>
      </View>

      <View style={styles.footer}>
        <AppButton title="Next" disabled={!isValid} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}


function formatDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d} / ${m} / ${y}`;
}

function toInputDate(date: Date) {
  return date.toISOString().split("T")[0];
}
