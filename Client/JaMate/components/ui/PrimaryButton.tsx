import { TouchableOpacity, Text } from 'react-native';
import { colors, spacing } from '../../styles/theme';

type Props = {
  title: string;
  onPress?: () => void;
};

export function PrimaryButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        borderRadius: spacing.pill,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 20,
      }}
    >
      <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
