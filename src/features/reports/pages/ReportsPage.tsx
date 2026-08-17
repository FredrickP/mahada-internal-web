import {
  useMemo,
  useState,
} from 'react';

import { Download } from 'lucide-react';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  reportModuleConfig,
  reportStatusConfig,
} from '../constants/report-config';

import { useExportReport } from '../hooks/useExportReport';
import { useReports } from '../hooks/useReports';

import type {
  ReportFilter,
  ReportModule,
} from '../types/report.types';

import styles from './ReportsPage.module.css';

const initialFilter: ReportFilter = {
  dateFrom: '2026-08-01',
  dateTo: '2026-08-31',
  module: 'ALL',
};

function ReportsPage() {
  const [formFilter, setFormFilter] =
    useState<ReportFilter>(
      initialFilter,
    );

  const [appliedFilter, setAppliedFilter] =
    useState<ReportFilter>(
      initialFilter,
    );

  const [filterError, setFilterError] =
    useState('');

  const reportsQuery =
    useReports(appliedFilter);

  const exportMutation =
    useExportReport();

  const handleFilterChange = (
    field: keyof ReportFilter,
    value: string,
  ) => {
    setFormFilter((current) => {
      return {
        ...current,
        [field]: value,
      };
    });

    if (filterError) {
      setFilterError('');
    }
  };

  const validateFilter = (): boolean => {
    if (
      !formFilter.dateFrom ||
      !formFilter.dateTo
    ) {
      setFilterError(
        'Tanggal mulai dan tanggal akhir wajib diisi.',
      );

      return false;
    }

    if (
      formFilter.dateFrom >
      formFilter.dateTo
    ) {
      setFilterError(
        'Tanggal mulai tidak boleh melewati tanggal akhir.',
      );

      return false;
    }

    return true;
  };

  const handleApplyFilter = () => {
    if (!validateFilter()) {
      return;
    }

    setAppliedFilter({
      ...formFilter,
    });
  };

  const handleExport = () => {
    if (!validateFilter()) {
      return;
    }

    exportMutation.mutate({
      dateFrom:
        formFilter.dateFrom,
      dateTo:
        formFilter.dateTo,
      module:
        formFilter.module,
    });
  };

  const reportData =
    reportsQuery.data;

  const maxModuleTotal =
    useMemo(() => {
      if (
        !reportData ||
        reportData.moduleStatistics
          .length === 0
      ) {
        return 1;
      }

      return Math.max(
        ...reportData.moduleStatistics.map(
          (item) => item.total,
        ),
      );
    }, [
      reportData,
    ]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>
          Reports & Export
        </h1>

        <p>
          Pantau ringkasan pengajuan
          dan export laporan sesuai
          periode yang dibutuhkan.
        </p>
      </header>

      <section className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="dateFrom">
              Tanggal Mulai
            </label>

            <input
              id="dateFrom"
              type="date"
              value={
                formFilter.dateFrom
              }
              onChange={(event) => {
                handleFilterChange(
                  'dateFrom',
                  event.target.value,
                );
              }}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="dateTo">
              Tanggal Akhir
            </label>

            <input
              id="dateTo"
              type="date"
              value={
                formFilter.dateTo
              }
              onChange={(event) => {
                handleFilterChange(
                  'dateTo',
                  event.target.value,
                );
              }}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="module">
              Modul
            </label>

            <select
              id="module"
              value={
                formFilter.module
              }
              onChange={(event) => {
                handleFilterChange(
                  'module',
                  event.target
                    .value as ReportModule,
                );
              }}
            >
              {Object.entries(
                reportModuleConfig,
              ).map(
                ([
                  value,
                  config,
                ]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {config.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className={styles.filterActions}>
            <button
              type="button"
              className={styles.showButton}
              onClick={handleApplyFilter}
              disabled={
                reportsQuery.isFetching
              }
            >
              {reportsQuery.isFetching
                ? 'Memuat...'
                : 'Tampilkan'}
            </button>

            <button
              type="button"
              className={styles.exportButton}
              onClick={handleExport}
              disabled={
                exportMutation.isPending
              }
            >
              <Download
                size={15}
                strokeWidth={1.8}
              />

              <span>
                {exportMutation.isPending
                  ? 'Export...'
                  : 'Export Excel'}
              </span>
            </button>
          </div>
        </div>

        {filterError && (
          <p className={styles.filterError}>
            {filterError}
          </p>
        )}

        {exportMutation.isError && (
          <p className={styles.filterError}>
            {getApiErrorMessage(
              exportMutation.error,
              'Laporan gagal diexport.',
            )}
          </p>
        )}
      </section>

      {reportsQuery.isLoading && (
        <div className={styles.stateContainer}>
          Memuat laporan...
        </div>
      )}

      {reportsQuery.isError && (
        <div className={styles.stateContainer}>
          <p>
            {getApiErrorMessage(
              reportsQuery.error,
              'Data laporan gagal dimuat.',
            )}
          </p>

          <button
            type="button"
            className={styles.retryButton}
            onClick={() => {
              reportsQuery.refetch();
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {reportData && (
        <>
          <section className={styles.summaryGrid}>
            <article className={styles.summaryCard}>
              <div
                className={styles.summaryIndicator}
                data-variant="total"
              />

              <div>
                <p>
                  Total Pengajuan
                </p>

                <strong>
                  {
                    reportData
                      .summary
                      .totalSubmission
                  }
                </strong>
              </div>
            </article>

            <article className={styles.summaryCard}>
              <div
                className={styles.summaryIndicator}
                data-variant="completed"
              />

              <div>
                <p>
                  Selesai
                </p>

                <strong>
                  {
                    reportData
                      .summary
                      .completed
                  }
                </strong>
              </div>
            </article>

            <article className={styles.summaryCard}>
              <div
                className={styles.summaryIndicator}
                data-variant="progress"
              />

              <div>
                <p>
                  Dalam Proses
                </p>

                <strong>
                  {
                    reportData
                      .summary
                      .inProgress
                  }
                </strong>
              </div>
            </article>

            <article className={styles.summaryCard}>
              <div
                className={styles.summaryIndicator}
                data-variant="rejected"
              />

              <div>
                <p>
                  Ditolak
                </p>

                <strong>
                  {
                    reportData
                      .summary
                      .rejected
                  }
                </strong>
              </div>
            </article>
          </section>

          <section className={styles.analyticsGrid}>
            <article className={styles.analyticsCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>
                    Pengajuan per Modul
                  </h2>

                  <p>
                    Jumlah pengajuan
                    berdasarkan modul.
                  </p>
                </div>
              </div>

              <div className={styles.moduleList}>
                {reportData.moduleStatistics.map(
                  (item) => {
                    const config =
                      reportModuleConfig[
                        item.module
                      ];

                    const percentage =
                      Math.max(
                        4,
                        (
                          item.total /
                          maxModuleTotal
                        ) *
                          100,
                      );

                    return (
                      <div
                        key={item.module}
                        className={
                          styles.moduleItem
                        }
                      >
                        <div
                          className={
                            styles.moduleInfo
                          }
                        >
                          <span>
                            {config.label}
                          </span>

                          <strong>
                            {item.total}
                          </strong>
                        </div>

                        <div
                          className={
                            styles.progressTrack
                          }
                        >
                          <div
                            className={
                              styles.moduleProgress
                            }
                            style={{
                              width:
                                `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </article>

            <article className={styles.analyticsCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>
                    Status Distribution
                  </h2>

                  <p>
                    Distribusi status
                    seluruh pengajuan.
                  </p>
                </div>
              </div>

              <div className={styles.statusList}>
                {reportData.statusStatistics.map(
                  (item) => {
                    const config =
                      reportStatusConfig[
                        item.status
                      ];

                    const total =
                      reportData.summary
                        .totalSubmission;

                    const percentage =
                      total > 0
                        ? Math.round(
                            (
                              item.total /
                              total
                            ) * 100,
                          )
                        : 0;

                    return (
                      <div
                        key={item.status}
                        className={
                          styles.statusItem
                        }
                      >
                        <div
                          className={
                            styles.statusInfo
                          }
                        >
                          <div
                            className={
                              styles.statusLabel
                            }
                          >
                            <span
                              className={
                                styles.statusDot
                              }
                              data-variant={
                                config.variant
                              }
                            />

                            <span>
                              {
                                config.label
                              }
                            </span>
                          </div>

                          <strong>
                            {item.total}
                          </strong>
                        </div>

                        <div
                          className={
                            styles.statusMeta
                          }
                        >
                          <div
                            className={
                              styles.progressTrack
                            }
                          >
                            <div
                              className={
                                styles.statusProgress
                              }
                              data-variant={
                                config.variant
                              }
                              style={{
                                width:
                                  `${percentage}%`,
                              }}
                            />
                          </div>

                          <span>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}

export default ReportsPage;