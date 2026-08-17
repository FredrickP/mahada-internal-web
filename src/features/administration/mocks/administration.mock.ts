import type {
  AdministrationData,
  AdministrationPermission,
  AdministrationRole,
  AdministrationUser,
  CreateUserInput,
  LeaveBalanceData,
  LeaveBalanceRecord,
  OrganizationData,
  OrganizationDivision,
  OrganizationMember,
  PermissionKey,
  RolePermissionDetail,
  TaxConfiguration,
  TaxConfigurationData,
  UpdateTaxConfigurationInput,
  UpdateTaxConfigurationResponse,
  UpdateLeaveBalanceInput,
  UpdateLeaveBalanceResponse,
  UpdateOrganizationMappingInput,
  UpdateOrganizationMappingResponse,
  UpdateRoleInput,
  UpdateRolePermissionInput,
  UpdateRolePermissionResponse,
  UpdateUserInput,
  UserMutationResponse,
  UserRole,
} from '../types/administration.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

let mockUsers: AdministrationUser[] = [
  {
    id: 'USR001',
    name: 'Fredrick Pardosi',
    email: 'fredrick@mahadafinance.co.id',
    division: 'Operation',
    position: 'Staff',
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: '17 Agu 2026 • 08:12',
  },
  {
    id: 'USR002',
    name: 'Siti Rahma',
    email: 'siti.rahma@mahadafinance.co.id',
    division: 'Operation',
    position: 'Operation Head',
    role: 'APPROVER',
    status: 'ACTIVE',
    lastLogin: '17 Agu 2026 • 07:45',
  },
  {
    id: 'USR003',
    name: 'Budi Santoso',
    email: 'budi.santoso@mahadafinance.co.id',
    division: 'Finance, Accounting and Tax',
    position: 'Finance Staff',
    role: 'PROCESSOR',
    status: 'ACTIVE',
    lastLogin: '16 Agu 2026 • 16:20',
  },
  {
    id: 'USR004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@mahadafinance.co.id',
    division: 'Human Capital & General Affairs',
    position: 'HCGA Staff',
    role: 'PROCESSOR',
    status: 'ACTIVE',
    lastLogin: '16 Agu 2026 • 15:10',
  },
  {
    id: 'USR005',
    name: 'Admin Mahada',
    email: 'admin@mahadafinance.co.id',
    division: 'Information Technology',
    position: 'Administrator',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLogin: '17 Agu 2026 • 08:01',
  },
  {
    id: 'USR006',
    name: 'Rina Pratiwi',
    email: 'rina.pratiwi@mahadafinance.co.id',
    division: 'Sales & Marketing',
    position: 'Staff',
    role: 'USER',
    status: 'INACTIVE',
    lastLogin: '03 Agu 2026 • 11:32',
  },
];

let mockRoles: AdministrationRole[] = [
  {
    id: 'ROLE001',
    name: 'USER',
    displayName: 'User',
    description:
      'Membuat dan memantau pengajuan sendiri.',
    totalUsers: 21,
  },
  {
    id: 'ROLE002',
    name: 'APPROVER',
    displayName: 'Approver',
    description:
      'Memeriksa dan memutuskan pengajuan bawahan.',
    totalUsers: 9,
  },
  {
    id: 'ROLE003',
    name: 'PROCESSOR',
    displayName: 'Processor',
    description:
      'Memproses pengajuan pada divisi terkait.',
    totalUsers: 2,
  },
  {
    id: 'ROLE004',
    name: 'ADMIN',
    displayName: 'Admin',
    description:
      'Mengelola master data dan konfigurasi.',
    totalUsers: 3,
  },
];

const permissionDefinitions: Omit<
  AdministrationPermission,
  'enabled'
>[] = [
  {
    key: 'CREATE_SUBMISSION',
    label: 'Buat Pengajuan',
    description:
      'Membuat pengajuan IT Request, HR Services, dan Payment.',
  },
  {
    key: 'VIEW_OWN_SUBMISSION',
    label: 'Lihat Pengajuan Sendiri',
    description:
      'Melihat detail dan status pengajuan milik sendiri.',
  },
  {
    key: 'APPROVE_REJECT',
    label: 'Approve / Reject',
    description:
      'Memberikan persetujuan atau penolakan pengajuan.',
  },
  {
    key: 'PROCESS_SUBMISSION',
    label: 'Proses Pengajuan',
    description:
      'Memproses pengajuan pada divisi terkait.',
  },
  {
    key: 'VIEW_REPORT',
    label: 'Lihat Reports',
    description:
      'Melihat dashboard laporan dan statistik pengajuan.',
  },
  {
    key: 'EXPORT_REPORT',
    label: 'Export Reports',
    description:
      'Mengunduh laporan dalam format Excel.',
  },
  {
    key: 'MANAGE_USER_ROLE',
    label: 'Kelola User & Role',
    description:
      'Membuat dan mengubah user serta role aplikasi.',
  },
  {
    key: 'MANAGE_ORGANIZATION',
    label: 'Kelola Struktur Organisasi',
    description:
      'Mengatur divisi dan mapping atasan langsung.',
  },
  {
    key: 'MANAGE_LEAVE_BALANCE',
    label: 'Kelola Saldo Cuti',
    description:
      'Mengatur saldo awal dan penyesuaian cuti karyawan.',
  },
  {
    key: 'MANAGE_TAX_CONFIGURATION',
    label: 'Kelola Konfigurasi Pajak',
    description:
      'Mengatur tarif dan konfigurasi perhitungan pajak.',
  },
];

let mockRolePermissions: Record<
  UserRole,
  PermissionKey[]
> = {
  USER: [
    'CREATE_SUBMISSION',
    'VIEW_OWN_SUBMISSION',
    'VIEW_REPORT',
  ],
  APPROVER: [
    'CREATE_SUBMISSION',
    'VIEW_OWN_SUBMISSION',
    'APPROVE_REJECT',
    'VIEW_REPORT',
    'EXPORT_REPORT',
  ],
  PROCESSOR: [
    'CREATE_SUBMISSION',
    'VIEW_OWN_SUBMISSION',
    'PROCESS_SUBMISSION',
    'VIEW_REPORT',
    'EXPORT_REPORT',
  ],
  ADMIN: [
    'CREATE_SUBMISSION',
    'VIEW_OWN_SUBMISSION',
    'APPROVE_REJECT',
    'PROCESS_SUBMISSION',
    'VIEW_REPORT',
    'EXPORT_REPORT',
    'MANAGE_USER_ROLE',
    'MANAGE_ORGANIZATION',
    'MANAGE_LEAVE_BALANCE',
    'MANAGE_TAX_CONFIGURATION',
  ],
};

const mockDivisions: OrganizationDivision[] = [
  {
    id: 'DIV001',
    code: 'IT',
    name: 'Information Technology',
    headName: 'Andi Pratama',
    headEmail: 'andi@mahadafinance.co.id',
    totalEmployees: 5,
    status: 'ACTIVE',
  },
  {
    id: 'DIV002',
    code: 'HCGA',
    name: 'Human Capital & General Affairs',
    headName: 'Maya Putri',
    headEmail: 'maya@mahadafinance.co.id',
    totalEmployees: 4,
    status: 'ACTIVE',
  },
  {
    id: 'DIV003',
    code: 'FAT',
    name: 'Finance, Accounting and Tax',
    headName: 'Rudi Hartono',
    headEmail: 'rudi@mahadafinance.co.id',
    totalEmployees: 6,
    status: 'ACTIVE',
  },
  {
    id: 'DIV004',
    code: 'OPS',
    name: 'Operation',
    headName: 'Siti Rahma',
    headEmail: 'siti.rahma@mahadafinance.co.id',
    totalEmployees: 7,
    status: 'ACTIVE',
  },
  {
    id: 'DIV005',
    code: 'SAM',
    name: 'Sales & Marketing',
    headName: 'Dimas Setiawan',
    headEmail: 'dimas@mahadafinance.co.id',
    totalEmployees: 6,
    status: 'ACTIVE',
  },
  {
    id: 'DIV006',
    code: 'RNC',
    name: 'Risk & Compliance',
    headName: 'Indah Permata',
    headEmail: 'indah@mahadafinance.co.id',
    totalEmployees: 4,
    status: 'ACTIVE',
  },
  {
    id: 'DIV007',
    code: 'BOD',
    name: 'Board of Directors',
    headName: 'Bambang Wijaya',
    headEmail: 'bambang@mahadafinance.co.id',
    totalEmployees: 3,
    status: 'ACTIVE',
  },
];

let mockOrganizationMembers: OrganizationMember[] = [
  {
    id: 'USR001',
    name: 'Fredrick Pardosi',
    email: 'fredrick@mahadafinance.co.id',
    divisionId: 'DIV004',
    divisionName: 'Operation',
    position: 'Staff',
    managerId: 'USR002',
    managerName: 'Siti Rahma',
    managerEmail: 'siti.rahma@mahadafinance.co.id',
    status: 'ACTIVE',
  },
  {
    id: 'USR002',
    name: 'Siti Rahma',
    email: 'siti.rahma@mahadafinance.co.id',
    divisionId: 'DIV004',
    divisionName: 'Operation',
    position: 'Operation Head',
    managerId: null,
    managerName: null,
    managerEmail: null,
    status: 'ACTIVE',
  },
  {
    id: 'USR003',
    name: 'Budi Santoso',
    email: 'budi.santoso@mahadafinance.co.id',
    divisionId: 'DIV003',
    divisionName: 'Finance, Accounting and Tax',
    position: 'Finance Staff',
    managerId: null,
    managerName: 'Rudi Hartono',
    managerEmail: 'rudi@mahadafinance.co.id',
    status: 'ACTIVE',
  },
  {
    id: 'USR004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@mahadafinance.co.id',
    divisionId: 'DIV002',
    divisionName: 'Human Capital & General Affairs',
    position: 'HCGA Staff',
    managerId: null,
    managerName: 'Maya Putri',
    managerEmail: 'maya@mahadafinance.co.id',
    status: 'ACTIVE',
  },
  {
    id: 'USR005',
    name: 'Admin Mahada',
    email: 'admin@mahadafinance.co.id',
    divisionId: 'DIV001',
    divisionName: 'Information Technology',
    position: 'Administrator',
    managerId: null,
    managerName: 'Andi Pratama',
    managerEmail: 'andi@mahadafinance.co.id',
    status: 'ACTIVE',
  },
  {
    id: 'USR006',
    name: 'Rina Pratiwi',
    email: 'rina.pratiwi@mahadafinance.co.id',
    divisionId: 'DIV005',
    divisionName: 'Sales & Marketing',
    position: 'Staff',
    managerId: null,
    managerName: null,
    managerEmail: null,
    status: 'INACTIVE',
  },
];

let mockLeaveBalances: LeaveBalanceRecord[] = [
  {
    userId: 'USR001',
    name: 'Fredrick Pardosi',
    email: 'fredrick@mahadafinance.co.id',
    division: 'Operation',
    year: 2026,
    openingBalance: 12,
    adjustmentBalance: 0,
    usedBalance: 4,
    remainingBalance: 8,
    lastUpdatedAt: '17 Agu 2026 • 08:12',
    status: 'ACTIVE',
  },
  {
    userId: 'USR002',
    name: 'Siti Rahma',
    email: 'siti.rahma@mahadafinance.co.id',
    division: 'Operation',
    year: 2026,
    openingBalance: 12,
    adjustmentBalance: 0,
    usedBalance: 3,
    remainingBalance: 9,
    lastUpdatedAt: '15 Agu 2026 • 14:20',
    status: 'ACTIVE',
  },
  {
    userId: 'USR003',
    name: 'Budi Santoso',
    email: 'budi.santoso@mahadafinance.co.id',
    division: 'Finance, Accounting and Tax',
    year: 2026,
    openingBalance: 12,
    adjustmentBalance: 2,
    usedBalance: 6,
    remainingBalance: 8,
    lastUpdatedAt: '12 Agu 2026 • 10:35',
    status: 'ACTIVE',
  },
  {
    userId: 'USR004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@mahadafinance.co.id',
    division: 'Human Capital & General Affairs',
    year: 2026,
    openingBalance: 12,
    adjustmentBalance: 0,
    usedBalance: 2,
    remainingBalance: 10,
    lastUpdatedAt: '10 Agu 2026 • 09:10',
    status: 'ACTIVE',
  },
  {
    userId: 'USR005',
    name: 'Admin Mahada',
    email: 'admin@mahadafinance.co.id',
    division: 'Information Technology',
    year: 2026,
    openingBalance: 12,
    adjustmentBalance: 0,
    usedBalance: 1,
    remainingBalance: 11,
    lastUpdatedAt: '08 Agu 2026 • 15:42',
    status: 'ACTIVE',
  },
  {
    userId: 'USR006',
    name: 'Rina Pratiwi',
    email: 'rina.pratiwi@mahadafinance.co.id',
    division: 'Sales & Marketing',
    year: 2026,
    openingBalance: 12,
    adjustmentBalance: 0,
    usedBalance: 5,
    remainingBalance: 7,
    lastUpdatedAt: '03 Agu 2026 • 11:32',
    status: 'INACTIVE',
  },
];

let mockTaxConfigurations: TaxConfiguration[] = [
  {
    id: 'TAX001',
    taxType: 'PPN',
    name: 'PPN',
    rate: 11,
    description:
      'Tarif PPN untuk perhitungan pengajuan pembayaran.',
    isActive: true,
  },
  {
    id: 'TAX002',
    taxType: 'PPH',
    name: 'PPh',
    rate: 2,
    description:
      'Tarif PPh untuk perhitungan pengajuan pembayaran.',
    isActive: true,
  },
];

const hiddenLeaveBalanceAggregate = {
  totalEmployees: 29,
  totalAllocated: 348,
  totalUsed: 112,
  totalRemaining: 236,
  lowBalanceEmployees: 4,
};

const getAdministrationData = (): AdministrationData => {
  const inactiveUsers =
    mockUsers.filter(
      (user) =>
        user.status === 'INACTIVE',
    ).length;

  return {
    summary: {
      totalUsers: 36,
      activeUsers: 35,
      inactiveUsers,
      totalRoles: mockRoles.length,
      totalApprovers: 9,
      totalDivisions: 7,
      totalLeaveBalances: 35,
      totalTaxConfigurations: 4,
    },
    recentUsers: structuredClone(
      mockUsers.slice(0, 5),
    ),
    roles: structuredClone(
      mockRoles,
    ),
    menus: [
      {
        id: 'USER_ROLE',
        shortLabel: 'US',
        title: 'User & Role',
        description:
          'Kelola akun, role, dan status pengguna',
        path:
          '/administration/users',
      },
      {
        id: 'ORGANIZATION',
        shortLabel: 'OR',
        title: 'Struktur Organisasi',
        description:
          'Mapping divisi dan atasan langsung',
        path:
          '/administration/organization',
      },
      {
        id: 'LEAVE_BALANCE',
        shortLabel: 'CT',
        title: 'Saldo Cuti',
        description:
          'Atur saldo awal dan penyesuaian cuti',
        path:
          '/administration/leave-balance',
      },
      {
        id: 'TAX_CONFIGURATION',
        shortLabel: 'TX',
        title: 'Konfigurasi Pajak',
        description:
          'Atur tarif dan aturan perhitungan',
        path:
          '/administration/tax-configuration',
      },
    ],
  };
};

const getOrganizationData = (): OrganizationData => {
  const activeMembers =
    mockOrganizationMembers.filter(
      (member) =>
        member.status === 'ACTIVE',
    );

  const totalMappedManagers =
    activeMembers.filter(
      (member) =>
        Boolean(
          member.managerName,
        ),
    ).length;

  const unmappedManagers =
    activeMembers.filter(
      (member) =>
        !member.managerName,
    ).length;

  return {
    summary: {
      totalDivisions:
        mockDivisions.length,
      totalEmployees: 35,
      totalMappedManagers,
      unmappedManagers,
    },
    divisions: structuredClone(
      mockDivisions,
    ),
    members: structuredClone(
      mockOrganizationMembers,
    ),
  };
};

const getLeaveBalanceData = (
  year: number,
): LeaveBalanceData => {
  const balances =
    mockLeaveBalances.filter(
      (balance) =>
        balance.year === year,
    );

  const visibleAllocated =
    balances.reduce(
      (total, balance) =>
        total +
        balance.openingBalance +
        balance.adjustmentBalance,
      0,
    );

  const visibleUsed =
    balances.reduce(
      (total, balance) =>
        total +
        balance.usedBalance,
      0,
    );

  const visibleRemaining =
    balances.reduce(
      (total, balance) =>
        total +
        balance.remainingBalance,
      0,
    );

  const visibleLowBalance =
    balances.filter(
      (balance) =>
        balance.status === 'ACTIVE' &&
        balance.remainingBalance <= 3,
    ).length;

  return {
    year,
    summary: {
      totalEmployees:
        balances.length +
        hiddenLeaveBalanceAggregate.totalEmployees,
      totalAllocated:
        visibleAllocated +
        hiddenLeaveBalanceAggregate.totalAllocated,
      totalUsed:
        visibleUsed +
        hiddenLeaveBalanceAggregate.totalUsed,
      totalRemaining:
        visibleRemaining +
        hiddenLeaveBalanceAggregate.totalRemaining,
      lowBalanceEmployees:
        visibleLowBalance +
        hiddenLeaveBalanceAggregate.lowBalanceEmployees,
    },
    balances: structuredClone(
      balances,
    ),
  };
};

export const getMockAdministration = async (): Promise<
  AdministrationData
> => {
  await delay(500);

  return getAdministrationData();
};

export const getMockUsers = async (): Promise<
  AdministrationUser[]
> => {
  await delay(500);

  return structuredClone(
    mockUsers,
  );
};

export const getMockUserDetail = async (
  id: string,
): Promise<AdministrationUser> => {
  await delay(400);

  const user =
    mockUsers.find(
      (item) =>
        item.id === id,
    );

  if (!user) {
    throw new Error(
      'User tidak ditemukan',
    );
  }

  return structuredClone(
    user,
  );
};

export const createMockUser = async (
  input: CreateUserInput,
): Promise<UserMutationResponse> => {
  await delay(700);

  const emailExists =
    mockUsers.some(
      (user) =>
        user.email.toLowerCase() ===
        input.email.toLowerCase(),
    );

  if (emailExists) {
    throw new Error(
      'Email sudah digunakan',
    );
  }

  const maxNumber =
    mockUsers.reduce(
      (currentMax, user) => {
        const number =
          Number(
            user.id.replace(
              'USR',
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

  const id =
    `USR${String(
      maxNumber + 1,
    ).padStart(3, '0')}`;

  mockUsers = [
    {
      id,
      name: input.name,
      email: input.email,
      division: input.division,
      position: input.position,
      role: input.role,
      status: 'ACTIVE',
    },
    ...mockUsers,
  ];

  return {
    id,
    message:
      'User berhasil dibuat',
  };
};

export const updateMockUser = async (
  id: string,
  input: UpdateUserInput,
): Promise<UserMutationResponse> => {
  await delay(700);

  const userIndex =
    mockUsers.findIndex(
      (user) =>
        user.id === id,
    );

  if (userIndex < 0) {
    throw new Error(
      'User tidak ditemukan',
    );
  }

  const emailExists =
    mockUsers.some(
      (user) =>
        user.id !== id &&
        user.email.toLowerCase() ===
          input.email.toLowerCase(),
    );

  if (emailExists) {
    throw new Error(
      'Email sudah digunakan',
    );
  }

  mockUsers[
    userIndex
  ] = {
    ...mockUsers[
      userIndex
    ],
    ...input,
  };

  return {
    id,
    message:
      'User berhasil diperbarui',
  };
};

export const getMockRoles = async (): Promise<
  AdministrationRole[]
> => {
  await delay(400);

  return structuredClone(
    mockRoles,
  );
};

export const updateMockRole = async (
  input: UpdateRoleInput,
): Promise<UserMutationResponse> => {
  await delay(600);

  const roleIndex =
    mockRoles.findIndex(
      (role) =>
        role.name ===
        input.role,
    );

  if (roleIndex < 0) {
    throw new Error(
      'Role tidak ditemukan',
    );
  }

  mockRoles[
    roleIndex
  ] = {
    ...mockRoles[
      roleIndex
    ],
    description:
      input.description,
  };

  return {
    id: mockRoles[
      roleIndex
    ].id,
    message:
      'Role berhasil diperbarui',
  };
};

export const getMockRolePermission = async (
  role: UserRole,
): Promise<RolePermissionDetail> => {
  await delay(400);

  const roleData =
    mockRoles.find(
      (item) =>
        item.name === role,
    );

  if (!roleData) {
    throw new Error(
      'Role tidak ditemukan',
    );
  }

  const enabledPermissions =
    mockRolePermissions[
      role
    ];

  return {
    role:
      roleData.name,
    displayName:
      roleData.displayName,
    description:
      roleData.description,
    totalUsers:
      roleData.totalUsers,
    permissions:
      permissionDefinitions.map(
        (permission) => {
          return {
            ...permission,
            enabled:
              enabledPermissions.includes(
                permission.key,
              ),
          };
        },
      ),
  };
};

export const updateMockRolePermission = async (
  input: UpdateRolePermissionInput,
): Promise<UpdateRolePermissionResponse> => {
  await delay(700);

  const roleExists =
    mockRoles.some(
      (role) =>
        role.name ===
        input.role,
    );

  if (!roleExists) {
    throw new Error(
      'Role tidak ditemukan',
    );
  }

  const validPermissionKeys =
    new Set(
      permissionDefinitions.map(
        (permission) =>
          permission.key,
      ),
    );

  const uniquePermissions =
    [
      ...new Set(
        input.permissions,
      ),
    ].filter(
      (permission) =>
        validPermissionKeys.has(
          permission,
        ),
    );

  mockRolePermissions = {
    ...mockRolePermissions,
    [input.role]:
      uniquePermissions,
  };

  return {
    role:
      input.role,
    message:
      'Permission berhasil diperbarui',
  };
};

export const getMockOrganization = async (): Promise<
  OrganizationData
> => {
  await delay(500);

  return getOrganizationData();
};

export const updateMockOrganizationMapping = async (
  input: UpdateOrganizationMappingInput,
): Promise<UpdateOrganizationMappingResponse> => {
  await delay(700);

  const memberIndex =
    mockOrganizationMembers.findIndex(
      (member) =>
        member.id ===
        input.userId,
    );

  if (memberIndex < 0) {
    throw new Error(
      'Pengguna tidak ditemukan',
    );
  }

  const division =
    mockDivisions.find(
      (item) =>
        item.id ===
        input.divisionId,
    );

  if (!division) {
    throw new Error(
      'Divisi tidak ditemukan',
    );
  }

  if (
    input.managerId ===
    input.userId
  ) {
    throw new Error(
      'Pengguna tidak dapat menjadi atasan dirinya sendiri',
    );
  }

  const manager =
    input.managerId
      ? mockOrganizationMembers.find(
          (member) =>
            member.id ===
            input.managerId,
        )
      : null;

  if (
    input.managerId &&
    !manager
  ) {
    throw new Error(
      'Atasan tidak ditemukan',
    );
  }

  mockOrganizationMembers[
    memberIndex
  ] = {
    ...mockOrganizationMembers[
      memberIndex
    ],
    divisionId:
      division.id,
    divisionName:
      division.name,
    managerId:
      manager?.id ?? null,
    managerName:
      manager?.name ?? null,
    managerEmail:
      manager?.email ?? null,
  };

  return {
    userId:
      input.userId,
    message:
      'Mapping organisasi berhasil diperbarui',
  };
};

export const getMockLeaveBalances = async (
  year = 2026,
): Promise<LeaveBalanceData> => {
  await delay(500);

  return getLeaveBalanceData(
    year,
  );
};

export const updateMockLeaveBalance = async (
  input: UpdateLeaveBalanceInput,
): Promise<UpdateLeaveBalanceResponse> => {
  await delay(700);

  const balanceIndex =
    mockLeaveBalances.findIndex(
      (balance) =>
        balance.userId ===
          input.userId &&
        balance.year ===
          input.year,
    );

  if (balanceIndex < 0) {
    throw new Error(
      'Data saldo cuti tidak ditemukan',
    );
  }

  if (
    input.amount < 0 ||
    Number.isNaN(
      input.amount,
    )
  ) {
    throw new Error(
      'Jumlah adjustment tidak valid',
    );
  }

  if (
    !input.reason.trim()
  ) {
    throw new Error(
      'Alasan adjustment wajib diisi',
    );
  }

  const currentBalance =
    mockLeaveBalances[
      balanceIndex
    ];

  let adjustmentBalance =
    currentBalance.adjustmentBalance;

  if (
    input.adjustmentType === 'ADD'
  ) {
    adjustmentBalance +=
      input.amount;
  }

  if (
    input.adjustmentType === 'DEDUCT'
  ) {
    adjustmentBalance -=
      input.amount;
  }

  if (
    input.adjustmentType === 'SET'
  ) {
    adjustmentBalance =
      input.amount -
      currentBalance.openingBalance +
      currentBalance.usedBalance;
  }

  const remainingBalance =
    currentBalance.openingBalance +
    adjustmentBalance -
    currentBalance.usedBalance;

  if (remainingBalance < 0) {
    throw new Error(
      'Saldo cuti tidak boleh kurang dari 0',
    );
  }

  mockLeaveBalances[
    balanceIndex
  ] = {
    ...currentBalance,
    adjustmentBalance,
    remainingBalance,
    lastUpdatedAt:
      '17 Agu 2026 • 14:06',
  };

  return {
    userId:
      input.userId,
    message:
      'Saldo cuti berhasil diperbarui',
  };
};

export const getMockTaxConfigurations = async (): Promise<
  TaxConfigurationData
> => {
  await delay(400);

  return {
    configurations:
      structuredClone(
        mockTaxConfigurations,
      ),
  };
};

export const updateMockTaxConfiguration = async (
  input: UpdateTaxConfigurationInput,
): Promise<UpdateTaxConfigurationResponse> => {
  await delay(600);

  const taxIndex =
    mockTaxConfigurations.findIndex(
      (tax) =>
        tax.id === input.id,
    );

  if (taxIndex < 0) {
    throw new Error(
      'Konfigurasi pajak tidak ditemukan',
    );
  }

  if (
    input.rate < 0 ||
    input.rate > 100
  ) {
    throw new Error(
      'Tarif pajak harus antara 0 sampai 100 persen',
    );
  }

  mockTaxConfigurations[
    taxIndex
  ] = {
    ...mockTaxConfigurations[
      taxIndex
    ],
    rate: input.rate,
    isActive: input.isActive,
  };

  return {
    id: input.id,
    message:
      'Konfigurasi pajak berhasil diperbarui',
  };
};