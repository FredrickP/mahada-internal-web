import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateITRequestProcessorStatus,
} from '../api/it-request.api';

import type {
  UpdateITRequestProcessorStatusInput,
} from '../api/it-request.api';

export const useUpdateITRequestStatus = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: UpdateITRequestProcessorStatusInput,
    ) => {
      return updateITRequestProcessorStatus(
        input,
      );
    },

    onSuccess: (
      _response,
      input,
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          'it-requests',
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'it-request',
          input.id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'dashboard',
        ],
      });
    },
  });
};