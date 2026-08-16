import {
  useQuery,
} from '@tanstack/react-query';

import {
  getITRequestDetail,
} from '../api/it-request.api';

export const useITRequestDetail = (
  id: string,
) => {
  return useQuery({
    queryKey: [
      'it-requests',
      'detail',
      id,
    ],

    queryFn: () => {
      return getITRequestDetail(
        id,
      );
    },

    enabled: Boolean(id),
  });
};