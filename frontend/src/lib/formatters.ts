// Date formatting
export const formatDate = (
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-KE', defaultOptions).format(d);
};

export const formatDateFull = (date: string | Date | null | undefined): string => {
  return formatDate(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(date);
};

// Currency formatting (KES)
export const formatCurrency = (
  amount: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string => {
  if (amount === null || amount === undefined) return 'KES 0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'KES 0';

  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  };

  return new Intl.NumberFormat('en-KE', defaultOptions).format(num);
};

export const formatCurrencyWithDecimals = (
  amount: number | string | null | undefined
): string => {
  return formatCurrency(amount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Number formatting
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';

  return new Intl.NumberFormat('en-KE').format(n);
};

export const formatCompactNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';

  const formatter = new Intl.NumberFormat('en-KE', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(n);
};

export const formatPercentage = (
  value: number | string | null | undefined,
  decimalPlaces = 1
): string => {
  if (value === null || value === undefined) return '0%';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(n)) return '0%';

  return `${n.toFixed(decimalPlaces)}%`;
};

// String formatting
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    const rest = cleaned.slice(3);
    return `+254 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 8)} ${rest.slice(8, 10)}`;
  }
  return phone;
};

export const formatNationalId = (id: string): string => {
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)}`;
  }
  return id;
};

// Address formatting
export const formatAddress = (
  address: string,
  city?: string | null,
  county?: string | null
): string => {
  const parts = [address];
  if (city) parts.push(city);
  if (county) parts.push(county);
  return parts.join(', ');
};

// Status formatting
export const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Abbreviate text
export const abbreviateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};