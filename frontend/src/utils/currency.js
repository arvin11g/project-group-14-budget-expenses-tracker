export const APP_CURRENCY = "CAD";

export const CURRENCY_OPTIONS = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "AUD", label: "Australian Dollar", symbol: "$" },
  { code: "SGD", label: "Singapore Dollar", symbol: "$" },
  { code: "ZAR", label: "South African Rand", symbol: "R" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "MXN", label: "Mexican Peso", symbol: "$" },
];

export const CAD_EXCHANGE_RATES = {
  USD: 0.74,
  EUR: 0.68,
  GBP: 0.58,
  NGN: 1180,
  INR: 61.5,
  CNY: 5.3,
  JPY: 110,
  AUD: 1.12,
  SGD: 1.0,
  ZAR: 13.7,
  BRL: 3.7,
  MXN: 12.5,
};

export function getHomeCurrency() {
  return localStorage.getItem("homeCurrency") || "USD";
}

export function setHomeCurrency(currencyCode) {
  localStorage.setItem("homeCurrency", currencyCode);
  window.dispatchEvent(new Event("homeCurrencyChanged"));
}

export function formatCurrency(amount, currencyCode = APP_CURRENCY) {
  const value = Number(amount || 0);

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

export function convertFromCad(amountInCad, targetCurrency) {
  const value = Number(amountInCad || 0);
  const rate = CAD_EXCHANGE_RATES[targetCurrency];

  if (!rate) return value;
  return value * rate;
}