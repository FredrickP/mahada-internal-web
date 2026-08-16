export type LeaveStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'COMPLETED'
  | 'REJECTED';

export type HRSubmissionType =
  | 'LEAVE'
  | 'BUSINESS_TRIP';

export interface LeaveBalance {
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id: string;
  submissionNumber: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  workingDays: number;
  reason: string;
  approverName: string;
  status: LeaveStatus;
}

export interface BusinessTripSummary {
  activeCount: number;
  waitingApprovalCount: number;
  approvedCount: number;
}

export interface HRHistoryItem {
  id: string;
  submissionNumber: string;
  type: HRSubmissionType;
  typeLabel: string;
  periodOrDestination: string;
  status: LeaveStatus;
}

export interface HRServicesData {
  leaveBalance: LeaveBalance;
  businessTripSummary: BusinessTripSummary;
  history: HRHistoryItem[];
}

export interface CreateLeaveRequestInput {
  startDate: string;
  endDate: string;
  workingDays: number;
  reason: string;
  approverName: string;
}

export interface SaveLeaveDraftInput {
  startDate?: string;
  endDate?: string;
  workingDays?: number;
  reason?: string;
  approverName?: string;
}

export interface LeaveRequestResponse {
  id: string;
  submissionNumber: string;
  status: LeaveStatus;
  isDraft: boolean;
}