import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  completeBusinessTrip,
  getBusinessTripDetail,
  uploadBusinessTripEvidence,
} from '../api/business-trip.api';

import type {
  UploadBusinessTripEvidenceInput,
} from '../types/business-trip.types';

export const useBusinessTripDetail = (
  id: string,
) => {
  return useQuery({
    queryKey: [
      'business-trip',
      'detail',
      id,
    ],
    queryFn: () => {
      return getBusinessTripDetail(
        id,
      );
    },
    enabled: Boolean(id),
  });
};

export const useUploadBusinessTripEvidence =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        input: UploadBusinessTripEvidenceInput,
      ) => {
        return uploadBusinessTripEvidence(
          input,
        );
      },
      onSuccess: async (
        _response,
        input,
      ) => {
        await queryClient.invalidateQueries({
          queryKey: [
            'business-trip',
            'detail',
            input.tripId,
          ],
        });
      },
    });
  };

export const useCompleteBusinessTrip =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string,
      ) => {
        return completeBusinessTrip(
          id,
        );
      },
      onSuccess: async (
        _response,
        id,
      ) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              'business-trip',
              'detail',
              id,
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              'hr-services',
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