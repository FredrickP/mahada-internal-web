import type {
  SubmissionStatus,
} from '../types/dashboard.types';

export type SubmissionStatusVariant =
  | 'submitted'
  | 'approved'
  | 'inProgress'
  | 'completed'
  | 'rejected';

interface SubmissionStatusConfig {
  label: string;
  variant: SubmissionStatusVariant;
}

export const submissionStatusConfig: Record<
  SubmissionStatus,
  SubmissionStatusConfig
> = {
  SUBMITTED: {
    label: 'Diajukan',
    variant: 'submitted',
  },

  APPROVED: {
    label: 'Disetujui',
    variant: 'approved',
  },

  IN_PROGRESS: {
    label: 'Diproses',
    variant: 'inProgress',
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