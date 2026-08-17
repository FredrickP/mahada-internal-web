import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import { useAdministration } from '../hooks/useAdministration';

import styles from './AdministrationPage.module.css';

function AdministrationPage() {
  const navigate = useNavigate();

  const administrationQuery =
    useAdministration();

  const handleManage = (
    path: string,
  ) => {
    navigate(path);
  };

  if (administrationQuery.isLoading) {
    return (
      <div className={styles.stateContainer}>
        Memuat data administration...
      </div>
    );
  }

  if (
    administrationQuery.isError ||
    !administrationQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            administrationQuery.error,
            'Data administration gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            administrationQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const {
    summary,
    menus,
  } = administrationQuery.data;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>
          Administration
        </h1>

        <p>
          Kelola akun, divisi,
          approver, saldo cuti,
          dan konfigurasi.
        </p>
      </header>

      <section className={styles.summaryGrid}>
        <article
          className={styles.summaryCard}
          data-variant="users"
        >
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon}>
              US
            </div>

            <div>
              <p className={styles.summaryLabel}>
                Pengguna Aktif
              </p>

              <strong className={styles.summaryValue}>
                {summary.activeUsers}
              </strong>
            </div>
          </div>

          <p className={styles.summaryDescription}>
            {summary.totalDivisions} divisi
          </p>
        </article>

        <article
          className={styles.summaryCard}
          data-variant="approver"
        >
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon}>
              AP
            </div>

            <div>
              <p className={styles.summaryLabel}>
                Approver
              </p>

              <strong className={styles.summaryValue}>
                {summary.totalApprovers}
              </strong>
            </div>
          </div>

          <p className={styles.summaryDescription}>
            Mapping aktif
          </p>
        </article>

        <article
          className={styles.summaryCard}
          data-variant="leave"
        >
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon}>
              CT
            </div>

            <div>
              <p className={styles.summaryLabel}>
                Saldo Cuti
              </p>

              <strong className={styles.summaryValue}>
                {summary.totalLeaveBalances}
              </strong>
            </div>
          </div>

          <p className={styles.summaryDescription}>
            Data karyawan
          </p>
        </article>

        <article
          className={styles.summaryCard}
          data-variant="tax"
        >
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon}>
              TX
            </div>

            <div>
              <p className={styles.summaryLabel}>
                Konfigurasi Pajak
              </p>

              <strong className={styles.summaryValue}>
                {summary.totalTaxConfigurations}
              </strong>
            </div>
          </div>

          <p className={styles.summaryDescription}>
            Tarif aktif
          </p>
        </article>
      </section>

      <section className={styles.menuSection}>
        <h2>
          Menu Administrasi
        </h2>

        <div className={styles.menuGrid}>
          {menus.map((menu) => (
            <article
              key={menu.id}
              className={styles.menuCard}
            >
              <div className={styles.menuIcon}>
                {menu.shortLabel}
              </div>

              <div className={styles.menuContent}>
                <h3>
                  {menu.title}
                </h3>

                <p>
                  {menu.description}
                </p>

                <button
                  type="button"
                  className={styles.manageButton}
                  onClick={() => {
                    handleManage(
                      menu.path,
                    );
                  }}
                >
                  Kelola →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdministrationPage;