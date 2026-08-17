import { z } from 'zod';

export const createBusinessTripSchema = z
  .object({
    destinationCity: z
      .string()
      .trim()
      .min(1, 'Kota tujuan wajib diisi'),
    departureDate: z
      .string()
      .min(1, 'Tanggal berangkat wajib dipilih'),
    returnDate: z
      .string()
      .min(1, 'Tanggal kembali wajib dipilih'),
    transportationEstimate: z
      .number()
      .min(0, 'Estimasi transportasi tidak valid'),
    accommodationEstimate: z
      .number()
      .min(0, 'Estimasi akomodasi tidak valid'),
    otherEstimate: z
      .number()
      .min(0, 'Estimasi lainnya tidak valid'),
    purpose: z
      .string()
      .trim()
      .min(1, 'Tujuan perjalanan wajib diisi')
      .max(
        500,
        'Tujuan perjalanan maksimal 500 karakter',
      ),
  })
  .refine(
    (data) => {
      if (!data.departureDate || !data.returnDate) {
        return true;
      }

      return new Date(data.returnDate) >= new Date(data.departureDate);
    },
    {
      message: 'Tanggal kembali tidak boleh sebelum tanggal berangkat',
      path: ['returnDate'],
    },
  );

export type CreateBusinessTripFormValues =
  z.infer<typeof createBusinessTripSchema>;