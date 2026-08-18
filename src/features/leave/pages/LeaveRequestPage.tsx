import {
  useMemo,
} from 'react';

import {
  zodResolver,
} from '@hookform/resolvers/zod';

import {
  useForm,
} from 'react-hook-form';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import {
  useCreateLeaveRequest,
} from '../hooks/useCreateLeaveRequest';

import {
  useHRServices,
} from '../hooks/useHRServices';

import {
  createLeaveSchema,
  type CreateLeaveFormValues,
} from '../schemas/create-leave.schema';

import {
  calculateWorkingDays,
  formatWorkingDays,
} from '../utils/leave-date';

import styles from './LeaveRequestPage.module.css';

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

function LeaveRequestPage() {
  const navigate =
    useNavigate();

  const hrServicesQuery =
    useHRServices();

  const {
    createMutation,
    saveDraftMutation,
  } = useCreateLeaveRequest();

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setError,
    formState: {
      errors,
    },
  } = useForm<CreateLeaveFormValues>({
    resolver:
      zodResolver(
        createLeaveSchema,
      ),
    defaultValues: {
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const startDate =
    watch(
      'startDate',
    );

  const endDate =
    watch(
      'endDate',
    );

  const workingDays =
    useMemo(
      () => {
        return calculateWorkingDays(
          startDate,
          endDate,
        );
      },
      [
        startDate,
        endDate,
      ],
    );

  const remainingDays =
    hrServicesQuery.data
      ?.leaveBalance
      .remainingDays ?? 0;

  /*
   * Untuk demo sementara.
   * Nanti production value ini
   * berasal dari backend berdasarkan
   * user dan struktur approver.
   */
  const approverName =
    'Information Technology Head';

  const isProcessing =
    createMutation.isPending ||
    saveDraftMutation.isPending;

  const mutationError =
    createMutation.error ??
    saveDraftMutation.error;

  const validateLeaveBalance =
    () => {
      if (
        !startDate ||
        !endDate
      ) {
        return true;
      }

      if (
        workingDays <= 0
      ) {
        setError(
          'endDate',
          {
            message:
              'Periode cuti tidak memiliki hari kerja',
          },
        );

        return false;
      }

      if (
        workingDays >
        remainingDays
      ) {
        setError(
          'endDate',
          {
            message:
              'Jumlah hari cuti melebihi sisa cuti',
          },
        );

        return false;
      }

      return true;
    };

  const handleSaveDraft =
    () => {
      const values =
        getValues();

      saveDraftMutation.mutate(
        {
          startDate:
            values.startDate ||
            undefined,
          endDate:
            values.endDate ||
            undefined,
          workingDays:
            workingDays > 0
              ? workingDays
              : undefined,
          reason:
            values.reason ||
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

  const handleSubmitLeave = (
    values:
      CreateLeaveFormValues,
  ) => {
    if (
      !validateLeaveBalance()
    ) {
      return;
    }

    createMutation.mutate(
      {
        startDate:
          values.startDate,
        endDate:
          values.endDate,
        workingDays,
        reason:
          values.reason,
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

  if (
    hrServicesQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat data cuti...
      </div>
    );
  }

  if (
    hrServicesQuery.isError ||
    !hrServicesQuery.data
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        <p>
          {getApiErrorMessage(
            hrServicesQuery.error,
            'Data cuti gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={
            styles.retryButton
          }
          onClick={() =>
            hrServicesQuery.refetch()
          }
        >
          Coba Lagi
        </button>
      </div>
    );
  }

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
          Pengajuan Cuti
        </h1>

        <p>
          Ajukan cuti tahunan
          dan pantau proses
          persetujuan.
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
          onSubmit={
            handleSubmit(
              handleSubmitLeave,
            )
          }
        >
          <h2>
            Detail Pengajuan
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
              <label>
                Jenis Cuti
              </label>

              <input
                type="text"
                value="Cuti Tahunan"
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
                Sisa Cuti
              </label>

              <input
                type="text"
                value={`${remainingDays} Hari`}
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
                htmlFor="startDate"
              >
                Tanggal Mulai
                <RequiredMark />
              </label>

              <input
                id="startDate"
                type="date"
                disabled={
                  isProcessing
                }
                {...register(
                  'startDate',
                )}
              />

              {errors.startDate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .startDate
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
                htmlFor="endDate"
              >
                Tanggal Selesai
                <RequiredMark />
              </label>

              <input
                id="endDate"
                type="date"
                disabled={
                  isProcessing
                }
                {...register(
                  'endDate',
                )}
              />

              {errors.endDate && (
                <span
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors
                      .endDate
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
                Jumlah Hari
              </label>

              <input
                type="text"
                value={
                  formatWorkingDays(
                    workingDays,
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
                Approver
              </label>

              <input
                type="text"
                value={
                  approverName
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
              styles.reasonGroup
            }
          >
            <label
              htmlFor="reason"
            >
              Alasan Cuti
              <RequiredMark />
            </label>

            <textarea
              id="reason"
              rows={5}
              placeholder="Tuliskan alasan pengajuan cuti..."
              disabled={
                isProcessing
              }
              {...register(
                'reason',
              )}
            />

            <div
              className={
                styles.reasonFooter
              }
            >
              <span
                className={
                  styles.errorText
                }
              >
                {
                  errors.reason
                    ?.message
                }
              </span>

              <span
                className={
                  styles.characterCount
                }
              >
                {
                  watch(
                    'reason',
                  ).length
                }
                /500
              </span>
            </div>
          </div>

          {mutationError && (
            <div
              className={
                styles.submitError
              }
            >
              {getApiErrorMessage(
                mutationError,
                'Pengajuan cuti gagal diproses.',
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
                : 'Ajukan Cuti'}
            </button>
          </div>
        </form>

        <aside
          className={
            styles.infoCard
          }
        >
          <h3>
            Perhitungan otomatis
          </h3>

          <p>
            Sistem menghitung hari
            kerja dan mengurangi saldo
            setelah disetujui oleh
            Head/Manager serta
            diverifikasi HC.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default LeaveRequestPage;