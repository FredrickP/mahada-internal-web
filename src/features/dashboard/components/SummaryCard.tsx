import type {
  DashboardSummary,
} from '../types/dashboard.types';

import styles from './SummaryCard.module.css';

interface SummaryCardProps {
  data: DashboardSummary;
}

function SummaryCard({
  data,
}: SummaryCardProps) {
  const variantClass = {
    TOTAL: styles.total,
    WAITING_APPROVAL:
      styles.waitingApproval,
    IN_PROGRESS: styles.inProgress,
    COMPLETED: styles.completed,
  }[data.type];

  return (
    <article
      className={`${styles.card} ${variantClass}`}
    >
      <div className={styles.mainContent}>
        <div className={styles.iconBox} />

        <div className={styles.info}>
          <span className={styles.title}>
            {data.title}
          </span>

          <strong className={styles.value}>
            {data.value}
          </strong>
        </div>
      </div>

      <span className={styles.description}>
        {data.description}
      </span>
    </article>
  );
}

export default SummaryCard;