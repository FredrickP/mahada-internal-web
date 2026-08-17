import { z } from 'zod';

export const createPaymentSchema = z.object({
  vendorName: z
    .string()
    .trim()
    .min(1, 'Nama vendor wajib diisi'),
  invoiceNumber: z
    .string()
    .trim()
    .min(1, 'Nomor invoice wajib diisi'),
  recipientName: z
    .string()
    .trim()
    .min(1, 'Nama penerima wajib diisi'),
  destinationAccountNumber: z
    .string()
    .trim()
    .min(1, 'Nomor rekening tujuan wajib diisi'),
  taxInvoiceNumber: z
    .string()
    .trim()
    .optional(),
  invoiceDate: z
    .string()
    .min(1, 'Tanggal invoice wajib dipilih'),
  dppAmount: z
    .number()
    .min(1, 'DPP wajib diisi'),
});

export type CreatePaymentFormValues =
  z.infer<typeof createPaymentSchema>;