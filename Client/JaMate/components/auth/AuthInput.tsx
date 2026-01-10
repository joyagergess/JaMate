import { Text, TextInput } from 'react-native';
import { authStyles as styles } from '../../styles/auth.styles';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
};

export function AuthInput({ label, secure, ...props }: Props) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        secureTextEntry={secure}
        {...props}
      />
    </>
  );
}
