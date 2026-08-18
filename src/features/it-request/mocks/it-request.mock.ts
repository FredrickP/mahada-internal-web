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

let mockITRequestDetails: Record<
  string,
  Pick<
    ITRequestDetail,
    'attachments' | 'history'
  >
> = {
  IT001: {
    attachments: [
      {
        id: 'ATT001',
        fileName: 'vpn-error.png',
        fileUrl: '/mock/vpn-error.png',
        fileSize: 245760,
      },
    ],
    history: [
      {
        id: 'HIS001',
        status: 'SUBMITTED',
        actionBy: 'Fredrick Pardosi',
        actionDate: '05 Agu 2026 09:15',
        notes: 'Incident dilaporkan.',
      },
      {
        id: 'HIS002',
        status: 'IN_PROGRESS',
        actionBy: 'Andi IT',
        actionDate: '05 Agu 2026 09:30',
        notes:
          'Sedang dilakukan pengecekan akses VPN.',
      },
    ],
  },
};

const formatActionDate = (
  date: Date,
): string => {
  const dateText =
    new Intl.DateTimeFormat(
      'id-ID',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    ).format(date);

  const timeText =
    new Intl.DateTimeFormat(
      'id-ID',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
    ).format(date);

  return `${dateText} ${timeText}`;
};

export const getMockITRequests = async (
  filter?: ITRequestFilter,
): Promise<ITRequest[]> => {
  await delay(500);

  let result = [
    ...mockITRequests,
  ];

  if (!filter) {
    return result;
  }

  const search =
    filter.search
      .trim()
      .toLowerCase();

  if (search) {
    result =
      result.filter(
        (request) => {
          const requestNumber =
            request.requestNumber
              .toLowerCase();

          const title =
            request.title
              .toLowerCase();

          return (
            requestNumber.includes(
              search,
            ) ||
            title.includes(
              search,
            )
          );
        },
      );
  }

  if (filter.type) {
    result =
      result.filter(
        (request) => {
          return (
            request.type ===
            filter.type
          );
        },
      );
  }

  if (filter.status) {
    result =
      result.filter(
        (request) => {
          return (
            request.status ===
            filter.status
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
      (item) => {
        return (
          item.id === id
        );
      },
    );

  if (!request) {
    throw new Error(
      'IT Request tidak ditemukan',
    );
  }

  const storedDetail =
    mockITRequestDetails[
      request.id
    ];

  const defaultHistory: ITRequestDetail['history'] = [
    {
      id:
        `HIS-${request.id}`,
      status:
        request.status,
      actionBy:
        request.picName ??
        'System',
      actionDate:
        request.submissionDate,
    },
  ];

  return {
    ...request,
    requesterName:
      'Fredrick Pardosi',
    requesterDivision:
      'Operation',
    requesterEmail:
      'fredrick@mahadafinance.co.id',
    attachments:
      structuredClone(
        storedDetail?.attachments ??
          [],
      ),
    history:
      structuredClone(
        storedDetail?.history ??
          defaultHistory,
      ),
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

  const id =
    `IT${Date.now()}`;

  if (isDraft) {
    return {
      id,
      requestNumber,
      status: null,
      isDraft: true,
    };
  }

  const submittedInput =
    input as CreateITRequestInput;

  const status =
    submittedInput.type ===
    'INCIDENT'
      ? 'IN_PROGRESS'
      : 'SUBMITTED';

  const newRequest: ITRequest = {
    id,
    requestNumber,
    title:
      submittedInput.title,
    type:
      submittedInput.type,
    submissionDate:
      '17 Agu 2026',
    status,
    description:
      submittedInput.description,
    priority:
      submittedInput.priority,
    attachmentCount:
      submittedInput.attachments.length,
    picName:
      submittedInput.type ===
      'INCIDENT'
        ? 'IT Team'
        : undefined,
  };

  const attachments: ITRequestDetail['attachments'] =
    submittedInput.attachments.map(
      (
        file,
        index,
      ) => {
        return {
          id:
            `ATT-${id}-${index + 1}`,
          fileName:
            file.name,
          fileUrl:
            URL.createObjectURL(
              file,
            ),
          fileSize:
            file.size,
        };
      },
    );

  const history: ITRequestDetail['history'] = [
    {
      id:
        `HIS-${id}-001`,
      status:
        'SUBMITTED',
      actionBy:
        'Fredrick Pardosi',
      actionDate:
        formatActionDate(
          new Date(),
        ),
      notes:
        submittedInput.type ===
        'INCIDENT'
          ? 'Incident dilaporkan.'
          : 'IT Request diajukan.',
    },
  ];

  if (
    submittedInput.type ===
    'INCIDENT'
  ) {
    history.push({
      id:
        `HIS-${id}-002`,
      status:
        'IN_PROGRESS',
      actionBy:
        'IT Team',
      actionDate:
        formatActionDate(
          new Date(),
        ),
      notes:
        'Incident langsung diteruskan ke proses IT tanpa approval.',
    });
  }

  mockITRequests = [
    newRequest,
    ...mockITRequests,
  ];

  mockITRequestDetails = {
    ...mockITRequestDetails,
    [id]: {
      attachments,
      history,
    },
  };

  return {
    id,
    requestNumber,
    status,
    isDraft: false,
  };
};

export const updateMockITRequestApprovalStatus = async (
  reference: string,
  status: Extract<
    ITRequest['status'],
    'APPROVED' | 'REJECTED'
  >,
): Promise<ITRequest> => {
  await delay(400);

  const requestIndex =
    mockITRequests.findIndex(
      (request) => {
        return (
          request.id === reference ||
          request.requestNumber ===
            reference
        );
      },
    );

  if (
    requestIndex < 0
  ) {
    throw new Error(
      'IT Request tidak ditemukan',
    );
  }

  const request =
    mockITRequests[
      requestIndex
    ];

  if (
    request.type ===
    'INCIDENT'
  ) {
    throw new Error(
      'Incident tidak memerlukan approval',
    );
  }

  if (
    request.status !==
    'SUBMITTED'
  ) {
    throw new Error(
      'IT Request sudah diproses',
    );
  }

  const updatedRequest: ITRequest = {
    ...request,
    status,
  };

  mockITRequests[
    requestIndex
  ] = updatedRequest;

  const existingDetail =
    mockITRequestDetails[
      request.id
    ];

  const existingHistory =
    existingDetail?.history ??
    [
      {
        id:
          `HIS-${request.id}-001`,
        status:
          'SUBMITTED' as const,
        actionBy:
          'Fredrick Pardosi',
        actionDate:
          request.submissionDate,
        notes:
          'IT Request diajukan.',
      },
    ];

  mockITRequestDetails = {
    ...mockITRequestDetails,
    [request.id]: {
      attachments:
        existingDetail?.attachments ??
        [],
      history: [
        ...existingHistory,
        {
          id:
            `HIS-${Date.now()}`,
          status,
          actionBy:
            'Demo Approver',
          actionDate:
            formatActionDate(
              new Date(),
            ),
          notes:
            status ===
            'APPROVED'
              ? 'IT Request disetujui.'
              : 'IT Request ditolak.',
        },
      ],
    },
  };

  return structuredClone(
    updatedRequest,
  );
};

export const updateMockITRequestProcessorStatus = async (
  reference: string,
  status: Extract<
    ITRequest['status'],
    'IN_PROGRESS' | 'COMPLETED'
  >,
): Promise<ITRequest> => {
  await delay(500);

  const requestIndex =
    mockITRequests.findIndex(
      (request) => {
        return (
          request.id === reference ||
          request.requestNumber ===
            reference
        );
      },
    );

  if (
    requestIndex < 0
  ) {
    throw new Error(
      'IT Request tidak ditemukan',
    );
  }

  const request =
    mockITRequests[
      requestIndex
    ];

  if (
    status === 'IN_PROGRESS' &&
    request.status !== 'APPROVED'
  ) {
    throw new Error(
      'Hanya IT Request yang sudah disetujui yang dapat mulai diproses',
    );
  }

  if (
    status === 'COMPLETED' &&
    request.status !== 'IN_PROGRESS'
  ) {
    throw new Error(
      'Hanya IT Request yang sedang diproses yang dapat diselesaikan',
    );
  }

  const updatedRequest: ITRequest = {
    ...request,
    status,
    picName:
      'Demo Processor',
  };

  mockITRequests[
    requestIndex
  ] = updatedRequest;

  const existingDetail =
    mockITRequestDetails[
      request.id
    ];

  const existingHistory =
    existingDetail?.history ??
    [
      {
        id:
          `HIS-${request.id}-001`,
        status:
          request.status,
        actionBy:
          request.picName ??
          'System',
        actionDate:
          request.submissionDate,
      },
    ];

  mockITRequestDetails = {
    ...mockITRequestDetails,
    [request.id]: {
      attachments:
        existingDetail?.attachments ??
        [],
      history: [
        ...existingHistory,
        {
          id:
            `HIS-${Date.now()}`,
          status,
          actionBy:
            'Demo Processor',
          actionDate:
            formatActionDate(
              new Date(),
            ),
          notes:
            status ===
            'IN_PROGRESS'
              ? 'IT Request mulai diproses oleh tim IT.'
              : 'IT Request telah selesai diproses.',
        },
      ],
    },
  };

  return structuredClone(
    updatedRequest,
  );
};