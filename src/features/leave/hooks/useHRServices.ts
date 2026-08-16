import { useQuery } from '@tanstack/react-query';

import { getHRServices } from '../api/leave.api';

export const useHRServices = () => {
  return useQuery({
    queryKey: ['hr-services'],
    queryFn: getHRServices,
  });
};