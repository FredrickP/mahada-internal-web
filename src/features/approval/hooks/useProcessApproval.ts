import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  processApproval,
} from '../api/approval.api';

import type {
  ApprovalActionInput,
} from '../types/approval.types';

export const useProcessApproval = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: ApprovalActionInput,
    ) => {
      return processApproval(
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
            'approvals',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'approvals',
            'detail',
            input.approvalId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'payments',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'payment',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'it-requests',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'it-request',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'hr-services',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'business-trip',
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            'dashboard',
          ],
        }),
      ]);
    },
  });
};