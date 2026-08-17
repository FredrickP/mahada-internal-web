import { apiClient } from '../../../lib/api/api-client';

import {
  createMockPayment,
  getMockPaymentDetail,
  getMockPayments,
  updateMockPaymentStatus,
  uploadMockPaymentProof,
} from '../mocks/payment.mock';

import type {
  CreatePaymentInput,
  PaymentDetail,
  PaymentListResponse,
  PaymentRequestResponse,
  SavePaymentDraftInput,
  UpdatePaymentStatusInput,
  UpdatePaymentStatusResponse,
  UploadPaymentProofInput,
  UploadPaymentProofResponse,
} from '../types/payment.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

export const getPayments = async (): Promise<PaymentListResponse> => {
  if (useMock) {
    return getMockPayments();
  }

  const response =
    await apiClient.get<PaymentListResponse>(
      '/payments',
    );

  return response.data;
};

export const getPaymentDetail = async (
  id: string,
): Promise<PaymentDetail> => {
  if (useMock) {
    return getMockPaymentDetail(
      id,
    );
  }

  const response =
    await apiClient.get<PaymentDetail>(
      `/payments/${id}`,
    );

  return response.data;
};

const appendFile = (
  formData: FormData,
  key: string,
  file?: File,
) => {
  if (file) {
    formData.append(
      key,
      file,
    );
  }
};

export const createPayment = async (
  input: CreatePaymentInput,
): Promise<PaymentRequestResponse> => {
  if (useMock) {
    return createMockPayment(
      input,
      false,
    );
  }

  const formData =
    new FormData();

  formData.append(
    'vendorName',
    input.vendorName.trim(),
  );

  formData.append(
    'invoiceNumber',
    input.invoiceNumber.trim(),
  );

  formData.append(
    'recipientName',
    input.recipientName.trim(),
  );

  formData.append(
    'destinationAccountNumber',
    input.destinationAccountNumber.trim(),
  );

  if (
    input.taxInvoiceNumber?.trim()
  ) {
    formData.append(
      'taxInvoiceNumber',
      input.taxInvoiceNumber.trim(),
    );
  }

  formData.append(
    'invoiceDate',
    input.invoiceDate,
  );

  formData.append(
    'dppAmount',
    String(
      input.dppAmount,
    ),
  );

  formData.append(
    'ppnAmount',
    String(
      input.ppnAmount,
    ),
  );

  formData.append(
    'pphAmount',
    String(
      input.pphAmount,
    ),
  );

  formData.append(
    'totalAmount',
    String(
      input.totalAmount,
    ),
  );

  formData.append(
    'isDraft',
    'false',
  );

  appendFile(
    formData,
    'invoiceFile',
    input.invoiceFile,
  );

  appendFile(
    formData,
    'quotationFile',
    input.quotationFile,
  );

  appendFile(
    formData,
    'otherDocumentFile',
    input.otherDocumentFile,
  );

  const response =
    await apiClient.post<PaymentRequestResponse>(
      '/payments',
      formData,
    );

  return response.data;
};

export const savePaymentDraft = async (
  input: SavePaymentDraftInput,
): Promise<PaymentRequestResponse> => {
  if (useMock) {
    return createMockPayment(
      input,
      true,
    );
  }

  const formData =
    new FormData();

  if (
    input.vendorName?.trim()
  ) {
    formData.append(
      'vendorName',
      input.vendorName.trim(),
    );
  }

  if (
    input.invoiceNumber?.trim()
  ) {
    formData.append(
      'invoiceNumber',
      input.invoiceNumber.trim(),
    );
  }

  if (
    input.recipientName?.trim()
  ) {
    formData.append(
      'recipientName',
      input.recipientName.trim(),
    );
  }

  if (
    input.destinationAccountNumber?.trim()
  ) {
    formData.append(
      'destinationAccountNumber',
      input.destinationAccountNumber.trim(),
    );
  }

  if (
    input.taxInvoiceNumber?.trim()
  ) {
    formData.append(
      'taxInvoiceNumber',
      input.taxInvoiceNumber.trim(),
    );
  }

  if (
    input.invoiceDate
  ) {
    formData.append(
      'invoiceDate',
      input.invoiceDate,
    );
  }

  if (
    input.dppAmount !== undefined
  ) {
    formData.append(
      'dppAmount',
      String(
        input.dppAmount,
      ),
    );
  }

  if (
    input.ppnAmount !== undefined
  ) {
    formData.append(
      'ppnAmount',
      String(
        input.ppnAmount,
      ),
    );
  }

  if (
    input.pphAmount !== undefined
  ) {
    formData.append(
      'pphAmount',
      String(
        input.pphAmount,
      ),
    );
  }

  if (
    input.totalAmount !== undefined
  ) {
    formData.append(
      'totalAmount',
      String(
        input.totalAmount,
      ),
    );
  }

  formData.append(
    'isDraft',
    'true',
  );

  appendFile(
    formData,
    'invoiceFile',
    input.invoiceFile,
  );

  appendFile(
    formData,
    'quotationFile',
    input.quotationFile,
  );

  appendFile(
    formData,
    'otherDocumentFile',
    input.otherDocumentFile,
  );

  const response =
    await apiClient.post<PaymentRequestResponse>(
      '/payments',
      formData,
    );

  return response.data;
};

export const updatePaymentStatus = async (
  input: UpdatePaymentStatusInput,
): Promise<UpdatePaymentStatusResponse> => {
  if (useMock) {
    return updateMockPaymentStatus(
      input,
    );
  }

  const response =
    await apiClient.put<UpdatePaymentStatusResponse>(
      `/payments/${input.id}/status`,
      {
        status:
          input.status,
        notes:
          input.notes,
      },
    );

  return response.data;
};

export const uploadPaymentProof = async (
  input: UploadPaymentProofInput,
): Promise<UploadPaymentProofResponse> => {
  if (useMock) {
    return uploadMockPaymentProof(
      input,
    );
  }

  const formData =
    new FormData();

  formData.append(
    'file',
    input.file,
  );

  const response =
    await apiClient.post<UploadPaymentProofResponse>(
      `/payments/${input.id}/payment-proof`,
      formData,
    );

  return response.data;
};