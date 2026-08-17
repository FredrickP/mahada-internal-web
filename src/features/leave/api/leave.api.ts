import { apiClient } from '../../../lib/api/api-client';

import {
  registerMockApproval,
} from '../../approval/mocks/approval.mock';

import {
  createMockLeaveRequest,
  getMockHRServices,
  getMockLeaveDetail,
} from '../mocks/leave.mock';

import type {
  CreateLeaveRequestInput,
  HRServicesData,
  LeaveRequest,
  LeaveRequestResponse,
  SaveLeaveDraftInput,
} from '../types/leave.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

const formatApprovalDate = (
  value: string,
): string => {
  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(date);
};

export const getHRServices = async (): Promise<HRServicesData> => {
  if (useMock) {
    return getMockHRServices();
  }

  const response =
    await apiClient.get<HRServicesData>(
      '/hr-services',
    );

  return response.data;
};

export const getLeaveDetail = async (
  id: string,
): Promise<LeaveRequest> => {
  if (useMock) {
    return getMockLeaveDetail(
      id,
    );
  }

  const response =
    await apiClient.get<LeaveRequest>(
      `/leave-requests/${id}`,
    );

  return response.data;
};

export const createLeaveRequest = async (
  input: CreateLeaveRequestInput,
): Promise<LeaveRequestResponse> => {
  if (useMock) {
    const leaveResponse =
      await createMockLeaveRequest(
        input,
        false,
      );

    await registerMockApproval({
      submissionNumber:
        leaveResponse.submissionNumber,
      module:
        'LEAVE',
      title:
        'Pengajuan Cuti Tahunan',
      requesterName:
        'Fredrick Pardosi',
      requesterDivision:
        'Operation',
      data: {
        leaveType:
          'Cuti Tahunan',
        startDate:
          formatApprovalDate(
            input.startDate,
          ),
        endDate:
          formatApprovalDate(
            input.endDate,
          ),
        workingDays:
          input.workingDays,
        reason:
          input.reason.trim(),
      },
      attachments: [],
    });

    return leaveResponse;
  }

  const response =
    await apiClient.post<LeaveRequestResponse>(
      '/leave-requests',
      {
        startDate:
          input.startDate,
        endDate:
          input.endDate,
        workingDays:
          input.workingDays,
        reason:
          input.reason.trim(),
        approverName:
          input.approverName,
        isDraft:
          false,
      },
    );

  return response.data;
};

export const saveLeaveDraft = async (
  input: SaveLeaveDraftInput,
): Promise<LeaveRequestResponse> => {
  if (useMock) {
    return createMockLeaveRequest(
      input,
      true,
    );
  }

  const payload = {
    startDate:
      input.startDate ||
      undefined,
    endDate:
      input.endDate ||
      undefined,
    workingDays:
      input.workingDays ||
      undefined,
    reason:
      input.reason?.trim() ||
      undefined,
    approverName:
      input.approverName ||
      undefined,
    isDraft:
      true,
  };

  const response =
    await apiClient.post<LeaveRequestResponse>(
      '/leave-requests',
      payload,
    );

  return response.data;
};