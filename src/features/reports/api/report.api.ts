import { apiClient } from '../../../lib/api/api-client';

import {
  exportMockReport,
  getMockReports,
} from '../mocks/report.mock';

import type {
  ExportReportInput,
  ExportReportResponse,
  ReportData,
  ReportFilter,
} from '../types/report.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

export const getReports = async (
  filter: ReportFilter,
): Promise<ReportData> => {
  if (useMock) {
    return getMockReports(filter);
  }

  const response =
    await apiClient.get<ReportData>(
      '/reports',
      {
        params: {
          dateFrom:
            filter.dateFrom,
          dateTo:
            filter.dateTo,
          module:
            filter.module,
        },
      },
    );

  return response.data;
};

export const exportReport = async (
  input: ExportReportInput,
): Promise<ExportReportResponse> => {
  if (useMock) {
    return exportMockReport(
      input,
    );
  }

  const response =
    await apiClient.get<Blob>(
      '/reports/export',
      {
        params: {
          dateFrom:
            input.dateFrom,
          dateTo:
            input.dateTo,
          module:
            input.module,
        },
        responseType: 'blob',
      },
    );

  const disposition =
    response.headers[
      'content-disposition'
    ];

  const fileNameMatch =
    disposition?.match(
      /filename="?([^"]+)"?/,
    );

  const fileName =
    fileNameMatch?.[1] ??
    `mahada-report-${input.dateFrom}-${input.dateTo}.xlsx`;

  const downloadUrl =
    URL.createObjectURL(
      response.data,
    );

  return {
    fileName,
    downloadUrl,
  };
};