import type {
  DashboardSummary,
  QuickAction,
  RecentSubmission,
} from '../types/dashboard.types';

export const dashboardSummaryMock: DashboardSummary[] = [
  {
    type: 'TOTAL',
    title: 'Semua Pengajuan',
    value: 18,
    description: '4 pengajuan aktif',
  },
  {
    type: 'WAITING_APPROVAL',
    title: 'Menunggu Approval',
    value: 3,
    description: 'Perlu menunggu atasan',
  },
  {
    type: 'IN_PROGRESS',
    title: 'Sedang Diproses',
    value: 5,
    description: 'Ditangani divisi terkait',
  },
  {
    type: 'COMPLETED',
    title: 'Selesai',
    value: 10,
    description: 'Bulan berjalan',
  },
];

export const quickActionsMock: QuickAction[] = [
  {
    id: 'IT_REQUEST',
    code: 'IT',
    title: 'Buat IT Request',
    path: '/it-request/create',
  },
  {
    id: 'LEAVE_REQUEST',
    code: 'HR',
    title: 'Ajukan Cuti',
    path: '/hr-services/leave/create',
  },
  {
    id: 'BUSINESS_TRIP',
    code: 'PD',
    title: 'Perjalanan Dinas',
    path: '/hr-services/business-trip/create',
  },
  {
    id: 'PAYMENT_REQUEST',
    code: 'FN',
    title: 'Pengajuan Pembayaran',
    path: '/payment/create',
  },
];

export const recentSubmissionsMock: RecentSubmission[] = [
  {
    id: '1',
    submissionNumber: 'IT-2026-0081',
    module: 'IT_REQUEST',
    type: 'Incident',
    date: '05 Agu 2026',
    status: 'IN_PROGRESS',
    targetDivision: 'Information Technology',
  },
  {
    id: '2',
    submissionNumber: 'HR-2026-0032',
    module: 'LEAVE',
    type: 'Cuti Tahunan',
    date: '03 Agu 2026',
    status: 'APPROVED',
    targetDivision: 'HCGA',
  },
  {
    id: '3',
    submissionNumber: 'FIN-2026-0054',
    module: 'PAYMENT',
    type: 'Pembayaran Vendor',
    date: '01 Agu 2026',
    status: 'SUBMITTED',
    targetDivision: 'Finance',
  },
];