import { useEffect, useState } from 'react';
import { useAssistant } from '../../context/AssistantContext.jsx';

const SHOWN_KEY = 'azraa.assistantNudge.shown';
const DELAY_MS = 16000;

/**
 * A quiet, one-time teaser toward the existing AZRAA Bot — "shopping
 * assistance" popups (a subtle prompt, not a gate) came up repeatedly in
 * fashion-ecommerce research as a popup pattern distinct from discount
 * capture. Shown once ever, only on product pages, only if the bot isn't
 * already open.
 */
export default function AssistantNudge({ prompt = 'Have a question about this piece?' }) {
  const { open, openPanel } = useAssistant();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shown = false;
    try { shown = localStorage.getItem(SHOWN_KEY) === '1'; } catch { /* ignore */ }
    if (shown || open) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(SHOWN_KEY, '1'); } catch { /* ignore */ }
  };

  const chat = () => {
    dismiss();
    openPanel();
  };

  if (!visible || open) return null;

  return (
    <div className="assistant-nudge" role="status">
      <span>{prompt} <button type="button" className="link" onClick={chat}>Chat with AZRAA</button></span>
      <button type="button" className="assistant-nudge__close" onClick={dismiss} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
