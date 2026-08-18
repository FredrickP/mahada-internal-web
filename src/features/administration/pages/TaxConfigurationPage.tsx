import {
  useState,
} from 'react';

import {
  Percent,
} from 'lucide-react';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import {
  useTaxConfiguration,
  useUpdateTaxConfiguration,
} from '../hooks/useTaxConfiguration';

import type {
  TaxConfiguration,
} from '../types/administration.types';

import styles from './TaxConfigurationPage.module.css';

interface EditTaxState {
  id: string;
  rate: string;
  isActive: boolean;
}

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

function TaxConfigurationPage() {
  const taxQuery =
    useTaxConfiguration();

  const updateMutation =
    useUpdateTaxConfiguration();

  const [
    editingTax,
    setEditingTax,
  ] = useState<EditTaxState | null>(
    null,
  );

  const [
    validationError,
    setValidationError,
  ] = useState('');

  const handleEdit = (
    tax: TaxConfiguration,
  ) => {
    updateMutation.reset();

    setValidationError('');

    setEditingTax({
      id: tax.id,
      rate: String(
        tax.rate,
      ),
      isActive:
        tax.isActive,
    });
  };

  const handleCancel = () => {
    updateMutation.reset();

    setValidationError('');

    setEditingTax(
      null,
    );
  };

  const handleSave = () => {
    if (
      !editingTax
    ) {
      return;
    }

    const rate =
      Number(
        editingTax.rate,
      );

    if (
      editingTax.rate.trim() ===
        '' ||
      Number.isNaN(
        rate,
      )
    ) {
      setValidationError(
        'Tarif pajak wajib diisi.',
      );

      return;
    }

    if (
      rate < 0 ||
      rate > 100
    ) {
      setValidationError(
        'Tarif pajak harus antara 0 sampai 100 persen.',
      );

      return;
    }

    setValidationError('');

    updateMutation.mutate(
      {
        id:
          editingTax.id,
        rate,
        isActive:
          editingTax.isActive,
      },
      {
        onSuccess: () => {
          setEditingTax(
            null,
          );
        },
      },
    );
  };

  if (
    taxQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        Memuat konfigurasi pajak...
      </div>
    );
  }

  if (
    taxQuery.isError ||
    !taxQuery.data
  ) {
    return (
      <div
        className={
          styles.stateContainer
        }
      >
        <p>
          {getApiErrorMessage(
            taxQuery.error,
            'Konfigurasi pajak gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={
            styles.retryButton
          }
          onClick={() => {
            taxQuery.refetch();
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
        <h1>
          Konfigurasi Pajak
        </h1>

        <p>
          Atur tarif pajak yang digunakan
          dalam perhitungan pengajuan pembayaran.
        </p>
      </header>

      {updateMutation.isSuccess && (
        <div
          className={
            styles.successMessage
          }
        >
          {
            updateMutation.data.message
          }
        </div>
      )}

      <section
        className={
          styles.configurationSection
        }
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <h2>
            Tarif Pajak
          </h2>

          <p>
            Tarif aktif digunakan pada
            perhitungan pembayaran.
          </p>
        </div>

        <div
          className={
            styles.taxList
          }
        >
          {taxQuery.data.configurations.map(
            (
              tax,
            ) => {
              const isEditing =
                editingTax?.id ===
                tax.id;

              return (
                <article
                  key={
                    tax.id
                  }
                  className={
                    styles.taxCard
                  }
                >
                  <div
                    className={
                      styles.taxIcon
                    }
                  >
                    <Percent
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div
                    className={
                      styles.taxInformation
                    }
                  >
                    <div
                      className={
                        styles.taxTitle
                      }
                    >
                      <h3>
                        {
                          tax.name
                        }
                      </h3>

                      <span
                        data-active={
                          isEditing
                            ? editingTax.isActive
                            : tax.isActive
                        }
                      >
                        {(isEditing
                          ? editingTax.isActive
                          : tax.isActive)
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>

                    <p>
                      {
                        tax.description
                      }
                    </p>
                  </div>

                  {isEditing ? (
                    <div
                      className={
                        styles.editArea
                      }
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          flexDirection:
                            'column',
                          gap:
                            '6px',
                        }}
                      >
                        <label
                          style={{
                            color:
                              '#334155',
                            fontSize:
                              '13px',
                            fontWeight:
                              600,
                          }}
                        >
                          Tarif Pajak
                          <RequiredMark />
                        </label>

                        <div
                          className={
                            styles.rateInput
                          }
                        >
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={
                              editingTax.rate
                            }
                            disabled={
                              updateMutation.isPending
                            }
                            onChange={(
                              event,
                            ) => {
                              setEditingTax(
                                (
                                  current,
                                ) => {
                                  if (
                                    !current
                                  ) {
                                    return current;
                                  }

                                  return {
                                    ...current,
                                    rate:
                                      event.target.value,
                                  };
                                },
                              );

                              setValidationError(
                                '',
                              );
                            }}
                          />

                          <span>
                            %
                          </span>
                        </div>
                      </div>

                      <label
                        className={
                          styles.statusToggle
                        }
                      >
                        <input
                          type="checkbox"
                          checked={
                            editingTax.isActive
                          }
                          disabled={
                            updateMutation.isPending
                          }
                          onChange={(
                            event,
                          ) => {
                            setEditingTax(
                              (
                                current,
                              ) => {
                                if (
                                  !current
                                ) {
                                  return current;
                                }

                                return {
                                  ...current,
                                  isActive:
                                    event.target.checked,
                                };
                              },
                            );
                          }}
                        />

                        <span>
                          Aktif
                        </span>
                      </label>

                      <div
                        className={
                          styles.actions
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.cancelButton
                          }
                          disabled={
                            updateMutation.isPending
                          }
                          onClick={
                            handleCancel
                          }
                        >
                          Batal
                        </button>

                        <button
                          type="button"
                          className={
                            styles.saveButton
                          }
                          disabled={
                            updateMutation.isPending
                          }
                          onClick={
                            handleSave
                          }
                        >
                          {updateMutation.isPending
                            ? 'Menyimpan...'
                            : 'Simpan'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        styles.taxValue
                      }
                    >
                      <strong>
                        {
                          tax.rate
                        }
                        %
                      </strong>

                      <button
                        type="button"
                        onClick={() => {
                          handleEdit(
                            tax,
                          );
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </article>
              );
            },
          )}
        </div>

        {validationError && (
          <div
            className={
              styles.errorMessage
            }
          >
            {
              validationError
            }
          </div>
        )}

        {updateMutation.isError && (
          <div
            className={
              styles.errorMessage
            }
          >
            {getApiErrorMessage(
              updateMutation.error,
              'Konfigurasi pajak gagal diperbarui.',
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default TaxConfigurationPage;