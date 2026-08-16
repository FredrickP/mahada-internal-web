import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type {
  QuickAction,
} from '../types/dashboard.types';

import styles from './QuickActionCard.module.css';

interface QuickActionCardProps {
  data: QuickAction;
}

function QuickActionCard({
  data,
}: QuickActionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(data.path);
  };

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handleClick}
    >
      <div
        className={`${styles.iconBox} ${
          styles[data.id]
        }`}
      >
        {data.code}
      </div>

      <div className={styles.content}>
        <span className={styles.title}>
          {data.title}
        </span>

        <span className={styles.actionText}>
          Buat baru

          <ArrowRight
            size={13}
            strokeWidth={1.7}
          />
        </span>
      </div>
    </button>
  );
}

export default QuickActionCard;