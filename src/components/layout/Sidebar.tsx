import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'IT Request',
    path: '/it-request',
    icon: ClipboardCheck,
  },
  {
    label: 'HR Services',
    path: '/hr-services',
    icon: Users,
  },
  {
    label: 'Payment',
    path: '/payment',
    icon: CreditCard,
  },
  {
    label: 'Approval',
    path: '/approval',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
  },
  {
    label: 'Administration',
    path: '/administration',
    icon: Settings,
  },
];

function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
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
          isOpen ? styles.sidebarOpen : ''
        }`}
      >
        <div className={styles.brand}>
          <div className={styles.logo}>M</div>

          <div>
            <div className={styles.brandName}>
              Mahada
            </div>
            <div className={styles.brandDescription}>
              Internal Application
            </div>
          </div>
        </div>

        <nav className={styles.navigation}>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.menuItem} ${
                    isActive ? styles.menuItemActive : ''
                  }`
                }
              >
                <Icon
                  className={styles.menuIcon}
                  size={20}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;