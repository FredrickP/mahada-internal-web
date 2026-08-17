import { useQuery } from '@tanstack/react-query';

import { getPaymentDetail } from '../api/payment.api';

export const usePaymentDetail = (
  id: string,
) => {
  return useQuery({
    queryKey: [
      'payments',
      'detail',
      id,
    ],
    queryFn: () => {
      return getPaymentDetail(id);
    },
    enabled: Boolean(id),
  });
};