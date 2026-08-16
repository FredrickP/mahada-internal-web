import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AppShell from '../../components/layout/AppShell';

import LoginPage from '../../features/auth/pages/LoginPage';
import ProtectedRoute from '../../features/auth/components/ProtectedRoute';
import PublicRoute from '../../features/auth/components/PublicRoute';
import RoleRoute from '../../features/auth/components/RoleRoute';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import ITRequestPage from '../../features/it-request/pages/ITRequestPage';
import CreateITRequestPage from '../../features/it-request/pages/CreateITRequestPage';
import ITRequestDetailPage from '../../features/it-request/pages/ITRequestDetailPage';
import HRServicesPage from '../../features/leave/pages/HRServicesPage';

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

        <Route
        path="/it-request"
        element={<ITRequestPage />}
        />

        <Route
        path="/it-request/create"
        element={<CreateITRequestPage />}
        />

        <Route
        path="/it-request/:id"
        element={<ITRequestDetailPage />}
        />

          <Route
            path="/hr-services"
            element={<HRServicesPage />}
          />

          <Route
            path="/payment"
            element={<div>Payment</div>}
          />

          {/* Approver Only */}
          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  'APPROVER',
                ]}
              />
            }
          >
            <Route
              path="/approval"
              element={<div>Approval</div>}
            />
          </Route>

          <Route
            path="/reports"
            element={<div>Reports</div>}
          />

          {/* Admin Only */}
          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  'ADMIN',
                ]}
              />
            }
          >
            <Route
              path="/administration"
              element={
                <div>
                  Administration
                </div>
              }
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRouter;