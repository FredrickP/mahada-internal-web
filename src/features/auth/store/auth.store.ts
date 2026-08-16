import { create } from 'zustand';

import { authStorage } from '../utils/auth.storage';

import type {
  AuthUser,
  LoginResponse,
} from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setSession: (response: LoginResponse) => void;
  clearSession: () => void;
}

const storedUser = authStorage.getUser();
const storedAccessToken =
  authStorage.getAccessToken();

export const useAuthStore = create<AuthState>(
  (set) => ({
    user: storedUser,

    accessToken: storedAccessToken,

    isAuthenticated:
      Boolean(storedUser) &&
      Boolean(storedAccessToken),

    setSession: (response) => {
      authStorage.saveAccessToken(
        response.accessToken,
      );

      authStorage.saveUser(
        response.user,
      );

      set({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
      });
    },

    clearSession: () => {
      authStorage.clear();

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    },
  }),
);