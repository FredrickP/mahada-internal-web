import type {
  ReportModule,
  ReportStatus,
} from '../types/report.types';

interface ReportModuleConfig {
  label: string;
}

interface ReportStatusConfig {
  label: string;
  variant:
    | 'completed'
    | 'progress'
    | 'rejected';
}

export const reportModuleConfig: Record<
  ReportModule,
  ReportModuleConfig
> = {
  ALL: {
    label: 'Semua modul',
  },
  IT_REQUEST: {
    label: 'IT Request',
  },
  LEAVE: {
    label: 'Cuti',
  },
  BUSINESS_TRIP: {
    label: 'Perjalanan Dinas',
  },
  PAYMENT: {
    label: 'Pembayaran',
  },
};

export const reportStatusConfig: Record<
  ReportStatus,
  ReportStatusConfig
> = {
  COMPLETED: {
    label: 'Selesai',
    variant: 'completed',
  },
  IN_PROGRESS: {
    label: 'Dalam Proses',
    variant: 'progress',
  },
  REJECTED: {
    label: 'Ditolak',
    variant: 'rejected',
  },
};