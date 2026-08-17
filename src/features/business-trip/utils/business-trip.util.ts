export const calculateTripDuration = (
  departureDate: string,
  returnDate: string,
): number => {
  if (!departureDate || !returnDate) {
    return 0;
  }

  const departure = new Date(
    `${departureDate}T00:00:00`,
  );

  const returned = new Date(
    `${returnDate}T00:00:00`,
  );

  if (returned < departure) {
    return 0;
  }

  const difference =
    returned.getTime() -
    departure.getTime();

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return (
    Math.floor(
      difference /
        millisecondsPerDay,
    ) + 1
  );
};

export const formatTripDuration = (
  durationDays: number,
): string => {
  if (durationDays <= 0) {
    return '-';
  }

  return `${durationDays} Hari`;
};

export const calculateTotalEstimate = (
  transportationEstimate: number,
  accommodationEstimate: number,
  otherEstimate: number,
): number => {
  return (
    transportationEstimate +
    accommodationEstimate +
    otherEstimate
  );
};

export const formatRupiah = (
  value: number,
): string => {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ).format(value);
};

export const parseRupiahInput = (
  value: string,
): number => {
  const numericValue =
    value.replace(/\D/g, '');

  if (!numericValue) {
    return 0;
  }

  return Number(numericValue);
};