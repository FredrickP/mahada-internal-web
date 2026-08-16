import type {
  CreateLeaveRequestInput,
  HRServicesData,
  LeaveRequest,
  LeaveRequestResponse,
  SaveLeaveDraftInput,
} from '../types/leave.types';

const delay = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

let mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LEAVE001',
    submissionNumber: 'HR-CUTI-0032',
    leaveType: 'Cuti Tahunan',
    startDate: '12 Agustus 2026',
    endDate: '13 Agustus 2026',
    workingDays: 2,
    reason: 'Keperluan keluarga.',
    approverName: 'Information Technology Head',
    status: 'APPROVED',
  },
  {
    id: 'LEAVE002',
    submissionNumber: 'HR-CUTI-0027',
    leaveType: 'Cuti Tahunan',
    startDate: '21 Juli 2026',
    endDate: '21 Juli 2026',
    workingDays: 1,
    reason: 'Keperluan pribadi.',
    approverName: 'Information Technology Head',
    status: 'COMPLETED',
  },
];

const getLeaveBalance = () => {
  return {
    totalDays: 12,
    usedDays: 3,
    remainingDays: 9,
  };
};

const getBusinessTripSummary = () => {
  return {
    activeCount: 2,
    waitingApprovalCount: 1,
    approvedCount: 1,
  };
};

export const getMockHRServices = async (): Promise<HRServicesData> => {
  await delay(500);

  return {
    leaveBalance: getLeaveBalance(),
    businessTripSummary: getBusinessTripSummary(),
    history: [
      {
        id: 'HISTORY001',
        submissionNumber: 'HR-CUTI-0032',
        type: 'LEAVE',
        typeLabel: 'Cuti Tahunan',
        periodOrDestination: '12–13 Agustus 2026',
        status: 'APPROVED',
      },
      {
        id: 'HISTORY002',
        submissionNumber: 'HR-PD-0018',
        type: 'BUSINESS_TRIP',
        typeLabel: 'Perjalanan Dinas',
        periodOrDestination: 'Bandung • 2 Hari',
        status: 'SUBMITTED',
      },
      {
        id: 'HISTORY003',
        submissionNumber: 'HR-CUTI-0027',
        type: 'LEAVE',
        typeLabel: 'Cuti Tahunan',
        periodOrDestination: '21 Juli 2026',
        status: 'COMPLETED',
      },
    ],
  };
};

const generateLeaveNumber = (): string => {
  const highestSequence = mockLeaveRequests.reduce(
    (highest, request) => {
      const sequenceText = request.submissionNumber
        .split('-')
        .at(-1);

      const sequence = Number(sequenceText);

      if (Number.isNaN(sequence)) {
        return highest;
      }

      return Math.max(highest, sequence);
    },
    0,
  );

  const nextSequence = String(
    highestSequence + 1,
  ).padStart(4, '0');

  return `HR-CUTI-${nextSequence}`;
};

export const createMockLeaveRequest = async (
  input: CreateLeaveRequestInput | SaveLeaveDraftInput,
  isDraft: boolean,
): Promise<LeaveRequestResponse> => {
  await delay(700);

  const id = `LEAVE${Date.now()}`;
  const submissionNumber = generateLeaveNumber();

  if (isDraft) {
    return {
      id,
      submissionNumber,
      status: 'DRAFT',
      isDraft: true,
    };
  }

  const submittedInput = input as CreateLeaveRequestInput;

  const newRequest: LeaveRequest = {
    id,
    submissionNumber,
    leaveType: 'Cuti Tahunan',
    startDate: submittedInput.startDate,
    endDate: submittedInput.endDate,
    workingDays: submittedInput.workingDays,
    reason: submittedInput.reason,
    approverName: submittedInput.approverName,
    status: 'SUBMITTED',
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