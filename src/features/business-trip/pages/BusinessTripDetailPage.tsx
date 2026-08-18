import {
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  X,
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
  useBusinessTripDetail,
  useCompleteBusinessTrip,
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

  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

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

  const completeMutation =
    useCompleteBusinessTrip();

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
    if (
      !selectedFile
    ) {
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

  const handleComplete = () => {
    completeMutation.mutate(
      id,
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

  const isRegularUser =
    Boolean(
      user?.roles.includes(
        'USER',
      ) &&
        !user.roles.includes(
          'APPROVER',
        ) &&
        !user.roles.includes(
          'PROCESSOR',
        ) &&
        !user.roles.includes(
          'ADMIN',
        ),
    );

  const isTripOwner =
    Boolean(
      user?.name &&
        user.name ===
          trip.employeeName,
    );

  const canManageEvidence =
    isRegularUser &&
    isTripOwner &&
    trip.status ===
      'APPROVED';

  const canCompleteTrip =
    canManageEvidence &&
    trip.evidences.length >
      0;

  const showEmptyEvidence =
    trip.evidences.length ===
      0 &&
    !selectedFile;

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

            {trip.evidences.length >
              0 && (
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

            {canManageEvidence && (
              <div
                className={
                  styles.uploadArea
                }
              >
                <div
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      '10px',
                  }}
                >
                  <Upload
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    style={{
                      flexShrink:
                        0,
                      color:
                        '#64748b',
                    }}
                  />

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={
                      uploadMutation.isPending ||
                      completeMutation.isPending
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
                    style={{
                      flex:
                        1,
                      minWidth:
                        0,
                    }}
                  />
                </div>

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

                {!canCompleteTrip && (
                  <p
                    style={{
                      margin:
                        '12px 0 0',
                      color:
                        '#64748b',
                      fontSize:
                        '13px',
                      lineHeight:
                        1.6,
                    }}
                  >
                    Upload minimal satu bukti perjalanan sebelum menyelesaikan perjalanan.
                  </p>
                )}

                {canCompleteTrip && (
                  <div
                    style={{
                      marginTop:
                        '18px',
                      paddingTop:
                        '18px',
                      borderTop:
                        '1px solid #e2e8f0',
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
                          '16px',
                        flexWrap:
                          'wrap',
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display:
                              'block',
                            color:
                              '#0f172a',
                            fontSize:
                              '14px',
                          }}
                        >
                          Bukti perjalanan sudah tersedia
                        </strong>

                        <span
                          style={{
                            display:
                              'block',
                            marginTop:
                              '4px',
                            color:
                              '#64748b',
                            fontSize:
                              '13px',
                          }}
                        >
                          Selesaikan perjalanan jika seluruh kegiatan sudah selesai.
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={
                          completeMutation.isPending ||
                          uploadMutation.isPending
                        }
                        onClick={
                          handleComplete
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
                            '190px',
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
                            completeMutation.isPending
                              ? 'not-allowed'
                              : 'pointer',
                          opacity:
                            completeMutation.isPending
                              ? 0.65
                              : 1,
                        }}
                      >
                        <CheckCircle2
                          size={17}
                        />

                        {completeMutation.isPending
                          ? 'Menyelesaikan...'
                          : 'Selesaikan Perjalanan'}
                      </button>
                    </div>

                    {completeMutation.isError && (
                      <div
                        className={
                          styles.errorMessage
                        }
                        style={{
                          marginTop:
                            '12px',
                        }}
                      >
                        {getApiErrorMessage(
                          completeMutation.error,
                          'Perjalanan dinas gagal diselesaikan.',
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {trip.status ===
              'COMPLETED' && (
              <div
                style={{
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap:
                    '8px',
                  marginTop:
                    '16px',
                  padding:
                    '12px 14px',
                  borderRadius:
                    '10px',
                  background:
                    '#f0fdf4',
                  color:
                    '#166534',
                  fontSize:
                    '13px',
                  fontWeight:
                    600,
                }}
              >
                <CheckCircle2
                  size={17}
                />

                Perjalanan dinas sudah selesai.
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