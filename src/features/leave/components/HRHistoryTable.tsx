import {
  hrSubmissionTypeConfig,
  leaveStatusConfig,
} from '../constants/leave-config';

import type {
  HRHistoryItem,
  LeaveStatus,
} from '../types/leave.types';

import styles from './HRHistoryTable.module.css';

interface HRHistoryTableProps {
  data: HRHistoryItem[];
  onViewDetail: (item: HRHistoryItem) => void;
}

const statusClassMap: Record<
  LeaveStatus,
  string
> = {
  DRAFT: styles.draft,
  SUBMITTED: styles.submitted,
  APPROVED: styles.approved,
  COMPLETED: styles.completed,
  REJECTED: styles.rejected,
};

function HRHistoryTable({
  data,
  onViewDetail,
}: HRHistoryTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        Belum ada riwayat layanan HR.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No. Pengajuan</th>
            <th>Jenis</th>
            <th>Periode / Tujuan</th>
            <th>Status</th>
            <th className={styles.actionColumn}>
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const typeConfig =
              hrSubmissionTypeConfig[
                item.type
              ];

            const statusConfig =
              leaveStatusConfig[
                item.status
              ];

            return (
              <tr key={item.id}>
                <td>
                  <span
                    className={
                      styles.submissionNumber
                    }
                  >
                    {
                      item.submissionNumber
                    }
                  </span>
                </td>

                <td>
                  {typeConfig.label}
                </td>

                <td>
                  {
                    item.periodOrDestination
                  }
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      statusClassMap[
                        item.status
                      ]
                    }`}
                  >
                    {statusConfig.label}
                  </span>
                </td>

                <td
                  className={
                    styles.actionColumn
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.detailButton
                    }
                    onClick={() => {
                      onViewDetail(item);
                    }}
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HRHistoryTable;