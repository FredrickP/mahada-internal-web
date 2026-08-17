import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updatePaymentStatus,
  uploadPaymentProof,
} from '../api/payment.api';

import type {
  UpdatePaymentStatusInput,
  UploadPaymentProofInput,
} from '../types/payment.types';

export const usePaymentProcessing = () => {
  const queryClient =
    useQueryClient();

  const invalidatePaymentQueries =
    async (
      paymentId: string,
    ) => {
      await Promise.all([
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
            'payment',
            'detail',
            paymentId,
          ],
        }),
      ]);
    };

  const updateStatusMutation =
    useMutation({
      mutationFn: (
        input: UpdatePaymentStatusInput,
      ) => {
        return updatePaymentStatus(
          input,
        );
      },
      onSuccess: async (
        _response,
        input,
      ) => {
        await invalidatePaymentQueries(
          input.id,
        );
      },
    });

  const uploadProofMutation =
    useMutation({
      mutationFn: (
        input: UploadPaymentProofInput,
      ) => {
        return uploadPaymentProof(
          input,
        );
      },
      onSuccess: async (
        _response,
        input,
      ) => {
        await invalidatePaymentQueries(
          input.id,
        );
      },
    });

  return {
    updateStatusMutation,
    uploadProofMutation,
  };
};