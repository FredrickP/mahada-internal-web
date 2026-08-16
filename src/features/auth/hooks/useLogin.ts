import { useMutation } from '@tanstack/react-query';

import { login } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useLogin = () => {
  const setSession = useAuthStore(
    (state) => state.setSession,
  );

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      setSession(response);
    },
  });
};