import {
  apiClient,
} from '../../../lib/api/api-client';

import {
  registerMockApproval,
} from '../../approval/mocks/approval.mock';

import {
  completeMockBusinessTrip,
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

const calculateDurationDays = (
  startDate: string,
  endDate: string,
): number => {
  const start =
    new Date(
      `${startDate}T00:00:00`,
    );

  const end =
    new Date(
      `${endDate}T00:00:00`,
    );

  const difference =
    end.getTime() -
    start.getTime();

  const millisecondsPerDay =
    1000 *
    60 *
    60 *
    24;

  return (
    Math.floor(
      difference /
        millisecondsPerDay,
    ) + 1
  );
};

export const createBusinessTrip = async (
  input: CreateBusinessTripInput,
): Promise<CreateBusinessTripResponse> => {
  if (
    useMock
  ) {
    const businessTripResponse =
      await createMockBusinessTrip(
        input,
      );

    await registerMockApproval({
      submissionNumber:
        businessTripResponse.requestNumber,
      module:
        'BUSINESS_TRIP',
      title:
        `Perjalanan Dinas ke ${input.destination}`,
      requesterName:
        'Fredrick Pardosi',
      requesterDivision:
        'Operation',
      data: {
        destinationCity:
          input.destination,
        departureDate:
          formatApprovalDate(
            input.startDate,
          ),
        returnDate:
          formatApprovalDate(
            input.endDate,
          ),
        durationDays:
          calculateDurationDays(
            input.startDate,
            input.endDate,
          ),
        totalEstimate:
          input.estimatedCost,
        purpose:
          input.purpose.trim(),
      },
      attachments: [],
    });

    return businessTripResponse;
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
  if (
    useMock
  ) {
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
  if (
    useMock
  ) {
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

export const completeBusinessTrip = async (
  id: string,
): Promise<BusinessTripDetail> => {
  if (
    useMock
  ) {
    return completeMockBusinessTrip(
      id,
    );
  }

  const response =
    await apiClient.put<BusinessTripDetail>(
      `/business-trips/${id}/status`,
      {
        status:
          'COMPLETED',
      },
    );

  return response.data;
};