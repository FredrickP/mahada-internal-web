import {
  ArrowLeft,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getApiErrorMessage,
} from '../../../lib/api/api-error';

import {
  useLeaveDetail,
} from '../hooks/useLeaveDetail';

import type {
  LeaveStatus,
} from '../types/leave.types';

const getStatusLabel = (
  status: LeaveStatus,
): string => {
  switch (status) {
    case 'DRAFT':
      return 'Draft';
    case 'SUBMITTED':
      return 'Diajukan';
    case 'APPROVED':
      return 'Disetujui';
    case 'COMPLETED':
      return 'Selesai';
    case 'REJECTED':
      return 'Ditolak';
  }
};

const getStatusStyle = (
  status: LeaveStatus,
) => {
  switch (status) {
    case 'APPROVED':
      return {
        color: '#17835d',
        background: '#e5f5ee',
      };
    case 'COMPLETED':
      return {
        color: '#555555',
        background: '#e9edf4',
      };
    case 'REJECTED':
      return {
        color: '#ad3e3e',
        background: '#fbe8e8',
      };
    case 'DRAFT':
      return {
        color: '#666666',
        background: '#eeeeee',
      };
    default:
      return {
        color: '#b86a00',
        background: '#fff0d3',
      };
  }
};

const formatDate = (
  value: string,
): string => {
  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  if (
    !isoDatePattern.test(value)
  ) {
    return value;
  }

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

function LeaveDetailPage() {
  const navigate =
    useNavigate();

  const {
    id = '',
  } = useParams<{
    id: string;
  }>();

  const leaveQuery =
    useLeaveDetail(
      id,
    );

  const handleBack = () => {
    navigate(
      '/hr-services',
    );
  };

  if (
    leaveQuery.isLoading
  ) {
    return (
      <div
        style={{
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#777777',
          fontSize: 13,
        }}
      >
        Memuat detail cuti...
      </div>
    );
  }

  if (
    leaveQuery.isError ||
    !leaveQuery.data
  ) {
    return (
      <div
        style={{
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          color: '#777777',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        <p>
          {getApiErrorMessage(
            leaveQuery.error,
            'Detail cuti gagal dimuat.',
          )}
        </p>

        <button
          type="button"
          onClick={() => {
            leaveQuery.refetch();
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const leave =
    leaveQuery.data;

  const statusStyle =
    getStatusStyle(
      leave.status,
    );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <button
        type="button"
        onClick={handleBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 20,
          padding: 0,
          fontSize: 12,
          fontWeight: 500,
          color: '#a87512',
          background: 'transparent',
          border: 0,
        }}
      >
        <ArrowLeft
          size={17}
          strokeWidth={1.8}
        />

        Kembali ke HR Services
      </button>

      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 28,
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 13,
              fontWeight: 600,
              color: '#b67b0d',
            }}
          >
            {leave.submissionNumber}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: 27,
              fontWeight: 700,
              color: '#383838',
            }}
          >
            Detail Pengajuan Cuti
          </h1>

          <p
            style={{
              margin: '7px 0 0',
              fontSize: 13,
              color: '#888888',
            }}
          >
            Informasi pengajuan cuti tahunan.
          </p>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 32,
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 999,
            whiteSpace: 'nowrap',
            ...statusStyle,
          }}
        >
          {getStatusLabel(
            leave.status,
          )}
        </span>
      </header>

      <section
        style={{
          padding: 32,
          background: '#ffffff',
          border: '1px solid #e3ddd2',
          borderRadius: 16,
        }}
      >
        <h2
          style={{
            margin: '0 0 26px',
            fontSize: 17,
            fontWeight: 600,
            color: '#414141',
          }}
        >
          Informasi Cuti
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(2, minmax(0, 1fr))',
            gap: '26px 40px',
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 11,
                color: '#858585',
              }}
            >
              Jenis Cuti
            </span>

            <strong
              style={{
                fontSize: 13,
                color: '#4b4b4b',
              }}
            >
              {leave.leaveType}
            </strong>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 11,
                color: '#858585',
              }}
            >
              Jumlah Hari
            </span>

            <strong
              style={{
                fontSize: 13,
                color: '#4b4b4b',
              }}
            >
              {leave.workingDays} Hari
            </strong>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 11,
                color: '#858585',
              }}
            >
              Tanggal Mulai
            </span>

            <strong
              style={{
                fontSize: 13,
                color: '#4b4b4b',
              }}
            >
              {formatDate(
                leave.startDate,
              )}
            </strong>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 11,
                color: '#858585',
              }}
            >
              Tanggal Selesai
            </span>

            <strong
              style={{
                fontSize: 13,
                color: '#4b4b4b',
              }}
            >
              {formatDate(
                leave.endDate,
              )}
            </strong>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 11,
                color: '#858585',
              }}
            >
              Approver
            </span>

            <strong
              style={{
                fontSize: 13,
                color: '#4b4b4b',
              }}
            >
              {leave.approverName}
            </strong>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 11,
                color: '#858585',
              }}
            >
              Status
            </span>

            <strong
              style={{
                fontSize: 13,
                color: '#4b4b4b',
              }}
            >
              {getStatusLabel(
                leave.status,
              )}
            </strong>
          </div>
        </div>

        <div
          style={{
            height: 1,
            margin: '30px 0',
            background: '#ebe5dc',
          }}
        />

        <div>
          <span
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 11,
              color: '#858585',
            }}
          >
            Alasan Cuti
          </span>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.7,
              color: '#4b4b4b',
            }}
          >
            {leave.reason || '-'}
          </p>
        </div>
      </section>
    </div>
  );
}

export default LeaveDetailPage;