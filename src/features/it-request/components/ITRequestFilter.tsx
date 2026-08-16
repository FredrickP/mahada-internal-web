import {
  useEffect,
  useState,
} from 'react';

import type {
  ITRequestFilter as ITRequestFilterValue,
  ITRequestStatus,
  ITRequestType,
} from '../types/it-request.types';

import styles from './ITRequestFilter.module.css';

interface ITRequestFilterProps {
  initialValue: ITRequestFilterValue;

  onApply: (
    filter: ITRequestFilterValue,
  ) => void;
}

function ITRequestFilter({
  initialValue,
  onApply,
}: ITRequestFilterProps) {
  const [filter, setFilter] =
    useState<ITRequestFilterValue>(
      initialValue,
    );

  useEffect(() => {
    setFilter(initialValue);
  }, [initialValue]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onApply(filter);
  };

  return (
    <form
      className={styles.filterCard}
      onSubmit={handleSubmit}
    >
      <div className={styles.searchField}>
        <input
          type="search"
          className={styles.input}
          placeholder="Cari nomor atau judul request"
          value={filter.search}
          onChange={(event) => {
            setFilter((current) => ({
              ...current,
              search: event.target.value,
            }));
          }}
        />
      </div>

      <div className={styles.selectField}>
        <select
          className={`${styles.input} ${styles.select}`}
          value={filter.type}
          onChange={(event) => {
            setFilter((current) => ({
              ...current,

              type:
                event.target.value as
                  | ITRequestType
                  | '',
            }));
          }}
        >
          <option value="">
            Pilih jenis request
          </option>

          <option value="REQUEST">
            Request
          </option>

          <option value="CHANGE">
            Change
          </option>

          <option value="INCIDENT">
            Incident
          </option>
        </select>
      </div>

      <div className={styles.selectField}>
        <select
          className={`${styles.input} ${styles.select}`}
          value={filter.status}
          onChange={(event) => {
            setFilter((current) => ({
              ...current,

              status:
                event.target.value as
                  | ITRequestStatus
                  | '',
            }));
          }}
        >
          <option value="">
            Pilih status
          </option>

          <option value="SUBMITTED">
            Diajukan
          </option>

          <option value="APPROVED">
            Disetujui
          </option>

          <option value="IN_PROGRESS">
            Diproses
          </option>

          <option value="COMPLETED">
            Selesai
          </option>

          <option value="REJECTED">
            Ditolak
          </option>
        </select>
      </div>

      <button
        type="submit"
        className={styles.applyButton}
      >
        Terapkan Filter
      </button>
    </form>
  );
}

export default ITRequestFilter;