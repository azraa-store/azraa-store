// Mirrors the Supabase Auth password policy (Settings -> Password
// requirements: "Lowercase, uppercase letters, digits and symbols", minimum
// length 8) so the form catches a weak password before it ever reaches the
// server, and shows exactly what's missing instead of a flat rejection.

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'lower', label: 'A lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', label: 'An uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'digit', label: 'A number', test: (v) => /\d/.test(v) },
  { id: 'symbol', label: 'A symbol, e.g. ! ? # %', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function isPasswordValid(value) {
  return PASSWORD_RULES.every((r) => r.test(value || ''));
}
