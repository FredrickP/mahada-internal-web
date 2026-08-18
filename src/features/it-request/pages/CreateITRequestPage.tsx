import type {
  ChangeEvent,
  DragEvent,
} from 'react';

import {
  useRef,
  useState,
} from 'react';

import {
  zodResolver,
} from '@hookform/resolvers/zod';

import {
  useForm,
} from 'react-hook-form';

import {
  Upload,
  X,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import {
  useCreateITRequest,
} from '../hooks/useCreateITRequest';

import {
  createITRequestSchema,
  type CreateITRequestFormValues,
} from '../schemas/create-it-request.schema';

import {
  formatSubmissionDate,
} from '../utils/it-request-date';

import styles from './CreateITRequestPage.module.css';

const RequiredMark = () => {
  return (
    <span
      aria-hidden="true"
      style={{
        marginLeft: '3px',
        color: '#dc2626',
        fontWeight: 700,
      }}
    >
      *
    </span>
  );
};

function CreateITRequestPage() {
  const navigate =
    useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    attachments,
    setAttachments,
  ] = useState<File[]>(
    [],
  );

  const [
    isDragging,
    setIsDragging,
  ] = useState(
    false,
  );

  const {
    createMutation,
    saveDraftMutation,
  } = useCreateITRequest();

  const submissionDate =
    formatSubmissionDate(
      new Date(),
    );

  const {
    register,
    handleSubmit,
    getValues,
    formState: {
      errors,
    },
  } = useForm<CreateITRequestFormValues>({
    resolver:
      zodResolver(
        createITRequestSchema,
      ),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const addFiles = (
    files:
      | FileList
      | File[],
  ) => {
    const selectedFiles =
      Array.from(
        files,
      );

    setAttachments(
      (
        currentAttachments,
      ) => {
        const newFiles =
          selectedFiles.filter(
            (
              selectedFile,
            ) => {
              return !currentAttachments.some(
                (
                  currentFile,
                ) => {
                  return (
                    currentFile.name ===
                      selectedFile.name &&
                    currentFile.size ===
                      selectedFile.size
                  );
                },
              );
            },
          );

        return [
          ...currentAttachments,
          ...newFiles,
        ];
      },
    );
  };

  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    if (
      !event.target.files
    ) {
      return;
    }

    addFiles(
      event.target.files,
    );

    event.target.value =
      '';
  };

  const handleDragOver = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsDragging(
      true,
    );
  };

  const handleDragLeave = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsDragging(
      false,
    );
  };

  const handleDrop = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsDragging(
      false,
    );

    if (
      event.dataTransfer
        .files.length === 0
    ) {
      return;
    }

    addFiles(
      event.dataTransfer.files,
    );
  };

  const handleRemoveAttachment = (
    index: number,
  ) => {
    setAttachments(
      (
        currentAttachments,
      ) => {
        return currentAttachments.filter(
          (
            _,
            currentIndex,
          ) => {
            return (
              currentIndex !==
              index
            );
          },
        );
      },
    );
  };

  const handleSaveDraft = () => {
    const values =
      getValues();

    saveDraftMutation.mutate(
      {
        type:
          values.type,
        title:
          values.title,
        description:
          values.description,
        priority:
          values.priority,
        attachments,
      },
      {
        onSuccess: () => {
          navigate(
            '/it-request',
            {
              replace: true,
            },
          );
        },
      },
    );
  };

  const handleSendRequest = (
    values:
      CreateITRequestFormValues,
  ) => {
    createMutation.mutate(
      {
        type:
          values.type,
        title:
          values.title,
        description:
          values.description,
        priority:
          values.priority,
        attachments,
      },
      {
        onSuccess: () => {
          navigate(
            '/it-request',
            {
              replace: true,
            },
          );
        },
      },
    );
  };

  const requestError =
    createMutation.isError
      ? getApiErrorMessage(
          createMutation.error,
          'IT Request gagal dikirim.',
        )
      : saveDraftMutation.isError
        ? getApiErrorMessage(
            saveDraftMutation.error,
            'Draft gagal disimpan.',
          )
        : null;

  const isProcessing =
    createMutation.isPending ||
    saveDraftMutation.isPending;

  return (
    <div
      className={
        styles.page
      }
    >
      <div
        className={
          styles.pageHeader
        }
      >
        <h1
          className={
            styles.pageTitle
          }
        >
          Buat IT Request
        </h1>

        <p
          className={
            styles.pageDescription
          }
        >
          Lengkapi informasi agar tim IT
          dapat menindaklanjuti.
        </p>
      </div>

      <div
        className={
          styles.contentGrid
        }
      >
        <form
          className={
            styles.formCard
          }
          onSubmit={
            handleSubmit(
              handleSendRequest,
            )
          }
          noValidate
        >
          <h2
            className={
              styles.formTitle
            }
          >
            Informasi Request
          </h2>

          <div
            className={
              styles.twoColumnGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="type"
                className={
                  styles.label
                }
              >
                Jenis Request
                <RequiredMark />
              </label>

              <select
                id="type"
                className={`${styles.input} ${
                  errors.type
                    ? styles.inputError
                    : ''
                }`}
                defaultValue=""
                {...register(
                  'type',
                )}
              >
                <option
                  value=""
                  disabled
                >
                  Pilih Request / Change /
                  Incident
                </option>

                <option
                  value="REQUEST"
                >
                  Request
                </option>

                <option
                  value="CHANGE"
                >
                  Change
                </option>

                <option
                  value="INCIDENT"
                >
                  Incident
                </option>
              </select>

              {errors.type && (
                <p
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.type.message
                  }
                </p>
              )}
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="submissionDate"
                className={
                  styles.label
                }
              >
                Tanggal Pengajuan
              </label>

              <input
                id="submissionDate"
                type="text"
                value={
                  submissionDate
                }
                className={`${styles.input} ${styles.readOnlyInput}`}
                readOnly
              />
            </div>
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label
              htmlFor="title"
              className={
                styles.label
              }
            >
              Judul Request
              <RequiredMark />
            </label>

            <input
              id="title"
              type="text"
              className={`${styles.input} ${
                errors.title
                  ? styles.inputError
                  : ''
              }`}
              placeholder="Contoh: Tidak dapat mengakses VPN"
              {...register(
                'title',
              )}
            />

            {errors.title && (
              <p
                className={
                  styles.errorText
                }
              >
                {
                  errors.title.message
                }
              </p>
            )}
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label
              htmlFor="description"
              className={
                styles.label
              }
            >
              Deskripsi Masalah / Kebutuhan
              <RequiredMark />
            </label>

            <textarea
              id="description"
              rows={6}
              className={`${styles.input} ${styles.textarea} ${
                errors.description
                  ? styles.inputError
                  : ''
              }`}
              placeholder="Jelaskan kondisi, dampak, dan kebutuhan secara rinci..."
              {...register(
                'description',
              )}
            />

            {errors.description && (
              <p
                className={
                  styles.errorText
                }
              >
                {
                  errors.description
                    .message
                }
              </p>
            )}
          </div>

          <div
            className={
              styles.priorityWrapper
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="priority"
                className={
                  styles.label
                }
              >
                Prioritas
                <RequiredMark />
              </label>

              <select
                id="priority"
                className={`${styles.input} ${
                  errors.priority
                    ? styles.inputError
                    : ''
                }`}
                defaultValue=""
                {...register(
                  'priority',
                )}
              >
                <option
                  value=""
                  disabled
                >
                  Pilih prioritas
                </option>

                <option
                  value="LOW"
                >
                  Rendah
                </option>

                <option
                  value="MEDIUM"
                >
                  Sedang
                </option>

                <option
                  value="HIGH"
                >
                  Tinggi
                </option>
              </select>

              {errors.priority && (
                <p
                  className={
                    styles.errorText
                  }
                >
                  {
                    errors.priority
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <div
              className={
                styles.attachmentHeader
              }
            >
              <label
                className={
                  styles.label
                }
              >
                Lampiran
              </label>

              <span
                className={
                  styles.attachmentHint
                }
              >
                Unggah screenshot atau
                dokumen
              </span>
            </div>

            <input
              ref={
                fileInputRef
              }
              type="file"
              multiple
              className={
                styles.hiddenFileInput
              }
              onChange={
                handleFileChange
              }
            />

            <div
              className={`${styles.dropZone} ${
                isDragging
                  ? styles.dropZoneActive
                  : ''
              }`}
              role="button"
              tabIndex={0}
              onClick={() => {
                fileInputRef.current?.click();
              }}
              onKeyDown={(
                event,
              ) => {
                if (
                  event.key ===
                    'Enter' ||
                  event.key ===
                    ' '
                ) {
                  event.preventDefault();

                  fileInputRef.current?.click();
                }
              }}
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={
                handleDrop
              }
            >
              <span
                style={{
                  display:
                    'inline-flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  gap:
                    '8px',
                }}
              >
                <Upload
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                Tarik file ke sini atau
                pilih dari perangkat
              </span>
            </div>

            {attachments.length >
              0 && (
              <div
                className={
                  styles.attachmentList
                }
              >
                {attachments.map(
                  (
                    attachment,
                    index,
                  ) => (
                    <div
                      key={`${attachment.name}-${attachment.size}-${index}`}
                      className={
                        styles.attachmentItem
                      }
                    >
                      <div
                        className={
                          styles.attachmentInfo
                        }
                      >
                        <span
                          className={
                            styles.attachmentName
                          }
                        >
                          {
                            attachment.name
                          }
                        </span>

                        <span
                          className={
                            styles.attachmentSize
                          }
                        >
                          {(
                            attachment.size /
                            1024
                          ).toFixed(
                            1,
                          )}{' '}
                          KB
                        </span>
                      </div>

                      <button
                        type="button"
                        className={
                          styles.removeAttachmentButton
                        }
                        onClick={() => {
                          handleRemoveAttachment(
                            index,
                          );
                        }}
                        aria-label={`Hapus ${attachment.name}`}
                      >
                        <X
                          size={16}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {requestError && (
            <div
              className={
                styles.requestError
              }
              role="alert"
            >
              {
                requestError
              }
            </div>
          )}

          <div
            className={
              styles.formActions
            }
          >
            <button
              type="button"
              className={
                styles.draftButton
              }
              disabled={
                isProcessing
              }
              onClick={
                handleSaveDraft
              }
            >
              {saveDraftMutation.isPending
                ? 'Menyimpan...'
                : 'Simpan Draft'}
            </button>

            <button
              type="submit"
              className={
                styles.submitButton
              }
              disabled={
                isProcessing
              }
            >
              {createMutation.isPending
                ? 'Mengirim...'
                : 'Kirim Request'}
            </button>
          </div>
        </form>

        <aside
          className={
            styles.guideCard
          }
        >
          <h2
            className={
              styles.guideTitle
            }
          >
            Panduan singkat
          </h2>

          <div
            className={
              styles.guideList
            }
          >
            <p>
              <span>
                •
              </span>

              Incident tidak memerlukan
              approval.
            </p>

            <p>
              <span>
                •
              </span>

              Request dan Change dikirim
              ke Head/Manager terlebih
              dahulu.
            </p>

            <p>
              <span>
                •
              </span>

              Lampirkan screenshot untuk
              mempercepat pemeriksaan.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CreateITRequestPage;