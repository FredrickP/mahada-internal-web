import { z } from 'zod';

export const createITRequestSchema = z.object({
  type: z.enum(
    [
      'REQUEST',
      'CHANGE',
      'INCIDENT',
    ],
    {
      message: 'Jenis request wajib dipilih',
    },
  ),

  title: z
    .string()
    .trim()
    .min(
      1,
      'Judul request wajib diisi',
    ),

  description: z
    .string()
    .trim()
    .min(
      1,
      'Deskripsi masalah atau kebutuhan wajib diisi',
    ),

  priority: z.enum(
    [
      'LOW',
      'MEDIUM',
      'HIGH',
    ],
    {
      message: 'Prioritas wajib dipilih',
    },
  ),
});

export type CreateITRequestFormValues =
  z.infer<typeof createITRequestSchema>;