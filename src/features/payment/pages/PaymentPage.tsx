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

import PaymentTable from '../components/PaymentTable';

import {
  usePayments,
} from '../hooks/usePayments';

import type {
  PaymentRequest,
} from '../types/payment.types';

import styles from './PaymentPage.module.css';

function PaymentPage() {
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

  const paymentsQuery =
    usePayments();

  const data =
    paymentsQuery.data?.data ??
    [];

  const paginatedData =
    useMemo(() => {
      if (
        pageSize === 'ALL'
      ) {
        return data;
      }

      const startIndex =
        (
          currentPage -
          1
        ) *
        pageSize;

      return data.slice(
        startIndex,
        startIndex +
          pageSize,
      );
    }, [
      data,
      currentPage,
      pageSize,
    ]);

  const handleCreatePayment = () => {
    navigate(
      '/payment/create',
    );
  };

  const handleViewDetail = (
    payment: PaymentRequest,
  ) => {
    navigate(
      `/payment/${payment.id}`,
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
    paymentsQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat pengajuan pembayaran...
      </div>
    );
  }

  if (
    paymentsQuery.isError ||
    !paymentsQuery.data
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        <p>
          {getApiErrorMessage(
            paymentsQuery.error,
            'Data pengajuan pembayaran gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={
            styles.retryButton
          }
          onClick={() => {
            paymentsQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const {
    summary,
  } = paymentsQuery.data;

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
            Pengajuan Pembayaran
          </h1>

          <p>
            Pantau pembayaran vendor
            dari pengajuan hingga
            eksekusi.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.createButton
          }
          onClick={
            handleCreatePayment
          }
        >
          + Buat Pengajuan
        </button>
      </header>

      <section
        className={
          styles.summaryGrid
        }
      >
        <article
          className={
            styles.summaryCard
          }
          data-variant="waiting"
        >
          <div
            className={
              styles.summaryTop
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            />

            <div>
              <p
                className={
                  styles.summaryLabel
                }
              >
                Menunggu Approval
              </p>

              <strong
                className={
                  styles.summaryValue
                }
              >
                {
                  summary.waitingApproval
                }
              </strong>
            </div>
          </div>

          <p
            className={
              styles.summaryDescription
            }
          >
            Approval atasan
          </p>
        </article>

        <article
          className={
            styles.summaryCard
          }
          data-variant="finance"
        >
          <div
            className={
              styles.summaryTop
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            />

            <div>
              <p
                className={
                  styles.summaryLabel
                }
              >
                Finance Check
              </p>

              <strong
                className={
                  styles.summaryValue
                }
              >
                {
                  summary.financeCheck
                }
              </strong>
            </div>
          </div>

          <p
            className={
              styles.summaryDescription
            }
          >
            Sedang diverifikasi
          </p>
        </article>

        <article
          className={
            styles.summaryCard
          }
          data-variant="execution"
        >
          <div
            className={
              styles.summaryTop
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            />

            <div>
              <p
                className={
                  styles.summaryLabel
                }
              >
                Siap Dieksekusi
              </p>

              <strong
                className={
                  styles.summaryValue
                }
              >
                {
                  summary.readyForExecution
                }
              </strong>
            </div>
          </div>

          <p
            className={
              styles.summaryDescription
            }
          >
            Menunggu pembayaran
          </p>
        </article>

        <article
          className={
            styles.summaryCard
          }
          data-variant="completed"
        >
          <div
            className={
              styles.summaryTop
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            />

            <div>
              <p
                className={
                  styles.summaryLabel
                }
              >
                Selesai
              </p>

              <strong
                className={
                  styles.summaryValue
                }
              >
                {
                  summary.completed
                }
              </strong>
            </div>
          </div>

          <p
            className={
              styles.summaryDescription
            }
          >
            Bulan berjalan
          </p>
        </article>
      </section>

      <section
        className={
          styles.listSection
        }
      >
        <h2>
          Daftar Pengajuan Pembayaran
        </h2>

        <PaymentTable
          data={
            paginatedData
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
            data.length
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

export default PaymentPage;