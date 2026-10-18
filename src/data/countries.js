// Region configuration. Selecting a country drives: display currency, tax,
// available payment providers, and shipping region. The customer can always
// override detection. Base currency for the whole system is USD.

export const COUNTRIES = {
  US: {
    code: 'US', name: 'United States', flag: '🇺🇸', region: 'International',
    currency: 'USD', locale: 'en-US', taxLabel: 'Tax', taxRate: 0,
    paymentMethods: ['paypal'],
  },
  IN: {
    code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia',
    currency: 'INR', locale: 'en-IN', taxLabel: 'GST', taxRate: 0.05,
    paymentMethods: ['razorpay', 'paypal'],
  },
  NG: {
    code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa',
    currency: 'NGN', locale: 'en-NG', taxLabel: 'VAT', taxRate: 0.075,
    paymentMethods: ['paystack', 'flutterwave', 'paypal'],
  },
  GH: {
    code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa',
    currency: 'GHS', locale: 'en-GH', taxLabel: 'VAT', taxRate: 0.15,
    paymentMethods: ['flutterwave', 'paypal'],
  },
  KE: {
    code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa',
    currency: 'KES', locale: 'en-KE', taxLabel: 'VAT', taxRate: 0.16,
    paymentMethods: ['flutterwave', 'paypal'],
  },
  ZA: {
    code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa',
    currency: 'ZAR', locale: 'en-ZA', taxLabel: 'VAT', taxRate: 0.15,
    paymentMethods: ['flutterwave', 'paypal'],
  },
  BD: {
    code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia',
    currency: 'BDT', locale: 'en-BD', taxLabel: 'VAT', taxRate: 0.075,
    paymentMethods: ['paypal'],
  },
  AE: {
    code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Asia',
    currency: 'AED', locale: 'en-AE', taxLabel: 'VAT', taxRate: 0.05,
    paymentMethods: ['paypal'],
  },
  GB: {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'International',
    currency: 'GBP', locale: 'en-GB', taxLabel: 'VAT', taxRate: 0.2,
    paymentMethods: ['paypal'],
  },
  // Fallback for anywhere not individually configured, priced in USD.
  ROW: {
    code: 'ROW', name: 'Other / International', flag: '🌍', region: 'International',
    currency: 'USD', locale: 'en-US', taxLabel: 'Tax', taxRate: 0,
    paymentMethods: ['paypal'],
  },
};

export const DEFAULT_COUNTRY = 'US'; // default currency shown to new visitors: USD

// Surfaced first in pickers / the welcome modal.
export const PRIMARY_COUNTRIES = ['IN', 'NG', 'US'];

export const getCountry = (code) => COUNTRIES[code] || COUNTRIES[DEFAULT_COUNTRY];
export const countryList = () => Object.values(COUNTRIES).filter((c) => c.code !== 'ROW');

// Currencies we can display (must be covered by services/fx.js).
export const SUPPORTED_CURRENCIES = [
  ...new Set(Object.values(COUNTRIES).map((c) => c.currency)),
];
