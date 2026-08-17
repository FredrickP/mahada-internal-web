import type {
  ApprovalModule,
  ApprovalStatus,
} from '../types/approval.types';

export type ApprovalStatusVariant =
  | 'waiting'
  | 'approved'
  | 'rejected';

interface ApprovalStatusConfig {
  label: string;
  variant: ApprovalStatusVariant;
}

interface ApprovalModuleConfig {
  label: string;
  shortLabel: string;
}

export const approvalStatusConfig: Record<
  ApprovalStatus,
  ApprovalStatusConfig
> = {
  WAITING_APPROVAL: {
    label: 'Menunggu Approval',
    variant: 'waiting',
  },
  APPROVED: {
    label: 'Disetujui',
    variant: 'approved',
  },
  REJECTED: {
    label: 'Ditolak',
    variant: 'rejected',
  },
};

export const approvalModuleConfig: Record<
  ApprovalModule,
  ApprovalModuleConfig
> = {
  IT_REQUEST: {
    label: 'IT Request',
    shortLabel: 'IT',
  },
  LEAVE: {
    label: 'Cuti Tahunan',
    shortLabel: 'Cuti',
  },
  BUSINESS_TRIP: {
    label: 'Perjalanan Dinas',
    shortLabel: 'PD',
  },
  PAYMENT: {
    label: 'Pembayaran',
    shortLabel: 'Payment',
  },
};