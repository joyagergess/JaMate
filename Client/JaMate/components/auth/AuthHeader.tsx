import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function AuthHeader() {
  const router = useRouter();

  return (
    <View style={{ padding: 16 }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#1F2937',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
