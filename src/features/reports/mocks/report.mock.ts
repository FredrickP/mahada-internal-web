import type {
  ExportReportInput,
  ExportReportResponse,
  ReportData,
  ReportFilter,
} from '../types/report.types';

const delay = (
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const mockReportData: ReportData = {
  summary: {
    totalSubmission: 84,
    completed: 57,
    inProgress: 19,
    rejected: 8,
  },
  moduleStatistics: [
    {
      module: 'IT_REQUEST',
      total: 44,
    },
    {
      module: 'LEAVE',
      total: 25,
    },
    {
      module: 'BUSINESS_TRIP',
      total: 12,
    },
    {
      module: 'PAYMENT',
      total: 62,
    },
  ],
  statusStatistics: [
    {
      status: 'COMPLETED',
      total: 57,
    },
    {
      status: 'IN_PROGRESS',
      total: 19,
    },
    {
      status: 'REJECTED',
      total: 8,
    },
  ],
};

const getModuleMultiplier = (
  module: ReportFilter['module'],
): number => {
  switch (module) {
    case 'IT_REQUEST':
      return 0.52;
    case 'LEAVE':
      return 0.3;
    case 'BUSINESS_TRIP':
      return 0.14;
    case 'PAYMENT':
      return 0.74;
    case 'ALL':
    default:
      return 1;
  }
};

const getModuleLabel = (
  module: ReportFilter['module'],
): string => {
  switch (module) {
    case 'IT_REQUEST':
      return 'IT Request';
    case 'LEAVE':
      return 'Cuti Tahunan';
    case 'BUSINESS_TRIP':
      return 'Perjalanan Dinas';
    case 'PAYMENT':
      return 'Payment';
    case 'ALL':
    default:
      return 'Semua Modul';
  }
};

const getStatisticModuleLabel = (
  module: string,
): string => {
  switch (module) {
    case 'IT_REQUEST':
      return 'IT Request';
    case 'LEAVE':
      return 'Cuti Tahunan';
    case 'BUSINESS_TRIP':
      return 'Perjalanan Dinas';
    case 'PAYMENT':
      return 'Payment';
    default:
      return module;
  }
};

const getStatusLabel = (
  status: string,
): string => {
  switch (status) {
    case 'COMPLETED':
      return 'Selesai';
    case 'IN_PROGRESS':
      return 'Dalam Proses';
    case 'REJECTED':
      return 'Ditolak';
    default:
      return status;
  }
};

const formatDate = (
  value: string,
): string => {
  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(date);
};

const escapeHtml = (
  value: string | number,
): string => {
  return String(value)
    .replaceAll(
      '&',
      '&amp;',
    )
    .replaceAll(
      '<',
      '&lt;',
    )
    .replaceAll(
      '>',
      '&gt;',
    )
    .replaceAll(
      '"',
      '&quot;',
    )
    .replaceAll(
      "'",
      '&#039;',
    );
};

export const getMockReports = async (
  filter: ReportFilter,
): Promise<ReportData> => {
  await delay(500);

  if (
    filter.module === 'ALL'
  ) {
    return structuredClone(
      mockReportData,
    );
  }

  const multiplier =
    getModuleMultiplier(
      filter.module,
    );

  return {
    summary: {
      totalSubmission:
        Math.round(
          mockReportData
            .summary
            .totalSubmission *
            multiplier,
        ),
      completed:
        Math.round(
          mockReportData
            .summary
            .completed *
            multiplier,
        ),
      inProgress:
        Math.round(
          mockReportData
            .summary
            .inProgress *
            multiplier,
        ),
      rejected:
        Math.round(
          mockReportData
            .summary
            .rejected *
            multiplier,
        ),
    },
    moduleStatistics:
      mockReportData
        .moduleStatistics
        .filter(
          (item) => {
            return (
              item.module ===
              filter.module
            );
          },
        ),
    statusStatistics:
      mockReportData
        .statusStatistics
        .map((item) => {
          return {
            ...item,
            total:
              Math.round(
                item.total *
                  multiplier,
              ),
          };
        }),
  };
};

export const exportMockReport = async (
  input: ExportReportInput,
): Promise<ExportReportResponse> => {
  await delay(700);

  const reportData =
    await getMockReports({
      dateFrom:
        input.dateFrom,
      dateTo:
        input.dateTo,
      module:
        input.module,
    });

  const moduleName =
    input.module
      .toLowerCase()
      .replaceAll(
        '_',
        '-',
      );

  const moduleRows =
    reportData
      .moduleStatistics
      .map((item) => {
        return `
          <tr>
            <td>
              ${escapeHtml(
                getStatisticModuleLabel(
                  item.module,
                ),
              )}
            </td>
            <td class="number-cell">
              ${escapeHtml(
                item.total,
              )}
            </td>
          </tr>
        `;
      })
      .join('');

  const statusRows =
    reportData
      .statusStatistics
      .map((item) => {
        return `
          <tr>
            <td>
              ${escapeHtml(
                getStatusLabel(
                  item.status,
                ),
              )}
            </td>
            <td class="number-cell">
              ${escapeHtml(
                item.total,
              )}
            </td>
          </tr>
        `;
      })
      .join('');

  const workbook = `
  <!DOCTYPE html>

  <html>
    <head>
      <meta charset="UTF-8" />

      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #1f2937;
        }

        table {
          width: 640px;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .col-main {
          width: 220px;
        }

        .col-value {
          width: 140px;
        }

        .title {
          height: 34px;
          font-size: 16pt;
          font-weight: bold;
          vertical-align: middle;
        }

        .subtitle {
          height: 24px;
          color: #64748b;
          font-size: 9pt;
        }

        .section-title {
          height: 30px;
          font-size: 11pt;
          font-weight: bold;
          vertical-align: middle;
        }

        .label-cell {
          font-weight: bold;
          background: #f3f4f6;
        }

        th {
          height: 28px;
          padding: 6px 8px;
          border: 1px solid #cbd5e1;
          background: #e5e7eb;
          font-weight: bold;
          text-align: left;
          vertical-align: middle;
          white-space: nowrap;
        }

        td {
          height: 26px;
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          vertical-align: middle;
          white-space: nowrap;
        }

        .summary-header {
          text-align: center;
        }

        .summary-value {
          font-weight: bold;
          text-align: center;
        }

        .number-cell {
          text-align: right;
        }

        .spacer {
          height: 10px;
          border: 0;
        }
      </style>
    </head>

    <body>
      <table
        width="640"
        cellspacing="0"
        cellpadding="0"
      >
        <colgroup>
          <col width="220" />
          <col width="140" />
          <col width="140" />
          <col width="140" />
        </colgroup>

        <tr>
          <td
            class="title"
            colspan="4"
          >
            Mahada Finance - Report
          </td>
        </tr>

        <tr>
          <td
            class="subtitle"
            colspan="4"
          >
            Laporan pengajuan internal PT Mahada Adipratama Sejati Finance
          </td>
        </tr>

        <tr>
          <td
            class="spacer"
            colspan="4"
          ></td>
        </tr>

        <tr>
          <td class="label-cell">
            Periode
          </td>

          <td colspan="3">
            ${escapeHtml(
              formatDate(
                input.dateFrom,
              ),
            )}
            s/d
            ${escapeHtml(
              formatDate(
                input.dateTo,
              ),
            )}
          </td>
        </tr>

        <tr>
          <td class="label-cell">
            Modul
          </td>

          <td colspan="3">
            ${escapeHtml(
              getModuleLabel(
                input.module,
              ),
            )}
          </td>
        </tr>

        <tr>
          <td
            class="spacer"
            colspan="4"
          ></td>
        </tr>

        <tr>
          <td
            class="section-title"
            colspan="4"
          >
            Ringkasan
          </td>
        </tr>

        <tr>
          <th class="summary-header">
            Total Pengajuan
          </th>

          <th class="summary-header">
            Selesai
          </th>

          <th class="summary-header">
            Dalam Proses
          </th>

          <th class="summary-header">
            Ditolak
          </th>
        </tr>

        <tr>
          <td class="summary-value">
            ${escapeHtml(
              reportData
                .summary
                .totalSubmission,
            )}
          </td>

          <td class="summary-value">
            ${escapeHtml(
              reportData
                .summary
                .completed,
            )}
          </td>

          <td class="summary-value">
            ${escapeHtml(
              reportData
                .summary
                .inProgress,
            )}
          </td>

          <td class="summary-value">
            ${escapeHtml(
              reportData
                .summary
                .rejected,
            )}
          </td>
        </tr>

        <tr>
          <td
            class="spacer"
            colspan="4"
          ></td>
        </tr>

        <tr>
          <td
            class="section-title"
            colspan="2"
          >
            Pengajuan per Modul
          </td>
        </tr>

        <tr>
          <th>
            Modul
          </th>

          <th>
            Total
          </th>
        </tr>

        ${moduleRows}

        <tr>
          <td
            class="spacer"
            colspan="2"
          ></td>
        </tr>

        <tr>
          <td
            class="section-title"
            colspan="2"
          >
            Distribusi Status
          </td>
        </tr>

        <tr>
          <th>
            Status
          </th>

          <th>
            Total
          </th>
        </tr>

        ${statusRows}
      </table>
    </body>
  </html>
`;

  const blob =
    new Blob(
      [
        '\ufeff',
        workbook,
      ],
      {
        type:
          'application/vnd.ms-excel;charset=utf-8;',
      },
    );

  const downloadUrl =
    URL.createObjectURL(
      blob,
    );

  return {
    fileName:
      `mahada-report-${moduleName}-${input.dateFrom}-${input.dateTo}.xls`,
    downloadUrl,
  };
};