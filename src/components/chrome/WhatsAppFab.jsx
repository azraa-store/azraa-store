import { whatsappLink, WHATSAPP } from '../../config/site.js';

/** WhatsApp glyph (official mark, single path). */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.02 4c-6.63 0-12 5.37-12 12 0 2.11.55 4.17 1.6 5.99L4 28l6.18-1.6a11.9 11.9 0 0 0 5.83 1.52h.01c6.62 0 12-5.37 12-12s-5.38-11.92-12-11.92Zm0 21.82h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.92-9.92 9.92Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

/**
 * A fixed WhatsApp contact button, bottom-right on every page.
 * Full pill on wider screens; icon-only circle on phones.
 */
export default function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${WHATSAPP.display}`}
      title={`WhatsApp, ${WHATSAPP.display}`}
    >
      <span className="wa-fab__icon"><WhatsAppIcon /></span>
      <span className="wa-fab__label">WhatsApp</span>
    </a>
  );
}
