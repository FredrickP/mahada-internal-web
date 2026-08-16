import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import QuickActionCard from '../components/QuickActionCard';
import RecentSubmissionTable from '../components/RecentSubmissionTable';
import SummaryCard from '../components/SummaryCard';

import { useDashboard } from '../hooks/useDashboard';

import {
  getSubmissionModuleRoute,
} from '../utils/dashboard-route';

import type {
  RecentSubmission,
} from '../types/dashboard.types';

import styles from './DashboardPage.module.css';

function DashboardPage() {
  const navigate = useNavigate();

  const dashboardQuery = useDashboard();

  const handleViewAll = () => {
    navigate('/reports');
  };

  const handleViewDetail = (
    submission: RecentSubmission,
  ) => {
    const targetRoute =
      getSubmissionModuleRoute(
        submission.module,
      );

    navigate(targetRoute);
  };

  if (dashboardQuery.isLoading) {
    return (
      <div className={styles.stateContainer}>
        <span>
          Memuat dashboard...
        </span>
      </div>
    );
  }

  if (
    dashboardQuery.isError ||
    !dashboardQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            dashboardQuery.error,
            'Dashboard gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            dashboardQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const {
    summary,
    quickActions,
    recentSubmissions,
  } = dashboardQuery.data;

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Dashboard
        </h1>

        <p className={styles.pageDescription}>
          Ringkasan aktivitas dan pengajuan Anda.
        </p>
      </div>

      <section
        className={styles.summaryGrid}
        aria-label="Ringkasan pengajuan"
      >
        {summary.map((item) => (
          <SummaryCard
            key={item.type}
            data={item}
          />
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Aksi Cepat
        </h2>

        <div className={styles.quickActionGrid}>
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              data={action}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Pengajuan Terbaru
          </h2>

          <button
            type="button"
            className={styles.viewAllButton}
            onClick={handleViewAll}
          >
            Lihat Semua
          </button>
        </div>

        <RecentSubmissionTable
          data={recentSubmissions}
          onViewDetail={handleViewDetail}
        />
      </section>
    </div>
  );
}

export default DashboardPage;