import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import {
  useRolePermission,
  useUpdateRolePermission,
} from '../hooks/useRolePermission';

import type {
  PermissionKey,
  UserRole,
} from '../types/administration.types';

import styles from './RolePermissionDetailPage.module.css';

const validRoles: UserRole[] = [
  'USER',
  'APPROVER',
  'PROCESSOR',
  'ADMIN',
];

const getRoleInitial = (
  role: UserRole,
): string => {
  switch (role) {
    case 'USER':
      return 'US';
    case 'APPROVER':
      return 'AP';
    case 'PROCESSOR':
      return 'PR';
    case 'ADMIN':
      return 'AD';
  }
};

function RolePermissionDetailPage() {
  const navigate = useNavigate();

  const {
    role: roleParam,
  } = useParams<{
    role: string;
  }>();

  const normalizedRole =
    roleParam?.toUpperCase();

  const role =
    normalizedRole &&
    validRoles.includes(
      normalizedRole as UserRole,
    )
      ? normalizedRole as UserRole
      : null;

  const rolePermissionQuery =
    useRolePermission(
      role,
    );

  const updatePermissionMutation =
    useUpdateRolePermission();

  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<PermissionKey[]>(
    [],
  );

  useEffect(() => {
    if (
      !rolePermissionQuery.data
    ) {
      return;
    }

    setSelectedPermissions(
      rolePermissionQuery.data.permissions
        .filter(
          (permission) =>
            permission.enabled,
        )
        .map(
          (permission) =>
            permission.key,
        ),
    );
  }, [
    rolePermissionQuery.data,
  ]);

  const originalPermissions =
    useMemo(() => {
      if (
        !rolePermissionQuery.data
      ) {
        return [];
      }

      return rolePermissionQuery.data.permissions
        .filter(
          (permission) =>
            permission.enabled,
        )
        .map(
          (permission) =>
            permission.key,
        )
        .sort();
    }, [
      rolePermissionQuery.data,
    ]);

  const currentPermissions =
    useMemo(() => {
      return [
        ...selectedPermissions,
      ].sort();
    }, [
      selectedPermissions,
    ]);

  const hasChanges =
    JSON.stringify(
      originalPermissions,
    ) !==
    JSON.stringify(
      currentPermissions,
    );

  const handleBack = () => {
    navigate(
      '/administration/roles',
    );
  };

  const handleTogglePermission = (
    permission: PermissionKey,
  ) => {
    updatePermissionMutation.reset();

    setSelectedPermissions(
      (current) => {
        const isSelected =
          current.includes(
            permission,
          );

        if (isSelected) {
          return current.filter(
            (item) =>
              item !== permission,
          );
        }

        return [
          ...current,
          permission,
        ];
      },
    );
  };

  const handleReset = () => {
    setSelectedPermissions(
      originalPermissions,
    );

    updatePermissionMutation.reset();
  };

  const handleSave = () => {
    if (!role) {
      return;
    }

    updatePermissionMutation.mutate({
      role,
      permissions:
        selectedPermissions,
    });
  };

  if (!role) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateIcon}>
          !
        </div>

        <h2>
          Role tidak valid
        </h2>

        <p>
          Role yang kamu buka tidak
          tersedia di aplikasi.
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={handleBack}
        >
          Kembali ke Role
        </button>
      </div>
    );
  }

  if (
    rolePermissionQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat permission role...
      </div>
    );
  }

  if (
    rolePermissionQuery.isError ||
    !rolePermissionQuery.data
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            rolePermissionQuery.error,
            'Permission role gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            rolePermissionQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const roleData =
    rolePermissionQuery.data;

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
          Kembali ke Role & Permission
        </span>
      </button>

      <header className={styles.pageHeader}>
        <div>
          <h1>
            Atur Permission
          </h1>

          <p>
            Tentukan fitur yang dapat
            diakses oleh role ini.
          </p>
        </div>
      </header>

      <section className={styles.roleCard}>
        <div
          className={styles.roleIcon}
          data-role={roleData.role}
        >
          {getRoleInitial(
            roleData.role,
          )}
        </div>

        <div className={styles.roleInformation}>
          <div className={styles.roleTitle}>
            <h2>
              {roleData.displayName}
            </h2>

            <span>
              {
                roleData.totalUsers
              }{' '}
              pengguna
            </span>
          </div>

          <p>
            {roleData.description}
          </p>
        </div>

        <div className={styles.roleStatus}>
          <ShieldCheck
            size={18}
            strokeWidth={1.8}
          />

          <span>
            {
              selectedPermissions.length
            }{' '}
            permission aktif
          </span>
        </div>
      </section>

      <section className={styles.permissionCard}>
        <div className={styles.permissionHeader}>
          <div>
            <h2>
              Permission Aplikasi
            </h2>

            <p>
              Aktifkan atau nonaktifkan
              akses sesuai kebutuhan role.
            </p>
          </div>

          <span className={styles.permissionCount}>
            {
              selectedPermissions.length
            }
            /
            {
              roleData.permissions.length
            }{' '}
            aktif
          </span>
        </div>

        <div className={styles.permissionList}>
          {roleData.permissions.map(
            (permission) => {
              const checked =
                selectedPermissions.includes(
                  permission.key,
                );

              return (
                <label
                  key={permission.key}
                  className={styles.permissionItem}
                  data-active={checked}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={
                      updatePermissionMutation.isPending
                    }
                    onChange={() => {
                      handleTogglePermission(
                        permission.key,
                      );
                    }}
                  />

                  <span
                    className={styles.customCheckbox}
                  >
                    {checked && (
                      <Check
                        size={14}
                        strokeWidth={2.5}
                      />
                    )}
                  </span>

                  <span className={styles.permissionContent}>
                    <strong>
                      {permission.label}
                    </strong>

                    <span>
                      {
                        permission.description
                      }
                    </span>
                  </span>

                  <span
                    className={styles.permissionStatus}
                    data-active={checked}
                  >
                    {checked
                      ? 'Aktif'
                      : 'Tidak Aktif'}
                  </span>
                </label>
              );
            },
          )}
        </div>
      </section>

      {updatePermissionMutation.isSuccess && (
        <div className={styles.successMessage}>
          {
            updatePermissionMutation.data.message
          }
        </div>
      )}

      {updatePermissionMutation.isError && (
        <div className={styles.errorMessage}>
          {getApiErrorMessage(
            updatePermissionMutation.error,
            'Permission gagal diperbarui.',
          )}
        </div>
      )}

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={
            updatePermissionMutation.isPending
          }
          onClick={
            hasChanges
              ? handleReset
              : handleBack
          }
        >
          {hasChanges
            ? 'Reset Perubahan'
            : 'Batal'}
        </button>

        <button
          type="button"
          className={styles.saveButton}
          disabled={
            !hasChanges ||
            updatePermissionMutation.isPending
          }
          onClick={handleSave}
        >
          {updatePermissionMutation.isPending
            ? 'Menyimpan...'
            : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}

export default RolePermissionDetailPage;