import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api/api-error';

import { useUserDetail } from '../hooks/useUserDetail';
import { useUserMutation } from '../hooks/useUserMutation';

import {
  updateUserSchema,
  type UpdateUserFormValues,
} from '../schemas/user.schema';

import {
  divisionOptions,
  roleOptions,
  statusOptions,
} from '../utils/administration-option';

import styles from './UserFormPage.module.css';

const defaultValues: UpdateUserFormValues = {
  name: '',
  email: '',
  division: '',
  position: '',
  role: 'USER',
  status: 'ACTIVE',
};

function UserFormPage() {
  const navigate = useNavigate();

  const {
    id = '',
  } = useParams<{
    id: string;
  }>();

  const isEditMode =
    Boolean(id);

  const userQuery =
    useUserDetail(
      isEditMode
        ? id
        : '',
    );

  const {
    createMutation,
    updateMutation,
  } = useUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(
      updateUserSchema,
    ),
    defaultValues,
  });

  useEffect(() => {
    if (
      !isEditMode ||
      !userQuery.data
    ) {
      return;
    }

    reset({
      name:
        userQuery.data.name,
      email:
        userQuery.data.email,
      division:
        userQuery.data.division,
      position:
        userQuery.data.position,
      role:
        userQuery.data.role,
      status:
        userQuery.data.status,
    });
  }, [
    isEditMode,
    userQuery.data,
    reset,
  ]);

  const isProcessing =
    createMutation.isPending ||
    updateMutation.isPending;

  const mutationError =
    createMutation.error ??
    updateMutation.error;

  const handleBack = () => {
    navigate(
      '/administration/users',
    );
  };

  const handleSave = (
    values: UpdateUserFormValues,
  ) => {
    if (isEditMode) {
      updateMutation.mutate(
        {
          id,
          input: {
            name:
              values.name,
            email:
              values.email,
            division:
              values.division,
            position:
              values.position,
            role:
              values.role,
            status:
              values.status,
          },
        },
        {
          onSuccess: () => {
            navigate(
              '/administration/users',
            );
          },
        },
      );

      return;
    }

    createMutation.mutate(
      {
        name:
          values.name,
        email:
          values.email,
        division:
          values.division,
        position:
          values.position,
        role:
          values.role,
      },
      {
        onSuccess: () => {
          navigate(
            '/administration/users',
          );
        },
      },
    );
  };

  if (
    isEditMode &&
    userQuery.isLoading
  ) {
    return (
      <div className={styles.stateContainer}>
        Memuat data pengguna...
      </div>
    );
  }

  if (
    isEditMode &&
    (
      userQuery.isError ||
      !userQuery.data
    )
  ) {
    return (
      <div className={styles.stateContainer}>
        <p>
          {getApiErrorMessage(
            userQuery.error,
            'Data pengguna gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            userQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

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
          Kembali ke User Management
        </span>
      </button>

      <header className={styles.pageHeader}>
        <h1>
          {isEditMode
            ? 'Edit Pengguna'
            : 'Tambah Pengguna'}
        </h1>

        <p>
          {isEditMode
            ? 'Perbarui informasi akun, divisi, jabatan, role, dan status pengguna.'
            : 'Tambahkan akun baru dan tentukan divisi, jabatan, serta role pengguna.'}
        </p>
      </header>

      <form
        className={styles.formCard}
        onSubmit={handleSubmit(
          handleSave,
        )}
      >
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>
              Informasi Pengguna
            </h2>

            <p>
              Data dasar akun yang digunakan
              untuk mengakses aplikasi.
            </p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                Nama Lengkap
              </label>

              <input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                disabled={isProcessing}
                {...register(
                  'name',
                )}
              />

              {errors.name && (
                <span className={styles.errorText}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="nama@mahadafinance.co.id"
                disabled={isProcessing}
                {...register(
                  'email',
                )}
              />

              {errors.email && (
                <span className={styles.errorText}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="division">
                Divisi
              </label>

              <select
                id="division"
                disabled={isProcessing}
                {...register(
                  'division',
                )}
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

              {errors.division && (
                <span className={styles.errorText}>
                  {errors.division.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="position">
                Jabatan
              </label>

              <input
                id="position"
                type="text"
                placeholder="Contoh: Operation Staff"
                disabled={isProcessing}
                {...register(
                  'position',
                )}
              />

              {errors.position && (
                <span className={styles.errorText}>
                  {errors.position.message}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>
              Role & Akses
            </h2>

            <p>
              Tentukan hak akses pengguna
              di dalam aplikasi.
            </p>
          </div>

          <div className={styles.accessGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="role">
                Role
              </label>

              <select
                id="role"
                disabled={isProcessing}
                {...register(
                  'role',
                )}
              >
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

              {errors.role && (
                <span className={styles.errorText}>
                  {errors.role.message}
                </span>
              )}
            </div>

            {isEditMode && (
              <div className={styles.formGroup}>
                <label htmlFor="status">
                  Status Pengguna
                </label>

                <select
                  id="status"
                  disabled={isProcessing}
                  {...register(
                    'status',
                  )}
                >
                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ),
                  )}
                </select>

                {errors.status && (
                  <span className={styles.errorText}>
                    {errors.status.message}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className={styles.roleInformation}>
            <strong>
              Informasi Role
            </strong>

            <div className={styles.roleItems}>
              <div>
                <span>
                  User
                </span>

                <p>
                  Membuat dan memantau
                  pengajuan sendiri.
                </p>
              </div>

              <div>
                <span>
                  Approver
                </span>

                <p>
                  Melakukan approval
                  atau penolakan pengajuan.
                </p>
              </div>

              <div>
                <span>
                  Processor
                </span>

                <p>
                  Memproses pengajuan
                  pada divisi terkait.
                </p>
              </div>

              <div>
                <span>
                  Admin
                </span>

                <p>
                  Mengelola user,
                  role, dan master data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {mutationError && (
          <div className={styles.submitError}>
            {getApiErrorMessage(
              mutationError,
              isEditMode
                ? 'Pengguna gagal diperbarui.'
                : 'Pengguna gagal ditambahkan.',
            )}
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            disabled={isProcessing}
            onClick={handleBack}
          >
            Batal
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Menyimpan...'
              : isEditMode
                ? 'Simpan Perubahan'
                : 'Tambah Pengguna'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserFormPage;