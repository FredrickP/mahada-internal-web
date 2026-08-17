import type {
  CreatePaymentInput,
  PaymentDetail,
  PaymentListResponse,
  PaymentRequest,
  PaymentRequestResponse,
  PaymentStatus,
  PaymentSummary,
  SavePaymentDraftInput,
  UpdatePaymentStatusInput,
  UpdatePaymentStatusResponse,
  UploadPaymentProofInput,
  UploadPaymentProofResponse,
} from '../types/payment.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

let mockPayments: PaymentRequest[] = [
  {
    id: 'PAY001',
    submissionNumber: 'FIN-2026-0054',
    vendorName: 'PT Nusantara Teknologi',
    invoiceNumber: 'INV-NT-0801',
    recipientName: 'Budi Santoso',
    destinationAccountNumber: '1234567890',
    taxInvoiceNumber: '010.000-26.12345678',
    invoiceDate: '2026-08-05',
    dppAmount: 17201835,
    ppnAmount: 1892202,
    pphAmount: 344037,
    totalAmount: 18750000,
    invoiceFileName: 'invoice-nt-0801.pdf',
    submissionDate: '05 Agu 2026',
    status: 'WAITING_APPROVAL',
  },
  {
    id: 'PAY002',
    submissionNumber: 'FIN-2026-0051',
    vendorName: 'CV Maju Bersama',
    invoiceNumber: 'MB-2026-122',
    recipientName: 'Siti Rahma',
    destinationAccountNumber: '9876543210',
    invoiceDate: '2026-08-03',
    dppAmount: 5871559,
    ppnAmount: 645871,
    pphAmount: 117430,
    totalAmount: 6400000,
    invoiceFileName: 'invoice-mb-2026-122.pdf',
    submissionDate: '03 Agu 2026',
    status: 'APPROVED',
  },
  {
    id: 'PAY003',
    submissionNumber: 'FIN-2026-0048',
    vendorName: 'PT Office Solution',
    invoiceNumber: 'OS-4481',
    recipientName: 'Andi Wijaya',
    destinationAccountNumber: '1122334455',
    invoiceDate: '2026-08-01',
    dppAmount: 2981651,
    ppnAmount: 327982,
    pphAmount: 59633,
    totalAmount: 3250000,
    invoiceFileName: 'invoice-os-4481.pdf',
    submissionDate: '01 Agu 2026',
    status: 'EXECUTED',
  },
  {
    id: 'PAY004',
    submissionNumber: 'FIN-2026-0044',
    vendorName: 'PT Data Aman',
    invoiceNumber: 'DA-0726',
    recipientName: 'Rian Pratama',
    destinationAccountNumber: '5566778899',
    invoiceDate: '2026-07-29',
    dppAmount: 11100917,
    ppnAmount: 1221101,
    pphAmount: 222018,
    totalAmount: 12100000,
    invoiceFileName: 'invoice-da-0726.pdf',
    paymentProofFileName: 'payment-proof-da-0726.pdf',
    submissionDate: '29 Jul 2026',
    status: 'COMPLETED',
  },
];

let mockPaymentSummary: PaymentSummary = {
  waitingApproval: 4,
  financeCheck: 6,
  readyForExecution: 3,
  completed: 18,
};

const generatePaymentNumber = (): string => {
  const highestSequence = mockPayments.reduce(
    (highest, payment) => {
      const sequenceText = payment.submissionNumber
        .split('-')
        .at(-1);

      const sequence = Number(
        sequenceText,
      );

      if (Number.isNaN(sequence)) {
        return highest;
      }

      return Math.max(
        highest,
        sequence,
      );
    },
    0,
  );

  const nextSequence = String(
    highestSequence + 1,
  ).padStart(
    4,
    '0',
  );

  return `FIN-2026-${nextSequence}`;
};

const getStatusLabel = (
  status: PaymentStatus,
): string => {
  switch (status) {
    case 'DRAFT':
      return 'Draft';
    case 'WAITING_APPROVAL':
      return 'Menunggu Approval';
    case 'APPROVED':
      return 'Disetujui Atasan';
    case 'FINANCE_CHECK':
      return 'Finance Check';
    case 'READY_FOR_EXECUTION':
      return 'Siap Dieksekusi';
    case 'EXECUTED':
      return 'Dieksekusi';
    case 'COMPLETED':
      return 'Selesai';
    case 'REJECTED':
      return 'Ditolak';
  }
};

const buildPaymentDetail = (
  payment: PaymentRequest,
): PaymentDetail => {
  const history: PaymentDetail['history'] = [
    {
      id: `${payment.id}-HISTORY-001`,
      status: 'WAITING_APPROVAL',
      label: 'Diajukan',
      actionBy: 'Fredrick Pardosi',
      actionDate: '05 Agu 2026 • 09:12',
    },
  ];

  if (
    payment.status === 'WAITING_APPROVAL'
  ) {
    history.push({
      id: `${payment.id}-HISTORY-002`,
      status: 'WAITING_APPROVAL',
      label: 'Menunggu Approval',
      actionBy: 'Operation Head',
      actionDate: '05 Agu 2026 • 09:13',
    });
  }

  if (
    [
      'APPROVED',
      'FINANCE_CHECK',
      'READY_FOR_EXECUTION',
      'EXECUTED',
      'COMPLETED',
    ].includes(payment.status)
  ) {
    history.push({
      id: `${payment.id}-HISTORY-002`,
      status: 'APPROVED',
      label: 'Disetujui Atasan',
      actionBy: 'Operation Head',
      actionDate: '05 Agu 2026 • 10:20',
    });
  }

  if (
    [
      'FINANCE_CHECK',
      'READY_FOR_EXECUTION',
      'EXECUTED',
      'COMPLETED',
    ].includes(payment.status)
  ) {
    history.push({
      id: `${payment.id}-HISTORY-003`,
      status: 'FINANCE_CHECK',
      label: 'Finance Check',
      actionBy: 'Finance Team',
      actionDate: '05 Agu 2026 • 11:05',
    });
  }

  if (
    [
      'READY_FOR_EXECUTION',
      'EXECUTED',
      'COMPLETED',
    ].includes(payment.status)
  ) {
    history.push({
      id: `${payment.id}-HISTORY-004`,
      status: 'READY_FOR_EXECUTION',
      label: 'Siap Dieksekusi',
      actionBy: 'Finance Team',
      actionDate: '05 Agu 2026 • 13:10',
    });
  }

  if (
    [
      'EXECUTED',
      'COMPLETED',
    ].includes(payment.status)
  ) {
    history.push({
      id: `${payment.id}-HISTORY-005`,
      status: 'EXECUTED',
      label: 'Dieksekusi',
      actionBy: 'Finance Team',
      actionDate: '05 Agu 2026 • 14:30',
    });
  }

  if (
    payment.status === 'COMPLETED'
  ) {
    history.push({
      id: `${payment.id}-HISTORY-006`,
      status: 'COMPLETED',
      label: 'Selesai',
      actionBy: 'Finance Team',
      actionDate: '05 Agu 2026 • 14:35',
    });
  }

  if (
    payment.status === 'REJECTED'
  ) {
    history.push({
      id: `${payment.id}-HISTORY-002`,
      status: 'REJECTED',
      label: 'Ditolak',
      actionBy: 'Operation Head',
      actionDate: '05 Agu 2026 • 10:20',
    });
  }

  return {
    ...payment,
    requesterName: 'Fredrick Pardosi',
    requesterDivision: 'Operation',
    requesterEmail: 'fredrick@mahadafinance.co.id',
    destinationDivision: 'Finance, Accounting and Tax',
    history,
  };
};

const validateNextFinanceStatus = (
  currentStatus: PaymentStatus,
  nextStatus: PaymentStatus,
): boolean => {
  if (
    currentStatus === 'APPROVED' &&
    nextStatus === 'FINANCE_CHECK'
  ) {
    return true;
  }

  if (
    currentStatus === 'FINANCE_CHECK' &&
    nextStatus === 'READY_FOR_EXECUTION'
  ) {
    return true;
  }

  if (
    currentStatus === 'READY_FOR_EXECUTION' &&
    nextStatus === 'EXECUTED'
  ) {
    return true;
  }

  return false;
};

const updateSummaryByStatus = (
  previousStatus: PaymentStatus,
  nextStatus: PaymentStatus,
) => {
  const nextSummary = {
    ...mockPaymentSummary,
  };

  if (
    previousStatus === 'FINANCE_CHECK'
  ) {
    nextSummary.financeCheck = Math.max(
      0,
      nextSummary.financeCheck - 1,
    );
  }

  if (
    previousStatus === 'READY_FOR_EXECUTION'
  ) {
    nextSummary.readyForExecution = Math.max(
      0,
      nextSummary.readyForExecution - 1,
    );
  }

  if (
    nextStatus === 'FINANCE_CHECK'
  ) {
    nextSummary.financeCheck += 1;
  }

  if (
    nextStatus === 'READY_FOR_EXECUTION'
  ) {
    nextSummary.readyForExecution += 1;
  }

  mockPaymentSummary =
    nextSummary;
};

export const getMockPayments = async (): Promise<
  PaymentListResponse
> => {
  await delay(500);

  return {
    data: structuredClone(
      mockPayments,
    ),
    total: mockPayments.length,
    summary: {
      ...mockPaymentSummary,
    },
  };
};

export const getMockPaymentDetail = async (
  id: string,
): Promise<PaymentDetail> => {
  await delay(500);

  const payment =
    mockPayments.find(
      (item) => {
        return item.id === id;
      },
    );

  if (!payment) {
    throw new Error(
      'Pengajuan pembayaran tidak ditemukan',
    );
  }

  return structuredClone(
    buildPaymentDetail(
      payment,
    ),
  );
};

export const createMockPayment = async (
  input:
    | CreatePaymentInput
    | SavePaymentDraftInput,
  isDraft: boolean,
): Promise<PaymentRequestResponse> => {
  await delay(700);

  const id =
    `PAY${Date.now()}`;

  const submissionNumber =
    generatePaymentNumber();

  if (isDraft) {
    return {
      id,
      submissionNumber,
      status: 'DRAFT',
      isDraft: true,
    };
  }

  const submittedInput =
    input as CreatePaymentInput;

  const newPayment: PaymentRequest = {
    id,
    submissionNumber,
    vendorName:
      submittedInput.vendorName,
    invoiceNumber:
      submittedInput.invoiceNumber,
    recipientName:
      submittedInput.recipientName,
    destinationAccountNumber:
      submittedInput.destinationAccountNumber,
    taxInvoiceNumber:
      submittedInput.taxInvoiceNumber,
    invoiceDate:
      submittedInput.invoiceDate,
    dppAmount:
      submittedInput.dppAmount,
    ppnAmount:
      submittedInput.ppnAmount,
    pphAmount:
      submittedInput.pphAmount,
    totalAmount:
      submittedInput.totalAmount,
    invoiceFileName:
      submittedInput.invoiceFile.name,
    quotationFileName:
      submittedInput.quotationFile?.name,
    otherDocumentFileName:
      submittedInput.otherDocumentFile?.name,
    submissionDate:
      '17 Agu 2026',
    status:
      'WAITING_APPROVAL',
  };

  mockPayments = [
    newPayment,
    ...mockPayments,
  ];

  mockPaymentSummary = {
    ...mockPaymentSummary,
    waitingApproval:
      mockPaymentSummary.waitingApproval + 1,
  };

  return {
    id,
    submissionNumber,
    status: 'WAITING_APPROVAL',
    isDraft: false,
  };
};

export const updateMockPaymentApprovalStatus = async (
  reference: string,
  status: Extract<
    PaymentStatus,
    'APPROVED' | 'REJECTED'
  >,
): Promise<PaymentRequest> => {
  await delay(400);

  const paymentIndex =
    mockPayments.findIndex(
      (payment) => {
        return (
          payment.id === reference ||
          payment.submissionNumber === reference
        );
      },
    );

  if (
    paymentIndex < 0
  ) {
    throw new Error(
      'Pengajuan pembayaran tidak ditemukan',
    );
  }

  const payment =
    mockPayments[
      paymentIndex
    ];

  if (
    payment.status !==
    'WAITING_APPROVAL'
  ) {
    throw new Error(
      'Pengajuan pembayaran sudah diproses',
    );
  }

  const updatedPayment: PaymentRequest = {
    ...payment,
    status,
  };

  mockPayments[
    paymentIndex
  ] = updatedPayment;

  mockPaymentSummary = {
    ...mockPaymentSummary,
    waitingApproval:
      Math.max(
        0,
        mockPaymentSummary.waitingApproval - 1,
      ),
  };

  return structuredClone(
    updatedPayment,
  );
};

export const updateMockPaymentStatus = async (
  input: UpdatePaymentStatusInput,
): Promise<UpdatePaymentStatusResponse> => {
  await delay(600);

  const paymentIndex =
    mockPayments.findIndex(
      (payment) => {
        return (
          payment.id ===
          input.id
        );
      },
    );

  if (
    paymentIndex < 0
  ) {
    throw new Error(
      'Pengajuan pembayaran tidak ditemukan',
    );
  }

  const payment =
    mockPayments[
      paymentIndex
    ];

  if (
    !validateNextFinanceStatus(
      payment.status,
      input.status,
    )
  ) {
    throw new Error(
      `Perubahan status dari ${getStatusLabel(
        payment.status,
      )} ke ${getStatusLabel(
        input.status,
      )} tidak valid`,
    );
  }

  updateSummaryByStatus(
    payment.status,
    input.status,
  );

  mockPayments[
    paymentIndex
  ] = {
    ...payment,
    status:
      input.status,
  };

  return {
    id:
      payment.id,
    status:
      input.status,
    message:
      'Status pembayaran berhasil diperbarui',
  };
};

export const uploadMockPaymentProof = async (
  input: UploadPaymentProofInput,
): Promise<UploadPaymentProofResponse> => {
  await delay(600);

  const paymentIndex =
    mockPayments.findIndex(
      (payment) => {
        return (
          payment.id ===
          input.id
        );
      },
    );

  if (
    paymentIndex < 0
  ) {
    throw new Error(
      'Pengajuan pembayaran tidak ditemukan',
    );
  }

  const payment =
    mockPayments[
      paymentIndex
    ];

  if (
    ![
      'READY_FOR_EXECUTION',
      'EXECUTED',
      'COMPLETED',
    ].includes(payment.status)
  ) {
    throw new Error(
      'Bukti pembayaran hanya dapat diunggah pada proses eksekusi pembayaran',
    );
  }

  const paymentProofFileName =
    input.file.name;

  mockPayments[
    paymentIndex
  ] = {
    ...payment,
    paymentProofFileName,
  };

  return {
    id:
      payment.id,
    paymentProofFileName,
    message:
      'Bukti pembayaran berhasil diunggah',
  };
};