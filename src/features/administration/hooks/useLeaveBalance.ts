import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getLeaveBalances,
  updateLeaveBalance,
} from '../api/administration.api';

import type {
  UpdateLeaveBalanceInput,
} from '../types/administration.types';

export const useLeaveBalance = (
  year: number,
) => {
  return useQuery({
    queryKey: [
      'administration',
      'leave-balance',
      year,
    ],
    queryFn: () => {
      return getLeaveBalances(
        year,
      );
    },
  });
};

export const useUpdateLeaveBalance =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        input: UpdateLeaveBalanceInput,
      ) => {
        return updateLeaveBalance(
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
              'leave-balance',
              input.year,
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              'administration',
            ],
          }),
        ]);
      },
    });
  };