import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },

  inputLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    marginBottom: 16,
  },

  primaryButton: {
    backgroundColor: '#6D5DF6',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F2937',
  },

  dividerText: {
    color: '#6B7280',
    fontSize: 12,
    marginHorizontal: 8,
  },

  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  googleText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },

  footer: {
    marginTop: 24,
    alignItems: 'center',
  },

  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  link: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
