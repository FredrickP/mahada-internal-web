import { approvalModuleConfig, approvalStatusConfig } from '../constants/approval-config';
import type { ApprovalQueueItem } from '../types/approval.types';
import styles from './ApprovalTable.module.css';

interface ApprovalTableProps {
  data: ApprovalQueueItem[];
  onViewDetail: (approval: ApprovalQueueItem) => void;
}

function ApprovalTable({
  data,
  onViewDetail,
}: ApprovalTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        Tidak ada pengajuan yang menunggu approval.
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
            <th>Pengajuan</th>
            <th>Pengaju</th>
            <th>Divisi</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((approval) => {
            const moduleConfig =
              approvalModuleConfig[approval.module];

            const statusConfig =
              approvalStatusConfig[approval.status];

            return (
              <tr key={approval.id}>
                <td>
                  <strong className={styles.submissionNumber}>
                    {approval.submissionNumber}
                  </strong>
                </td>

                <td>
                  <span className={styles.moduleBadge}>
                    {moduleConfig.shortLabel}
                  </span>
                </td>

                <td className={styles.titleColumn}>
                  {approval.title}
                </td>

                <td>
                  {approval.requesterName}
                </td>

                <td>
                  {approval.requesterDivision}
                </td>

                <td>
                  {approval.submissionDate}
                </td>

                <td>
                  <span
                    className={styles.statusBadge}
                    data-variant={statusConfig.variant}
                  >
                    {statusConfig.label}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className={styles.detailButton}
                    onClick={() => {
                      onViewDetail(approval);
                    }}
                  >
                    Detail
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

export default ApprovalTable;