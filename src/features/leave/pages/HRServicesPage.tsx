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
} from '../types/leave.types';

import styles from './HRServicesPage.module.css';

function HRServicesPage() {
  const navigate =
    useNavigate();

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

  if (
    hrServicesQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat layanan HR...
      </div>
    );
  }

  if (
    hrServicesQuery.isError ||
    !hrServicesQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            hrServicesQuery.error,
            'Data HR Services gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
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
    history,
  } = hrServicesQuery.data;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>
          HR Services
        </h1>

        <p>
          Kelola cuti tahunan dan perjalanan dinas.
        </p>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.leaveCard}>
          <div className={styles.leaveContent}>
            <p className={styles.leaveLabel}>
              Sisa Cuti Tahunan
            </p>

            <strong className={styles.leaveValue}>
              {leaveBalance.remainingDays} Hari
            </strong>

            <p className={styles.leaveDescription}>
              Terpakai{' '}
              {leaveBalance.usedDays}{' '}
              dari{' '}
              {leaveBalance.totalDays}{' '}
              hari
            </p>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleCreateLeave}
          >
            Ajukan Cuti
          </button>
        </article>

        <article className={styles.businessTripCard}>
          <div className={styles.tripContent}>
            <p className={styles.tripLabel}>
              Perjalanan Dinas Aktif
            </p>

            <strong className={styles.tripValue}>
              {
                businessTripSummary
                  .activeCount
              }{' '}
              Pengajuan
            </strong>

            <p className={styles.tripDescription}>
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
            className={styles.secondaryButton}
            onClick={handleCreateBusinessTrip}
          >
            Ajukan Perjalanan
          </button>
        </article>
      </section>

      <section className={styles.historySection}>
        <h2>
          Riwayat HR
        </h2>

        <HRHistoryTable
          data={history}
          onViewDetail={handleViewDetail}
        />
      </section>
    </div>
  );
}

export default HRServicesPage;