import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createBusinessTrip,
} from '../api/business-trip.api';

import type {
  CreateBusinessTripInput,
} from '../types/business-trip.types';

export const useCreateBusinessTrip = () => {
  const queryClient =
    useQueryClient();

  const invalidateHRServices =
    async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'hr-services',
        ],
      });
    };

  const createMutation =
    useMutation({
      mutationFn: (
        input: CreateBusinessTripInput,
      ) => {
        return createBusinessTrip(
          input,
        );
      },
      onSuccess: async () => {
        await invalidateHRServices();
      },
    });

  return {
    createMutation,
  };
};