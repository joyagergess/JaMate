import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 32,
  },

  label: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    marginBottom: 16,
  },
});
