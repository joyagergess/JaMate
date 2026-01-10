import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

type LoginPayload = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const res = await apiClient.post('/auth/login', {
        email,
        password,
      });

      return res.data.data.token;
    },
  });
}
