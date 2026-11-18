/**
 * Utility for formatting Indian Rupee (INR / ₹) values with proper Indian numbering system (Lakhs / Crores).
 */
export const formatINR = (
  amount: number,
  options?: { showDecimals?: boolean; compact?: boolean }
): string => {
  if (options?.compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')} K`;
    }
  }

  const hasDecimals = options?.showDecimals ?? (amount % 1 !== 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: hasDecimals ? 2 : 0,
    minimumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);
};
