import { useQuery } from '@tanstack/react-query';

import { getApprovalQueue } from '../api/approval.api';

export const useApprovalQueue = () => {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: getApprovalQueue,
  });
};