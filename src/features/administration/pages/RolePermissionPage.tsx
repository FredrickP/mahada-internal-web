import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import { useRoles } from '../hooks/useRoles';

import type {
  UserRole,
} from '../types/administration.types';

import styles from './RolePermissionPage.module.css';

interface PermissionRow {
  id: string;
  feature: string;
  permissions: Record<UserRole, boolean>;
}

const permissionMatrix: PermissionRow[] = [
  {
    id: 'CREATE_SUBMISSION',
    feature: 'Buat pengajuan',
    permissions: {
      USER: true,
      APPROVER: true,
      PROCESSOR: true,
      ADMIN: true,
    },
  },
  {
    id: 'APPROVE_REJECT',
    feature: 'Approve / Reject',
    permissions: {
      USER: false,
      APPROVER: true,
      PROCESSOR: false,
      ADMIN: true,
    },
  },
  {
    id: 'PROCESS_SUBMISSION',
    feature: 'Proses pengajuan',
    permissions: {
      USER: false,
      APPROVER: false,
      PROCESSOR: true,
      ADMIN: true,
    },
  },
  {
    id: 'MANAGE_USER_ROLE',
    feature: 'Kelola user & role',
    permissions: {
      USER: false,
      APPROVER: false,
      PROCESSOR: false,
      ADMIN: true,
    },
  },
];

const roleOrder: UserRole[] = [
  'USER',
  'APPROVER',
  'PROCESSOR',
  'ADMIN',
];

function RolePermissionPage() {
  const navigate = useNavigate();

  const rolesQuery =
    useRoles();

  const handleAddRole = () => {
    console.log(
      'Add custom role belum diimplementasikan',
    );
  };

  const handleManagePermission = (
    role: UserRole,
  ) => {
    navigate(
      `/administration/roles/${role}`,
    );
  };

  if (rolesQuery.isLoading) {
    return (
      <div className={styles.stateContainer}>
        Memuat role dan permission...
      </div>
    );
  }

  if (
    rolesQuery.isError ||
    !rolesQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            rolesQuery.error,
            'Data role gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            rolesQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const roles =
    roleOrder
      .map((roleName) => {
        return rolesQuery.data.find(
          (role) =>
            role.name === roleName,
        );
      })
      .filter(
        (role) =>
          role !== undefined,
      );

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>
            Role & Permission
          </h1>

          <p>
            Atur hak akses User,
            Approver, Processor,
            dan Admin.
          </p>
        </div>

        <button
          type="button"
          className={styles.createButton}
          onClick={handleAddRole}
        >
          + Tambah Role
        </button>
      </header>

      <section className={styles.roleSection}>
        <h2>
          Role Aplikasi
        </h2>

        <div className={styles.roleList}>
          {roles.map((role) => (
            <article
              key={role.id}
              className={styles.roleCard}
            >
              <div
                className={styles.roleIcon}
                data-role={role.name}
              >
                {role.name === 'USER' && 'US'}
                {role.name === 'APPROVER' && 'AP'}
                {role.name === 'PROCESSOR' && 'PR'}
                {role.name === 'ADMIN' && 'AD'}
              </div>

              <div className={styles.roleContent}>
                <h3>
                  {role.displayName}
                </h3>

                <p>
                  {role.description}
                </p>
              </div>

              <div className={styles.roleAction}>
                <strong>
                  {role.totalUsers}{' '}
                  pengguna
                </strong>

                <button
                  type="button"
                  onClick={() => {
                    handleManagePermission(
                      role.name,
                    );
                  }}
                >
                  Atur Permission
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.permissionSection}>
        <h2>
          Permission Matrix
        </h2>

        <div className={styles.tableWrapper}>
          <table className={styles.permissionTable}>
            <thead>
              <tr>
                <th>
                  Fitur
                </th>

                {roles.map((role) => (
                  <th key={role.id}>
                    {role.displayName}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {permissionMatrix.map(
                (permission) => (
                  <tr key={permission.id}>
                    <td>
                      {permission.feature}
                    </td>

                    {roles.map((role) => {
                      const allowed =
                        permission
                          .permissions[
                            role.name
                          ];

                      return (
                        <td key={role.id}>
                          <span
                            className={
                              allowed
                                ? styles.allowed
                                : styles.notAllowed
                            }
                          >
                            {allowed
                              ? '✓'
                              : '—'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default RolePermissionPage;