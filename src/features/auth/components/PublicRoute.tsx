import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import { useAuthStore } from '../store/auth.store';

function PublicRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default PublicRoute;