import { paymentStatusConfig } from '../constants/payment-config';
import type { PaymentRequest } from '../types/payment.types';
import { formatRupiah } from '../utils/payment.util';

import styles from './PaymentTable.module.css';

interface PaymentTableProps {
  data: PaymentRequest[];
  onViewDetail: (payment: PaymentRequest) => void;
}

function PaymentTable({
  data,
  onViewDetail,
}: PaymentTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        Belum ada pengajuan pembayaran.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No. Pengajuan</th>
            <th>Vendor</th>
            <th>Invoice</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th className={styles.actionColumn}>
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((payment) => {
            const statusConfig =
              paymentStatusConfig[
                payment.status
              ];

            return (
              <tr key={payment.id}>
                <td>
                  <span
                    className={
                      styles.submissionNumber
                    }
                  >
                    {
                      payment.submissionNumber
                    }
                  </span>
                </td>

                <td>
                  {payment.vendorName}
                </td>

                <td>
                  {
                    payment.invoiceNumber
                  }
                </td>

                <td>
                  <strong
                    className={
                      styles.totalAmount
                    }
                  >
                    {formatRupiah(
                      payment.totalAmount,
                    )}
                  </strong>
                </td>

                <td>
                  <span
                    className={
                      styles.statusBadge
                    }
                    data-variant={
                      statusConfig.variant
                    }
                  >
                    {statusConfig.label}
                  </span>
                </td>

                <td>
                  {
                    payment.submissionDate
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
                      styles.detailButton
                    }
                    onClick={() => {
                      onViewDetail(
                        payment,
                      );
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

export default PaymentTable;