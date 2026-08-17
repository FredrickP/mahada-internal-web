import {
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  Upload,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';
import { paymentStatusConfig } from '../constants/payment-config';
import { usePaymentDetail } from '../hooks/usePaymentDetail';
import { usePaymentProcessing } from '../hooks/usePaymentProcessing';

import type {
  FinancePaymentStatus,
  PaymentStatus,
} from '../types/payment.types';

import { formatRupiah } from '../utils/payment.util';

import styles from './PaymentDetailPage.module.css';

const formatDate = (
  value: string,
): string => {
  if (!value) {
    return '-';
  }

  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(date);
};

const getNextFinanceStatus = (
  status: PaymentStatus,
): FinancePaymentStatus | null => {
  switch (status) {
    case 'APPROVED':
      return 'FINANCE_CHECK';

    case 'FINANCE_CHECK':
      return 'READY_FOR_EXECUTION';

    case 'READY_FOR_EXECUTION':
      return 'EXECUTED';

    default:
      return null;
  }
};

const getFinanceActionLabel = (
  status: PaymentStatus,
): string | null => {
  switch (status) {
    case 'APPROVED':
      return 'Mulai Finance Check';

    case 'FINANCE_CHECK':
      return 'Siap Dieksekusi';

    case 'READY_FOR_EXECUTION':
      return 'Eksekusi Pembayaran';

    default:
      return null;
  }
};

function PaymentDetailPage() {
  const navigate =
    useNavigate();

  const {
    id = '',
  } = useParams<{
    id: string;
  }>();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    selectedProof,
    setSelectedProof,
  ] = useState<File | null>(
    null,
  );

  const paymentQuery =
    usePaymentDetail(
      id,
    );

  const {
    updateStatusMutation,
    uploadProofMutation,
  } = usePaymentProcessing();

  const handleBack = () => {
    navigate(
      '/payment',
    );
  };

  const handleProcessPayment =
    () => {
      if (!paymentQuery.data) {
        return;
      }

      const nextStatus =
        getNextFinanceStatus(
          paymentQuery.data.status,
        );

      if (!nextStatus) {
        return;
      }

      updateStatusMutation.mutate(
        {
          id:
            paymentQuery.data.id,
          status:
            nextStatus,
        },
        {
          onSuccess: async () => {
            await paymentQuery.refetch();
          },
        },
      );
    };

  const handleUploadProof =
    () => {
      if (
        !paymentQuery.data ||
        !selectedProof
      ) {
        return;
      }

      uploadProofMutation.mutate(
        {
          id:
            paymentQuery.data.id,
          file:
            selectedProof,
        },
        {
          onSuccess: async () => {
            setSelectedProof(
              null,
            );

            if (
              fileInputRef.current
            ) {
              fileInputRef.current.value =
                '';
            }

            await paymentQuery.refetch();
          },
        },
      );
    };

  if (
    paymentQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat detail pembayaran...
      </div>
    );
  }

  if (
    paymentQuery.isError ||
    !paymentQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            paymentQuery.error,
            'Detail pembayaran gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            paymentQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const payment =
    paymentQuery.data;

  const statusConfig =
    paymentStatusConfig[
      payment.status
    ];

  const nextFinanceStatus =
    getNextFinanceStatus(
      payment.status,
    );

  const financeActionLabel =
    getFinanceActionLabel(
      payment.status,
    );

  const canUploadProof =
    payment.status ===
      'READY_FOR_EXECUTION' ||
    payment.status ===
      'EXECUTED';

  const isProcessing =
    updateStatusMutation.isPending ||
    uploadProofMutation.isPending;

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
      >
        <ArrowLeft
          size={17}
          strokeWidth={1.8}
        />

        <span>
          Kembali ke Payment
        </span>
      </button>

      <header className={styles.pageHeader}>
        <h1>
          Detail Pembayaran
        </h1>

        <p>
          Pantau informasi pengajuan,
          dokumen, dan proses pembayaran.
        </p>
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
          <section className={styles.mainCard}>
            <div className={styles.detailHeader}>
              <div>
                <p className={styles.submissionNumber}>
                  {payment.submissionNumber}
                </p>

                <h2>
                  Pembayaran {payment.vendorName}
                </h2>
              </div>

              <span
                className={styles.statusBadge}
                data-variant={
                  statusConfig.variant
                }
              >
                {statusConfig.label}
              </span>
            </div>

            <div className={styles.sectionDivider} />

            <section className={styles.detailSection}>
              <h3>
                Informasi Vendor & Invoice
              </h3>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span>
                    Nama Vendor
                  </span>

                  <strong>
                    {payment.vendorName}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    No. Invoice
                  </span>

                  <strong>
                    {payment.invoiceNumber}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Tanggal Invoice
                  </span>

                  <strong>
                    {formatDate(
                      payment.invoiceDate,
                    )}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Nama Penerima
                  </span>

                  <strong>
                    {payment.recipientName}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Nomor Rekening Tujuan
                  </span>

                  <strong>
                    {
                      payment
                        .destinationAccountNumber
                    }
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    No. Faktur Pajak
                  </span>

                  <strong>
                    {
                      payment.taxInvoiceNumber ??
                      '-'
                    }
                  </strong>
                </div>
              </div>
            </section>

            <div className={styles.sectionDivider} />

            <section className={styles.detailSection}>
              <h3>
                Perhitungan Pembayaran
              </h3>

              <div className={styles.paymentGrid}>
                <div className={styles.amountItem}>
                  <span>
                    DPP
                  </span>

                  <strong>
                    {formatRupiah(
                      payment.dppAmount,
                    )}
                  </strong>
                </div>

                <div className={styles.amountItem}>
                  <span>
                    PPN
                  </span>

                  <strong>
                    {formatRupiah(
                      payment.ppnAmount,
                    )}
                  </strong>
                </div>

                <div className={styles.amountItem}>
                  <span>
                    PPh
                  </span>

                  <strong>
                    {formatRupiah(
                      payment.pphAmount,
                    )}
                  </strong>
                </div>

                <div
                  className={`${styles.amountItem} ${styles.totalItem}`}
                >
                  <span>
                    Total Pembayaran
                  </span>

                  <strong>
                    {formatRupiah(
                      payment.totalAmount,
                    )}
                  </strong>
                </div>
              </div>
            </section>

            <div className={styles.sectionDivider} />

            <section className={styles.detailSection}>
              <h3>
                Dokumen
              </h3>

              <div className={styles.documentGrid}>
                <div className={styles.documentGroup}>
                  <span className={styles.documentLabel}>
                    Invoice
                  </span>

                  <div className={styles.documentItem}>
                    {payment.invoiceFileName}
                  </div>
                </div>

                <div className={styles.documentGroup}>
                  <span className={styles.documentLabel}>
                    Quotation / PO
                  </span>

                  {payment.quotationFileName ? (
                    <div className={styles.documentItem}>
                      {
                        payment
                          .quotationFileName
                      }
                    </div>
                  ) : (
                    <div className={styles.emptyDocument}>
                      Tidak ada dokumen
                    </div>
                  )}
                </div>

                <div className={styles.documentGroup}>
                  <span className={styles.documentLabel}>
                    Dokumen Lain
                  </span>

                  {payment.otherDocumentFileName ? (
                    <div className={styles.documentItem}>
                      {
                        payment
                          .otherDocumentFileName
                      }
                    </div>
                  ) : (
                    <div className={styles.emptyDocument}>
                      Tidak ada dokumen
                    </div>
                  )}
                </div>
              </div>

              {payment.paymentProofFileName && (
                <div className={styles.paymentProof}>
                  <span className={styles.documentLabel}>
                    Bukti Pembayaran
                  </span>

                  <div className={styles.documentItem}>
                    {
                      payment
                        .paymentProofFileName
                    }
                  </div>
                </div>
              )}

              {canUploadProof && (
                <div className={styles.proofUploadSection}>
                  <span className={styles.documentLabel}>
                    Bukti Pembayaran
                    {' '}
                    <small>
                      (Opsional)
                    </small>
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={isProcessing}
                    onChange={(event) => {
                      setSelectedProof(
                        event.target
                          .files?.[0] ??
                          null,
                      );

                      uploadProofMutation.reset();
                    }}
                  />

                  {selectedProof && (
                    <div className={styles.selectedProof}>
                      <span>
                        {selectedProof.name}
                      </span>

                      <button
                        type="button"
                        disabled={
                          uploadProofMutation.isPending
                        }
                        onClick={handleUploadProof}
                      >
                        <Upload
                          size={15}
                          strokeWidth={1.8}
                        />

                        {uploadProofMutation.isPending
                          ? 'Mengunggah...'
                          : 'Upload Bukti'}
                      </button>
                    </div>
                  )}

                  {uploadProofMutation.isSuccess && (
                    <div className={styles.successMessage}>
                      {
                        uploadProofMutation
                          .data.message
                      }
                    </div>
                  )}

                  {uploadProofMutation.isError && (
                    <div className={styles.errorMessage}>
                      {getApiErrorMessage(
                        uploadProofMutation.error,
                        'Bukti pembayaran gagal diunggah.',
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </section>
        </main>

        <aside className={styles.sideContent}>
          <section className={styles.statusCard}>
            <h3>
              Status Pembayaran
            </h3>

            <span
              className={styles.largeStatusBadge}
              data-variant={
                statusConfig.variant
              }
            >
              {statusConfig.label}
            </span>

            <div className={styles.statusInfo}>
              <div>
                <span>
                  Pengaju
                </span>

                <strong>
                  {payment.requesterName}
                </strong>
              </div>

              <div>
                <span>
                  Divisi Pengaju
                </span>

                <strong>
                  {
                    payment
                      .requesterDivision
                  }
                </strong>
              </div>

              <div>
                <span>
                  Divisi Tujuan
                </span>

                <strong>
                  {
                    payment
                      .destinationDivision
                  }
                </strong>
              </div>

              <div>
                <span>
                  Tanggal Pengajuan
                </span>

                <strong>
                  {
                    payment
                      .submissionDate
                  }
                </strong>
              </div>
            </div>
          </section>

          {nextFinanceStatus &&
            financeActionLabel && (
            <section className={styles.financeActionCard}>
              <h3>
                Proses Finance
              </h3>

              <p>
                Lanjutkan pembayaran
                ke proses berikutnya.
              </p>

              <button
                type="button"
                className={styles.financeActionButton}
                disabled={
                  updateStatusMutation.isPending
                }
                onClick={
                  handleProcessPayment
                }
              >
                {updateStatusMutation.isPending
                  ? 'Memproses...'
                  : financeActionLabel}
              </button>

              {updateStatusMutation.isError && (
                <div className={styles.errorMessage}>
                  {getApiErrorMessage(
                    updateStatusMutation.error,
                    'Status pembayaran gagal diperbarui.',
                  )}
                </div>
              )}
            </section>
          )}

          <section className={styles.historySection}>
            <h3>
              Riwayat Proses
            </h3>

            <div className={styles.timeline}>
              {payment.history.map(
                (
                  history,
                  index,
                ) => {
                  const isLast =
                    index ===
                    payment.history.length -
                      1;

                  return (
                    <div
                      key={history.id}
                      className={
                        styles.timelineItem
                      }
                    >
                      <div
                        className={
                          styles.timelineIndicator
                        }
                      >
                        <span
                          className={
                            styles.timelineDot
                          }
                        />

                        {!isLast && (
                          <span
                            className={
                              styles.timelineLine
                            }
                          />
                        )}
                      </div>

                      <div
                        className={
                          styles.timelineContent
                        }
                      >
                        <strong>
                          {
                            history.label
                          }
                        </strong>

                        <span>
                          {
                            history
                              .actionDate
                          }
                        </span>

                        <p>
                          Oleh{' '}
                          {
                            history
                              .actionBy
                          }
                        </p>

                        {history.notes && (
                          <p>
                            {
                              history.notes
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default PaymentDetailPage;