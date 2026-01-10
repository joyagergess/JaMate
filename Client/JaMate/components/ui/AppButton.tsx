import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../../styles/theme';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
}: Props) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isPrimary ? colors.primary : colors.white,
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: isPrimary ? colors.white : colors.black,
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
