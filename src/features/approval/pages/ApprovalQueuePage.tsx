import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import Pagination, {
  type PaginationPageSize,
} from '../../../components/common/Pagination';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import ApprovalTable from '../components/ApprovalTable';

import {
  useApprovalQueue,
} from '../hooks/useApprovalQueue';

import type {
  ApprovalQueueItem,
} from '../types/approval.types';

import styles from './ApprovalQueuePage.module.css';

function ApprovalQueuePage() {
  const navigate =
    useNavigate();

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

  const approvalQuery =
    useApprovalQueue();

  const approvals =
    approvalQuery.data ??
    [];

  const paginatedApprovals =
    useMemo(() => {
      if (
        pageSize === 'ALL'
      ) {
        return approvals;
      }

      const startIndex =
        (
          currentPage -
          1
        ) *
        pageSize;

      return approvals.slice(
        startIndex,
        startIndex +
          pageSize,
      );
    }, [
      approvals,
      currentPage,
      pageSize,
    ]);

  const handleViewDetail = (
    approval: ApprovalQueueItem,
  ) => {
    navigate(
      `/approval/${approval.id}`,
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

  if (
    approvalQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat daftar approval...
      </div>
    );
  }

  if (
    approvalQuery.isError ||
    !approvalQuery.data
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        <p>
          {getApiErrorMessage(
            approvalQuery.error,
            'Daftar approval gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={
            styles.retryButton
          }
          onClick={() => {
            approvalQuery.refetch();
          }}
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
        <div>
          <h1>
            Approval
          </h1>

          <p>
            Tinjau dan proses pengajuan
            yang memerlukan persetujuan Anda.
          </p>
        </div>

        <div
          className={
            styles.queueSummary
          }
        >
          <span>
            Menunggu Approval
          </span>

          <strong>
            {approvals.length}
          </strong>
        </div>
      </header>

      <section
        className={
          styles.listSection
        }
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <div>
            <h2>
              Approval Queue
            </h2>

            <p>
              Pengajuan terbaru ditampilkan
              berdasarkan antrean approval.
            </p>
          </div>
        </div>

        <ApprovalTable
          data={
            paginatedApprovals
          }
          onViewDetail={
            handleViewDetail
          }
        />

        <Pagination
          currentPage={
            currentPage
          }
          totalItems={
            approvals.length
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
      </section>
    </div>
  );
}

export default ApprovalQueuePage;