import type {
  BusinessTripDetail,
  BusinessTripEvidenceType,
  BusinessTripStatus,
  CreateBusinessTripInput,
  CreateBusinessTripResponse,
  UploadBusinessTripEvidenceInput,
  UploadBusinessTripEvidenceResponse,
} from '../types/business-trip.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
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

  return `${dateText} • ${timeText}`;
};

const getEvidenceFileType = (
  file: File,
): BusinessTripEvidenceType => {
  if (
    file.type.startsWith(
      'image/',
    )
  ) {
    return 'IMAGE';
  }

  if (
    file.type ===
      'application/pdf' ||
    file.name
      .toLowerCase()
      .endsWith('.pdf')
  ) {
    return 'PDF';
  }

  return 'FILE';
};

let mockBusinessTripDetails: BusinessTripDetail[] = [
  {
    id: 'TRIP001',
    requestNumber: 'TRIP-2026-0012',
    employeeName: 'Fredrick Pardosi',
    employeeDivision: 'Operation',
    destination: 'Bandung',
    purpose:
      'Meeting koordinasi operasional dengan partner.',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    totalDays: 3,
    estimatedCost: 2500000,
    status: 'APPROVED',
    evidences: [],
    history: [
      {
        id: 'HIS001',
        status: 'SUBMITTED',
        label: 'Diajukan',
        date: '15 Agu 2026 • 09:12',
      },
      {
        id: 'HIS002',
        status: 'WAITING_APPROVAL',
        label: 'Menunggu Approval',
        date: '15 Agu 2026 • 09:13',
      },
      {
        id: 'HIS003',
        status: 'APPROVED',
        label: 'Disetujui',
        date: '15 Agu 2026 • 13:40',
        note:
          'Perjalanan dinas disetujui.',
      },
    ],
  },
  {
    id: 'TRIP002',
    requestNumber: 'TRIP-2026-0010',
    employeeName: 'Siti Rahma',
    employeeDivision: 'Operation',
    destination: 'Surabaya',
    purpose:
      'Kunjungan operasional cabang.',
    startDate: '2026-08-05',
    endDate: '2026-08-07',
    totalDays: 3,
    estimatedCost: 3200000,
    status: 'COMPLETED',
    evidences: [
      {
        id: 'EVD001',
        fileName:
          'bukti-perjalanan-surabaya.pdf',
        fileType:
          'PDF',
        uploadedAt:
          '08 Agu 2026 • 10:20',
      },
    ],
    history: [
      {
        id: 'HIS004',
        status: 'SUBMITTED',
        label: 'Diajukan',
        date: '01 Agu 2026 • 08:30',
      },
      {
        id: 'HIS005',
        status: 'WAITING_APPROVAL',
        label: 'Menunggu Approval',
        date: '01 Agu 2026 • 08:31',
      },
      {
        id: 'HIS006',
        status: 'APPROVED',
        label: 'Disetujui',
        date: '01 Agu 2026 • 11:15',
      },
      {
        id: 'HIS007',
        status: 'COMPLETED',
        label: 'Selesai',
        date: '08 Agu 2026 • 10:20',
      },
    ],
  },
  {
    id: 'TRIP003',
    requestNumber: 'HR-PD-0019',
    employeeName: 'Budi Santoso',
    employeeDivision: 'Sales & Marketing',
    destination: 'Bandung, Jawa Barat',
    purpose:
      'Kunjungan dan koordinasi dengan mitra.',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    totalDays: 2,
    estimatedCost: 3200000,
    status: 'WAITING_APPROVAL',
    evidences: [],
    history: [
      {
        id: 'HIS008',
        status: 'SUBMITTED',
        label: 'Diajukan',
        date: '10 Agu 2026 • 13:20',
      },
      {
        id: 'HIS009',
        status: 'WAITING_APPROVAL',
        label: 'Menunggu Approval',
        date: '10 Agu 2026 • 13:21',
      },
    ],
  },
];

const calculateTotalDays = (
  startDate: string,
  endDate: string,
): number => {
  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const difference =
    end.getTime() -
    start.getTime();

  const totalDays =
    Math.floor(
      difference /
        (
          1000 *
          60 *
          60 *
          24
        ),
    ) + 1;

  return Math.max(
    totalDays,
    1,
  );
};

export const createMockBusinessTrip = async (
  input: CreateBusinessTripInput,
): Promise<CreateBusinessTripResponse> => {
  await delay(700);

  const maxNumber =
    mockBusinessTripDetails.reduce(
      (
        currentMax,
        trip,
      ) => {
        const number =
          Number(
            trip.id.replace(
              'TRIP',
              '',
            ),
          );

        return Math.max(
          currentMax,
          Number.isNaN(number)
            ? 0
            : number,
        );
      },
      0,
    );

  const nextNumber =
    maxNumber + 1;

  const id =
    `TRIP${String(
      nextNumber,
    ).padStart(
      3,
      '0',
    )}`;

  const requestNumber =
    `TRIP-2026-${String(
      nextNumber + 12,
    ).padStart(
      4,
      '0',
    )}`;

  const now =
    new Date();

  const newTrip: BusinessTripDetail = {
    id,
    requestNumber,
    employeeName:
      'Fredrick Pardosi',
    employeeDivision:
      'Operation',
    destination:
      input.destination,
    purpose:
      input.purpose,
    startDate:
      input.startDate,
    endDate:
      input.endDate,
    totalDays:
      calculateTotalDays(
        input.startDate,
        input.endDate,
      ),
    estimatedCost:
      input.estimatedCost,
    status:
      'WAITING_APPROVAL',
    evidences: [],
    history: [
      {
        id:
          `HIS-${id}-001`,
        status:
          'SUBMITTED',
        label:
          'Diajukan',
        date:
          formatActionDate(
            now,
          ),
      },
      {
        id:
          `HIS-${id}-002`,
        status:
          'WAITING_APPROVAL',
        label:
          'Menunggu Approval',
        date:
          formatActionDate(
            now,
          ),
      },
    ],
  };

  mockBusinessTripDetails = [
    newTrip,
    ...mockBusinessTripDetails,
  ];

  return {
    id,
    requestNumber,
    message:
      'Pengajuan perjalanan dinas berhasil dibuat',
  };
};

export const getMockBusinessTripDetail = async (
  id: string,
): Promise<BusinessTripDetail> => {
  await delay(400);

  const trip =
    mockBusinessTripDetails.find(
      (item) => {
        return (
          item.id === id
        );
      },
    );

  if (!trip) {
    throw new Error(
      'Data perjalanan dinas tidak ditemukan',
    );
  }

  return structuredClone(
    trip,
  );
};

export const updateMockBusinessTripStatus = async (
  reference: string,
  status: BusinessTripStatus,
): Promise<BusinessTripDetail> => {
  await delay(400);

  const tripIndex =
    mockBusinessTripDetails.findIndex(
      (trip) => {
        return (
          trip.id === reference ||
          trip.requestNumber ===
            reference
        );
      },
    );

  if (
    tripIndex < 0
  ) {
    throw new Error(
      'Data perjalanan dinas tidak ditemukan',
    );
  }

  const trip =
    mockBusinessTripDetails[
      tripIndex
    ];

  if (
    trip.status !==
    'WAITING_APPROVAL'
  ) {
    throw new Error(
      'Pengajuan perjalanan dinas sudah diproses',
    );
  }

  if (
    status !== 'APPROVED' &&
    status !== 'REJECTED'
  ) {
    throw new Error(
      'Status perjalanan dinas tidak valid',
    );
  }

  const now =
    new Date();

  const history =
    status === 'APPROVED'
      ? {
          id:
            `HIS-${Date.now()}`,
          status:
            'APPROVED' as const,
          label:
            'Disetujui',
          date:
            formatActionDate(
              now,
            ),
          note:
            'Perjalanan dinas disetujui.',
        }
      : {
          id:
            `HIS-${Date.now()}`,
          status:
            'REJECTED' as const,
          label:
            'Ditolak',
          date:
            formatActionDate(
              now,
            ),
          note:
            'Perjalanan dinas ditolak.',
        };

  const updatedTrip: BusinessTripDetail = {
    ...trip,
    status,
    history: [
      ...trip.history,
      history,
    ],
  };

  mockBusinessTripDetails[
    tripIndex
  ] = updatedTrip;

  return structuredClone(
    updatedTrip,
  );
};

export const uploadMockBusinessTripEvidence = async (
  input: UploadBusinessTripEvidenceInput,
): Promise<UploadBusinessTripEvidenceResponse> => {
  await delay(700);

  const tripIndex =
    mockBusinessTripDetails.findIndex(
      (trip) => {
        return (
          trip.id ===
          input.tripId
        );
      },
    );

  if (
    tripIndex < 0
  ) {
    throw new Error(
      'Data perjalanan dinas tidak ditemukan',
    );
  }

  const trip =
    mockBusinessTripDetails[
      tripIndex
    ];

  if (
    trip.status !== 'APPROVED'
  ) {
    throw new Error(
      'Bukti perjalanan hanya dapat diunggah pada perjalanan yang sudah disetujui',
    );
  }

  const fileType =
    getEvidenceFileType(
      input.file,
    );

  const fileUrl =
    URL.createObjectURL(
      input.file,
    );

  const now =
    new Date();

  const evidence = {
    id:
      `EVD-${Date.now()}`,
    fileName:
      input.file.name,
    fileUrl,
    fileType,
    uploadedAt:
      formatActionDate(
        now,
      ),
  };

  const evidenceHistory = {
    id:
      `HIS-EVIDENCE-${Date.now()}`,
    status:
      'APPROVED' as const,
    label:
      'Bukti Perjalanan Diunggah',
    date:
      formatActionDate(
        now,
      ),
    note:
      `${input.file.name} berhasil diunggah.`,
  };

  mockBusinessTripDetails[
    tripIndex
  ] = {
    ...trip,
    evidences: [
      ...trip.evidences,
      evidence,
    ],
    history: [
      ...trip.history,
      evidenceHistory,
    ],
  };

  return {
    tripId:
      input.tripId,
    evidence,
    message:
      'Bukti perjalanan berhasil diunggah',
  };
};

export const completeMockBusinessTrip = async (
  reference: string,
): Promise<BusinessTripDetail> => {
  await delay(500);

  const tripIndex =
    mockBusinessTripDetails.findIndex(
      (trip) => {
        return (
          trip.id === reference ||
          trip.requestNumber ===
            reference
        );
      },
    );

  if (
    tripIndex < 0
  ) {
    throw new Error(
      'Data perjalanan dinas tidak ditemukan',
    );
  }

  const trip =
    mockBusinessTripDetails[
      tripIndex
    ];

  if (
    trip.status !== 'APPROVED'
  ) {
    throw new Error(
      'Hanya perjalanan yang sudah disetujui yang dapat diselesaikan',
    );
  }

  if (
    trip.evidences.length === 0
  ) {
    throw new Error(
      'Upload minimal satu bukti perjalanan sebelum menyelesaikan perjalanan',
    );
  }

  const now =
    new Date();

  const updatedTrip: BusinessTripDetail = {
    ...trip,
    status:
      'COMPLETED',
    history: [
      ...trip.history,
      {
        id:
          `HIS-COMPLETED-${Date.now()}`,
        status:
          'COMPLETED',
        label:
          'Selesai',
        date:
          formatActionDate(
            now,
          ),
        note:
          'Perjalanan dinas telah diselesaikan oleh pengaju.',
      },
    ],
  };

  mockBusinessTripDetails[
    tripIndex
  ] = updatedTrip;

  return structuredClone(
    updatedTrip,
  );
};

export const getMockBusinessTrips = (): BusinessTripDetail[] => {
  return structuredClone(
    mockBusinessTripDetails,
  );
};