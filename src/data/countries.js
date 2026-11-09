// Region configuration. Selecting a country drives: display currency, tax,
// available payment providers, and shipping region. The customer can always
// override detection. Base currency for the whole system is USD.
//
// Name/currency/flag below were generated once from `country-codes-list`
// (already a project dependency, already used for the phone-country picker
// in data/phoneCountries.js) rather than hand-typed — for ~195 entries
// that's the difference between an authoritative source and a real
// transcription-error risk. They're baked in as plain data here rather than
// importing the package at runtime: that package is pulled in by the
// always-loaded header/region chrome, and importing it directly added ~21KB
// gzip to the main bundle on every page load. A couple of names below are
// simplified from the package's formal UN/treaty names to the names a
// shopper would actually recognize (e.g. "Laos", not "Lao People's
// Democratic Republic") — not a political edit, just plain-language naming,
// same spirit as the Taiwan/Vatican/Palestine naming already settled on.
//
// Only the continent grouping is curated by hand, since the package's own
// "region" field is ITU-based (e.g. "Arab States", "Asia & Pacific") and
// doesn't match plain continents.

// [code, name, currency, flag] per continent. The standard ~195 UN
// member/observer states — dependent/non-sovereign territories (which the
// source package also lists, e.g. Hong Kong, Puerto Rico, Greenland) are
// intentionally left out, and so is Antarctica (no currency, no commerce).
// Nothing here is excluded by wealth — every sovereign country is included.
const BY_CONTINENT = {
  Africa: [
    ['DZ', 'Algeria', 'DZD', '🇩🇿'], ['AO', 'Angola', 'AOA', '🇦🇴'], ['BJ', 'Benin', 'XOF', '🇧🇯'],
    ['BW', 'Botswana', 'BWP', '🇧🇼'], ['BF', 'Burkina Faso', 'XOF', '🇧🇫'], ['BI', 'Burundi', 'BIF', '🇧🇮'],
    ['CV', 'Cabo Verde', 'CVE', '🇨🇻'], ['CM', 'Cameroon', 'XAF', '🇨🇲'], ['CF', 'Central African Republic', 'XAF', '🇨🇫'],
    ['TD', 'Chad', 'XAF', '🇹🇩'], ['KM', 'Comoros', 'KMF', '🇰🇲'], ['CG', 'Congo-Brazzaville', 'XAF', '🇨🇬'],
    ['CD', 'DR Congo', 'CDF', '🇨🇩'], ['CI', "Côte d'Ivoire", 'XOF', '🇨🇮'], ['DJ', 'Djibouti', 'DJF', '🇩🇯'],
    ['EG', 'Egypt', 'EGP', '🇪🇬'], ['GQ', 'Equatorial Guinea', 'XAF', '🇬🇶'], ['ER', 'Eritrea', 'ERN', '🇪🇷'],
    ['SZ', 'Eswatini', 'SZL', '🇸🇿'], ['ET', 'Ethiopia', 'ETB', '🇪🇹'], ['GA', 'Gabon', 'XAF', '🇬🇦'],
    ['GM', 'Gambia', 'GMD', '🇬🇲'], ['GH', 'Ghana', 'GHS', '🇬🇭'], ['GN', 'Guinea', 'GNF', '🇬🇳'],
    ['GW', 'Guinea-Bissau', 'XOF', '🇬🇼'], ['KE', 'Kenya', 'KES', '🇰🇪'], ['LS', 'Lesotho', 'LSL', '🇱🇸'],
    ['LR', 'Liberia', 'LRD', '🇱🇷'], ['LY', 'Libya', 'LYD', '🇱🇾'], ['MG', 'Madagascar', 'MGA', '🇲🇬'],
    ['MW', 'Malawi', 'MWK', '🇲🇼'], ['ML', 'Mali', 'XOF', '🇲🇱'], ['MR', 'Mauritania', 'MRU', '🇲🇷'],
    ['MU', 'Mauritius', 'MUR', '🇲🇺'], ['MA', 'Morocco', 'MAD', '🇲🇦'], ['MZ', 'Mozambique', 'MZN', '🇲🇿'],
    ['NA', 'Namibia', 'NAD', '🇳🇦'], ['NE', 'Niger', 'XOF', '🇳🇪'], ['NG', 'Nigeria', 'NGN', '🇳🇬'],
    ['RW', 'Rwanda', 'RWF', '🇷🇼'], ['ST', 'Sao Tome and Principe', 'STN', '🇸🇹'], ['SN', 'Senegal', 'XOF', '🇸🇳'],
    ['SC', 'Seychelles', 'SCR', '🇸🇨'], ['SL', 'Sierra Leone', 'SLE', '🇸🇱'], ['SO', 'Somalia', 'SOS', '🇸🇴'],
    ['ZA', 'South Africa', 'ZAR', '🇿🇦'], ['SS', 'South Sudan', 'SSP', '🇸🇸'], ['SD', 'Sudan', 'SDG', '🇸🇩'],
    ['TZ', 'Tanzania', 'TZS', '🇹🇿'], ['TG', 'Togo', 'XOF', '🇹🇬'], ['TN', 'Tunisia', 'TND', '🇹🇳'],
    ['UG', 'Uganda', 'UGX', '🇺🇬'], ['ZM', 'Zambia', 'ZMW', '🇿🇲'], ['ZW', 'Zimbabwe', 'ZWG', '🇿🇼'],
  ],
  Asia: [
    ['AF', 'Afghanistan', 'AFN', '🇦🇫'], ['AM', 'Armenia', 'AMD', '🇦🇲'], ['AZ', 'Azerbaijan', 'AZN', '🇦🇿'],
    ['BH', 'Bahrain', 'BHD', '🇧🇭'], ['BD', 'Bangladesh', 'BDT', '🇧🇩'], ['BT', 'Bhutan', 'BTN', '🇧🇹'],
    ['BN', 'Brunei', 'BND', '🇧🇳'], ['KH', 'Cambodia', 'KHR', '🇰🇭'], ['CN', 'China', 'CNY', '🇨🇳'],
    ['CY', 'Cyprus', 'EUR', '🇨🇾'], ['GE', 'Georgia', 'GEL', '🇬🇪'], ['IN', 'India', 'INR', '🇮🇳'],
    ['ID', 'Indonesia', 'IDR', '🇮🇩'], ['IR', 'Iran', 'IRR', '🇮🇷'], ['IQ', 'Iraq', 'IQD', '🇮🇶'],
    ['IL', 'Israel', 'ILS', '🇮🇱'], ['JP', 'Japan', 'JPY', '🇯🇵'], ['JO', 'Jordan', 'JOD', '🇯🇴'],
    ['KZ', 'Kazakhstan', 'KZT', '🇰🇿'], ['KW', 'Kuwait', 'KWD', '🇰🇼'], ['KG', 'Kyrgyzstan', 'KGS', '🇰🇬'],
    ['LA', 'Laos', 'LAK', '🇱🇦'], ['LB', 'Lebanon', 'LBP', '🇱🇧'], ['MY', 'Malaysia', 'MYR', '🇲🇾'],
    ['MV', 'Maldives', 'MVR', '🇲🇻'], ['MN', 'Mongolia', 'MNT', '🇲🇳'], ['MM', 'Myanmar', 'MMK', '🇲🇲'],
    ['NP', 'Nepal', 'NPR', '🇳🇵'], ['KP', 'North Korea', 'KPW', '🇰🇵'], ['OM', 'Oman', 'OMR', '🇴🇲'],
    ['PK', 'Pakistan', 'PKR', '🇵🇰'], ['PS', 'Palestine', 'ILS', '🇵🇸'], ['PH', 'Philippines', 'PHP', '🇵🇭'],
    ['QA', 'Qatar', 'QAR', '🇶🇦'], ['SA', 'Saudi Arabia', 'SAR', '🇸🇦'], ['SG', 'Singapore', 'SGD', '🇸🇬'],
    ['KR', 'South Korea', 'KRW', '🇰🇷'], ['LK', 'Sri Lanka', 'LKR', '🇱🇰'], ['SY', 'Syria', 'SYP', '🇸🇾'],
    ['TW', 'Taiwan', 'TWD', '🇹🇼'], ['TJ', 'Tajikistan', 'TJS', '🇹🇯'], ['TH', 'Thailand', 'THB', '🇹🇭'],
    ['TL', 'Timor-Leste', 'USD', '🇹🇱'], ['TR', 'Türkiye', 'TRY', '🇹🇷'], ['TM', 'Turkmenistan', 'TMT', '🇹🇲'],
    ['AE', 'United Arab Emirates', 'AED', '🇦🇪'], ['UZ', 'Uzbekistan', 'UZS', '🇺🇿'], ['VN', 'Vietnam', 'VND', '🇻🇳'],
    ['YE', 'Yemen', 'YER', '🇾🇪'],
  ],
  Europe: [
    ['AL', 'Albania', 'ALL', '🇦🇱'], ['AD', 'Andorra', 'EUR', '🇦🇩'], ['AT', 'Austria', 'EUR', '🇦🇹'],
    ['BY', 'Belarus', 'BYN', '🇧🇾'], ['BE', 'Belgium', 'EUR', '🇧🇪'], ['BA', 'Bosnia and Herzegovina', 'BAM', '🇧🇦'],
    ['BG', 'Bulgaria', 'EUR', '🇧🇬'], ['HR', 'Croatia', 'EUR', '🇭🇷'], ['CZ', 'Czechia', 'CZK', '🇨🇿'],
    ['DK', 'Denmark', 'DKK', '🇩🇰'], ['EE', 'Estonia', 'EUR', '🇪🇪'], ['FI', 'Finland', 'EUR', '🇫🇮'],
    ['FR', 'France', 'EUR', '🇫🇷'], ['DE', 'Germany', 'EUR', '🇩🇪'], ['GR', 'Greece', 'EUR', '🇬🇷'],
    ['HU', 'Hungary', 'HUF', '🇭🇺'], ['IS', 'Iceland', 'ISK', '🇮🇸'], ['IE', 'Ireland', 'EUR', '🇮🇪'],
    ['IT', 'Italy', 'EUR', '🇮🇹'], ['LV', 'Latvia', 'EUR', '🇱🇻'], ['LI', 'Liechtenstein', 'CHF', '🇱🇮'],
    ['LT', 'Lithuania', 'EUR', '🇱🇹'], ['LU', 'Luxembourg', 'EUR', '🇱🇺'], ['MT', 'Malta', 'EUR', '🇲🇹'],
    ['MD', 'Moldova', 'MDL', '🇲🇩'], ['MC', 'Monaco', 'EUR', '🇲🇨'], ['ME', 'Montenegro', 'EUR', '🇲🇪'],
    ['NL', 'Netherlands', 'EUR', '🇳🇱'], ['MK', 'North Macedonia', 'MKD', '🇲🇰'], ['NO', 'Norway', 'NOK', '🇳🇴'],
    ['PL', 'Poland', 'PLN', '🇵🇱'], ['PT', 'Portugal', 'EUR', '🇵🇹'], ['RO', 'Romania', 'RON', '🇷🇴'],
    ['RU', 'Russia', 'RUB', '🇷🇺'], ['SM', 'San Marino', 'EUR', '🇸🇲'], ['RS', 'Serbia', 'RSD', '🇷🇸'],
    ['SK', 'Slovakia', 'EUR', '🇸🇰'], ['SI', 'Slovenia', 'EUR', '🇸🇮'], ['ES', 'Spain', 'EUR', '🇪🇸'],
    ['SE', 'Sweden', 'SEK', '🇸🇪'], ['CH', 'Switzerland', 'CHF', '🇨🇭'], ['UA', 'Ukraine', 'UAH', '🇺🇦'],
    ['GB', 'United Kingdom', 'GBP', '🇬🇧'], ['VA', 'Vatican City', 'EUR', '🇻🇦'],
  ],
  'North America': [
    ['AG', 'Antigua and Barbuda', 'XCD', '🇦🇬'], ['BS', 'Bahamas', 'BSD', '🇧🇸'], ['BB', 'Barbados', 'BBD', '🇧🇧'],
    ['BZ', 'Belize', 'BZD', '🇧🇿'], ['CA', 'Canada', 'CAD', '🇨🇦'], ['CR', 'Costa Rica', 'CRC', '🇨🇷'],
    ['CU', 'Cuba', 'CUP', '🇨🇺'], ['DM', 'Dominica', 'XCD', '🇩🇲'], ['DO', 'Dominican Republic', 'DOP', '🇩🇴'],
    ['SV', 'El Salvador', 'USD', '🇸🇻'], ['GD', 'Grenada', 'XCD', '🇬🇩'], ['GT', 'Guatemala', 'GTQ', '🇬🇹'],
    ['HT', 'Haiti', 'HTG', '🇭🇹'], ['HN', 'Honduras', 'HNL', '🇭🇳'], ['JM', 'Jamaica', 'JMD', '🇯🇲'],
    ['MX', 'Mexico', 'MXN', '🇲🇽'], ['NI', 'Nicaragua', 'NIO', '🇳🇮'], ['PA', 'Panama', 'PAB', '🇵🇦'],
    ['KN', 'Saint Kitts and Nevis', 'XCD', '🇰🇳'], ['LC', 'Saint Lucia', 'XCD', '🇱🇨'],
    ['VC', 'Saint Vincent and the Grenadines', 'XCD', '🇻🇨'], ['TT', 'Trinidad and Tobago', 'TTD', '🇹🇹'],
    ['US', 'United States', 'USD', '🇺🇸'],
  ],
  'South America': [
    ['AR', 'Argentina', 'ARS', '🇦🇷'], ['BO', 'Bolivia', 'BOB', '🇧🇴'], ['BR', 'Brazil', 'BRL', '🇧🇷'],
    ['CL', 'Chile', 'CLP', '🇨🇱'], ['CO', 'Colombia', 'COP', '🇨🇴'], ['EC', 'Ecuador', 'USD', '🇪🇨'],
    ['GY', 'Guyana', 'GYD', '🇬🇾'], ['PY', 'Paraguay', 'PYG', '🇵🇾'], ['PE', 'Peru', 'PEN', '🇵🇪'],
    ['SR', 'Suriname', 'SRD', '🇸🇷'], ['UY', 'Uruguay', 'UYU', '🇺🇾'], ['VE', 'Venezuela', 'VES', '🇻🇪'],
  ],
  Oceania: [
    ['AU', 'Australia', 'AUD', '🇦🇺'], ['FJ', 'Fiji', 'FJD', '🇫🇯'], ['KI', 'Kiribati', 'AUD', '🇰🇮'],
    ['MH', 'Marshall Islands', 'USD', '🇲🇭'], ['FM', 'Micronesia', 'USD', '🇫🇲'], ['NR', 'Nauru', 'AUD', '🇳🇷'],
    ['NZ', 'New Zealand', 'NZD', '🇳🇿'], ['PW', 'Palau', 'USD', '🇵🇼'], ['PG', 'Papua New Guinea', 'PGK', '🇵🇬'],
    ['WS', 'Samoa', 'WST', '🇼🇸'], ['SB', 'Solomon Islands', 'SBD', '🇸🇧'], ['TO', 'Tonga', 'TOP', '🇹🇴'],
    ['TV', 'Tuvalu', 'AUD', '🇹🇻'], ['VU', 'Vanuatu', 'VUV', '🇻🇺'],
  ],
};

// Real, already-confirmed payment routing (see CLAUDE.md "Payments"):
// Razorpay is India-only, Paystack covers Nigeria/Ghana/Kenya/South Africa,
// everywhere else runs on PayPal. Every other country below defaults to
// ['paypal'] unless listed here.
const SPECIAL_PAYMENTS = {
  IN: ['razorpay', 'paypal'],
  NG: ['paystack', 'paypal'],
  GH: ['paystack', 'paypal'],
  KE: ['paystack', 'paypal'],
  ZA: ['paystack', 'paypal'],
};

// Real, already-confirmed tax rates for the countries this store already
// operates in. Every other country intentionally defaults to 0% / "Tax" —
// inventing ~190 countries' real VAT/GST rates isn't something to guess at;
// these need confirming with real figures before launch, same as the other
// "still needs real data" placeholders in this codebase.
const SPECIAL_TAX = {
  US: { taxLabel: 'Tax', taxRate: 0 },
  IN: { taxLabel: 'GST', taxRate: 0.05 },
  NG: { taxLabel: 'VAT', taxRate: 0.075 },
  GH: { taxLabel: 'VAT', taxRate: 0.15 },
  KE: { taxLabel: 'VAT', taxRate: 0.16 },
  ZA: { taxLabel: 'VAT', taxRate: 0.15 },
  BD: { taxLabel: 'VAT', taxRate: 0.075 },
  AE: { taxLabel: 'VAT', taxRate: 0.05 },
  GB: { taxLabel: 'VAT', taxRate: 0.2 },
};

function buildCountries() {
  const out = {};
  for (const [continent, rows] of Object.entries(BY_CONTINENT)) {
    for (const [code, name, currency, flag] of rows) {
      const tax = SPECIAL_TAX[code] || { taxLabel: 'Tax', taxRate: 0 };
      out[code] = {
        code,
        name,
        flag,
        continent,
        currency,
        locale: `en-${code}`,
        taxLabel: tax.taxLabel,
        taxRate: tax.taxRate,
        paymentMethods: SPECIAL_PAYMENTS[code] || ['paypal'],
      };
    }
  }
  return out;
}

export const COUNTRIES = {
  ...buildCountries(),
  // Fallback for anywhere not individually listed above, priced in USD.
  ROW: {
    code: 'ROW', name: 'Other / International', flag: '🌍', continent: 'International',
    currency: 'USD', locale: 'en-US', taxLabel: 'Tax', taxRate: 0,
    paymentMethods: ['paypal'],
  },
};

export const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

export const DEFAULT_COUNTRY = 'US'; // default currency shown to new visitors: USD

// Surfaced first in pickers / the welcome modal.
export const PRIMARY_COUNTRIES = ['IN', 'NG', 'US'];

export const getCountry = (code) => COUNTRIES[code] || COUNTRIES[DEFAULT_COUNTRY];
export const countryList = () => Object.values(COUNTRIES).filter((c) => c.code !== 'ROW');

/** Every real country (no ROW), grouped and sorted by continent then name. */
export function countriesByContinent() {
  const list = countryList();
  return CONTINENTS.map((continent) => ({
    continent,
    countries: list.filter((c) => c.continent === continent).sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

// Currencies we can display (must be covered by services/fx.js).
export const SUPPORTED_CURRENCIES = [
  ...new Set(Object.values(COUNTRIES).map((c) => c.currency)),
];
