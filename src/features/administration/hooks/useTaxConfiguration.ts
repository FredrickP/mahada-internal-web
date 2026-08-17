import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getTaxConfigurations,
  updateTaxConfiguration,
} from '../api/administration.api';

import type {
  UpdateTaxConfigurationInput,
} from '../types/administration.types';

export const useTaxConfiguration = () => {
  return useQuery({
    queryKey: [
      'administration',
      'tax-configuration',
    ],
    queryFn:
      getTaxConfigurations,
  });
};

export const useUpdateTaxConfiguration =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        input: UpdateTaxConfigurationInput,
      ) => {
        return updateTaxConfiguration(
          input,
        );
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            'administration',
            'tax-configuration',
          ],
        });
      },
    });
  };