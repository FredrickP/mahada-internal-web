export type DashboardSummaryType =
  | 'TOTAL'
  | 'WAITING_APPROVAL'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type SubmissionStatus =
  | 'SUBMITTED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED';

export interface DashboardSummary {
  type: DashboardSummaryType;
  title: string;
  value: number;
  description: string;
}

export interface QuickAction {
  id: string;
  code: string;
  title: string;
  path: string;
}

export interface RecentSubmission {
  id: string;
  submissionNumber: string;
  module: SubmissionModule;
  type: string;
  date: string;
  status: SubmissionStatus;
  targetDivision: string;
}

export interface DashboardData {
  summary: DashboardSummary[];
  quickActions: QuickAction[];
  recentSubmissions: RecentSubmission[];
}

export type SubmissionModule =
  | 'IT_REQUEST'
  | 'LEAVE'
  | 'BUSINESS_TRIP'
  | 'PAYMENT';