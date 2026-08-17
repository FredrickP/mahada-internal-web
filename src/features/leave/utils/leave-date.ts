export const formatLeaveDate = (
  value: string,
): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(date);
};

export const calculateWorkingDays = (
  startDate: string,
  endDate: string,
): number => {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(
    `${startDate}T00:00:00`,
  );

  const end = new Date(
    `${endDate}T00:00:00`,
  );

  if (end < start) {
    return 0;
  }

  let totalDays = 0;

  const currentDate =
    new Date(start);

  while (currentDate <= end) {
    const day =
      currentDate.getDay();

    const isWeekend =
      day === 0 ||
      day === 6;

    if (!isWeekend) {
      totalDays += 1;
    }

    currentDate.setDate(
      currentDate.getDate() + 1,
    );
  }

  return totalDays;
};

export const formatWorkingDays = (
  totalDays: number,
): string => {
  if (totalDays <= 0) {
    return '-';
  }

  return `${totalDays} Hari kerja`;
};