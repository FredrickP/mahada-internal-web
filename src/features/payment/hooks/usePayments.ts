import { useQuery } from '@tanstack/react-query';

import { getPayments } from '../api/payment.api';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  });
};