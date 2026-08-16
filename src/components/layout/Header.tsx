import {
  ChevronDown,
  LogOut,
  Menu,
  UserRound,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/auth.store';

import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function Header({
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const user = useAuthStore(
    (state) => state.user,
  );

  const clearSession = useAuthStore(
    (state) => state.clearSession,
  );

  const additionalRoles =
    user?.roles.filter(
      (role) => role !== 'USER',
    ) ?? [];

  const displayRole =
    additionalRoles.length > 0
      ? additionalRoles
          .map(formatRole)
          .join(', ')
      : 'User';

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) =>
          name.charAt(0),
        )
        .join('')
        .toUpperCase()
    : 'U';

  const handleLogout = () => {
    clearSession();

    navigate('/login', {
      replace: true,
    });
  };

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );

      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, []);

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Buka navigasi"
      >
        <Menu
          size={21}
          strokeWidth={1.8}
        />
      </button>

      <div className={styles.spacer} />

      <div
        ref={dropdownRef}
        className={styles.profileContainer}
      >
        <button
          type="button"
          className={styles.profileButton}
          onClick={() => {
            setIsProfileOpen(
              (current) => !current,
            );
          }}
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
        >
          <div className={styles.avatar}>
            {initials}
          </div>

          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              {user?.name ?? 'User'}
            </span>

            <span className={styles.profileRole}>
              {displayRole}
            </span>
          </div>

          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={`${styles.chevron} ${
              isProfileOpen
                ? styles.chevronOpen
                : ''
            }`}
          />
        </button>

        {isProfileOpen && (
          <div
            className={styles.profileMenu}
            role="menu"
          >
            <div className={styles.profileMenuHeader}>
              <span className={styles.profileMenuName}>
                {user?.name ?? 'User'}
              </span>

              <span className={styles.profileMenuEmail}>
                {user?.email ?? '-'}
              </span>
            </div>

            <div className={styles.profileMenuDivider} />

            <button
              type="button"
              className={styles.profileMenuItem}
              role="menuitem"
              onClick={() => {
                setIsProfileOpen(false);
              }}
            >
              <UserRound
                size={17}
                strokeWidth={1.8}
              />

              <span>Profile</span>
            </button>

            <button
              type="button"
              className={`${styles.profileMenuItem} ${styles.logoutMenuItem}`}
              role="menuitem"
              onClick={handleLogout}
            >
              <LogOut
                size={17}
                strokeWidth={1.8}
              />

              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;