import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0F' }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '600' }}>
          JaMate Home
        </Text>
        <Text style={{ color: '#9CA3AF', marginTop: 8 }}>
          Feed coming soon…
        </Text>
      </View>
    </SafeAreaView>
  );
}
