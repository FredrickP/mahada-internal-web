import { useQuery } from '@tanstack/react-query';

import { getApprovalDetail } from '../api/approval.api';

export const useApprovalDetail = (
  id: string,
) => {
  return useQuery({
    queryKey: [
      'approvals',
      'detail',
      id,
    ],
    queryFn: () => {
      return getApprovalDetail(id);
    },
    enabled: Boolean(id),
  });
};