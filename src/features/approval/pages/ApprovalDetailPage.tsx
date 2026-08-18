import { useState } from 'react';

import { ArrowLeft } from 'lucide-react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  approvalModuleConfig,
  approvalStatusConfig,
} from '../constants/approval-config';

import { useApprovalDetail } from '../hooks/useApprovalDetail';
import { useProcessApproval } from '../hooks/useProcessApproval';

import type {
  ApprovalDetail,
} from '../types/approval.types';

import styles from './ApprovalDetailPage.module.css';

const formatRupiah = (
  value: number,
): string => {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ).format(value);
};

function ApprovalDetailPage() {
  const navigate = useNavigate();

  const {
    id = '',
  } = useParams<{
    id: string;
  }>();

  const [notes, setNotes] =
    useState('');

  const [notesError, setNotesError] =
    useState('');

  const approvalQuery =
    useApprovalDetail(id);

  const processMutation =
    useProcessApproval();

  const handleBack = () => {
    navigate('/approval');
  };

  const processAction = (
    action: 'APPROVE' | 'REJECT',
  ) => {
    const cleanNotes =
      notes.trim();

    if (!cleanNotes) {
      setNotesError(
        'Catatan approver wajib diisi',
      );

      return;
    }

    setNotesError('');

    processMutation.mutate(
      {
        approvalId: id,
        action,
        notes: cleanNotes,
      },
      {
        onSuccess: () => {
          navigate('/approval');
        },
      },
    );
  };

  const renderModuleDetail = (
    approval: ApprovalDetail,
  ) => {
    switch (approval.module) {
      case 'PAYMENT':
        return (
          <>
            <div className={styles.infoItem}>
              <span>
                Nama Vendor
              </span>

              <strong>
                {
                  approval.data
                    .vendorName
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Nomor Invoice
              </span>

              <strong>
                {
                  approval.data
                    .invoiceNumber
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Total Pembayaran
              </span>

              <strong>
                {formatRupiah(
                  approval.data
                    .totalAmount,
                )}
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Divisi Tujuan
              </span>

              <strong>
                {
                  approval.data
                    .destinationDivision
                }
              </strong>
            </div>
          </>
        );

      case 'IT_REQUEST':
        return (
          <>
            <div className={styles.infoItem}>
              <span>
                Jenis Request
              </span>

              <strong>
                {
                  approval.data
                    .requestType
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Prioritas
              </span>

              <strong>
                {
                  approval.data
                    .priority
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Divisi Tujuan
              </span>

              <strong>
                {
                  approval.data
                    .destinationDivision
                }
              </strong>
            </div>

            <div
              className={`${styles.infoItem} ${styles.fullWidth}`}
            >
              <span>
                Deskripsi
              </span>

              <strong>
                {
                  approval.data
                    .description
                }
              </strong>
            </div>
          </>
        );

      case 'LEAVE':
        return (
          <>
            <div className={styles.infoItem}>
              <span>
                Jenis Cuti
              </span>

              <strong>
                {
                  approval.data
                    .leaveType
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Jumlah Hari
              </span>

              <strong>
                {
                  approval.data
                    .workingDays
                }{' '}
                Hari Kerja
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Tanggal Mulai
              </span>

              <strong>
                {
                  approval.data
                    .startDate
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Tanggal Selesai
              </span>

              <strong>
                {
                  approval.data
                    .endDate
                }
              </strong>
            </div>

            <div
              className={`${styles.infoItem} ${styles.fullWidth}`}
            >
              <span>
                Alasan Cuti
              </span>

              <strong>
                {
                  approval.data
                    .reason
                }
              </strong>
            </div>
          </>
        );

      case 'BUSINESS_TRIP':
        return (
          <>
            <div className={styles.infoItem}>
              <span>
                Kota Tujuan
              </span>

              <strong>
                {
                  approval.data
                    .destinationCity
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Durasi
              </span>

              <strong>
                {
                  approval.data
                    .durationDays
                }{' '}
                Hari
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Tanggal Berangkat
              </span>

              <strong>
                {
                  approval.data
                    .departureDate
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Tanggal Kembali
              </span>

              <strong>
                {
                  approval.data
                    .returnDate
                }
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>
                Total Estimasi
              </span>

              <strong>
                {formatRupiah(
                  approval.data
                    .totalEstimate,
                )}
              </strong>
            </div>

            <div
              className={`${styles.infoItem} ${styles.fullWidth}`}
            >
              <span>
                Tujuan Perjalanan
              </span>

              <strong>
                {
                  approval.data
                    .purpose
                }
              </strong>
            </div>
          </>
        );
    }
  };

  if (approvalQuery.isLoading) {
    return (
      <div className={styles.stateContainer}>
        Memuat detail approval...
      </div>
    );
  }

  if (
    approvalQuery.isError ||
    !approvalQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            approvalQuery.error,
            'Detail approval gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            approvalQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const approval =
    approvalQuery.data;

  const statusConfig =
    approvalStatusConfig[
      approval.status
    ];

  const moduleConfig =
    approvalModuleConfig[
      approval.module
    ];

  const isWaitingApproval =
    approval.status ===
    'WAITING_APPROVAL';

  const isProcessing =
    processMutation.isPending;

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
          Kembali ke Approval
        </span>
      </button>

      <header className={styles.pageHeader}>
        <h1>
          Detail Approval
        </h1>

        <p>
          Tinjau informasi pengajuan
          sebelum memberikan keputusan.
        </p>
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
          <section className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <div>
                <div className={styles.moduleLabel}>
                  {moduleConfig.label}
                </div>

                <p className={styles.submissionNumber}>
                  {approval.submissionNumber}
                </p>

                <h2>
                  {approval.title}
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

            <div className={styles.divider} />

            <section className={styles.section}>
              <h3>
                Informasi Pengajuan
              </h3>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span>
                    Pengaju
                  </span>

                  <strong>
                    {
                      approval
                        .requesterName
                    }
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Divisi
                  </span>

                  <strong>
                    {
                      approval
                        .requesterDivision
                    }
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Tanggal Pengajuan
                  </span>

                  <strong>
                    {
                      approval
                        .submissionDate
                    }
                  </strong>
                </div>
              </div>
            </section>

            <div className={styles.divider} />

            <section className={styles.section}>
              <h3>
                Detail {moduleConfig.label}
              </h3>

              <div className={styles.infoGrid}>
                {renderModuleDetail(
                  approval,
                )}
              </div>
            </section>

            <div className={styles.divider} />

            <section className={styles.section}>
  <h3>
    Lampiran
  </h3>

  {approval.attachments.length ===
  0 ? (
    <div className={styles.emptyAttachment}>
      Tidak ada lampiran.
    </div>
  ) : (
    <div className={styles.attachmentList}>
      {approval.attachments.map(
        (attachment) => {
          const hasFileUrl =
            Boolean(
              attachment.fileUrl &&
                attachment.fileUrl !== '#',
            );

          if (!hasFileUrl) {
            return (
              <div
                key={attachment.id}
                className={
                  styles.attachmentItem
                }
              >
                <div>
                  <strong>
                    {attachment.fileName}
                  </strong>

                  <div
                    style={{
                      marginTop: '4px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: 400,
                    }}
                  >
                    File tidak tersedia untuk dibuka
                  </div>
                </div>
              </div>
            );
          }

          return (
            <a
              key={attachment.id}
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={
                styles.attachmentItem
              }
              style={{
                color: 'inherit',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <div>
                <strong>
                  {attachment.fileName}
                </strong>

                <div
                  style={{
                    marginTop: '4px',
                    color: '#b7791f',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Buka File
                </div>
              </div>
            </a>
          );
        },
      )}
    </div>
  )}
</section>

            <div className={styles.divider} />

            <section className={styles.section}>
              <h3>
                Riwayat Pengajuan
              </h3>

              <div className={styles.historyList}>
                {approval.history.map(
                  (history) => (
                    <div
                      key={history.id}
                      className={styles.historyItem}
                    >
                      <div>
                        <strong>
                          {
                            history
                              .label
                          }
                        </strong>

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
                              history
                                .notes
                            }
                          </p>
                        )}
                      </div>

                      <span>
                        {
                          history
                            .actionDate
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>
          </section>
        </main>

        <aside className={styles.actionCard}>
          <h3>
            Tindakan Approval
          </h3>

          {isWaitingApproval ? (
            <>
              <div className={styles.notesGroup}>
                <label htmlFor="approvalNotes">
                  Catatan Approver
                </label>

                <textarea
                  id="approvalNotes"
                  rows={5}
                  maxLength={500}
                  value={notes}
                  placeholder="Tambahkan catatan keputusan..."
                  disabled={isProcessing}
                  onChange={(event) => {
                    setNotes(
                      event.target.value,
                    );

                    if (
                      notesError
                    ) {
                      setNotesError('');
                    }
                  }}
                />

                <div className={styles.notesFooter}>
                  <span className={styles.errorText}>
                    {notesError}
                  </span>

                  <span className={styles.characterCount}>
                    {notes.length}/500
                  </span>
                </div>
              </div>

              {processMutation.isError && (
                <div className={styles.submitError}>
                  {getApiErrorMessage(
                    processMutation.error,
                    'Approval gagal diproses.',
                  )}
                </div>
              )}

              <div className={styles.actionButtons}>
                <button
                  type="button"
                  className={styles.approveButton}
                  disabled={isProcessing}
                  onClick={() => {
                    processAction(
                      'APPROVE',
                    );
                  }}
                >
                  {isProcessing
                    ? 'Memproses...'
                    : 'Setujui'}
                </button>

                <button
                  type="button"
                  className={styles.rejectButton}
                  disabled={isProcessing}
                  onClick={() => {
                    processAction(
                      'REJECT',
                    );
                  }}
                >
                  Tolak Pengajuan
                </button>
              </div>

              <p className={styles.actionHint}>
                Catatan wajib diisi
                sebelum memberikan
                keputusan.
              </p>
            </>
          ) : (
            <div className={styles.processedState}>
              <span
                className={styles.largeStatusBadge}
                data-variant={
                  statusConfig.variant
                }
              >
                {statusConfig.label}
              </span>

              <p>
                Pengajuan ini sudah
                diproses dan tidak
                memerlukan tindakan
                approval lagi.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ApprovalDetailPage;