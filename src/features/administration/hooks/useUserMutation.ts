import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createUser,
  updateUser,
} from '../api/administration.api';

import type {
  CreateUserInput,
  UpdateUserInput,
} from '../types/administration.types';

export const useUserMutation = () => {
  const queryClient =
    useQueryClient();

  const invalidateAdministration =
    async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'administration',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'administration',
            'users',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'administration',
            'roles',
          ],
        }),
      ]);
    };

  const createMutation =
    useMutation({
      mutationFn: (
        input: CreateUserInput,
      ) => {
        return createUser(input);
      },
      onSuccess:
        invalidateAdministration,
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        input,
      }: {
        id: string;
        input: UpdateUserInput;
      }) => {
        return updateUser(
          id,
          input,
        );
      },
      onSuccess: async (
        _response,
        variables,
      ) => {
        await Promise.all([
          invalidateAdministration(),
          queryClient.invalidateQueries({
            queryKey: [
              'administration',
              'users',
              variables.id,
            ],
          }),
        ]);
      },
    });

  return {
    createMutation,
    updateMutation,
  };
};