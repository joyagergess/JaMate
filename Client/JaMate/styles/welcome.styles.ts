import { StyleSheet } from 'react-native';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    justifyContent: 'space-between',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  privacy: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 20,
  },

  link: {
    color: '#FFFFFF',
    fontWeight: '500',
  },

  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
