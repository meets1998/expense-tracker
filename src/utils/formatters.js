export const CURRENCY = {
  symbol: '₹',
  code: 'INR',
  locale: 'en-IN',
};

export const formatCurrency = (amount) => {
  // Handle undefined, null, NaN
  if (amount === undefined || amount === null) {
    return '₹0';
  }
  
  // Parse to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if valid number
  if (isNaN(numAmount)) {
    return '₹0';
  }
  
  try {
    return new Intl.NumberFormat(CURRENCY.locale, {
      style: 'currency',
      currency: CURRENCY.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numAmount);
  } catch {
    return `₹${numAmount.toFixed(2)}`;
  }
};

export const formatNumber = (number) => {
  const num = parseFloat(number);
  if (isNaN(num)) return '0';
  
  try {
    return new Intl.NumberFormat(CURRENCY.locale).format(num);
  } catch {
    return String(num);
  }
};

export const formatCompactNumber = (number) => {
  const num = parseFloat(number);
  if (isNaN(num)) return '0';
  
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(Math.round(num));
};

export const formatPercentage = (value, total) => {
  const numValue = parseFloat(value) || 0;
  const numTotal = parseFloat(total) || 0;
  
  if (numTotal === 0) return '0%';
  
  const percentage = (numValue / numTotal) * 100;
  return `${percentage.toFixed(1)}%`;
};