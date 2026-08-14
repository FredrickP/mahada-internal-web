import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AppShell from '../../components/layout/AppShell';

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route element={<AppShell />}>
        <Route
          path="/dashboard"
          element={<div>Dashboard</div>}
        />

        <Route
          path="/it-request"
          element={<div>IT Request</div>}
        />

        <Route
          path="/hr-services"
          element={<div>HR Services</div>}
        />

        <Route
          path="/payment"
          element={<div>Payment</div>}
        />

        <Route
          path="/approval"
          element={<div>Approval</div>}
        />

        <Route
          path="/reports"
          element={<div>Reports</div>}
        />

        <Route
          path="/administration"
          element={<div>Administration</div>}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default AppRouter;