// Wholesale enquiry submission. Mock: persists locally and returns a reference.
// Production: POST to `/api/wholesale/enquiries` -> routes to the trade desk / CRM.

const KEY = 'azraa.wholesale.enquiries';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * @param {{
 *   business: { name, type, country, website?, taxId? },
 *   contact: { name, email, phone, role? },
 *   items: Array<{ productId, name, quantity, note? }>,
 *   message?: string,
 *   estimate?: object,
 * }} enquiry
 */
export async function submitWholesaleEnquiry(enquiry) {
  await delay(700);
  if (!enquiry.business?.name) throw new Error('Business name is required.');
  if (!enquiry.contact?.email) throw new Error('A contact email is required.');
  if (!enquiry.items?.length) throw new Error('Add at least one product to the enquiry.');

  const record = {
    reference: `WHS-${Date.now().toString(36).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    status: 'received',
    ...enquiry,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([record, ...readAll()]));
  } catch {
    /* ignore */
  }
  return record;
}

export async function listWholesaleEnquiries() {
  await delay(150);
  return readAll();
}
