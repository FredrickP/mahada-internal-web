import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getApiErrorMessage } from '../../../lib/api/api-error';
import { useLogin } from '../hooks/useLogin';
import {
  loginSchema,
  type LoginFormValues,
} from '../schemas/login.schema';

import styles from './LoginPage.module.css';

function LoginPage() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const handleLogin = (
    values: LoginFormValues,
  ) => {
    loginMutation.mutate(values);
  };

  const loginErrorMessage =
    loginMutation.isError
      ? getApiErrorMessage(
          loginMutation.error,
          'Login gagal. Silakan coba lagi.',
        )
      : null;

  return (
    <div className={styles.loginPage}>
      <section className={styles.introSection}>
        <div className={styles.logo}>
          M
        </div>

        <h1 className={styles.introTitle}>
          Mahada Internal
        </h1>

        <p className={styles.introDescription}>
          Satu aplikasi untuk proses internal yang lebih cepat,
          transparan, dan mudah dipantau.
        </p>

        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <div className={styles.featureNumber}>
              1
            </div>

            <span className={styles.featureLabel}>
              IT Request Management
            </span>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureNumber}>
              2
            </div>

            <span className={styles.featureLabel}>
              Cuti &amp; Perjalanan Dinas
            </span>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureNumber}>
              3
            </div>

            <span className={styles.featureLabel}>
              Pengajuan Pembayaran
            </span>
          </div>
        </div>

        <div className={styles.companyName}>
          PT Mahada Adipratama Sejati Finance
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.loginCard}>
          <h2 className={styles.title}>
            Selamat datang
          </h2>

          <p className={styles.subtitle}>
            Masuk menggunakan akun internal perusahaan.
          </p>

          <form
            className={styles.form}
            onSubmit={handleSubmit(handleLogin)}
            noValidate
          >
            <div className={styles.formGroup}>
              <label
                htmlFor="identifier"
                className={styles.label}
              >
                Email / Username
              </label>

              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="nama@mahadafinance.co.id"
                className={`${styles.input} ${
                  errors.identifier
                    ? styles.inputError
                    : ''
                }`}
                {...register('identifier')}
              />

              {errors.identifier && (
                <p className={styles.errorText}>
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan password"
                className={`${styles.input} ${
                  errors.password
                    ? styles.inputError
                    : ''
                }`}
                {...register('password')}
              />

              {errors.password && (
                <p className={styles.errorText}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="button"
              className={styles.forgotPassword}
            >
              Lupa password?
            </button>

            {loginErrorMessage && (
              <div
                className={styles.loginError}
                role="alert"
              >
                {loginErrorMessage}
              </div>
            )}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? 'Memproses...'
                : 'Masuk'}
            </button>
          </form>

          <p className={styles.helpText}>
            Hubungi Admin IT jika mengalami kendala akses.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;