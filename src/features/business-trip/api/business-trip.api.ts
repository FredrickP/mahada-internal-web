import {
  apiClient,
} from '../../../lib/api/api-client';

import {
  createMockBusinessTrip,
  getMockBusinessTripDetail,
  uploadMockBusinessTripEvidence,
} from '../mocks/business-trip.mock';

import type {
  BusinessTripDetail,
  CreateBusinessTripInput,
  CreateBusinessTripResponse,
  UploadBusinessTripEvidenceInput,
  UploadBusinessTripEvidenceResponse,
} from '../types/business-trip.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

export const createBusinessTrip = async (
  input: CreateBusinessTripInput,
): Promise<CreateBusinessTripResponse> => {
  if (useMock) {
    return createMockBusinessTrip(
      input,
    );
  }

  const response =
    await apiClient.post<CreateBusinessTripResponse>(
      '/business-trips',
      input,
    );

  return response.data;
};

export const getBusinessTripDetail = async (
  id: string,
): Promise<BusinessTripDetail> => {
  if (useMock) {
    return getMockBusinessTripDetail(
      id,
    );
  }

  const response =
    await apiClient.get<BusinessTripDetail>(
      `/business-trips/${id}`,
    );

  return response.data;
};

export const uploadBusinessTripEvidence = async (
  input: UploadBusinessTripEvidenceInput,
): Promise<UploadBusinessTripEvidenceResponse> => {
  if (useMock) {
    return uploadMockBusinessTripEvidence(
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
    await apiClient.post<UploadBusinessTripEvidenceResponse>(
      `/business-trips/${input.tripId}/evidences`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      },
    );

  return response.data;
};