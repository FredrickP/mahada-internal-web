import { NavLink } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/auth.store';
import { hasRole } from '../../features/auth/utils/auth-role';

import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  code: string;
}

const baseMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    code: 'DB',
  },
  {
    label: 'IT Request',
    path: '/it-request',
    code: 'IT',
  },
  {
    label: 'HR Services',
    path: '/hr-services',
    code: 'HR',
  },
  {
    label: 'Payment',
    path: '/payment',
    code: 'FN',
  },
  {
    label: 'Reports',
    path: '/reports',
    code: 'RP',
  },
];

function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  const menuItems: MenuItem[] = [
    ...baseMenuItems,

    ...(hasRole(user, 'APPROVER')
      ? [
          {
            label: 'Approval',
            path: '/approval',
            code: 'AP',
          },
        ]
      : []),

    ...(hasRole(user, 'ADMIN')
      ? [
          {
            label: 'Administration',
            path: '/administration',
            code: 'AD',
          },
        ]
      : []),
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          isOpen
            ? styles.sidebarOpen
            : ''
        }`}
      >
        <div className={styles.brand}>
          <div className={styles.brandName}>
            MAHADA
          </div>

          <div
            className={
              styles.brandDescription
            }
          >
            INTERNAL APP
          </div>
        </div>

        <nav
          className={styles.navigation}
          aria-label="Main navigation"
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.menuItem} ${
                  isActive
                    ? styles.menuItemActive
                    : ''
                }`
              }
            >
              <span
                className={
                  styles.menuCode
                }
              >
                {item.code}
              </span>

              <span
                className={
                  styles.menuLabel
                }
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;