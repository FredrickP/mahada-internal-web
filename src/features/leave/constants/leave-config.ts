import type {
  HRSubmissionType,
  LeaveStatus,
} from '../types/leave.types';

export type LeaveStatusVariant =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'completed'
  | 'rejected';

interface LeaveStatusConfig {
  label: string;
  variant: LeaveStatusVariant;
}

interface HRSubmissionTypeConfig {
  label: string;
}

export const leaveStatusConfig: Record<
  LeaveStatus,
  LeaveStatusConfig
> = {
  DRAFT: {
    label: 'Draft',
    variant: 'draft',
  },
  SUBMITTED: {
    label: 'Diajukan',
    variant: 'submitted',
  },
  APPROVED: {
    label: 'Disetujui',
    variant: 'approved',
  },
  COMPLETED: {
    label: 'Selesai',
    variant: 'completed',
  },
  REJECTED: {
    label: 'Ditolak',
    variant: 'rejected',
  },
};

export const hrSubmissionTypeConfig: Record<
  HRSubmissionType,
  HRSubmissionTypeConfig
> = {
  LEAVE: {
    label: 'Cuti Tahunan',
  },
  BUSINESS_TRIP: {
    label: 'Perjalanan Dinas',
  },
};