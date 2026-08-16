import { apiClient } from '../../../lib/api/api-client';
import { mockLogin } from '../../../mocks/auth.mock';

import type {
  LoginRequest,
  LoginResponse,
} from '../types/auth.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

export const login = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  if (useMock) {
    return mockLogin(request);
  }

  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    request,
  );

  return response.data;
};