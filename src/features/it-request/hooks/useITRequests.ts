import { useQuery } from '@tanstack/react-query';

import { getITRequests } from '../api/it-request.api';

import type {
  ITRequestFilter,
} from '../types/it-request.types';

export const useITRequests = (
  filter: ITRequestFilter,
) => {
  return useQuery({
    queryKey: [
      'it-requests',
      filter,
    ],
    queryFn: () => {
      return getITRequests(filter);
    },
  });
};