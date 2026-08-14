import { Bell, ChevronDown, Menu } from 'lucide-react';

import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Selamat datang di Mahada Internal Application
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />

          <span className={styles.notificationDot} />
        </button>

        <button
          type="button"
          className={styles.profileButton}
        >
          <div className={styles.avatar}>
            FP
          </div>

          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              Fredrick Pardosi
            </span>

            <span className={styles.profileRole}>
              User
            </span>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className={styles.chevron}
          />
        </button>
      </div>
    </header>
  );
}

export default Header;