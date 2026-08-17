import {
  useQuery,
} from '@tanstack/react-query';

import {
  getLeaveDetail,
} from '../api/leave.api';

export const useLeaveDetail = (
  id: string,
) => {
  return useQuery({
    queryKey: [
      'leave',
      'detail',
      id,
    ],
    queryFn: () => {
      return getLeaveDetail(
        id,
      );
    },
    enabled: Boolean(id),
  });
};