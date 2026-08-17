import { z } from 'zod';

export const createLeaveSchema = z
  .object({
    startDate: z
      .string()
      .min(1, 'Tanggal mulai wajib dipilih'),
    endDate: z
      .string()
      .min(1, 'Tanggal selesai wajib dipilih'),
    reason: z
      .string()
      .trim()
      .min(1, 'Alasan cuti wajib diisi')
      .max(
        500,
        'Alasan cuti maksimal 500 karakter',
      ),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) {
        return true;
      }

      return (
        new Date(data.endDate) >=
        new Date(data.startDate)
      );
    },
    {
      message:
        'Tanggal selesai tidak boleh sebelum tanggal mulai',
      path: ['endDate'],
    },
  );

export type CreateLeaveFormValues =
  z.infer<typeof createLeaveSchema>;