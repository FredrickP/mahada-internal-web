import { useQuery } from '@tanstack/react-query';

import { getUserDetail } from '../api/administration.api';

export const useUserDetail = (
  id: string,
) => {
  return useQuery({
    queryKey: [
      'administration',
      'users',
      id,
    ],
    queryFn: () => {
      return getUserDetail(id);
    },
    enabled: Boolean(id),
  });
};