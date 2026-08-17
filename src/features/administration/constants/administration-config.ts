import type {
  UserRole,
  UserStatus,
} from '../types/administration.types';

interface UserRoleConfig {
  label: string;
  description: string;
}

interface UserStatusConfig {
  label: string;
  variant:
    | 'active'
    | 'inactive';
}

export const userRoleConfig: Record<
  UserRole,
  UserRoleConfig
> = {
  USER: {
    label: 'User',
    description:
      'Membuat dan memantau pengajuan sendiri.',
  },
  APPROVER: {
    label: 'Approver',
    description:
      'Melakukan persetujuan atau penolakan pengajuan.',
  },
  PROCESSOR: {
    label: 'Processor',
    description:
      'Memproses pengajuan pada divisi terkait.',
  },
  ADMIN: {
    label: 'Admin',
    description:
      'Mengelola user, role, dan konfigurasi administrasi.',
  },
};

export const userStatusConfig: Record<
  UserStatus,
  UserStatusConfig
> = {
  ACTIVE: {
    label: 'Aktif',
    variant: 'active',
  },
  INACTIVE: {
    label: 'Tidak Aktif',
    variant: 'inactive',
  },
};