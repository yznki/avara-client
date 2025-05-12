export function getCurrencySymbol(code: string) {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(1)
      .replace(/\d/g, '')
      .trim();
  } catch {
    return code;
  }
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function abbreviateNumber(value: number): string {
  if (value >= 1e12) return (value / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return value.toFixed(0);
}
