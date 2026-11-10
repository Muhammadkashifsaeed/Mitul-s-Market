/**
 * Formats an amount in Indian Rupees (INR).
 */
export function formatCurrency(amount: number, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a Date or ISO date string into a human-readable date.
 */
export function formatDate(
  input: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
  locale = "en-US"
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Truncates text to a maximum length and appends an ellipsis when exceeded.
 */
export function truncate(value: string, maxLength: number): string {
  if (maxLength <= 0) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Delays execution for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

