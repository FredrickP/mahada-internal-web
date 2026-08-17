import type {
  ExportReportInput,
  ExportReportResponse,
  ReportData,
  ReportFilter,
} from '../types/report.types';

const delay = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const mockReportData: ReportData = {
  summary: {
    totalSubmission: 84,
    completed: 57,
    inProgress: 19,
    rejected: 8,
  },
  moduleStatistics: [
    {
      module: 'IT_REQUEST',
      total: 44,
    },
    {
      module: 'LEAVE',
      total: 25,
    },
    {
      module: 'BUSINESS_TRIP',
      total: 12,
    },
    {
      module: 'PAYMENT',
      total: 62,
    },
  ],
  statusStatistics: [
    {
      status: 'COMPLETED',
      total: 57,
    },
    {
      status: 'IN_PROGRESS',
      total: 19,
    },
    {
      status: 'REJECTED',
      total: 8,
    },
  ],
};

const getModuleMultiplier = (
  module: ReportFilter['module'],
): number => {
  switch (module) {
    case 'IT_REQUEST':
      return 0.52;
    case 'LEAVE':
      return 0.3;
    case 'BUSINESS_TRIP':
      return 0.14;
    case 'PAYMENT':
      return 0.74;
    case 'ALL':
    default:
      return 1;
  }
};

export const getMockReports = async (
  filter: ReportFilter,
): Promise<ReportData> => {
  await delay(500);

  if (filter.module === 'ALL') {
    return structuredClone(
      mockReportData,
    );
  }

  const multiplier =
    getModuleMultiplier(
      filter.module,
    );

  return {
    summary: {
      totalSubmission: Math.round(
        mockReportData.summary.totalSubmission *
          multiplier,
      ),
      completed: Math.round(
        mockReportData.summary.completed *
          multiplier,
      ),
      inProgress: Math.round(
        mockReportData.summary.inProgress *
          multiplier,
      ),
      rejected: Math.round(
        mockReportData.summary.rejected *
          multiplier,
      ),
    },
    moduleStatistics:
      mockReportData.moduleStatistics.filter(
        (item) =>
          item.module ===
          filter.module,
      ),
    statusStatistics:
      mockReportData.statusStatistics.map(
        (item) => {
          return {
            ...item,
            total: Math.round(
              item.total *
                multiplier,
            ),
          };
        },
      ),
  };
};

export const exportMockReport = async (
  input: ExportReportInput,
): Promise<ExportReportResponse> => {
  await delay(700);

  const moduleName =
    input.module
      .toLowerCase()
      .replaceAll('_', '-');

  return {
    fileName:
      `mahada-report-${moduleName}-${input.dateFrom}-${input.dateTo}.xlsx`,
    downloadUrl: '#',
  };
};