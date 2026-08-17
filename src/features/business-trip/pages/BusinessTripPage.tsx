import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  useForm,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import { useCreateBusinessTrip } from '../hooks/useCreateBusinessTrip';

import {
  createBusinessTripSchema,
  type CreateBusinessTripFormValues,
} from '../schemas/create-business-trip.schema';

import {
  calculateTotalEstimate,
  calculateTripDuration,
  formatRupiah,
  formatTripDuration,
  parseRupiahInput,
} from '../utils/business-trip.util';

import styles from './BusinessTripPage.module.css';

function BusinessTripPage() {
  const navigate = useNavigate();

  const {
    createMutation,
    saveDraftMutation,
  } = useCreateBusinessTrip();

  const approverName =
    'Operation Head';

  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    formState: {
      errors,
    },
  } = useForm<CreateBusinessTripFormValues>({
    resolver: zodResolver(
      createBusinessTripSchema,
    ),
    defaultValues: {
      destinationCity: '',
      departureDate: '',
      returnDate: '',
      transportationEstimate: 0,
      accommodationEstimate: 0,
      otherEstimate: 0,
      purpose: '',
    },
  });

  const departureDate =
    watch('departureDate');

  const returnDate =
    watch('returnDate');

  const transportationEstimate =
    watch(
      'transportationEstimate',
    );

  const accommodationEstimate =
    watch(
      'accommodationEstimate',
    );

  const otherEstimate =
    watch(
      'otherEstimate',
    );

  const durationDays =
    useMemo(() => {
      return calculateTripDuration(
        departureDate,
        returnDate,
      );
    }, [
      departureDate,
      returnDate,
    ]);

  const totalEstimate =
    useMemo(() => {
      return calculateTotalEstimate(
        transportationEstimate,
        accommodationEstimate,
        otherEstimate,
      );
    }, [
      transportationEstimate,
      accommodationEstimate,
      otherEstimate,
    ]);

  const isProcessing =
    createMutation.isPending ||
    saveDraftMutation.isPending;

  const mutationError =
    createMutation.error ??
    saveDraftMutation.error;

  const handleSaveDraft = () => {
    const values =
      getValues();

    saveDraftMutation.mutate(
      {
        destinationCity:
          values.destinationCity ||
          undefined,
        departureDate:
          values.departureDate ||
          undefined,
        returnDate:
          values.returnDate ||
          undefined,
        durationDays:
          durationDays > 0
            ? durationDays
            : undefined,
        transportationEstimate:
          values.transportationEstimate,
        accommodationEstimate:
          values.accommodationEstimate,
        otherEstimate:
          values.otherEstimate,
        totalEstimate,
        purpose:
          values.purpose ||
          undefined,
        approverName,
      },
      {
        onSuccess: () => {
          navigate(
            '/hr-services',
          );
        },
      },
    );
  };

  const handleSubmitTrip = (
    values: CreateBusinessTripFormValues,
  ) => {
    createMutation.mutate(
      {
        destinationCity:
          values.destinationCity,
        departureDate:
          values.departureDate,
        returnDate:
          values.returnDate,
        durationDays,
        transportationEstimate:
          values.transportationEstimate,
        accommodationEstimate:
          values.accommodationEstimate,
        otherEstimate:
          values.otherEstimate,
        totalEstimate,
        purpose:
          values.purpose,
        approverName,
      },
      {
        onSuccess: () => {
          navigate(
            '/hr-services',
          );
        },
      },
    );
  };

  return (
    <div className={styles.page}>
      <header
        className={
          styles.pageHeader
        }
      >
        <h1>
          Perjalanan Dinas
        </h1>

        <p>
          Ajukan perjalanan dinas
          dan unggah bukti setelah
          kegiatan.
        </p>
      </header>

      <div
        className={
          styles.contentGrid
        }
      >
        <form
          className={
            styles.formCard
          }
          onSubmit={handleSubmit(
            handleSubmitTrip,
          )}
        >
          <h2>
            Informasi Perjalanan
          </h2>

          <div
            className={
              styles.formGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="destinationCity"
              >
                Kota Tujuan
              </label>

              <input
                id="destinationCity"
                type="text"
                placeholder="Contoh: Bandung, Jawa Barat"
                disabled={
                  isProcessing
                }
                {...register(
                  'destinationCity',
                )}
              />

              {errors.destinationCity && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .destinationCity
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
              <label>
                Durasi
              </label>

              <input
                type="text"
                value={formatTripDuration(
                  durationDays,
                )}
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
              <label
                htmlFor="departureDate"
              >
                Tanggal Berangkat
              </label>

              <input
                id="departureDate"
                type="date"
                disabled={
                  isProcessing
                }
                {...register(
                  'departureDate',
                )}
              />

              {errors.departureDate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .departureDate
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
                htmlFor="returnDate"
              >
                Tanggal Kembali
              </label>

              <input
                id="returnDate"
                type="date"
                disabled={
                  isProcessing
                }
                {...register(
                  'returnDate',
                )}
              />

              {errors.returnDate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .returnDate
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
                htmlFor="transportationEstimate"
              >
                Estimasi Transportasi
              </label>

              <Controller
                name="transportationEstimate"
                control={control}
                render={({ field }) => (
                  <input
                    id="transportationEstimate"
                    type="text"
                    inputMode="numeric"
                    placeholder="Rp0"
                    disabled={
                      isProcessing
                    }
                    value={
                      field.value > 0
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

              {errors.transportationEstimate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .transportationEstimate
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
                htmlFor="accommodationEstimate"
              >
                Estimasi Akomodasi
              </label>

              <Controller
                name="accommodationEstimate"
                control={control}
                render={({ field }) => (
                  <input
                    id="accommodationEstimate"
                    type="text"
                    inputMode="numeric"
                    placeholder="Rp0"
                    disabled={
                      isProcessing
                    }
                    value={
                      field.value > 0
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

              {errors.accommodationEstimate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .accommodationEstimate
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
                htmlFor="otherEstimate"
              >
                Estimasi Lainnya
              </label>

              <Controller
                name="otherEstimate"
                control={control}
                render={({ field }) => (
                  <input
                    id="otherEstimate"
                    type="text"
                    inputMode="numeric"
                    placeholder="Rp0"
                    disabled={
                      isProcessing
                    }
                    value={
                      field.value > 0
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

              {errors.otherEstimate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .otherEstimate
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
              <label>
                Total Estimasi
              </label>

              <input
                type="text"
                value={
                  totalEstimate > 0
                    ? formatRupiah(
                        totalEstimate,
                      )
                    : 'Rp0'
                }
                readOnly
                className={
                  styles.readOnlyInput
                }
              />
            </div>
          </div>

          <div
            className={
              styles.purposeGroup
            }
          >
            <label
              htmlFor="purpose"
            >
              Tujuan Perjalanan
            </label>

            <textarea
              id="purpose"
              rows={4}
              maxLength={500}
              placeholder="Kunjungan dan koordinasi dengan mitra..."
              disabled={
                isProcessing
              }
              {...register(
                'purpose',
              )}
            />

            {errors.purpose && (
              <span
                className={
                  styles.errorText
                }
              >
                {
                  errors
                    .purpose
                    .message
                }
              </span>
            )}
          </div>

          {mutationError && (
            <div
              className={
                styles.submitError
              }
            >
              {getApiErrorMessage(
                mutationError,
                'Pengajuan perjalanan dinas gagal diproses.',
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
                ? 'Mengajukan...'
                : 'Ajukan'}
            </button>
          </div>
        </form>

        <aside
          className={
            styles.infoCard
          }
        >
          <h3>
            Setelah perjalanan
          </h3>

          <p>
            Unggah bukti pembayaran
            dan dokumen perjalanan
            pada halaman detail
            pengajuan.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default BusinessTripPage;