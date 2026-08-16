import type {
  CreateITRequestInput,
  CreateITRequestResponse,
  ITRequest,
  ITRequestDetail,
  ITRequestFilter,
  SaveITRequestDraftInput,
} from '../types/it-request.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

let mockITRequests: ITRequest[] = [
  {
    id: 'IT001',
    requestNumber: 'IT-2026-0081',
    title: 'Tidak dapat mengakses VPN',
    type: 'INCIDENT',
    submissionDate: '05 Agu 2026',
    status: 'IN_PROGRESS',
    picName: 'Andi IT',
  },
  {
    id: 'IT002',
    requestNumber: 'IT-2026-0079',
    title: 'Request laptop untuk staf baru',
    type: 'REQUEST',
    submissionDate: '04 Agu 2026',
    status: 'APPROVED',
  },
  {
    id: 'IT003',
    requestNumber: 'IT-2026-0074',
    title: 'Perubahan hak akses folder',
    type: 'CHANGE',
    submissionDate: '02 Agu 2026',
    status: 'SUBMITTED',
  },
  {
    id: 'IT004',
    requestNumber: 'IT-2026-0068',
    title: 'Outlook tidak sinkron',
    type: 'INCIDENT',
    submissionDate: '30 Jul 2026',
    status: 'COMPLETED',
    picName: 'Budi IT',
  },
];

export const getMockITRequests = async (
  filter?: ITRequestFilter,
): Promise<ITRequest[]> => {
  await delay(500);

  let result = [...mockITRequests];

  if (!filter) {
    return result;
  }

  const search = filter.search
    .trim()
    .toLowerCase();

  if (search) {
    result = result.filter((request) => {
      const requestNumber =
        request.requestNumber.toLowerCase();

      const title =
        request.title.toLowerCase();

      return (
        requestNumber.includes(search) ||
        title.includes(search)
      );
    });
  }

  if (filter.type) {
    result = result.filter(
      (request) => {
        return request.type === filter.type;
      },
    );
  }

  if (filter.status) {
    result = result.filter(
      (request) => {
        return (
          request.status === filter.status
        );
      },
    );
  }

  return result;
};

export const getMockITRequestDetail = async (
  id: string,
): Promise<ITRequestDetail> => {
  await delay(500);

  const request =
    mockITRequests.find(
      (item) => item.id === id,
    );

  if (!request) {
    throw new Error(
      'IT Request tidak ditemukan',
    );
  }

  return {
    ...request,

    requesterName:
      'Fredrick Pardosi',

    requesterDivision:
      'Operation',

    requesterEmail:
      'fredrick@mahadafinance.co.id',

    attachments:
      request.id === 'IT001'
        ? [
            {
              id: 'ATT001',
              fileName:
                'vpn-error.png',
              fileUrl:
                '/mock/vpn-error.png',
              fileSize: 245760,
            },
          ]
        : [],

    history:
      request.id === 'IT001'
        ? [
            {
              id: 'HIS001',
              status:
                'SUBMITTED',
              actionBy:
                'Fredrick Pardosi',
              actionDate:
                '05 Agu 2026 09:15',
              notes:
                'Incident dilaporkan.',
            },
            {
              id: 'HIS002',
              status:
                'IN_PROGRESS',
              actionBy:
                'Andi IT',
              actionDate:
                '05 Agu 2026 09:30',
              notes:
                'Sedang dilakukan pengecekan akses VPN.',
            },
          ]
        : [
            {
              id: `HIS-${request.id}`,
              status:
                request.status,
              actionBy:
                request.picName ??
                'System',
              actionDate:
                request.submissionDate,
            },
          ],
  };
};

const generateRequestNumber = (): string => {
  const highestSequence =
    mockITRequests.reduce(
      (
        highest,
        request,
      ) => {
        const sequenceText =
          request.requestNumber
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
  ).padStart(4, '0');

  return `IT-2026-${nextSequence}`;
};

export const createMockITRequest = async (
  input:
    | CreateITRequestInput
    | SaveITRequestDraftInput,
  isDraft: boolean,
): Promise<CreateITRequestResponse> => {
  await delay(700);

  const requestNumber =
    generateRequestNumber();

  const id = `IT${Date.now()}`;

  /*
   * Draft boleh parsial.
   * Belum masuk workflow.
   */
  if (isDraft) {
    return {
      id,
      requestNumber,
      status: null,
      isDraft: true,
    };
  }

  /*
   * Kalau bukan draft, input pasti berasal
   * dari CreateITRequestInput karena sebelumnya
   * sudah melewati validasi form.
   */
  const submittedInput =
    input as CreateITRequestInput;

  const status =
    submittedInput.type === 'INCIDENT'
      ? 'IN_PROGRESS'
      : 'SUBMITTED';

  const newRequest: ITRequest = {
    id,
    requestNumber,
    title: submittedInput.title,
    type: submittedInput.type,
    submissionDate: '15 Agu 2026',
    status,
    description:
      submittedInput.description,
    priority:
      submittedInput.priority,
    attachmentCount:
      submittedInput.attachments.length,
  };

  mockITRequests = [
    newRequest,
    ...mockITRequests,
  ];

  return {
    id,
    requestNumber,
    status,
    isDraft: false,
  };
};