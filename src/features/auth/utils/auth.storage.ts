import type { AuthUser } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'mahada_access_token';
const AUTH_USER_KEY = 'mahada_auth_user';

export const authStorage = {
  saveAccessToken(accessToken: string) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken,
    );
  },

  getAccessToken(): string | null {
    return localStorage.getItem(
      ACCESS_TOKEN_KEY,
    );
  },

  saveUser(user: AuthUser) {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(user),
    );
  },

  getUser(): AuthUser | null {
    const storedUser = localStorage.getItem(
      AUTH_USER_KEY,
    );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);

      return null;
    }
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};