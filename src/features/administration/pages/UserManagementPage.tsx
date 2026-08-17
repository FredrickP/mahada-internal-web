import {
  useMemo,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  userRoleConfig,
  userStatusConfig,
} from '../constants/administration-config';

import { useUsers } from '../hooks/useUsers';

import {
  divisionOptions,
  roleOptions,
} from '../utils/administration-option';

import type {
  UserRole,
} from '../types/administration.types';

import styles from './UserManagementPage.module.css';

interface UserFilter {
  keyword: string;
  division: string;
  role: UserRole | '';
}

const initialFilter: UserFilter = {
  keyword: '',
  division: '',
  role: '',
};

function UserManagementPage() {
  const navigate = useNavigate();

  const usersQuery =
    useUsers();

  const [formFilter, setFormFilter] =
    useState<UserFilter>(
      initialFilter,
    );

  const [appliedFilter, setAppliedFilter] =
    useState<UserFilter>(
      initialFilter,
    );

  const filteredUsers =
    useMemo(() => {
      if (!usersQuery.data) {
        return [];
      }

      const keyword =
        appliedFilter.keyword
          .trim()
          .toLowerCase();

      return usersQuery.data.filter(
        (user) => {
          const matchKeyword =
            !keyword ||
            user.name
              .toLowerCase()
              .includes(keyword) ||
            user.email
              .toLowerCase()
              .includes(keyword);

          const matchDivision =
            !appliedFilter.division ||
            user.division ===
              appliedFilter.division;

          const matchRole =
            !appliedFilter.role ||
            user.role ===
              appliedFilter.role;

          return (
            matchKeyword &&
            matchDivision &&
            matchRole
          );
        },
      );
    }, [
      usersQuery.data,
      appliedFilter,
    ]);

  const handleFilter = () => {
    setAppliedFilter({
      ...formFilter,
    });
  };

  const handleCreateUser = () => {
    navigate(
      '/administration/users/create',
    );
  };

  const handleEditUser = (
    id: string,
  ) => {
    navigate(
      `/administration/users/${id}`,
    );
  };

  if (usersQuery.isLoading) {
    return (
      <div className={styles.stateContainer}>
        Memuat data pengguna...
      </div>
    );
  }

  if (
    usersQuery.isError ||
    !usersQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            usersQuery.error,
            'Data pengguna gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            usersQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>
            User Management
          </h1>

          <p>
            Kelola akun, divisi,
            jabatan, role, dan status
            pengguna.
          </p>
        </div>

        <button
          type="button"
          className={styles.createButton}
          onClick={handleCreateUser}
        >
          + Tambah Pengguna
        </button>
      </header>

      <section className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <input
            type="text"
            className={styles.searchInput}
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
            value={formFilter.division}
            onChange={(event) => {
              setFormFilter(
                (current) => ({
                  ...current,
                  division:
                    event.target.value,
                }),
              );
            }}
          >
            <option value="">
              Pilih divisi
            </option>

            {divisionOptions.map(
              (division) => (
                <option
                  key={division}
                  value={division}
                >
                  {division}
                </option>
              ),
            )}
          </select>

          <select
            value={formFilter.role}
            onChange={(event) => {
              setFormFilter(
                (current) => ({
                  ...current,
                  role:
                    event.target
                      .value as UserRole | '',
                }),
              );
            }}
          >
            <option value="">
              Pilih role
            </option>

            {roleOptions.map(
              (role) => (
                <option
                  key={role.value}
                  value={role.value}
                >
                  {role.label}
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
        </div>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Divisi</th>
                <th>Jabatan</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (user) => {
                  const roleConfig =
                    userRoleConfig[
                      user.role
                    ];

                  const statusConfig =
                    userStatusConfig[
                      user.status
                    ];

                  return (
                    <tr key={user.id}>
                      <td>
                        <strong
                          className={
                            styles.userName
                          }
                        >
                          {user.name}
                        </strong>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.division}
                      </td>

                      <td>
                        {user.position}
                      </td>

                      <td>
                        <span
                          className={
                            styles.roleBadge
                          }
                          data-role={
                            user.role
                          }
                        >
                          {
                            roleConfig
                              .label
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            styles.statusBadge
                          }
                          data-variant={
                            statusConfig
                              .variant
                          }
                        >
                          {
                            statusConfig
                              .label
                          }
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={
                            styles.editButton
                          }
                          onClick={() => {
                            handleEditUser(
                              user.id,
                            );
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>

          {filteredUsers.length ===
            0 && (
            <div className={styles.emptyState}>
              Tidak ada pengguna yang
              sesuai dengan filter.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserManagementPage;