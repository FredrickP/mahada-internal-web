import { useQuery } from '@tanstack/react-query';

import { getRoles } from '../api/administration.api';

export const useRoles = () => {
  return useQuery({
    queryKey: [
      'administration',
      'roles',
    ],
    queryFn: getRoles,
  });
};