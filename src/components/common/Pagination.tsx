import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import styles from './Pagination.module.css';

export type PaginationPageSize =
  | 10
  | 20
  | 50
  | 'ALL';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: PaginationPageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (
    pageSize: PaginationPageSize,
  ) => void;
}

type PaginationItem =
  | number
  | 'ELLIPSIS';

const getTotalPages = (
  totalItems: number,
  pageSize: PaginationPageSize,
): number => {
  if (
    pageSize === 'ALL' ||
    totalItems === 0
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil(
      totalItems /
        pageSize,
    ),
  );
};

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  if (
    totalPages <= 5
  ) {
    return Array.from(
      {
        length:
          totalPages,
      },
      (
        _,
        index,
      ) => {
        return index + 1;
      },
    );
  }

  if (
    currentPage <= 3
  ) {
    return [
      1,
      2,
      3,
      4,
      'ELLIPSIS',
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages - 2
  ) {
    return [
      1,
      'ELLIPSIS',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ELLIPSIS',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ELLIPSIS',
    totalPages,
  ];
};

function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages =
    getTotalPages(
      totalItems,
      pageSize,
    );

  const safeCurrentPage =
    Math.min(
      Math.max(
        currentPage,
        1,
      ),
      totalPages,
    );

  const paginationItems =
    getPaginationItems(
      safeCurrentPage,
      totalPages,
    );

  const startItem =
    totalItems === 0
      ? 0
      : pageSize === 'ALL'
        ? 1
        : (
            safeCurrentPage -
            1
          ) *
            pageSize +
          1;

  const endItem =
    totalItems === 0
      ? 0
      : pageSize === 'ALL'
        ? totalItems
        : Math.min(
            safeCurrentPage *
              pageSize,
            totalItems,
          );

  const handlePrevious = () => {
    if (
      safeCurrentPage <= 1
    ) {
      return;
    }

    onPageChange(
      safeCurrentPage - 1,
    );
  };

  const handleNext = () => {
    if (
      safeCurrentPage >=
      totalPages
    ) {
      return;
    }

    onPageChange(
      safeCurrentPage + 1,
    );
  };

  return (
    <div
      className={
        styles.pagination
      }
    >
      <span
        className={
          styles.summary
        }
      >
        Menampilkan{' '}
        {startItem}
        –
        {endItem}{' '}
        dari{' '}
        {totalItems}{' '}
        data
      </span>

      <div
        className={
          styles.controls
        }
      >
        <div
          className={
            styles.pageButtons
          }
        >
          <button
            type="button"
            className={
              styles.pageButton
            }
            disabled={
              safeCurrentPage === 1 ||
              pageSize === 'ALL'
            }
            onClick={
              handlePrevious
            }
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft
              size={16}
            />
          </button>

          {paginationItems.map(
            (
              item,
              index,
            ) => {
              if (
                item ===
                'ELLIPSIS'
              ) {
                return (
                  <span
                    key={
                      `ellipsis-${index}`
                    }
                    className={
                      styles.ellipsis
                    }
                  >
                    ...
                  </span>
                );
              }

              const isActive =
                item ===
                safeCurrentPage;

              return (
                <button
                  key={
                    item
                  }
                  type="button"
                  className={`${styles.pageButton} ${
                    isActive
                      ? styles.activePage
                      : ''
                  }`}
                  disabled={
                    pageSize ===
                    'ALL'
                  }
                  onClick={() => {
                    onPageChange(
                      item,
                    );
                  }}
                  aria-current={
                    isActive
                      ? 'page'
                      : undefined
                  }
                >
                  {item}
                </button>
              );
            },
          )}

          <button
            type="button"
            className={
              styles.pageButton
            }
            disabled={
              safeCurrentPage ===
                totalPages ||
              pageSize === 'ALL'
            }
            onClick={
              handleNext
            }
            aria-label="Halaman berikutnya"
          >
            <ChevronRight
              size={16}
            />
          </button>
        </div>

        <div
          className={
            styles.pageSize
          }
        >
          <label
            htmlFor="pagination-page-size"
            className={
              styles.pageSizeLabel
            }
          >
            Per halaman
          </label>

          <select
            id="pagination-page-size"
            className={
              styles.pageSizeSelect
            }
            value={
              pageSize
            }
            onChange={(
              event,
            ) => {
              const value =
                event.target.value;

              const newPageSize:
                PaginationPageSize =
                value === 'ALL'
                  ? 'ALL'
                  : Number(
                      value,
                    ) as
                      | 10
                      | 20
                      | 50;

              onPageSizeChange(
                newPageSize,
              );
            }}
          >
            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>

            <option value="ALL">
              Semua
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Pagination;