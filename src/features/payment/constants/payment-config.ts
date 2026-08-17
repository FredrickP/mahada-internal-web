import type {
  PaymentStatus,
} from '../types/payment.types';

export type PaymentStatusVariant =
  | 'draft'
  | 'waitingApproval'
  | 'approved'
  | 'financeCheck'
  | 'readyForExecution'
  | 'executed'
  | 'completed'
  | 'rejected';

interface PaymentStatusConfig {
  label: string;
  variant: PaymentStatusVariant;
}

export const paymentStatusConfig: Record<
  PaymentStatus,
  PaymentStatusConfig
> = {
  DRAFT: {
    label: 'Draft',
    variant: 'draft',
  },
  WAITING_APPROVAL: {
    label: 'Menunggu Approval',
    variant: 'waitingApproval',
  },
  APPROVED: {
    label: 'Disetujui',
    variant: 'approved',
  },
  FINANCE_CHECK: {
    label: 'Finance Check',
    variant: 'financeCheck',
  },
  READY_FOR_EXECUTION: {
    label: 'Siap Dieksekusi',
    variant: 'readyForExecution',
  },
  EXECUTED: {
    label: 'Dieksekusi',
    variant: 'executed',
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