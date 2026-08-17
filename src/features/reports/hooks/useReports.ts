import { useQuery } from '@tanstack/react-query';

import { getReports } from '../api/report.api';
import type { ReportFilter } from '../types/report.types';

export const useReports = (
  filter: ReportFilter,
) => {
  return useQuery({
    queryKey: [
      'reports',
      filter.dateFrom,
      filter.dateTo,
      filter.module,
    ],
    queryFn: () => {
      return getReports(filter);
    },
    enabled: Boolean(
      filter.dateFrom &&
      filter.dateTo,
    ),
  });
};