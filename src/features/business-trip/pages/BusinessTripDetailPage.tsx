import {
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  FileText,
  Upload,
  X,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

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

  const handleClearFile = () => {
    setSelectedFile(
      null,
    );

    uploadMutation.reset();

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        '';
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }

    uploadMutation.mutate(
      {
        tripId:
          id,
        file:
          selectedFile,
      },
      {
        onSuccess: () => {
          handleClearFile();
        },
      },
    );
  };

  if (
    tripQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat detail perjalanan dinas...
      </div>
    );
  }

  if (
    tripQuery.isError ||
    !tripQuery.data
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
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

  const showEmptyEvidence =
    trip.evidences.length === 0 &&
    !selectedFile;

  return (
    <div className={styles.page}>
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
        />

        Kembali
      </button>

      <header
        className={
          styles.pageHeader
        }
      >
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
          className={
            styles.statusBadge
          }
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

      <div
        className={
          styles.contentGrid
        }
      >
        <div
          className={
            styles.leftColumn
          }
        >
          <section
            className={
              styles.card
            }
          >
            <h2>
              Informasi Perjalanan
            </h2>

            <div
              className={
                styles.detailGrid
              }
            >
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

              <div
                className={
                  styles.fullWidth
                }
              >
                <span>
                  Estimasi Biaya
                </span>

                <strong>
                  {formatCurrency(
                    trip.estimatedCost,
                  )}
                </strong>
              </div>

              <div
                className={
                  styles.fullWidth
                }
              >
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

          <section
            className={
              styles.card
            }
          >
            <h2>
              Bukti Perjalanan
            </h2>

            {trip.evidences.length > 0 && (
              <div
                className={
                  styles.evidenceList
                }
              >
                {trip.evidences.map(
                  (
                    evidence,
                  ) => {
                    const isImage =
                      evidence.fileType ===
                        'IMAGE' &&
                      Boolean(
                        evidence.fileUrl,
                      );

                    const isPdf =
                      evidence.fileType ===
                      'PDF';

                    return (
                      <div
                        key={
                          evidence.id
                        }
                        className={
                          styles.evidenceItem
                        }
                        style={{
                          alignItems:
                            isImage
                              ? 'stretch'
                              : 'flex-start',
                          flexDirection:
                            isImage
                              ? 'column'
                              : 'row',
                        }}
                      >
                        {isImage &&
                        evidence.fileUrl ? (
                          <a
                            href={
                              evidence.fileUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display:
                                'block',
                              overflow:
                                'hidden',
                              width:
                                '100%',
                              borderRadius:
                                '12px',
                              background:
                                '#f1f5f9',
                            }}
                          >
                            <img
                              src={
                                evidence.fileUrl
                              }
                              alt={
                                evidence.fileName
                              }
                              style={{
                                display:
                                  'block',
                                width:
                                  '100%',
                                maxHeight:
                                  '360px',
                                objectFit:
                                  'contain',
                              }}
                            />
                          </a>
                        ) : (
                          <FileText
                            size={20}
                          />
                        )}

                        <div
                          style={{
                            width:
                              '100%',
                          }}
                        >
                          {evidence.fileUrl &&
                          isPdf ? (
                            <a
                              href={
                                evidence.fileUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color:
                                  '#0f172a',
                                fontSize:
                                  '14px',
                                fontWeight:
                                  600,
                                textDecoration:
                                  'none',
                              }}
                            >
                              {
                                evidence.fileName
                              }
                            </a>
                          ) : (
                            <strong>
                              {
                                evidence.fileName
                              }
                            </strong>
                          )}

                          <span>
                            Diunggah{' '}
                            {
                              evidence.uploadedAt
                            }
                          </span>

                          {isImage && (
                            <span
                              style={{
                                marginTop:
                                  '4px',
                                color:
                                  '#64748b',
                              }}
                            >
                              Klik gambar untuk melihat ukuran penuh
                            </span>
                          )}

                          {isPdf &&
                            evidence.fileUrl && (
                              <span
                                style={{
                                  marginTop:
                                    '4px',
                                  color:
                                    '#64748b',
                                }}
                              >
                                Klik nama file untuk membuka PDF
                              </span>
                            )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}

            {showEmptyEvidence && (
              <p
                className={
                  styles.emptyText
                }
              >
                Belum ada bukti perjalanan.
              </p>
            )}

            {canUploadEvidence && (
              <div
                className={
                  styles.uploadArea
                }
              >
                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={
                    uploadMutation.isPending
                  }
                  onChange={(
                    event,
                  ) => {
                    setSelectedFile(
                      event.target
                        .files?.[0] ??
                        null,
                    );

                    uploadMutation.reset();
                  }}
                />

                {selectedFile && (
                  <div
                    className={
                      styles.selectedFile
                    }
                  >
                    <div
                      className={
                        styles.selectedFileInfo
                      }
                    >
                      <FileText
                        size={18}
                      />

                      <span>
                        {
                          selectedFile.name
                        }
                      </span>

                      <button
                        type="button"
                        className={
                          styles.clearFileButton
                        }
                        disabled={
                          uploadMutation.isPending
                        }
                        onClick={
                          handleClearFile
                        }
                        aria-label="Hapus file yang dipilih"
                        title="Hapus file"
                      >
                        <X
                          size={17}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      className={
                        styles.uploadButton
                      }
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
                  <div
                    className={
                      styles.errorMessage
                    }
                  >
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

        <aside
          className={
            styles.card
          }
        >
          <h2>
            Riwayat Proses
          </h2>

          <div
            className={
              styles.historyList
            }
          >
            {trip.history.map(
              (
                history,
                index,
              ) => {
                const isLastHistory =
                  index ===
                  trip.history.length -
                    1;

                return (
                  <div
                    key={
                      history.id
                    }
                    className={
                      styles.historyItem
                    }
                    data-final-status={
                      isLastHistory
                        ? history.status
                        : undefined
                    }
                  >
                    <span
                      className={
                        styles.historyDot
                      }
                    />

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
                );
              },
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BusinessTripDetailPage;