import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createPayment,
  savePaymentDraft,
} from '../api/payment.api';

import type {
  CreatePaymentInput,
  SavePaymentDraftInput,
} from '../types/payment.types';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  const invalidatePayments = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['payments'],
    });
  };

  const createMutation = useMutation({
    mutationFn: (
      input: CreatePaymentInput,
    ) => {
      return createPayment(input);
    },
    onSuccess: async () => {
      await invalidatePayments();
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (
      input: SavePaymentDraftInput,
    ) => {
      return savePaymentDraft(input);
    },
    onSuccess: async () => {
      await invalidatePayments();
    },
  });

  return {
    createMutation,
    saveDraftMutation,
  };
};