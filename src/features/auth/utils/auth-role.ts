import type {
  AuthUser,
  ProcessorModule,
  UserRole,
} from '../types/auth.types';

export const hasRole = (
  user: AuthUser | null | undefined,
  role: UserRole,
): boolean => {
  if (!user) {
    return false;
  }

  return user.roles.includes(role);
};

export const hasAnyRole = (
  user: AuthUser | null | undefined,
  roles: UserRole[],
): boolean => {
  if (!user) {
    return false;
  }

  return roles.some((role) =>
    user.roles.includes(role),
  );
};

export const canProcessModule = (
  user: AuthUser | null | undefined,
  module: ProcessorModule,
): boolean => {
  if (!user) {
    return false;
  }

  if (!hasRole(user, 'PROCESSOR')) {
    return false;
  }

  return (
    user.processorModules?.includes(module) ??
    false
  );
};