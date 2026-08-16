import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createITRequest,
  saveITRequestDraft,
} from '../api/it-request.api';

import type {
  CreateITRequestInput,
  SaveITRequestDraftInput,
} from '../types/it-request.types';

export const useCreateITRequest = () => {
  const queryClient =
    useQueryClient();

  const invalidateITRequests =
    async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'it-requests',
        ],
      });
    };

  const createMutation =
    useMutation({
      mutationFn: (
        input: CreateITRequestInput,
      ) => {
        return createITRequest(
          input,
        );
      },

      onSuccess: async () => {
        await invalidateITRequests();
      },
    });

  const saveDraftMutation =
    useMutation({
      mutationFn: (
        input: SaveITRequestDraftInput,
      ) => {
        return saveITRequestDraft(
          input,
        );
      },

      onSuccess: async () => {
        await invalidateITRequests();
      },
    });

  return {
    createMutation,
    saveDraftMutation,
  };
};