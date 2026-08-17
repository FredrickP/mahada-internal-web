const DEMO_PPN_RATE = 0.11;
const DEMO_PPH_RATE = 0.02;

export const calculatePpnAmount = (
  dppAmount: number,
): number => {
  if (dppAmount <= 0) {
    return 0;
  }

  return Math.round(
    dppAmount * DEMO_PPN_RATE,
  );
};

export const calculatePphAmount = (
  dppAmount: number,
): number => {
  if (dppAmount <= 0) {
    return 0;
  }

  return Math.round(
    dppAmount * DEMO_PPH_RATE,
  );
};

export const calculatePaymentTotal = (
  dppAmount: number,
  ppnAmount: number,
  pphAmount: number,
): number => {
  return Math.max(
    0,
    dppAmount +
      ppnAmount -
      pphAmount,
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