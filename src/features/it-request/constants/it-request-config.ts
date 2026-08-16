import type {
  ITRequestStatus,
  ITRequestType,
} from '../types/it-request.types';

export type ITRequestStatusVariant =
  | 'submitted'
  | 'approved'
  | 'inProgress'
  | 'completed'
  | 'rejected';

interface ITRequestTypeConfig {
  label: string;
}

interface ITRequestStatusConfig {
  label: string;
  variant: ITRequestStatusVariant;
}

export const itRequestTypeConfig: Record<
  ITRequestType,
  ITRequestTypeConfig
> = {
  REQUEST: {
    label: 'Request',
  },

  CHANGE: {
    label: 'Change',
  },

  INCIDENT: {
    label: 'Incident',
  },
};

export const itRequestStatusConfig: Record<
  ITRequestStatus,
  ITRequestStatusConfig
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