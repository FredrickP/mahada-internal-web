import { submissionStatusConfig } from '../constants/dashboard-status';

import type {
  RecentSubmission,
  SubmissionStatus,
} from '../types/dashboard.types';

import styles from './RecentSubmissionTable.module.css';

interface RecentSubmissionTableProps {
  data: RecentSubmission[];

  onViewDetail: (
    submission: RecentSubmission,
  ) => void;
}

const statusClassMap: Record<
  SubmissionStatus,
  string
> = {
  SUBMITTED: styles.submitted,
  APPROVED: styles.approved,
  IN_PROGRESS: styles.inProgress,
  COMPLETED: styles.completed,
  REJECTED: styles.rejected,
};

function RecentSubmissionTable({
  data,
  onViewDetail,
}: RecentSubmissionTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        Belum ada pengajuan terbaru.
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
            <th>Tanggal</th>
            <th>Status</th>
            <th>Divisi Tujuan</th>
            <th className={styles.actionColumn}>
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((submission) => {
            const status =
              submissionStatusConfig[
                submission.status
              ];

            return (
              <tr key={submission.id}>
                <td>
                  <span
                    className={
                      styles.submissionNumber
                    }
                  >
                    {
                      submission.submissionNumber
                    }
                  </span>
                </td>

                <td>
                  {submission.type}
                </td>

                <td>
                  {submission.date}
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      statusClassMap[
                        submission.status
                      ]
                    }`}
                  >
                    {status.label}
                  </span>
                </td>

                <td>
                  {
                    submission.targetDivision
                  }
                </td>

                <td
                  className={
                    styles.actionColumn
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.viewDetailButton
                    }
                    onClick={() => {
                      onViewDetail(
                        submission,
                      );
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

export default RecentSubmissionTable;