import {
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  FileText,
  Upload,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  useBusinessTripDetail,
  useUploadBusinessTripEvidence,
} from '../hooks/useBusinessTripDetail';

import styles from './BusinessTripDetailPage.module.css';

const formatCurrency = (
  value: number,
) => {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    },
  ).format(value);
};

function BusinessTripDetailPage() {
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
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null,
  );

  const tripQuery =
    useBusinessTripDetail(
      id,
    );

  const uploadMutation =
    useUploadBusinessTripEvidence();

  const handleBack = () => {
    navigate(
      '/hr-services',
    );
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }

    uploadMutation.mutate(
      {
        tripId: id,
        file:
          selectedFile,
      },
      {
        onSuccess: () => {
          setSelectedFile(
            null,
          );

          if (
            fileInputRef.current
          ) {
            fileInputRef.current.value =
              '';
          }
        },
      },
    );
  };

  if (
    tripQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat detail perjalanan dinas...
      </div>
    );
  }

  if (
    tripQuery.isError ||
    !tripQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            tripQuery.error,
            'Detail perjalanan dinas gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          onClick={() => {
            tripQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const trip =
    tripQuery.data;

  const canUploadEvidence =
    trip.status === 'APPROVED' ||
    trip.status === 'COMPLETED';

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
      >
        <ArrowLeft
          size={17}
        />

        Kembali
      </button>

      <header className={styles.pageHeader}>
        <div>
          <h1>
            Detail Perjalanan Dinas
          </h1>

          <p>
            {
              trip.requestNumber
            }
          </p>
        </div>

        <span
          className={styles.statusBadge}
          data-status={
            trip.status
          }
        >
          {trip.status ===
            'WAITING_APPROVAL' &&
            'Menunggu Approval'}

          {trip.status ===
            'SUBMITTED' &&
            'Diajukan'}

          {trip.status ===
            'APPROVED' &&
            'Disetujui'}

          {trip.status ===
            'REJECTED' &&
            'Ditolak'}

          {trip.status ===
            'COMPLETED' &&
            'Selesai'}
        </span>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <section className={styles.card}>
            <h2>
              Informasi Perjalanan
            </h2>

            <div className={styles.detailGrid}>
              <div>
                <span>
                  Karyawan
                </span>

                <strong>
                  {
                    trip.employeeName
                  }
                </strong>
              </div>

              <div>
                <span>
                  Divisi
                </span>

                <strong>
                  {
                    trip.employeeDivision
                  }
                </strong>
              </div>

              <div>
                <span>
                  Tujuan
                </span>

                <strong>
                  {
                    trip.destination
                  }
                </strong>
              </div>

              <div>
                <span>
                  Durasi
                </span>

                <strong>
                  {
                    trip.totalDays
                  }{' '}
                  hari
                </strong>
              </div>

              <div>
                <span>
                  Tanggal Mulai
                </span>

                <strong>
                  {
                    trip.startDate
                  }
                </strong>
              </div>

              <div>
                <span>
                  Tanggal Selesai
                </span>

                <strong>
                  {
                    trip.endDate
                  }
                </strong>
              </div>

              <div className={styles.fullWidth}>
                <span>
                  Estimasi Biaya
                </span>

                <strong>
                  {formatCurrency(
                    trip.estimatedCost,
                  )}
                </strong>
              </div>

              <div className={styles.fullWidth}>
                <span>
                  Keperluan
                </span>

                <p>
                  {
                    trip.purpose
                  }
                </p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>
              Bukti Perjalanan
            </h2>

            {trip.evidences.length >
            0 ? (
              <div className={styles.evidenceList}>
                {trip.evidences.map(
                  (evidence) => (
                    <div
                      key={
                        evidence.id
                      }
                      className={
                        styles.evidenceItem
                      }
                    >
                      <FileText
                        size={18}
                      />

                      <div>
                        <strong>
                          {
                            evidence.fileName
                          }
                        </strong>

                        <span>
                          Diunggah{' '}
                          {
                            evidence.uploadedAt
                          }
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className={styles.emptyText}>
                Belum ada bukti
                perjalanan.
              </p>
            )}

            {canUploadEvidence && (
              <div className={styles.uploadArea}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={
                    uploadMutation.isPending
                  }
                  onChange={(event) => {
                    setSelectedFile(
                      event.target
                        .files?.[0] ??
                        null,
                    );

                    uploadMutation.reset();
                  }}
                />

                {selectedFile && (
                  <div className={styles.selectedFile}>
                    <span>
                      {
                        selectedFile.name
                      }
                    </span>

                    <button
                      type="button"
                      disabled={
                        uploadMutation.isPending
                      }
                      onClick={
                        handleUpload
                      }
                    >
                      <Upload
                        size={15}
                      />

                      {uploadMutation.isPending
                        ? 'Mengunggah...'
                        : 'Upload Bukti'}
                    </button>
                  </div>
                )}

                {uploadMutation.isError && (
                  <div className={styles.errorMessage}>
                    {getApiErrorMessage(
                      uploadMutation.error,
                      'Bukti perjalanan gagal diunggah.',
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className={styles.card}>
          <h2>
            Riwayat Proses
          </h2>

          <div className={styles.historyList}>
            {trip.history.map(
              (history) => (
                <div
                  key={
                    history.id
                  }
                  className={styles.historyItem}
                >
                  <span className={styles.historyDot} />

                  <div>
                    <strong>
                      {
                        history.label
                      }
                    </strong>

                    <span>
                      {
                        history.date
                      }
                    </span>

                    {history.note && (
                      <p>
                        {
                          history.note
                        }
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BusinessTripDetailPage;