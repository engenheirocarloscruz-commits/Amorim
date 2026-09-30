export function formatCurrency(value: number, includeDecimals = true): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace('.', ',')}M €`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.', ',')}k €`;
  }
  return formatCurrency(value, false);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}
