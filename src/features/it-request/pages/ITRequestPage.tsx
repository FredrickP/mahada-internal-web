import {
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import ITRequestFilter from '../components/ITRequestFilter';
import ITRequestTable from '../components/ITRequestTable';

import { useITRequests } from '../hooks/useITRequests';

import type {
  ITRequest,
  ITRequestFilter as ITRequestFilterValue,
} from '../types/it-request.types';

import styles from './ITRequestPage.module.css';

const defaultFilter: ITRequestFilterValue = {
  search: '',
  type: '',
  status: '',
};

function ITRequestPage() {
  const navigate = useNavigate();

  const [
    appliedFilter,
    setAppliedFilter,
  ] = useState<ITRequestFilterValue>(
    defaultFilter,
  );

  const itRequestsQuery =
    useITRequests(appliedFilter);

  const handleCreateRequest = () => {
    navigate('/it-request/create');
  };

  const handleApplyFilter = (
    filter: ITRequestFilterValue,
  ) => {
    setAppliedFilter({
      search: filter.search.trim(),
      type: filter.type,
      status: filter.status,
    });
  };

const handleViewDetail = (
request: ITRequest,
) => {
navigate(
    `/it-request/${request.id}`,
);
};

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            IT Request Management
          </h1>

          <p className={styles.pageDescription}>
            Buat dan pantau Request, Change,
            atau Incident.
          </p>
        </div>

        <button
          type="button"
          className={styles.createButton}
          onClick={handleCreateRequest}
        >
          <span
            className={styles.createIcon}
            aria-hidden="true"
          >
            +
          </span>

          <span>
            Buat IT Request
          </span>
        </button>
      </div>

      <div className={styles.filterSection}>
        <ITRequestFilter
          initialValue={appliedFilter}
          onApply={handleApplyFilter}
        />
      </div>

      <section
        className={styles.tableSection}
        aria-label="Daftar IT Request"
      >
        {itRequestsQuery.isLoading && (
          <div className={styles.stateContainer}>
            Memuat IT Request...
          </div>
        )}

        {itRequestsQuery.isError && (
          <div className={styles.stateContainer}>
            <p className={styles.errorMessage}>
              {getApiErrorMessage(
                itRequestsQuery.error,
                'IT Request gagal dimuat.',
              )}
            </p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={() => {
                itRequestsQuery.refetch();
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!itRequestsQuery.isLoading &&
          !itRequestsQuery.isError &&
          itRequestsQuery.data && (
            <>
              <ITRequestTable
                data={
                  itRequestsQuery.data.data
                }
                onViewDetail={
                  handleViewDetail
                }
              />

              <div
                className={
                  styles.resultInfo
                }
              >
                Total{' '}
                <strong>
                  {
                    itRequestsQuery.data
                      .total
                  }
                </strong>{' '}
                request
              </div>
            </>
          )}
      </section>
    </div>
  );
}

export default ITRequestPage;