import {
  ArrowLeft,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import {
  itRequestStatusConfig,
  itRequestTypeConfig,
} from '../constants/it-request-config';

import {
  useITRequestDetail,
} from '../hooks/useITRequestDetail';

import styles from './ITRequestDetailPage.module.css';

function ITRequestDetailPage() {
  const navigate = useNavigate();

  const {
    id = '',
  } = useParams<{
    id: string;
  }>();

  const detailQuery =
    useITRequestDetail(id);

  const handleBack = () => {
    navigate('/it-request');
  };

  if (detailQuery.isLoading) {
    return (
      <div className={styles.stateContainer}>
        Memuat detail IT Request...
      </div>
    );
  }

  if (
    detailQuery.isError ||
    !detailQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            detailQuery.error,
            'Detail IT Request gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            detailQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const request =
    detailQuery.data;

  const typeConfig =
    itRequestTypeConfig[
      request.type
    ];

  const statusConfig =
    itRequestStatusConfig[
      request.status
    ];

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
          Kembali ke IT Request
        </span>
      </button>

      <div className={styles.pageHeader}>
        <div>
          <p
            className={
              styles.requestNumber
            }
          >
            {request.requestNumber}
          </p>

          <h1
            className={
              styles.pageTitle
            }
          >
            {request.title}
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            Detail dan riwayat
            IT Request.
          </p>
        </div>

        <span
          className={
            styles.statusBadge
          }
          data-variant={
            statusConfig.variant
          }
        >
          {statusConfig.label}
        </span>
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            Informasi Request
          </h2>

          <div
            className={
              styles.infoGrid
            }
          >
            <div
              className={
                styles.infoItem
              }
            >
              <span
                className={
                  styles.infoLabel
                }
              >
                Jenis
              </span>

              <strong>
                {typeConfig.label}
              </strong>
            </div>

            <div
              className={
                styles.infoItem
              }
            >
              <span
                className={
                  styles.infoLabel
                }
              >
                Tanggal Pengajuan
              </span>

              <strong>
                {
                  request.submissionDate
                }
              </strong>
            </div>

            <div
              className={
                styles.infoItem
              }
            >
              <span
                className={
                  styles.infoLabel
                }
              >
                Prioritas
              </span>

              <strong>
                {
                  request.priority ??
                  '-'
                }
              </strong>
            </div>

            <div
              className={
                styles.infoItem
              }
            >
              <span
                className={
                  styles.infoLabel
                }
              >
                PIC IT
              </span>

              <strong>
                {
                  request.picName ??
                  '-'
                }
              </strong>
            </div>
          </div>

          <div
            className={
              styles.descriptionSection
            }
          >
            <span
              className={
                styles.infoLabel
              }
            >
              Deskripsi
            </span>

            <p>
              {
                request.description ??
                '-'
              }
            </p>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            Pemohon
          </h2>

          <div
            className={
              styles.infoList
            }
          >
            <div>
              <span
                className={
                  styles.infoLabel
                }
              >
                Nama
              </span>

              <strong>
                {
                  request.requesterName
                }
              </strong>
            </div>

            <div>
              <span
                className={
                  styles.infoLabel
                }
              >
                Divisi
              </span>

              <strong>
                {
                  request.requesterDivision
                }
              </strong>
            </div>

            <div>
              <span
                className={
                  styles.infoLabel
                }
              >
                Email
              </span>

              <strong>
                {
                  request.requesterEmail ??
                  '-'
                }
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          Lampiran
        </h2>

        {request.attachments.length ===
        0 ? (
          <p className={styles.emptyText}>
            Tidak ada lampiran.
          </p>
        ) : (
          <div
            className={
              styles.attachmentList
            }
          >
            {request.attachments.map(
              (attachment) => (
                <div
                  key={attachment.id}
                  className={
                    styles.attachmentItem
                  }
                >
                  <span>
                    {
                      attachment.fileName
                    }
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          Riwayat Status
        </h2>

        <div
          className={
            styles.historyList
          }
        >
          {request.history.map(
            (history) => {
              const historyStatus =
                itRequestStatusConfig[
                  history.status
                ];

              return (
                <div
                  key={history.id}
                  className={
                    styles.historyItem
                  }
                >
                  <div>
                    <strong>
                      {
                        historyStatus.label
                      }
                    </strong>

                    <p>
                      {
                        history.actionBy
                      }
                    </p>

                    {history.notes && (
                      <p>
                        {history.notes}
                      </p>
                    )}
                  </div>

                  <span>
                    {
                      history.actionDate
                    }
                  </span>
                </div>
              );
            },
          )}
        </div>
      </section>
    </div>
  );
}

export default ITRequestDetailPage;