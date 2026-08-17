import {
  updateMockBusinessTripStatus,
} from '../../business-trip/mocks/business-trip.mock';

import {
  updateMockITRequestApprovalStatus,
} from '../../it-request/mocks/it-request.mock';

import {
  updateMockLeaveRequestStatus,
} from '../../leave/mocks/leave.mock';

import {
  updateMockPaymentApprovalStatus,
} from '../../payment/mocks/payment.mock';

import type {
  ApprovalActionInput,
  ApprovalActionResponse,
  ApprovalDetail,
  ApprovalQueueItem,
  ApprovalStatus,
} from '../types/approval.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

let mockApprovals: ApprovalDetail[] = [
  {
    id: 'APR001',
    submissionNumber: 'FIN-2026-0054',
    module: 'PAYMENT',
    title: 'Pembayaran PT Nusantara Teknologi',
    requesterName: 'Siti Rahma',
    requesterDivision: 'Operation',
    submissionDate: '05 Agustus 2026',
    status: 'WAITING_APPROVAL',
    data: {
      vendorName: 'PT Nusantara Teknologi',
      invoiceNumber: 'INV-NT-0801',
      totalAmount: 16350000,
      destinationDivision:
        'Finance, Accounting and Tax',
    },
    attachments: [
      {
        id: 'ATT001',
        fileName: 'invoice-nt-0801.pdf',
        fileUrl:
          '/mock/invoice-nt-0801.pdf',
      },
    ],
    history: [
      {
        id: 'HIS001',
        label: 'Diajukan',
        actionBy: 'Siti Rahma',
        actionDate:
          '05 Agu 2026 • 09:12',
      },
      {
        id: 'HIS002',
        label:
          'Menunggu Approval',
        actionBy: 'System',
        actionDate:
          '05 Agu 2026 • 09:13',
      },
    ],
  },
  {
    id: 'APR002',
    submissionNumber: 'IT-2026-0074',
    module: 'IT_REQUEST',
    title:
      'Perubahan hak akses folder',
    requesterName: 'Andi Saputra',
    requesterDivision: 'Operation',
    submissionDate:
      '02 Agustus 2026',
    status: 'WAITING_APPROVAL',
    data: {
      requestType: 'Change',
      priority: 'Medium',
      description:
        'Perubahan hak akses folder shared untuk kebutuhan operasional.',
      destinationDivision:
        'Information Technology',
    },
    attachments: [],
    history: [
      {
        id: 'HIS003',
        label: 'Diajukan',
        actionBy: 'Andi Saputra',
        actionDate:
          '02 Agu 2026 • 10:10',
      },
      {
        id: 'HIS004',
        label:
          'Menunggu Approval',
        actionBy: 'System',
        actionDate:
          '02 Agu 2026 • 10:11',
      },
    ],
  },
  {
    id: 'APR003',
    submissionNumber:
      'HR-CUTI-0035',
    module: 'LEAVE',
    title:
      'Pengajuan Cuti Tahunan',
    requesterName:
      'Dewi Lestari',
    requesterDivision:
      'Information Technology',
    submissionDate:
      '07 Agustus 2026',
    status:
      'WAITING_APPROVAL',
    data: {
      leaveType:
        'Cuti Tahunan',
      startDate:
        '12 Agustus 2026',
      endDate:
        '13 Agustus 2026',
      workingDays: 2,
      reason:
        'Keperluan keluarga.',
    },
    attachments: [],
    history: [
      {
        id: 'HIS005',
        label:
          'Diajukan',
        actionBy:
          'Dewi Lestari',
        actionDate:
          '07 Agu 2026 • 08:45',
      },
      {
        id: 'HIS006',
        label:
          'Menunggu Approval',
        actionBy:
          'System',
        actionDate:
          '07 Agu 2026 • 08:46',
      },
    ],
  },
  {
    id: 'APR004',
    submissionNumber:
      'HR-PD-0019',
    module:
      'BUSINESS_TRIP',
    title:
      'Perjalanan Dinas ke Bandung',
    requesterName:
      'Budi Santoso',
    requesterDivision:
      'Sales & Marketing',
    submissionDate:
      '10 Agustus 2026',
    status:
      'WAITING_APPROVAL',
    data: {
      destinationCity:
        'Bandung, Jawa Barat',
      departureDate:
        '20 Agustus 2026',
      returnDate:
        '21 Agustus 2026',
      durationDays: 2,
      totalEstimate: 3200000,
      purpose:
        'Kunjungan dan koordinasi dengan mitra.',
    },
    attachments: [],
    history: [
      {
        id: 'HIS007',
        label:
          'Diajukan',
        actionBy:
          'Budi Santoso',
        actionDate:
          '10 Agu 2026 • 13:20',
      },
      {
        id: 'HIS008',
        label:
          'Menunggu Approval',
        actionBy:
          'System',
        actionDate:
          '10 Agu 2026 • 13:21',
      },
    ],
  },
];

export const getMockApprovalQueue = async (): Promise<
  ApprovalQueueItem[]
> => {
  await delay(500);

  return mockApprovals
    .filter((approval) => {
      return (
        approval.status ===
        'WAITING_APPROVAL'
      );
    })
    .map((approval) => {
      return {
        id:
          approval.id,
        submissionNumber:
          approval.submissionNumber,
        module:
          approval.module,
        title:
          approval.title,
        requesterName:
          approval.requesterName,
        requesterDivision:
          approval.requesterDivision,
        submissionDate:
          approval.submissionDate,
        status:
          approval.status,
      };
    });
};

export const getMockApprovalDetail = async (
  id: string,
): Promise<ApprovalDetail> => {
  await delay(500);

  const approval =
    mockApprovals.find(
      (item) => {
        return (
          item.id === id
        );
      },
    );

  if (!approval) {
    throw new Error(
      'Data approval tidak ditemukan',
    );
  }

  return structuredClone(
    approval,
  );
};

export const processMockApproval = async (
  input: ApprovalActionInput,
): Promise<ApprovalActionResponse> => {
  await delay(700);

  const approvalIndex =
    mockApprovals.findIndex(
      (item) => {
        return (
          item.id ===
          input.approvalId
        );
      },
    );

  if (
    approvalIndex < 0
  ) {
    throw new Error(
      'Data approval tidak ditemukan',
    );
  }

  if (
    !input.notes.trim()
  ) {
    throw new Error(
      'Catatan approver wajib diisi',
    );
  }

  const currentApproval =
    mockApprovals[
      approvalIndex
    ];

  if (
    currentApproval.status !==
    'WAITING_APPROVAL'
  ) {
    throw new Error(
      'Pengajuan sudah diproses',
    );
  }

  const newStatus: ApprovalStatus =
    input.action === 'APPROVE'
      ? 'APPROVED'
      : 'REJECTED';

  const historyLabel =
    input.action === 'APPROVE'
      ? 'Disetujui'
      : 'Ditolak';

  if (
    currentApproval.module ===
    'PAYMENT'
  ) {
    await updateMockPaymentApprovalStatus(
      currentApproval.submissionNumber,
      input.action === 'APPROVE'
        ? 'APPROVED'
        : 'REJECTED',
    );
  }

  if (
    currentApproval.module ===
    'IT_REQUEST'
  ) {
    await updateMockITRequestApprovalStatus(
      currentApproval.submissionNumber,
      input.action === 'APPROVE'
        ? 'APPROVED'
        : 'REJECTED',
    );
  }

  if (
    currentApproval.module ===
    'LEAVE'
  ) {
    await updateMockLeaveRequestStatus(
      currentApproval.submissionNumber,
      input.action === 'APPROVE'
        ? 'APPROVED'
        : 'REJECTED',
    );
  }

  if (
    currentApproval.module ===
    'BUSINESS_TRIP'
  ) {
    await updateMockBusinessTripStatus(
      currentApproval.submissionNumber,
      input.action === 'APPROVE'
        ? 'APPROVED'
        : 'REJECTED',
    );
  }

  const updatedApproval: ApprovalDetail = {
    ...currentApproval,
    status:
      newStatus,
    history: [
      ...currentApproval.history,
      {
        id:
          `HIS-${Date.now()}`,
        label:
          historyLabel,
        actionBy:
          'Fredrick Pardosi',
        actionDate:
          '17 Agu 2026 • 15:20',
        notes:
          input.notes.trim(),
      },
    ],
  };

  mockApprovals[
    approvalIndex
  ] = updatedApproval;

  return {
    approvalId:
      input.approvalId,
    status:
      newStatus,
  };
};