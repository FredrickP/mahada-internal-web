export type ApprovalModule =
  | 'IT_REQUEST'
  | 'LEAVE'
  | 'BUSINESS_TRIP'
  | 'PAYMENT';

export type ApprovalStatus =
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export type ApprovalAction =
  | 'APPROVE'
  | 'REJECT';

export interface ApprovalQueueItem {
  id: string;
  submissionNumber: string;
  module: ApprovalModule;
  title: string;
  requesterName: string;
  requesterDivision: string;
  submissionDate: string;
  status: ApprovalStatus;
}

export interface ApprovalHistory {
  id: string;
  label: string;
  actionBy: string;
  actionDate: string;
  notes?: string;
}

export interface ApprovalAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
}

export interface PaymentApprovalData {
  vendorName: string;
  invoiceNumber: string;
  totalAmount: number;
  destinationDivision: string;
}

export interface ITRequestApprovalData {
  requestType: string;
  priority: string;
  description: string;
  destinationDivision: string;
}

export interface LeaveApprovalData {
  leaveType: string;
  startDate: string;
  endDate: string;
  workingDays: number;
  reason: string;
}

export interface BusinessTripApprovalData {
  destinationCity: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  totalEstimate: number;
  purpose: string;
}

interface ApprovalDetailBase {
  id: string;
  submissionNumber: string;
  title: string;
  requesterName: string;
  requesterDivision: string;
  submissionDate: string;
  status: ApprovalStatus;
  attachments: ApprovalAttachment[];
  history: ApprovalHistory[];
}

export type ApprovalDetail =
  | (ApprovalDetailBase & {
      module: 'PAYMENT';
      data: PaymentApprovalData;
    })
  | (ApprovalDetailBase & {
      module: 'IT_REQUEST';
      data: ITRequestApprovalData;
    })
  | (ApprovalDetailBase & {
      module: 'LEAVE';
      data: LeaveApprovalData;
    })
  | (ApprovalDetailBase & {
      module: 'BUSINESS_TRIP';
      data: BusinessTripApprovalData;
    });

export interface ApprovalActionInput {
  approvalId: string;
  action: ApprovalAction;
  notes: string;
}

export interface ApprovalActionResponse {
  approvalId: string;
  status: ApprovalStatus;
}