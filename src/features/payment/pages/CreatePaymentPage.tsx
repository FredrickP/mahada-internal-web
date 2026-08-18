import {
  useMemo,
  useState,
} from 'react';

import {
  zodResolver,
} from '@hookform/resolvers/zod';

import {
  Controller,
  useForm,
} from 'react-hook-form';

import {
  FileUp,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import {
  useCreatePayment,
} from '../hooks/useCreatePayment';

import {
  createPaymentSchema,
  type CreatePaymentFormValues,
} from '../schemas/create-payment.schema';

import {
  calculatePaymentTotal,
  calculatePphAmount,
  calculatePpnAmount,
  formatRupiah,
  parseRupiahInput,
} from '../utils/payment.util';

import styles from './CreatePaymentPage.module.css';

const RequiredMark = () => {
  return (
    <span
      aria-hidden="true"
      style={{
        marginLeft: '3px',
        color: '#dc2626',
        fontWeight: 700,
      }}
    >
      *
    </span>
  );
};

const FileLabelContent = ({
  fileName,
}: {
  fileName?: string;
}) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
      }}
    >
      <FileUp
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {fileName || 'Pilih dokumen'}
      </span>
    </span>
  );
};

function CreatePaymentPage() {
  const navigate =
    useNavigate();

  const {
    createMutation,
    saveDraftMutation,
  } = useCreatePayment();

  const [
    invoiceFile,
    setInvoiceFile,
  ] = useState<File | null>(
    null,
  );

  const [
    quotationFile,
    setQuotationFile,
  ] = useState<File | null>(
    null,
  );

  const [
    otherDocumentFile,
    setOtherDocumentFile,
  ] = useState<File | null>(
    null,
  );

  const [
    invoiceError,
    setInvoiceError,
  ] = useState('');

  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    formState: {
      errors,
    },
  } = useForm<CreatePaymentFormValues>({
    resolver:
      zodResolver(
        createPaymentSchema,
      ),
    defaultValues: {
      vendorName: '',
      invoiceNumber: '',
      recipientName: '',
      destinationAccountNumber: '',
      taxInvoiceNumber: '',
      invoiceDate: '',
      dppAmount: 0,
    },
  });

  const dppAmount =
    watch(
      'dppAmount',
    );

  const ppnAmount =
    useMemo(
      () => {
        return calculatePpnAmount(
          dppAmount,
        );
      },
      [
        dppAmount,
      ],
    );

  const pphAmount =
    useMemo(
      () => {
        return calculatePphAmount(
          dppAmount,
        );
      },
      [
        dppAmount,
      ],
    );

  const totalAmount =
    useMemo(
      () => {
        return calculatePaymentTotal(
          dppAmount,
          ppnAmount,
          pphAmount,
        );
      },
      [
        dppAmount,
        ppnAmount,
        pphAmount,
      ],
    );

  const isProcessing =
    createMutation.isPending ||
    saveDraftMutation.isPending;

  const mutationError =
    createMutation.error ??
    saveDraftMutation.error;

  const handleInvoiceChange = (
    file: File | null,
  ) => {
    setInvoiceFile(
      file,
    );

    if (
      file
    ) {
      setInvoiceError(
        '',
      );
    }
  };

  const handleSaveDraft = () => {
    const values =
      getValues();

    saveDraftMutation.mutate(
      {
        vendorName:
          values.vendorName ||
          undefined,
        invoiceNumber:
          values.invoiceNumber ||
          undefined,
        recipientName:
          values.recipientName ||
          undefined,
        destinationAccountNumber:
          values.destinationAccountNumber ||
          undefined,
        taxInvoiceNumber:
          values.taxInvoiceNumber ||
          undefined,
        invoiceDate:
          values.invoiceDate ||
          undefined,
        dppAmount:
          values.dppAmount,
        ppnAmount,
        pphAmount,
        totalAmount,
        invoiceFile:
          invoiceFile ||
          undefined,
        quotationFile:
          quotationFile ||
          undefined,
        otherDocumentFile:
          otherDocumentFile ||
          undefined,
      },
      {
        onSuccess: () => {
          navigate(
            '/payment',
          );
        },
      },
    );
  };

  const handleSubmitPayment = (
    values: CreatePaymentFormValues,
  ) => {
    if (
      !invoiceFile
    ) {
      setInvoiceError(
        'Invoice wajib diunggah',
      );

      return;
    }

    setInvoiceError(
      '',
    );

    createMutation.mutate(
      {
        vendorName:
          values.vendorName,
        invoiceNumber:
          values.invoiceNumber,
        recipientName:
          values.recipientName,
        destinationAccountNumber:
          values.destinationAccountNumber,
        taxInvoiceNumber:
          values.taxInvoiceNumber,
        invoiceDate:
          values.invoiceDate,
        dppAmount:
          values.dppAmount,
        ppnAmount,
        pphAmount,
        totalAmount,
        invoiceFile,
        quotationFile:
          quotationFile ||
          undefined,
        otherDocumentFile:
          otherDocumentFile ||
          undefined,
      },
      {
        onSuccess: () => {
          navigate(
            '/payment',
          );
        },
      },
    );
  };

  return (
    <div
      className={
        styles.page
      }
    >
      <header
        className={
          styles.pageHeader
        }
      >
        <h1>
          Buat Pengajuan Pembayaran
        </h1>

        <p>
          Isi data invoice, pajak,
          dan rekening tujuan.
        </p>
      </header>

      <form
        className={
          styles.formCard
        }
        onSubmit={
          handleSubmit(
            handleSubmitPayment,
          )
        }
      >
        <section>
          <h2>
            Informasi Vendor & Invoice
          </h2>

          <div
            className={
              styles.vendorGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="vendorName"
              >
                Nama Vendor
                <RequiredMark />
              </label>

              <input
                id="vendorName"
                type="text"
                placeholder="Nama vendor"
                disabled={
                  isProcessing
                }
                {...register(
                  'vendorName',
                )}
              />

              {errors.vendorName && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.vendorName.message
                  }
                </span>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="invoiceNumber"
              >
                No. Invoice
                <RequiredMark />
              </label>

              <input
                id="invoiceNumber"
                type="text"
                placeholder="Nomor invoice"
                disabled={
                  isProcessing
                }
                {...register(
                  'invoiceNumber',
                )}
              />

              {errors.invoiceNumber && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.invoiceNumber.message
                  }
                </span>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="recipientName"
              >
                Nama Penerima
                <RequiredMark />
              </label>

              <input
                id="recipientName"
                type="text"
                placeholder="Nama penerima"
                disabled={
                  isProcessing
                }
                {...register(
                  'recipientName',
                )}
              />

              {errors.recipientName && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.recipientName.message
                  }
                </span>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="destinationAccountNumber"
              >
                Nomor Rekening Tujuan
                <RequiredMark />
              </label>

              <input
                id="destinationAccountNumber"
                type="text"
                inputMode="numeric"
                placeholder="Nomor rekening"
                disabled={
                  isProcessing
                }
                {...register(
                  'destinationAccountNumber',
                )}
              />

              {errors.destinationAccountNumber && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .destinationAccountNumber
                      .message
                  }
                </span>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="taxInvoiceNumber"
              >
                No. Faktur Pajak
              </label>

              <input
                id="taxInvoiceNumber"
                type="text"
                placeholder="Nomor faktur pajak"
                disabled={
                  isProcessing
                }
                {...register(
                  'taxInvoiceNumber',
                )}
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="invoiceDate"
              >
                Tanggal Invoice
                <RequiredMark />
              </label>

              <input
                id="invoiceDate"
                type="date"
                disabled={
                  isProcessing
                }
                {...register(
                  'invoiceDate',
                )}
              />

              {errors.invoiceDate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.invoiceDate.message
                  }
                </span>
              )}
            </div>
          </div>
        </section>

        <section
          className={
            styles.paymentSection
          }
        >
          <h2>
            Perhitungan Pembayaran
          </h2>

          <div
            className={
              styles.paymentGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="dppAmount"
              >
                DPP
                <RequiredMark />
              </label>

              <Controller
                name="dppAmount"
                control={
                  control
                }
                render={({
                  field,
                }) => (
                  <input
                    id="dppAmount"
                    type="text"
                    inputMode="numeric"
                    placeholder="Rp0"
                    disabled={
                      isProcessing
                    }
                    value={
                      field.value >
                      0
                        ? formatRupiah(
                            field.value,
                          )
                        : ''
                    }
                    onBlur={
                      field.onBlur
                    }
                    onChange={(
                      event,
                    ) => {
                      field.onChange(
                        parseRupiahInput(
                          event
                            .target
                            .value,
                        ),
                      );
                    }}
                  />
                )}
              />

              {errors.dppAmount && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.dppAmount.message
                  }
                </span>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                PPN
              </label>

              <input
                type="text"
                value={
                  formatRupiah(
                    ppnAmount,
                  )
                }
                readOnly
                className={
                  styles.readOnlyInput
                }
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                PPh
              </label>

              <input
                type="text"
                value={
                  formatRupiah(
                    pphAmount,
                  )
                }
                readOnly
                className={
                  styles.readOnlyInput
                }
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Total Pembayaran
              </label>

              <input
                type="text"
                value={
                  formatRupiah(
                    totalAmount,
                  )
                }
                readOnly
                className={
                  styles.readOnlyInput
                }
              />
            </div>
          </div>

          <p
            className={
              styles.taxInformation
            }
          >
            Nilai pajak dihitung otomatis sesuai
            konfigurasi Finance yang berlaku.
          </p>
        </section>

        <section
          className={
            styles.documentSection
          }
        >
          <div
            className={
              styles.documentGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Invoice
                <RequiredMark />
              </label>

              <label
                className={
                  styles.fileField
                }
              >
                <FileLabelContent
                  fileName={
                    invoiceFile?.name
                  }
                />

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={
                    isProcessing
                  }
                  onChange={(
                    event,
                  ) => {
                    handleInvoiceChange(
                      event.target
                        .files?.[0] ??
                        null,
                    );
                  }}
                />
              </label>

              {invoiceError && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    invoiceError
                  }
                </span>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Quotation / PO
                {' '}
                <span
                  style={{
                    color:
                      '#94a3b8',
                    fontWeight:
                      400,
                  }}
                >
                  (Opsional)
                </span>
              </label>

              <label
                className={
                  styles.fileField
                }
              >
                <FileLabelContent
                  fileName={
                    quotationFile?.name
                  }
                />

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={
                    isProcessing
                  }
                  onChange={(
                    event,
                  ) => {
                    setQuotationFile(
                      event.target
                        .files?.[0] ??
                        null,
                    );
                  }}
                />
              </label>
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Dokumen Lain
                {' '}
                <span
                  style={{
                    color:
                      '#94a3b8',
                    fontWeight:
                      400,
                  }}
                >
                  (Opsional)
                </span>
              </label>

              <label
                className={
                  styles.fileField
                }
              >
                <FileLabelContent
                  fileName={
                    otherDocumentFile?.name
                  }
                />

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={
                    isProcessing
                  }
                  onChange={(
                    event,
                  ) => {
                    setOtherDocumentFile(
                      event.target
                        .files?.[0] ??
                        null,
                    );
                  }}
                />
              </label>
            </div>
          </div>
        </section>

        {mutationError && (
          <div
            className={
              styles.submitError
            }
          >
            {getApiErrorMessage(
              mutationError,
              'Pengajuan pembayaran gagal diproses.',
            )}
          </div>
        )}

        <div
          className={
            styles.formActions
          }
        >
          <button
            type="button"
            className={
              styles.draftButton
            }
            disabled={
              isProcessing
            }
            onClick={
              handleSaveDraft
            }
          >
            {saveDraftMutation.isPending
              ? 'Menyimpan...'
              : 'Simpan Draft'}
          </button>

          <button
            type="submit"
            className={
              styles.submitButton
            }
            disabled={
              isProcessing
            }
          >
            {createMutation.isPending
              ? 'Mengirim...'
              : 'Kirim Pengajuan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePaymentPage;