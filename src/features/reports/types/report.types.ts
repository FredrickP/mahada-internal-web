export type ReportModule =
  | 'ALL'
  | 'IT_REQUEST'
  | 'LEAVE'
  | 'BUSINESS_TRIP'
  | 'PAYMENT';

export type ReportStatus =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'REJECTED';

export interface ReportFilter {
  dateFrom: string;
  dateTo: string;
  module: ReportModule;
}

export interface ReportSummary {
  totalSubmission: number;
  completed: number;
  inProgress: number;
  rejected: number;
}

export interface ReportModuleStatistic {
  module: Exclude<ReportModule, 'ALL'>;
  total: number;
}

export interface ReportStatusStatistic {
  status: ReportStatus;
  total: number;
}

export interface ReportData {
  summary: ReportSummary;
  moduleStatistics: ReportModuleStatistic[];
  statusStatistics: ReportStatusStatistic[];
}

export interface ExportReportInput {
  dateFrom: string;
  dateTo: string;
  module: ReportModule;
}

export interface ExportReportResponse {
  fileName: string;
  downloadUrl: string;
}