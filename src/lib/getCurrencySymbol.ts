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
