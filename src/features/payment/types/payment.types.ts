export type PaymentStatus =
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'FINANCE_CHECK'
  | 'READY_FOR_EXECUTION'
  | 'EXECUTED'
  | 'COMPLETED'
  | 'REJECTED';

export type FinancePaymentStatus =
  | 'FINANCE_CHECK'
  | 'READY_FOR_EXECUTION'
  | 'EXECUTED';

export interface PaymentRequest {
  id: string;
  submissionNumber: string;
  vendorName: string;
  invoiceNumber: string;
  recipientName: string;
  destinationAccountNumber: string;
  taxInvoiceNumber?: string;
  invoiceDate: string;
  dppAmount: number;
  ppnAmount: number;
  pphAmount: number;
  totalAmount: number;
  invoiceFileName: string;
  quotationFileName?: string;
  otherDocumentFileName?: string;
  paymentProofFileName?: string;
  submissionDate: string;
  status: PaymentStatus;
}

export interface CreatePaymentInput {
  vendorName: string;
  invoiceNumber: string;
  recipientName: string;
  destinationAccountNumber: string;
  taxInvoiceNumber?: string;
  invoiceDate: string;
  dppAmount: number;
  ppnAmount: number;
  pphAmount: number;
  totalAmount: number;
  invoiceFile: File;
  quotationFile?: File;
  otherDocumentFile?: File;
}

export interface SavePaymentDraftInput {
  vendorName?: string;
  invoiceNumber?: string;
  recipientName?: string;
  destinationAccountNumber?: string;
  taxInvoiceNumber?: string;
  invoiceDate?: string;
  dppAmount?: number;
  ppnAmount?: number;
  pphAmount?: number;
  totalAmount?: number;
  invoiceFile?: File;
  quotationFile?: File;
  otherDocumentFile?: File;
}

export interface PaymentRequestResponse {
  id: string;
  submissionNumber: string;
  status: PaymentStatus;
  isDraft: boolean;
}

export interface PaymentSummary {
  waitingApproval: number;
  financeCheck: number;
  readyForExecution: number;
  completed: number;
}

export interface PaymentListResponse {
  data: PaymentRequest[];
  total: number;
  summary: PaymentSummary;
}

export interface PaymentHistory {
  id: string;
  status: PaymentStatus;
  label: string;
  actionBy: string;
  actionDate: string;
  notes?: string;
}

export interface PaymentDetail extends PaymentRequest {
  requesterName: string;
  requesterDivision: string;
  requesterEmail?: string;
  destinationDivision: string;
  history: PaymentHistory[];
}

export interface UpdatePaymentStatusInput {
  id: string;
  status: FinancePaymentStatus;
  notes?: string;
}

export interface UpdatePaymentStatusResponse {
  id: string;
  status: PaymentStatus;
  message: string;
}

export interface UploadPaymentProofInput {
  id: string;
  file: File;
}

export interface UploadPaymentProofResponse {
  id: string;
  paymentProofFileName: string;
  message: string;
}