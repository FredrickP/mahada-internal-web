import { useQuery } from '@tanstack/react-query';

import { getUsers } from '../api/administration.api';

export const useUsers = () => {
  return useQuery({
    queryKey: [
      'administration',
      'users',
    ],
    queryFn: getUsers,
  });
};