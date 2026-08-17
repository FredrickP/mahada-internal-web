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
import LeaveRequestPage from '../../features/leave/pages/LeaveRequestPage';
import LeaveDetailPage from '../../features/leave/pages/LeaveDetailPage';

import BusinessTripPage from '../../features/business-trip/pages/BusinessTripPage';
import BusinessTripDetailPage from '../../features/business-trip/pages/BusinessTripDetailPage';

import PaymentPage from '../../features/payment/pages/PaymentPage';
import CreatePaymentPage from '../../features/payment/pages/CreatePaymentPage';
import PaymentDetailPage from '../../features/payment/pages/PaymentDetailPage';

import ApprovalQueuePage from '../../features/approval/pages/ApprovalQueuePage';
import ApprovalDetailPage from '../../features/approval/pages/ApprovalDetailPage';

import ReportsPage from '../../features/reports/pages/ReportsPage';

import AdministrationPage from '../../features/administration/pages/AdministrationPage';
import UserManagementPage from '../../features/administration/pages/UserManagementPage';
import RolePermissionPage from '../../features/administration/pages/RolePermissionPage';
import UserFormPage from '../../features/administration/pages/UserFormPage';
import RolePermissionDetailPage from '../../features/administration/pages/RolePermissionDetailPage';
import OrganizationPage from '../../features/administration/pages/OrganizationPage';
import LeaveBalancePage from '../../features/administration/pages/LeaveBalancePage';
import TaxConfigurationPage from '../../features/administration/pages/TaxConfigurationPage';

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
      <Route
        element={
          <PublicRoute />
        }
      >
        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          element={
            <AppShell />
          }
        >
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage />
            }
          />

          {/* IT Request */}
          <Route
            path="/it-request"
            element={
              <ITRequestPage />
            }
          />

          <Route
            path="/it-request/create"
            element={
              <CreateITRequestPage />
            }
          />

          <Route
            path="/it-request/:id"
            element={
              <ITRequestDetailPage />
            }
          />

          {/* HR Services */}
          <Route
            path="/hr-services"
            element={
              <HRServicesPage />
            }
          />

          <Route
            path="/hr-services/leave/create"
            element={
              <LeaveRequestPage />
            }
          />

          <Route
            path="/hr-services/leave/:id"
            element={
              <LeaveDetailPage />
            }
          />

          <Route
            path="/hr-services/business-trip/create"
            element={
              <BusinessTripPage />
            }
          />

          <Route
            path="/hr-services/business-trip/:id"
            element={
              <BusinessTripDetailPage />
            }
          />

          {/* Payment */}
          <Route
            path="/payment"
            element={
              <PaymentPage />
            }
          />

          <Route
            path="/payment/create"
            element={
              <CreatePaymentPage />
            }
          />

          <Route
            path="/payment/:id"
            element={
              <PaymentDetailPage />
            }
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={
              <ReportsPage />
            }
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
              element={
                <ApprovalQueuePage />
              }
            />

            <Route
              path="/approval/:id"
              element={
                <ApprovalDetailPage />
              }
            />
          </Route>

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
                <AdministrationPage />
              }
            />

            <Route
              path="/administration/users"
              element={
                <UserManagementPage />
              }
            />

            <Route
              path="/administration/users/create"
              element={
                <UserFormPage />
              }
            />

            <Route
              path="/administration/users/:id"
              element={
                <UserFormPage />
              }
            />

            <Route
              path="/administration/roles"
              element={
                <RolePermissionPage />
              }
            />

            <Route
              path="/administration/roles/:role"
              element={
                <RolePermissionDetailPage />
              }
            />

            <Route
              path="/administration/organization"
              element={
                <OrganizationPage />
              }
            />

            <Route
              path="/administration/leave-balance"
              element={
                <LeaveBalancePage />
              }
            />

            <Route
              path="/administration/tax-configuration"
              element={
                <TaxConfigurationPage />
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
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