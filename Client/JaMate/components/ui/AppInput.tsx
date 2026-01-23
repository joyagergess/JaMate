import { Text, TextInput, View } from 'react-native';
import { colors } from '../../styles/theme';
import { ReactNode } from 'react';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secure?: boolean;

  rightIcon?: ReactNode;
  error?: string | null;
};

export function AppInput({
  label,
  secure,
  placeholder,
  rightIcon,
  error,
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 16,
          borderWidth: error ? 1 : 0,
          borderColor: error ? '#FF4D4F' : 'transparent',
        }}
      >
        <TextInput
          {...props}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          secureTextEntry={secure}
          style={{
            flex: 1,
            paddingVertical: 14,
            fontSize: 14,
          }}
        />

        {rightIcon && (
          <View style={{ marginLeft: 8 }}>
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text
          style={{
            color: '#FF4D4F',
            fontSize: 12,
            marginTop: 6,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
