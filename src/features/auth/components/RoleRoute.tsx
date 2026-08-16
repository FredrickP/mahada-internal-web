import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import { useAuthStore } from '../store/auth.store';
import { hasAnyRole } from '../utils/auth-role';

import type { UserRole } from '../types/auth.types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  const isAllowed = hasAnyRole(
    user,
    allowedRoles,
  );

  if (!isAllowed) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default RoleRoute;