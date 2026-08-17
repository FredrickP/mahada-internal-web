import { apiClient } from '../../../lib/api/api-client';

import {
  getMockApprovalDetail,
  getMockApprovalQueue,
  processMockApproval,
} from '../mocks/approval.mock';

import type {
  ApprovalActionInput,
  ApprovalActionResponse,
  ApprovalDetail,
  ApprovalQueueItem,
} from '../types/approval.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

export const getApprovalQueue = async (): Promise<
  ApprovalQueueItem[]
> => {
  if (useMock) {
    return getMockApprovalQueue();
  }

  const response =
    await apiClient.get<
      ApprovalQueueItem[]
    >('/approvals');

  return response.data;
};

export const getApprovalDetail = async (
  id: string,
): Promise<ApprovalDetail> => {
  if (useMock) {
    return getMockApprovalDetail(id);
  }

  const response =
    await apiClient.get<ApprovalDetail>(
      `/approvals/${id}`,
    );

  return response.data;
};

export const processApproval = async (
  input: ApprovalActionInput,
): Promise<ApprovalActionResponse> => {
  if (useMock) {
    return processMockApproval(input);
  }

  const response =
    await apiClient.post<ApprovalActionResponse>(
      `/approvals/${input.approvalId}/action`,
      {
        action: input.action,
        notes: input.notes.trim(),
      },
    );

  return response.data;
};