import {
  getMockBusinessTrips,
} from '../../business-trip/mocks/business-trip.mock';

import type {
  CreateLeaveRequestInput,
  HRServicesData,
  HRHistoryItem,
  LeaveRequest,
  LeaveRequestResponse,
  SaveLeaveDraftInput,
} from '../types/leave.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const TOTAL_ANNUAL_LEAVE_DAYS = 12;

let mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LEAVE001',
    submissionNumber: 'HR-CUTI-0032',
    leaveType: 'Cuti Tahunan',
    startDate: '2026-08-12',
    endDate: '2026-08-13',
    workingDays: 2,
    reason: 'Keperluan keluarga.',
    approverName: 'Information Technology Head',
    status: 'APPROVED',
  },
  {
    id: 'LEAVE002',
    submissionNumber: 'HR-CUTI-0027',
    leaveType: 'Cuti Tahunan',
    startDate: '2026-07-21',
    endDate: '2026-07-21',
    workingDays: 1,
    reason: 'Keperluan pribadi.',
    approverName: 'Information Technology Head',
    status: 'COMPLETED',
  },
  {
    id: 'LEAVE003',
    submissionNumber: 'HR-CUTI-0035',
    leaveType: 'Cuti Tahunan',
    startDate: '2026-08-12',
    endDate: '2026-08-13',
    workingDays: 2,
    reason: 'Keperluan keluarga.',
    approverName: 'Information Technology Head',
    status: 'SUBMITTED',
  },
];

const formatDate = (
  value: string,
): string => {
  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  if (
    !isoDatePattern.test(value)
  ) {
    return value;
  }

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

const getLeavePeriod = (
  request: LeaveRequest,
): string => {
  const startDate =
    formatDate(
      request.startDate,
    );

  const endDate =
    formatDate(
      request.endDate,
    );

  if (
    request.startDate ===
    request.endDate
  ) {
    return startDate;
  }

  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  const isStartIso =
    isoDatePattern.test(
      request.startDate,
    );

  const isEndIso =
    isoDatePattern.test(
      request.endDate,
    );

  if (
    isStartIso &&
    isEndIso
  ) {
    const start =
      new Date(
        `${request.startDate}T00:00:00`,
      );

    const end =
      new Date(
        `${request.endDate}T00:00:00`,
      );

    if (
      start.getMonth() ===
        end.getMonth() &&
      start.getFullYear() ===
        end.getFullYear()
    ) {
      const monthYear =
        new Intl.DateTimeFormat(
          'id-ID',
          {
            month: 'long',
            year: 'numeric',
          },
        ).format(start);

      return `${start.getDate()}–${end.getDate()} ${monthYear}`;
    }
  }

  return `${startDate} – ${endDate}`;
};

const getLeaveBalance = () => {
  const usedDays =
    mockLeaveRequests
      .filter((request) => {
        return (
          request.status === 'APPROVED' ||
          request.status === 'COMPLETED'
        );
      })
      .reduce(
        (total, request) => {
          return (
            total +
            request.workingDays
          );
        },
        0,
      );

  return {
    totalDays:
      TOTAL_ANNUAL_LEAVE_DAYS,
    usedDays,
    remainingDays:
      Math.max(
        0,
        TOTAL_ANNUAL_LEAVE_DAYS -
          usedDays,
      ),
  };
};

const getBusinessTripSummary = () => {
  const trips =
    getMockBusinessTrips();

  const waitingApprovalCount =
    trips.filter((trip) => {
      return (
        trip.status ===
        'WAITING_APPROVAL'
      );
    }).length;

  const approvedCount =
    trips.filter((trip) => {
      return (
        trip.status ===
        'APPROVED'
      );
    }).length;

  const activeCount =
    trips.filter((trip) => {
      return (
        trip.status ===
          'WAITING_APPROVAL' ||
        trip.status ===
          'APPROVED'
      );
    }).length;

  return {
    activeCount,
    waitingApprovalCount,
    approvedCount,
  };
};

const getLeaveHistory = (): HRHistoryItem[] => {
  return mockLeaveRequests
    .filter((request) => {
      return (
        request.status !==
        'DRAFT'
      );
    })
    .sort(
      (
        first,
        second,
      ) => {
        return second.submissionNumber.localeCompare(
          first.submissionNumber,
        );
      },
    )
    .map((request) => {
      return {
        id:
          `HISTORY-${request.id}`,
        referenceId:
          request.id,
        submissionNumber:
          request.submissionNumber,
        type:
          'LEAVE' as const,
        typeLabel:
          request.leaveType,
        periodOrDestination:
          getLeavePeriod(
            request,
          ),
        status:
          request.status,
      };
    });
};

const getBusinessTripHistory = (): HRHistoryItem[] => {
  const trips =
    getMockBusinessTrips();

  return trips.map((trip) => {
    return {
      id:
        `HISTORY-${trip.id}`,
      referenceId:
        trip.id,
      submissionNumber:
        trip.requestNumber,
      type:
        'BUSINESS_TRIP' as const,
      typeLabel:
        'Perjalanan Dinas',
      periodOrDestination:
        `${trip.destination} • ${trip.totalDays} Hari`,
      status:
        trip.status,
    };
  });
};

export const getMockHRServices = async (): Promise<HRServicesData> => {
  await delay(500);

  const leaveHistory =
    getLeaveHistory();

  const businessTripHistory =
    getBusinessTripHistory();

  return {
    leaveBalance:
      getLeaveBalance(),
    businessTripSummary:
      getBusinessTripSummary(),
    history: [
      ...leaveHistory,
      ...businessTripHistory,
    ],
  };
};

const generateLeaveNumber = (): string => {
  const highestSequence =
    mockLeaveRequests.reduce(
      (
        highest,
        request,
      ) => {
        const sequenceText =
          request.submissionNumber
            .split('-')
            .at(-1);

        const sequence =
          Number(
            sequenceText,
          );

        if (
          Number.isNaN(
            sequence,
          )
        ) {
          return highest;
        }

        return Math.max(
          highest,
          sequence,
        );
      },
      0,
    );

  const nextSequence =
    String(
      highestSequence + 1,
    ).padStart(
      4,
      '0',
    );

  return `HR-CUTI-${nextSequence}`;
};

export const createMockLeaveRequest = async (
  input:
    | CreateLeaveRequestInput
    | SaveLeaveDraftInput,
  isDraft: boolean,
): Promise<LeaveRequestResponse> => {
  await delay(700);

  const id =
    `LEAVE${Date.now()}`;

  const submissionNumber =
    generateLeaveNumber();

  if (isDraft) {
    return {
      id,
      submissionNumber,
      status: 'DRAFT',
      isDraft: true,
    };
  }

  const submittedInput =
    input as CreateLeaveRequestInput;

  const newRequest: LeaveRequest = {
    id,
    submissionNumber,
    leaveType:
      'Cuti Tahunan',
    startDate:
      submittedInput.startDate,
    endDate:
      submittedInput.endDate,
    workingDays:
      submittedInput.workingDays,
    reason:
      submittedInput.reason,
    approverName:
      submittedInput.approverName,
    status:
      'SUBMITTED',
  };

  mockLeaveRequests = [
    newRequest,
    ...mockLeaveRequests,
  ];

  return {
    id,
    submissionNumber,
    status: 'SUBMITTED',
    isDraft: false,
  };
};

export const updateMockLeaveRequestStatus = async (
  reference: string,
  status: LeaveRequest['status'],
): Promise<LeaveRequest> => {
  await delay(400);

  const requestIndex =
    mockLeaveRequests.findIndex(
      (request) => {
        return (
          request.id === reference ||
          request.submissionNumber ===
            reference
        );
      },
    );

  if (
    requestIndex < 0
  ) {
    throw new Error(
      'Pengajuan cuti tidak ditemukan',
    );
  }

  const updatedRequest: LeaveRequest = {
    ...mockLeaveRequests[
      requestIndex
    ],
    status,
  };

  mockLeaveRequests[
    requestIndex
  ] = updatedRequest;

  return structuredClone(
    updatedRequest,
  );
};

export const getMockLeaveDetail = async (
  id: string,
): Promise<LeaveRequest> => {
  await delay(400);

  const request =
    mockLeaveRequests.find(
      (item) => {
        return (
          item.id === id
        );
      },
    );

  if (!request) {
    throw new Error(
      'Pengajuan cuti tidak ditemukan',
    );
  }

  return structuredClone(
    request,
  );
};