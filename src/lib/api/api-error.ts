import axios from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.',
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage =
      error.response?.data?.message ??
      error.response?.data?.error;

    if (responseMessage?.trim()) {
      return responseMessage;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Permintaan terlalu lama. Silakan coba lagi.';
    }

    if (!error.response) {
      return 'Tidak dapat terhubung ke server.';
    }
  }

  if (
    error instanceof Error &&
    error.message.trim()
  ) {
    return error.message;
  }

  return fallbackMessage;
};