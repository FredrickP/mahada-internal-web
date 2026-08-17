import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { updateRole } from '../api/administration.api';

import type {
  UpdateRoleInput,
} from '../types/administration.types';

export const useUpdateRole = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: UpdateRoleInput,
    ) => {
      return updateRole(input);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'administration',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'administration',
            'roles',
          ],
        }),
      ]);
    },
  });
};