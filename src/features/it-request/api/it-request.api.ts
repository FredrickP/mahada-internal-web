import { apiClient } from '../../../lib/api/api-client';

import {
  registerMockApproval,
} from '../../approval/mocks/approval.mock';

import {
  createMockITRequest,
  getMockITRequestDetail,
  getMockITRequests,
} from '../mocks/it-request.mock';

import type {
  CreateITRequestInput,
  CreateITRequestResponse,
  ITRequestDetail,
  ITRequestFilter,
  ITRequestListResponse,
  SaveITRequestDraftInput,
} from '../types/it-request.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

const formatRequestType = (
  type: CreateITRequestInput['type'],
): string => {
  if (type === 'REQUEST') {
    return 'Request';
  }

  if (type === 'CHANGE') {
    return 'Change';
  }

  return 'Incident';
};

const formatPriority = (
  priority: CreateITRequestInput['priority'],
): string => {
  const normalizedPriority =
    priority.toLowerCase();

  return (
    normalizedPriority
      .charAt(0)
      .toUpperCase() +
    normalizedPriority.slice(1)
  );
};

/**
 * Get list IT Request.
 */
export const getITRequests = async (
  filter: ITRequestFilter,
): Promise<ITRequestListResponse> => {
  if (useMock) {
    const data =
      await getMockITRequests(
        filter,
      );

    return {
      data,
      total: data.length,
    };
  }

  const response =
    await apiClient.get<ITRequestListResponse>(
      '/it-requests',
      {
        params: {
          search:
            filter.search.trim() ||
            undefined,
          type:
            filter.type ||
            undefined,
          status:
            filter.status ||
            undefined,
        },
      },
    );

  return response.data;
};

/**
 * Helper untuk append attachment
 * ke multipart form data.
 */
const appendAttachments = (
  formData: FormData,
  attachments: File[],
) => {
  attachments.forEach(
    (attachment) => {
      formData.append(
        'attachments',
        attachment,
      );
    },
  );
};

/**
 * Submit final IT Request.
 *
 * REQUEST / CHANGE:
 * - masuk ke proses approval.
 *
 * INCIDENT:
 * - tidak membutuhkan approval.
 */
export const createITRequest = async (
  input: CreateITRequestInput,
): Promise<CreateITRequestResponse> => {
  if (useMock) {
    const response =
      await createMockITRequest(
        input,
        false,
      );

    const needApproval =
      input.type === 'REQUEST' ||
      input.type === 'CHANGE';

    if (needApproval) {
      await registerMockApproval({
        submissionNumber:
          response.requestNumber,
        module:
          'IT_REQUEST',
        title:
          input.title.trim(),
        requesterName:
          'Fredrick Pardosi',
        requesterDivision:
          'Operation',
        data: {
          requestType:
            formatRequestType(
              input.type,
            ),
          priority:
            formatPriority(
              input.priority,
            ),
          description:
            input.description.trim(),
          destinationDivision:
            'Information Technology',
        },
        attachments:
          input.attachments.map(
            (
              attachment,
              index,
            ) => {
              return {
                id:
                  `ATT-IT-${Date.now()}-${index}`,
                fileName:
                  attachment.name,
                fileUrl:
                  URL.createObjectURL(
                    attachment,
                  ),
              };
            },
          ),
      });
    }

    return response;
  }

  const formData =
    new FormData();

  formData.append(
    'type',
    input.type,
  );

  formData.append(
    'title',
    input.title.trim(),
  );

  formData.append(
    'description',
    input.description.trim(),
  );

  formData.append(
    'priority',
    input.priority,
  );

  formData.append(
    'isDraft',
    'false',
  );

  appendAttachments(
    formData,
    input.attachments,
  );

  const response =
    await apiClient.post<CreateITRequestResponse>(
      '/it-requests',
      formData,
    );

  return response.data;
};

/**
 * Save IT Request sebagai draft.
 *
 * Draft tidak masuk Approval Queue.
 */
export const saveITRequestDraft = async (
  input: SaveITRequestDraftInput,
): Promise<CreateITRequestResponse> => {
  if (useMock) {
    return createMockITRequest(
      input,
      true,
    );
  }

  const formData =
    new FormData();

  if (input.type) {
    formData.append(
      'type',
      input.type,
    );
  }

  const title =
    input.title?.trim();

  if (title) {
    formData.append(
      'title',
      title,
    );
  }

  const description =
    input.description?.trim();

  if (description) {
    formData.append(
      'description',
      description,
    );
  }

  if (input.priority) {
    formData.append(
      'priority',
      input.priority,
    );
  }

  formData.append(
    'isDraft',
    'true',
  );

  appendAttachments(
    formData,
    input.attachments,
  );

  const response =
    await apiClient.post<CreateITRequestResponse>(
      '/it-requests',
      formData,
    );

  return response.data;
};

export const getITRequestDetail = async (
  id: string,
): Promise<ITRequestDetail> => {
  if (useMock) {
    return getMockITRequestDetail(
      id,
    );
  }

  const response =
    await apiClient.get<ITRequestDetail>(
      `/it-requests/${id}`,
    );

  return response.data;
};