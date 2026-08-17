import { z } from 'zod';

export const userRoleSchema = z.enum([
  'USER',
  'APPROVER',
  'PROCESSOR',
  'ADMIN',
]);

export const userStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
]);

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama user wajib diisi')
    .max(100, 'Nama user maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  division: z
    .string()
    .trim()
    .min(1, 'Divisi wajib dipilih'),
  position: z
    .string()
    .trim()
    .min(1, 'Jabatan wajib diisi'),
  role: userRoleSchema,
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama user wajib diisi')
    .max(100, 'Nama user maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  division: z
    .string()
    .trim()
    .min(1, 'Divisi wajib dipilih'),
  position: z
    .string()
    .trim()
    .min(1, 'Jabatan wajib diisi'),
  role: userRoleSchema,
  status: userStatusSchema,
});

export type CreateUserFormValues =
  z.infer<typeof createUserSchema>;

export type UpdateUserFormValues =
  z.infer<typeof updateUserSchema>;