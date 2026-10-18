// Country list for the sign-up phone field: ISO code, name, flag emoji and
// dial code for every country, sourced from country-codes-list rather than
// hand-typed (too easy to get an uncommon dial code wrong by hand). Not the
// same list as data/countries.js, which is the smaller set of countries
// AZRAA has configured pricing/payment methods for.

import * as countryCodes from 'country-codes-list';

export const PHONE_COUNTRIES = countryCodes
  .all()
  .filter((c) => c.countryCallingCode)
  .map((c) => ({
    code: c.countryCode,
    name: c.countryNameEn,
    flag: c.flag,
    dialCode: `+${c.countryCallingCode}`,
    nationalLengths: c.nationalNumberLengths || [],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findPhoneCountry(code) {
  return PHONE_COUNTRIES.find((c) => c.code === code);
}
