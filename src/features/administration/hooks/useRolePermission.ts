import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getRolePermission,
  updateRolePermission,
} from '../api/administration.api';

import type {
  UpdateRolePermissionInput,
  UserRole,
} from '../types/administration.types';

export const useRolePermission = (
  role: UserRole | null,
) => {
  return useQuery({
    queryKey: [
      'administration',
      'roles',
      role,
      'permissions',
    ],
    queryFn: () => {
      if (!role) {
        throw new Error(
          'Role tidak valid',
        );
      }

      return getRolePermission(
        role,
      );
    },
    enabled: Boolean(role),
  });
};

export const useUpdateRolePermission =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        input: UpdateRolePermissionInput,
      ) => {
        return updateRolePermission(
          input,
        );
      },
      onSuccess: async (
        _response,
        input,
      ) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              'administration',
              'roles',
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              'administration',
              'roles',
              input.role,
              'permissions',
            ],
          }),
        ]);
      },
    });
  };