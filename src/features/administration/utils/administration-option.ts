import type {
  UserRole,
  UserStatus,
} from '../types/administration.types';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const divisionOptions = [
  'Information Technology',
  'Human Capital & General Affairs',
  'Finance, Accounting and Tax',
  'Operation',
  'Sales & Marketing',
  'Risk & Compliance',
  'Board of Directors',
] as const;

export const roleOptions: SelectOption<UserRole>[] = [
  {
    value: 'USER',
    label: 'User',
  },
  {
    value: 'APPROVER',
    label: 'Approver',
  },
  {
    value: 'PROCESSOR',
    label: 'Processor',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
  },
];

export const statusOptions: SelectOption<UserStatus>[] = [
  {
    value: 'ACTIVE',
    label: 'Aktif',
  },
  {
    value: 'INACTIVE',
    label: 'Tidak Aktif',
  },
];