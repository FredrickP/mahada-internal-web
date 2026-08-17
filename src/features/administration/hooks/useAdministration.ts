import { useQuery } from '@tanstack/react-query';

import { getAdministration } from '../api/administration.api';

export const useAdministration = () => {
  return useQuery({
    queryKey: ['administration'],
    queryFn: getAdministration,
  });
};