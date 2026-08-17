import {
  useMemo,
  useState,
} from 'react';

import {
  CalendarDays,
  CircleAlert,
  Clock3,
  Users,
  X,
} from 'lucide-react';

import Pagination, {
  type PaginationPageSize,
} from '../../../components/common/Pagination';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  useLeaveBalance,
  useUpdateLeaveBalance,
} from '../hooks/useLeaveBalance';

import type {
  LeaveBalanceAdjustmentType,
  LeaveBalanceRecord,
} from '../types/administration.types';

import styles from './LeaveBalancePage.module.css';

interface LeaveBalanceFilter {
  keyword: string;
  division: string;
}

const initialFilter: LeaveBalanceFilter = {
  keyword: '',
  division: '',
};

const adjustmentTypeOptions: {
  value: LeaveBalanceAdjustmentType;
  label: string;
}[] = [
  {
    value: 'ADD',
    label: 'Tambah Saldo',
  },
  {
    value: 'DEDUCT',
    label: 'Kurangi Saldo',
  },
  {
    value: 'SET',
    label: 'Set Saldo Akhir',
  },
];

function LeaveBalancePage() {
  const [year, setYear] =
    useState(2026);

  const leaveBalanceQuery =
    useLeaveBalance(
      year,
    );

  const updateBalanceMutation =
    useUpdateLeaveBalance();

  const [
    formFilter,
    setFormFilter,
  ] = useState<LeaveBalanceFilter>(
    initialFilter,
  );

  const [
    appliedFilter,
    setAppliedFilter,
  ] = useState<LeaveBalanceFilter>(
    initialFilter,
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState<PaginationPageSize>(
    10,
  );

  const [
    selectedBalance,
    setSelectedBalance,
  ] = useState<LeaveBalanceRecord | null>(
    null,
  );

  const [
    adjustmentType,
    setAdjustmentType,
  ] = useState<LeaveBalanceAdjustmentType>(
    'ADD',
  );

  const [
    amount,
    setAmount,
  ] = useState('');

  const [
    reason,
    setReason,
  ] = useState('');

  const [
    validationError,
    setValidationError,
  ] = useState('');

  const divisionOptions =
    useMemo(() => {
      if (!leaveBalanceQuery.data) {
        return [];
      }

      return [
        ...new Set(
          leaveBalanceQuery.data.balances.map(
            (balance) =>
              balance.division,
          ),
        ),
      ].sort();
    }, [
      leaveBalanceQuery.data,
    ]);

  const filteredBalances =
    useMemo(() => {
      if (!leaveBalanceQuery.data) {
        return [];
      }

      const keyword =
        appliedFilter.keyword
          .trim()
          .toLowerCase();

      return leaveBalanceQuery.data.balances.filter(
        (balance) => {
          const matchesKeyword =
            !keyword ||
            balance.name
              .toLowerCase()
              .includes(keyword) ||
            balance.email
              .toLowerCase()
              .includes(keyword);

          const matchesDivision =
            !appliedFilter.division ||
            balance.division ===
              appliedFilter.division;

          return (
            matchesKeyword &&
            matchesDivision
          );
        },
      );
    }, [
      appliedFilter,
      leaveBalanceQuery.data,
    ]);

  const paginatedBalances =
    useMemo(() => {
      if (
        pageSize === 'ALL'
      ) {
        return filteredBalances;
      }

      const startIndex =
        (
          currentPage -
          1
        ) *
        pageSize;

      return filteredBalances.slice(
        startIndex,
        startIndex +
          pageSize,
      );
    }, [
      filteredBalances,
      currentPage,
      pageSize,
    ]);

  const previewRemainingBalance =
    useMemo(() => {
      if (!selectedBalance) {
        return 0;
      }

      const numericAmount =
        Number(amount);

      if (
        amount === '' ||
        Number.isNaN(
          numericAmount,
        )
      ) {
        return selectedBalance.remainingBalance;
      }

      if (
        adjustmentType === 'ADD'
      ) {
        return (
          selectedBalance.remainingBalance +
          numericAmount
        );
      }

      if (
        adjustmentType === 'DEDUCT'
      ) {
        return (
          selectedBalance.remainingBalance -
          numericAmount
        );
      }

      return numericAmount;
    }, [
      adjustmentType,
      amount,
      selectedBalance,
    ]);

  const handleFilter = () => {
    setAppliedFilter({
      ...formFilter,
    });

    setCurrentPage(
      1,
    );
  };

  const handleResetFilter = () => {
    setFormFilter(
      initialFilter,
    );

    setAppliedFilter(
      initialFilter,
    );

    setCurrentPage(
      1,
    );
  };

  const handlePageSizeChange = (
    value: PaginationPageSize,
  ) => {
    setPageSize(
      value,
    );

    setCurrentPage(
      1,
    );
  };

  const handleOpenAdjustment = (
    balance: LeaveBalanceRecord,
  ) => {
    updateBalanceMutation.reset();

    setSelectedBalance(
      balance,
    );

    setAdjustmentType(
      'ADD',
    );

    setAmount('');

    setReason('');

    setValidationError('');
  };

  const handleCloseAdjustment = () => {
    if (
      updateBalanceMutation.isPending
    ) {
      return;
    }

    setSelectedBalance(
      null,
    );

    setAmount('');

    setReason('');

    setValidationError('');

    updateBalanceMutation.reset();
  };

  const validateAdjustment = () => {
    const numericAmount =
      Number(amount);

    if (
      amount.trim() === '' ||
      Number.isNaN(
        numericAmount,
      )
    ) {
      setValidationError(
        'Jumlah saldo wajib diisi.',
      );

      return false;
    }

    if (
      numericAmount < 0
    ) {
      setValidationError(
        'Jumlah saldo tidak boleh kurang dari 0.',
      );

      return false;
    }

    if (
      adjustmentType !== 'SET' &&
      numericAmount === 0
    ) {
      setValidationError(
        'Jumlah adjustment harus lebih dari 0.',
      );

      return false;
    }

    if (
      previewRemainingBalance < 0
    ) {
      setValidationError(
        'Saldo akhir tidak boleh kurang dari 0.',
      );

      return false;
    }

    if (
      !reason.trim()
    ) {
      setValidationError(
        'Alasan adjustment wajib diisi.',
      );

      return false;
    }

    setValidationError('');

    return true;
  };

  const handleSaveAdjustment = () => {
    if (
      !selectedBalance ||
      !validateAdjustment()
    ) {
      return;
    }

    updateBalanceMutation.mutate(
      {
        userId:
          selectedBalance.userId,
        year:
          selectedBalance.year,
        adjustmentType,
        amount:
          Number(amount),
        reason:
          reason.trim(),
      },
      {
        onSuccess: () => {
          setSelectedBalance(
            null,
          );

          setAmount('');

          setReason('');

          setValidationError('');
        },
      },
    );
  };

  if (
    leaveBalanceQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat saldo cuti...
      </div>
    );
  }

  if (
    leaveBalanceQuery.isError ||
    !leaveBalanceQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            leaveBalanceQuery.error,
            'Data saldo cuti gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            leaveBalanceQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const {
    summary,
  } = leaveBalanceQuery.data;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>
            Saldo Cuti
          </h1>

          <p>
            Kelola saldo cuti tahunan
            dan penyesuaian saldo
            karyawan.
          </p>
        </div>

        <div className={styles.yearField}>
          <label htmlFor="leave-year">
            Tahun
          </label>

          <select
            id="leave-year"
            value={year}
            onChange={(event) => {
              setYear(
                Number(
                  event.target.value,
                ),
              );

              setCurrentPage(
                1,
              );
            }}
          >
            <option value={2026}>
              2026
            </option>
          </select>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="gold"
          >
            <Users
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Total Karyawan
            </span>

            <strong>
              {
                summary.totalEmployees
              }
            </strong>

            <small>
              Data saldo cuti
            </small>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="blue"
          >
            <CalendarDays
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Total Dialokasikan
            </span>

            <strong>
              {
                summary.totalAllocated
              }
            </strong>

            <small>
              Hari
            </small>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="orange"
          >
            <Clock3
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Terpakai
            </span>

            <strong>
              {
                summary.totalUsed
              }
            </strong>

            <small>
              Hari
            </small>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="green"
          >
            <CalendarDays
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Total Tersisa
            </span>

            <strong>
              {
                summary.totalRemaining
              }
            </strong>

            <small>
              Hari
            </small>
          </div>
        </article>
      </section>

      {summary.lowBalanceEmployees > 0 && (
        <div className={styles.balanceNotice}>
          <CircleAlert
            size={17}
            strokeWidth={1.8}
          />

          <span>
            {
              summary.lowBalanceEmployees
            }{' '}
            karyawan memiliki saldo
            cuti rendah.
          </span>
        </div>
      )}

      {updateBalanceMutation.isSuccess && (
        <div className={styles.successMessage}>
          {
            updateBalanceMutation.data.message
          }
        </div>
      )}

      <section className={styles.balanceSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>
              Saldo Cuti Karyawan
            </h2>

            <p>
              Pantau saldo awal,
              adjustment, pemakaian,
              dan sisa cuti.
            </p>
          </div>
        </div>

        <div className={styles.filterCard}>
          <div className={styles.filterGrid}>
            <input
              type="text"
              placeholder="Cari nama atau email"
              value={formFilter.keyword}
              onChange={(event) => {
                setFormFilter(
                  (current) => ({
                    ...current,
                    keyword:
                      event.target.value,
                  }),
                );
              }}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter'
                ) {
                  handleFilter();
                }
              }}
            />

            <select
              value={formFilter.division}
              onChange={(event) => {
                setFormFilter(
                  (current) => ({
                    ...current,
                    division:
                      event.target.value,
                  }),
                );
              }}
            >
              <option value="">
                Semua divisi
              </option>

              {divisionOptions.map(
                (division) => (
                  <option
                    key={division}
                    value={division}
                  >
                    {division}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              className={styles.filterButton}
              onClick={handleFilter}
            >
              Filter
            </button>

            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetFilter}
            >
              Reset
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Divisi</th>
                <th>Saldo Awal</th>
                <th>Adjustment</th>
                <th>Terpakai</th>
                <th>Sisa</th>
                <th>Update Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBalances.map(
                (balance) => (
                  <tr
                    key={
                      balance.userId
                    }
                  >
                    <td>
                      <div className={styles.userIdentity}>
                        <strong>
                          {balance.name}
                        </strong>

                        <span>
                          {balance.email}
                        </span>
                      </div>
                    </td>

                    <td>
                      {balance.division}
                    </td>

                    <td>
                      <span className={styles.balanceValue}>
                        {
                          balance.openingBalance
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={styles.adjustmentValue}
                        data-negative={
                          balance.adjustmentBalance <
                          0
                        }
                      >
                        {balance.adjustmentBalance >
                          0 && '+'}

                        {
                          balance.adjustmentBalance
                        }
                      </span>
                    </td>

                    <td>
                      <span className={styles.usedValue}>
                        {
                          balance.usedBalance
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={styles.remainingBadge}
                        data-low={
                          balance.remainingBalance <=
                          3
                        }
                      >
                        {
                          balance.remainingBalance
                        }{' '}
                        hari
                      </span>
                    </td>

                    <td>
                      <span className={styles.updatedAt}>
                        {
                          balance.lastUpdatedAt
                        }
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.adjustButton}
                        disabled={
                          balance.status ===
                          'INACTIVE'
                        }
                        onClick={() => {
                          handleOpenAdjustment(
                            balance,
                          );
                        }}
                      >
                        Atur
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {filteredBalances.length === 0 && (
            <div className={styles.emptyState}>
              Tidak ada data saldo cuti
              yang sesuai dengan filter.
            </div>
          )}
        </div>

        {filteredBalances.length >
          0 && (
          <Pagination
            currentPage={
              currentPage
            }
            totalItems={
              filteredBalances.length
            }
            pageSize={
              pageSize
            }
            onPageChange={
              setCurrentPage
            }
            onPageSizeChange={
              handlePageSizeChange
            }
          />
        )}
      </section>

      {selectedBalance && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseAdjustment();
            }
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adjustment-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 id="adjustment-title">
                  Penyesuaian Saldo Cuti
                </h2>

                <p>
                  Atur saldo cuti
                  karyawan sesuai
                  kebutuhan HCGA.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                disabled={
                  updateBalanceMutation.isPending
                }
                onClick={
                  handleCloseAdjustment
                }
              >
                <X
                  size={18}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className={styles.employeeCard}>
              <div>
                <strong>
                  {
                    selectedBalance.name
                  }
                </strong>

                <span>
                  {
                    selectedBalance.email
                  }
                </span>
              </div>

              <div className={styles.employeeBalance}>
                <span>
                  Saldo Saat Ini
                </span>

                <strong>
                  {
                    selectedBalance.remainingBalance
                  }{' '}
                  hari
                </strong>
              </div>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="adjustment-type">
                  Tipe Penyesuaian
                </label>

                <select
                  id="adjustment-type"
                  value={
                    adjustmentType
                  }
                  disabled={
                    updateBalanceMutation.isPending
                  }
                  onChange={(event) => {
                    setAdjustmentType(
                      event.target
                        .value as LeaveBalanceAdjustmentType,
                    );

                    setValidationError(
                      '',
                    );
                  }}
                >
                  {adjustmentTypeOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="adjustment-amount">
                  {adjustmentType === 'SET'
                    ? 'Saldo Akhir'
                    : 'Jumlah Hari'}
                </label>

                <div className={styles.amountInput}>
                  <input
                    id="adjustment-amount"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={amount}
                    disabled={
                      updateBalanceMutation.isPending
                    }
                    onChange={(event) => {
                      setAmount(
                        event.target.value,
                      );

                      setValidationError(
                        '',
                      );
                    }}
                  />

                  <span>
                    hari
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="adjustment-reason">
                  Alasan Penyesuaian
                </label>

                <textarea
                  id="adjustment-reason"
                  rows={4}
                  placeholder="Contoh: Penambahan saldo cuti berdasarkan kebijakan HCGA"
                  value={reason}
                  disabled={
                    updateBalanceMutation.isPending
                  }
                  onChange={(event) => {
                    setReason(
                      event.target.value,
                    );

                    setValidationError(
                      '',
                    );
                  }}
                />
              </div>

              <div className={styles.previewCard}>
                <span>
                  Preview Saldo Akhir
                </span>

                <strong
                  data-invalid={
                    previewRemainingBalance <
                    0
                  }
                >
                  {
                    previewRemainingBalance
                  }{' '}
                  hari
                </strong>
              </div>

              {validationError && (
                <div className={styles.modalError}>
                  {validationError}
                </div>
              )}

              {updateBalanceMutation.isError && (
                <div className={styles.modalError}>
                  {getApiErrorMessage(
                    updateBalanceMutation.error,
                    'Saldo cuti gagal diperbarui.',
                  )}
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                disabled={
                  updateBalanceMutation.isPending
                }
                onClick={
                  handleCloseAdjustment
                }
              >
                Batal
              </button>

              <button
                type="button"
                className={styles.saveButton}
                disabled={
                  updateBalanceMutation.isPending
                }
                onClick={
                  handleSaveAdjustment
                }
              >
                {updateBalanceMutation.isPending
                  ? 'Menyimpan...'
                  : 'Simpan Penyesuaian'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveBalancePage;