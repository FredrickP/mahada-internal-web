import {
  useMemo,
  useState,
} from 'react';

import {
  Building2,
  CheckCircle2,
  UserRoundCheck,
  Users,
} from 'lucide-react';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  useOrganization,
  useUpdateOrganizationMapping,
} from '../hooks/useOrganization';

import type {
  OrganizationMember,
} from '../types/administration.types';

import styles from './OrganizationPage.module.css';

interface OrganizationFilter {
  keyword: string;
  divisionId: string;
}

interface EditMappingState {
  userId: string;
  divisionId: string;
  managerId: string;
}

const initialFilter: OrganizationFilter = {
  keyword: '',
  divisionId: '',
};

function OrganizationPage() {
  const organizationQuery =
    useOrganization();

  const updateMappingMutation =
    useUpdateOrganizationMapping();

  const [
    formFilter,
    setFormFilter,
  ] = useState<OrganizationFilter>(
    initialFilter,
  );

  const [
    appliedFilter,
    setAppliedFilter,
  ] = useState<OrganizationFilter>(
    initialFilter,
  );

  const [
    editingMapping,
    setEditingMapping,
  ] = useState<EditMappingState | null>(
    null,
  );

  const filteredMembers =
    useMemo(() => {
      if (!organizationQuery.data) {
        return [];
      }

      const keyword =
        appliedFilter.keyword
          .trim()
          .toLowerCase();

      return organizationQuery.data.members.filter(
        (member) => {
          const matchesKeyword =
            !keyword ||
            member.name
              .toLowerCase()
              .includes(keyword) ||
            member.email
              .toLowerCase()
              .includes(keyword);

          const matchesDivision =
            !appliedFilter.divisionId ||
            member.divisionId ===
              appliedFilter.divisionId;

          return (
            matchesKeyword &&
            matchesDivision
          );
        },
      );
    }, [
      appliedFilter,
      organizationQuery.data,
    ]);

  const getManagerOptions = (
    member: OrganizationMember,
    divisionId: string,
  ) => {
    if (!organizationQuery.data) {
      return [];
    }

    return organizationQuery.data.members.filter(
      (candidate) => {
        return (
          candidate.id !== member.id &&
          candidate.status === 'ACTIVE' &&
          candidate.divisionId === divisionId
        );
      },
    );
  };

  const handleFilter = () => {
    setAppliedFilter({
      ...formFilter,
    });
  };

  const handleResetFilter = () => {
    setFormFilter(
      initialFilter,
    );

    setAppliedFilter(
      initialFilter,
    );
  };

  const handleStartEdit = (
    member: OrganizationMember,
  ) => {
    updateMappingMutation.reset();

    setEditingMapping({
      userId: member.id,
      divisionId:
        member.divisionId,
      managerId:
        member.managerId ?? '',
    });
  };

  const handleCancelEdit = () => {
    updateMappingMutation.reset();

    setEditingMapping(
      null,
    );
  };

  const handleDivisionChange = (
    divisionId: string,
  ) => {
    setEditingMapping(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          divisionId,
          managerId: '',
        };
      },
    );
  };

  const handleManagerChange = (
    managerId: string,
  ) => {
    setEditingMapping(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          managerId,
        };
      },
    );
  };

  const handleSaveMapping = () => {
    if (!editingMapping) {
      return;
    }

    updateMappingMutation.mutate(
      {
        userId:
          editingMapping.userId,
        divisionId:
          editingMapping.divisionId,
        managerId:
          editingMapping.managerId ||
          null,
      },
      {
        onSuccess: () => {
          setEditingMapping(
            null,
          );
        },
      },
    );
  };

  if (
    organizationQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat struktur organisasi...
      </div>
    );
  }

  if (
    organizationQuery.isError ||
    !organizationQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            organizationQuery.error,
            'Struktur organisasi gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            organizationQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const {
    summary,
    divisions,
  } = organizationQuery.data;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>
            Struktur Organisasi
          </h1>

          <p>
            Kelola pembagian divisi
            dan mapping atasan langsung
            setiap pengguna.
          </p>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="gold"
          >
            <Building2
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Total Divisi
            </span>

            <strong>
              {summary.totalDivisions}
            </strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="green"
          >
            <Users
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Total Karyawan
            </span>

            <strong>
              {summary.totalEmployees}
            </strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="blue"
          >
            <UserRoundCheck
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Mapping Aktif
            </span>

            <strong>
              {summary.totalMappedManagers}
            </strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            data-variant="orange"
          >
            <CheckCircle2
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <span>
              Belum Mapping
            </span>

            <strong>
              {summary.unmappedManagers}
            </strong>
          </div>
        </article>
      </section>

      <section className={styles.divisionSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>
              Divisi
            </h2>

            <p>
              Ringkasan struktur divisi
              aktif di perusahaan.
            </p>
          </div>
        </div>

        <div className={styles.divisionGrid}>
          {divisions.map(
            (division) => (
              <article
                key={division.id}
                className={styles.divisionCard}
              >
                <div className={styles.divisionCode}>
                  {division.code}
                </div>

                <div className={styles.divisionContent}>
                  <h3>
                    {division.name}
                  </h3>

                  <p>
                    Head:{' '}
                    <strong>
                      {division.headName}
                    </strong>
                  </p>
                </div>

                <div className={styles.employeeCount}>
                  <strong>
                    {
                      division.totalEmployees
                    }
                  </strong>

                  <span>
                    karyawan
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section className={styles.mappingSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>
              Mapping Karyawan
            </h2>

            <p>
              Atur divisi dan atasan langsung
              pengguna.
            </p>
          </div>
        </div>

        <div className={styles.filterCard}>
          <div className={styles.filterGrid}>
            <input
              type="text"
              placeholder="Cari nama atau email"
              value={formFilter.keyword}
              onChange={(event) => {
                setFormFilter(
                  (current) => ({
                    ...current,
                    keyword:
                      event.target.value,
                  }),
                );
              }}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter'
                ) {
                  handleFilter();
                }
              }}
            />

            <select
              value={formFilter.divisionId}
              onChange={(event) => {
                setFormFilter(
                  (current) => ({
                    ...current,
                    divisionId:
                      event.target.value,
                  }),
                );
              }}
            >
              <option value="">
                Semua divisi
              </option>

              {divisions.map(
                (division) => (
                  <option
                    key={division.id}
                    value={division.id}
                  >
                    {division.name}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              className={styles.filterButton}
              onClick={handleFilter}
            >
              Filter
            </button>

            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetFilter}
            >
              Reset
            </button>
          </div>
        </div>

        {updateMappingMutation.isError && (
          <div className={styles.errorMessage}>
            {getApiErrorMessage(
              updateMappingMutation.error,
              'Mapping organisasi gagal diperbarui.',
            )}
          </div>
        )}

        {updateMappingMutation.isSuccess && (
          <div className={styles.successMessage}>
            {
              updateMappingMutation.data.message
            }
          </div>
        )}

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Divisi</th>
                <th>Jabatan</th>
                <th>Atasan Langsung</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map(
                (member) => {
                  const isEditing =
                    editingMapping?.userId ===
                    member.id;

                  const selectedDivisionId =
                    isEditing
                      ? editingMapping.divisionId
                      : member.divisionId;

                  const managerOptions =
                    getManagerOptions(
                      member,
                      selectedDivisionId,
                    );

                  return (
                    <tr key={member.id}>
                      <td>
                        <div className={styles.memberIdentity}>
                          <strong>
                            {member.name}
                          </strong>

                          <span>
                            {member.email}
                          </span>
                        </div>
                      </td>

                      <td>
                        {isEditing ? (
                          <select
                            className={styles.tableSelect}
                            value={
                              editingMapping.divisionId
                            }
                            disabled={
                              updateMappingMutation.isPending
                            }
                            onChange={(event) => {
                              handleDivisionChange(
                                event.target.value,
                              );
                            }}
                          >
                            {divisions.map(
                              (division) => (
                                <option
                                  key={division.id}
                                  value={division.id}
                                >
                                  {division.name}
                                </option>
                              ),
                            )}
                          </select>
                        ) : (
                          member.divisionName
                        )}
                      </td>

                      <td>
                        {member.position}
                      </td>

                      <td>
                        {isEditing ? (
                          <select
                            className={styles.tableSelect}
                            value={
                              editingMapping.managerId
                            }
                            disabled={
                              updateMappingMutation.isPending
                            }
                            onChange={(event) => {
                              handleManagerChange(
                                event.target.value,
                              );
                            }}
                          >
                            <option value="">
                              Tanpa atasan
                            </option>

                            {managerOptions.map(
                              (manager) => (
                                <option
                                  key={manager.id}
                                  value={manager.id}
                                >
                                  {manager.name}
                                </option>
                              ),
                            )}
                          </select>
                        ) : (
                          <div className={styles.managerInformation}>
                            <strong>
                              {
                                member.managerName ??
                                'Belum diatur'
                              }
                            </strong>

                            {member.managerEmail && (
                              <span>
                                {
                                  member.managerEmail
                                }
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td>
                        <span
                          className={styles.statusBadge}
                          data-status={member.status}
                        >
                          {member.status === 'ACTIVE'
                            ? 'Aktif'
                            : 'Nonaktif'}
                        </span>
                      </td>

                      <td>
                        {isEditing ? (
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.cancelButton}
                              disabled={
                                updateMappingMutation.isPending
                              }
                              onClick={
                                handleCancelEdit
                              }
                            >
                              Batal
                            </button>

                            <button
                              type="button"
                              className={styles.saveButton}
                              disabled={
                                updateMappingMutation.isPending
                              }
                              onClick={
                                handleSaveMapping
                              }
                            >
                              {updateMappingMutation.isPending
                                ? 'Menyimpan...'
                                : 'Simpan'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => {
                              handleStartEdit(
                                member,
                              );
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className={styles.emptyState}>
              Tidak ada karyawan yang
              sesuai dengan filter.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default OrganizationPage;