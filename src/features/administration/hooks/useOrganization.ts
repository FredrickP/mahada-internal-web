import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getOrganization,
  updateOrganizationMapping,
} from '../api/administration.api';

import type {
  UpdateOrganizationMappingInput,
} from '../types/administration.types';

export const useOrganization = () => {
  return useQuery({
    queryKey: [
      'administration',
      'organization',
    ],
    queryFn:
      getOrganization,
  });
};

export const useUpdateOrganizationMapping =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        input: UpdateOrganizationMappingInput,
      ) => {
        return updateOrganizationMapping(
          input,
        );
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              'administration',
              'organization',
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