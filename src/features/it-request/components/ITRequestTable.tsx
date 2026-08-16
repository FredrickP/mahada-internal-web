import {
  itRequestStatusConfig,
  itRequestTypeConfig,
} from '../constants/it-request-config';

import type {
  ITRequest,
  ITRequestStatus,
} from '../types/it-request.types';

import styles from './ITRequestTable.module.css';

interface ITRequestTableProps {
  data: ITRequest[];

  onViewDetail: (
    request: ITRequest,
  ) => void;
}

const statusClassMap: Record<
  ITRequestStatus,
  string
> = {
  SUBMITTED: styles.submitted,
  APPROVED: styles.approved,
  IN_PROGRESS: styles.inProgress,
  COMPLETED: styles.completed,
  REJECTED: styles.rejected,
};

function ITRequestTable({
  data,
  onViewDetail,
}: ITRequestTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        Tidak ada IT Request yang ditemukan.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No. Request</th>
            <th>Judul</th>
            <th>Jenis</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>PIC IT</th>
            <th className={styles.actionColumn}>
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((request) => {
            const typeConfig =
              itRequestTypeConfig[
                request.type
              ];

            const statusConfig =
              itRequestStatusConfig[
                request.status
              ];

            const picLabel =
              request.picName ??
              (
                request.status === 'APPROVED'
                  ? 'Belum diambil'
                  : '-'
              );

            return (
              <tr key={request.id}>
                <td>
                  <span
                    className={
                      styles.requestNumber
                    }
                  >
                    {request.requestNumber}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      styles.requestTitle
                    }
                  >
                    {request.title}
                  </span>
                </td>

                <td>
                  {typeConfig.label}
                </td>

                <td>
                  <span
                    className={
                      styles.requestDate
                    }
                  >
                    {request.submissionDate}
                  </span>
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      statusClassMap[
                        request.status
                      ]
                    }`}
                  >
                    {statusConfig.label}
                  </span>
                </td>

                <td>
                  {picLabel}
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
                      onViewDetail(request);
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

export default ITRequestTable;