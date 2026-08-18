import {
  ArrowLeft,
  CheckCircle2,
  Play,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  useAuthStore,
} from '../../auth/store/auth.store';

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

import {
  useUpdateITRequestStatus,
} from '../hooks/useUpdateITRequestStatus';

import styles from './ITRequestDetailPage.module.css';

function ITRequestDetailPage() {
  const navigate =
    useNavigate();

  const {
    id = '',
  } = useParams<{
    id: string;
  }>();

  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  const detailQuery =
    useITRequestDetail(
      id,
    );

  const updateStatusMutation =
    useUpdateITRequestStatus();

  const isProcessor =
    Boolean(
      user?.roles.includes(
        'PROCESSOR',
      ) &&
        user.processorModules?.includes(
          'IT_REQUEST',
        ),
    );

  const handleBack = () => {
    navigate(
      '/it-request',
    );
  };

  const handleStartProcess = () => {
    updateStatusMutation.mutate({
      id,
      status:
        'IN_PROGRESS',
    });
  };

  const handleCompleteRequest = () => {
    updateStatusMutation.mutate({
      id,
      status:
        'COMPLETED',
    });
  };

  if (
    detailQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat detail IT Request...
      </div>
    );
  }

  if (
    detailQuery.isError ||
    !detailQuery.data
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        <p>
          {getApiErrorMessage(
            detailQuery.error,
            'Detail IT Request gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={
            styles.retryButton
          }
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

  const canStartProcess =
    isProcessor &&
    request.status ===
      'APPROVED';

  const canCompleteRequest =
    isProcessor &&
    request.status ===
      'IN_PROGRESS';

  const showProcessorAction =
    canStartProcess ||
    canCompleteRequest;

  const isProcessing =
    updateStatusMutation.isPending;

  return (
    <div
      className={
        styles.page
      }
    >
      <button
        type="button"
        className={
          styles.backButton
        }
        onClick={
          handleBack
        }
      >
        <ArrowLeft
          size={17}
          strokeWidth={1.8}
        />

        <span>
          Kembali ke IT Request
        </span>
      </button>

      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <p
            className={
              styles.requestNumber
            }
          >
            {
              request.requestNumber
            }
          </p>

          <h1
            className={
              styles.pageTitle
            }
          >
            {
              request.title
            }
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
          {
            statusConfig.label
          }
        </span>
      </div>

      {showProcessorAction && (
        <section
          className={
            styles.card
          }
          style={{
            marginBottom:
              '20px',
          }}
        >
          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'space-between',
              gap:
                '20px',
              flexWrap:
                'wrap',
            }}
          >
            <div>
              <h2
                className={
                  styles.cardTitle
                }
                style={{
                  marginBottom:
                    '6px',
                }}
              >
                Tindakan Processor
              </h2>

              <p
                style={{
                  margin:
                    0,
                  color:
                    '#64748b',
                  fontSize:
                    '14px',
                  lineHeight:
                    1.6,
                }}
              >
                {canStartProcess
                  ? 'Request sudah disetujui dan siap mulai diproses oleh tim IT.'
                  : 'Request sedang diproses dan dapat diselesaikan setelah pekerjaan selesai.'}
              </p>
            </div>

            {canStartProcess && (
              <button
                type="button"
                disabled={
                  isProcessing
                }
                onClick={
                  handleStartProcess
                }
                style={{
                  display:
                    'inline-flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  gap:
                    '8px',
                  minWidth:
                    '160px',
                  height:
                    '42px',
                  padding:
                    '0 18px',
                  border:
                    0,
                  borderRadius:
                    '10px',
                  background:
                    '#b8860b',
                  color:
                    '#ffffff',
                  fontSize:
                    '14px',
                  fontWeight:
                    700,
                  cursor:
                    isProcessing
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    isProcessing
                      ? 0.65
                      : 1,
                }}
              >
                <Play
                  size={17}
                  strokeWidth={2}
                />

                {isProcessing
                  ? 'Memproses...'
                  : 'Mulai Proses'}
              </button>
            )}

            {canCompleteRequest && (
              <button
                type="button"
                disabled={
                  isProcessing
                }
                onClick={
                  handleCompleteRequest
                }
                style={{
                  display:
                    'inline-flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  gap:
                    '8px',
                  minWidth:
                    '180px',
                  height:
                    '42px',
                  padding:
                    '0 18px',
                  border:
                    0,
                  borderRadius:
                    '10px',
                  background:
                    '#15803d',
                  color:
                    '#ffffff',
                  fontSize:
                    '14px',
                  fontWeight:
                    700,
                  cursor:
                    isProcessing
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    isProcessing
                      ? 0.65
                      : 1,
                }}
              >
                <CheckCircle2
                  size={18}
                  strokeWidth={2}
                />

                {isProcessing
                  ? 'Memproses...'
                  : 'Selesaikan Request'}
              </button>
            )}
          </div>

          {updateStatusMutation.isError && (
            <div
              style={{
                marginTop:
                  '16px',
                padding:
                  '12px 14px',
                borderRadius:
                  '8px',
                background:
                  '#fef2f2',
                color:
                  '#b91c1c',
                fontSize:
                  '13px',
                fontWeight:
                  500,
              }}
            >
              {getApiErrorMessage(
                updateStatusMutation.error,
                'Status IT Request gagal diperbarui.',
              )}
            </div>
          )}
        </section>
      )}

      <div
        className={
          styles.contentGrid
        }
      >
        <section
          className={
            styles.card
          }
        >
          <h2
            className={
              styles.cardTitle
            }
          >
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
                {
                  typeConfig.label
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

        <section
          className={
            styles.card
          }
        >
          <h2
            className={
              styles.cardTitle
            }
          >
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

      <section
        className={
          styles.card
        }
      >
        <h2
          className={
            styles.cardTitle
          }
        >
          Lampiran
        </h2>

        {request.attachments.length ===
        0 ? (
          <p
            className={
              styles.emptyText
            }
          >
            Tidak ada lampiran.
          </p>
        ) : (
          <div
            className={
              styles.attachmentList
            }
          >
            {request.attachments.map(
              (
                attachment,
              ) => (
                <div
                  key={
                    attachment.id
                  }
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

      <section
        className={
          styles.card
        }
      >
        <h2
          className={
            styles.cardTitle
          }
        >
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
                  key={
                    history.id
                  }
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
                        {
                          history.notes
                        }
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