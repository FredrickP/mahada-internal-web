import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import HRHistoryTable from '../components/HRHistoryTable';

import {
  useHRServices,
} from '../hooks/useHRServices';

import type {
  HRHistoryItem,
  HRSubmissionType,
} from '../types/leave.types';

import styles from './HRServicesPage.module.css';

type HRTypeFilter =
  | 'ALL'
  | HRSubmissionType;

function HRServicesPage() {
  const navigate =
    useNavigate();

  const [
    typeFilter,
    setTypeFilter,
  ] = useState<HRTypeFilter>(
    'ALL',
  );

  const hrServicesQuery =
    useHRServices();

  const handleCreateLeave = () => {
    navigate(
      '/hr-services/leave/create',
    );
  };

  const handleCreateBusinessTrip = () => {
    navigate(
      '/hr-services/business-trip/create',
    );
  };

  const handleViewDetail = (
    item: HRHistoryItem,
  ) => {
    if (
      item.type === 'LEAVE'
    ) {
      navigate(
        `/hr-services/leave/${item.referenceId}`,
      );

      return;
    }

    navigate(
      `/hr-services/business-trip/${item.referenceId}`,
    );
  };

  const history =
    hrServicesQuery.data?.history ??
    [];

  const filteredHistory =
    useMemo(() => {
      if (
        typeFilter === 'ALL'
      ) {
        return history;
      }

      return history.filter(
        (item) => {
          return (
            item.type ===
            typeFilter
          );
        },
      );
    }, [
      history,
      typeFilter,
    ]);

  if (
    hrServicesQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat layanan HR...
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
            'Data HR Services gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={
            styles.retryButton
          }
          onClick={() => {
            hrServicesQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const {
    leaveBalance,
    businessTripSummary,
  } = hrServicesQuery.data;

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
          HR Services
        </h1>

        <p>
          Kelola cuti tahunan dan perjalanan dinas.
        </p>
      </header>

      <section
        className={
          styles.summaryGrid
        }
      >
        <article
          className={
            styles.leaveCard
          }
        >
          <div
            className={
              styles.leaveContent
            }
          >
            <p
              className={
                styles.leaveLabel
              }
            >
              Sisa Cuti Tahunan
            </p>

            <strong
              className={
                styles.leaveValue
              }
            >
              {
                leaveBalance.remainingDays
              }{' '}
              Hari
            </strong>

            <p
              className={
                styles.leaveDescription
              }
            >
              Terpakai{' '}
              {
                leaveBalance.usedDays
              }{' '}
              dari{' '}
              {
                leaveBalance.totalDays
              }{' '}
              hari
            </p>
          </div>

          <button
            type="button"
            className={
              styles.primaryButton
            }
            onClick={
              handleCreateLeave
            }
          >
            Ajukan Cuti
          </button>
        </article>

        <article
          className={
            styles.businessTripCard
          }
        >
          <div
            className={
              styles.tripContent
            }
          >
            <p
              className={
                styles.tripLabel
              }
            >
              Perjalanan Dinas Aktif
            </p>

            <strong
              className={
                styles.tripValue
              }
            >
              {
                businessTripSummary
                  .activeCount
              }{' '}
              Pengajuan
            </strong>

            <p
              className={
                styles.tripDescription
              }
            >
              {
                businessTripSummary
                  .waitingApprovalCount
              }{' '}
              menunggu approval
              {' • '}
              {
                businessTripSummary
                  .approvedCount
              }{' '}
              disetujui
            </p>
          </div>

          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={
              handleCreateBusinessTrip
            }
          >
            Ajukan Perjalanan
          </button>
        </article>
      </section>

      <section
        className={
          styles.historySection
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: '16px',
            marginBottom: '18px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              Riwayat HR
            </h2>

            <p
              style={{
                margin:
                  '6px 0 0',
                color:
                  '#64748b',
                fontSize:
                  '13px',
              }}
            >
              {
                filteredHistory.length
              }{' '}
              pengajuan ditampilkan
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <label
              htmlFor="hr-type-filter"
              style={{
                color:
                  '#64748b',
                fontSize:
                  '13px',
                fontWeight:
                  600,
              }}
            >
              Jenis
            </label>

            <select
              id="hr-type-filter"
              value={
                typeFilter
              }
              onChange={(
                event,
              ) => {
                setTypeFilter(
                  event.target
                    .value as HRTypeFilter,
                );
              }}
              style={{
                minWidth:
                  '190px',
                height:
                  '40px',
                padding:
                  '0 36px 0 12px',
                border:
                  '1px solid #cbd5e1',
                borderRadius:
                  '10px',
                background:
                  '#ffffff',
                color:
                  '#0f172a',
                fontSize:
                  '13px',
                fontWeight:
                  500,
                cursor:
                  'pointer',
                outline:
                  'none',
              }}
            >
              <option
                value="ALL"
              >
                Semua Pengajuan
              </option>

              <option
                value="LEAVE"
              >
                Cuti Tahunan
              </option>

              <option
                value="BUSINESS_TRIP"
              >
                Perjalanan Dinas
              </option>
            </select>
          </div>
        </div>

        <HRHistoryTable
          data={
            filteredHistory
          }
          onViewDetail={
            handleViewDetail
          }
        />
      </section>
    </div>
  );
}

export default HRServicesPage;