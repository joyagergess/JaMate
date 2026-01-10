import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

type RegisterPayload = {
  email: string;
  password: string;
};

export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, password }: RegisterPayload) => {
      const res = await apiClient.post('/auth/register', {
        email,
        password,
      });

      return res.data;
    },
  });
}
