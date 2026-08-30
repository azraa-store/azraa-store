/**
 * Single source of truth for AZRAA's public contact channels.
 * Update the values here and every link on the site follows.
 */

// WhatsApp business line. `display` is what people read; `e164` is digits only
// (country code + number, no +, spaces or dashes) for wa.me / click-to-chat.
export const WHATSAPP = {
  display: '+91 90035 41640',
  e164: '919003541640',
};

const DEFAULT_WA_MESSAGE = 'Hello AZRAA - I have a question about your products.';

/** Build a click-to-chat link, optionally with a prefilled message. */
export function whatsappLink(message = DEFAULT_WA_MESSAGE) {
  const base = `https://wa.me/${WHATSAPP.e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
