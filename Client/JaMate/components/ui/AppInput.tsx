import { Text, TextInput, View } from 'react-native';
import { colors } from '../../styles/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
};

export function AppInput({
  label,
  secure,
  placeholder,
  ...props
}: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: colors.muted,
          fontSize: 12,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        secureTextEntry={secure}
        style={{
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 14,
        }}
      />
    </View>
  );
}
