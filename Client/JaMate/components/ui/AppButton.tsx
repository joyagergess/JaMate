import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../styles/theme';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: Props) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: isPrimary ? colors.primary : colors.white,
        opacity: isDisabled ? 0.6 : 1,
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.white : colors.black}
        />
      ) : (
        <Text
          style={{
            color: isPrimary ? colors.white : colors.black,
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
