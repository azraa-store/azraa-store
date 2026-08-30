import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssistant } from '../../context/AssistantContext.jsx';
import { whatsappLink } from '../../config/site.js';

/* ── marks ─────────────────────────────────────────────────────────── */

function BotMark({ size = 20 }) {
  // a quiet concentric "listening" mark — reads as an assistant, not a face
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true">
      <path fill="currentColor" d="M16.02 4c-6.63 0-12 5.37-12 12 0 2.11.55 4.17 1.6 5.99L4 28l6.18-1.6a11.9 11.9 0 0 0 5.83 1.52h.01c6.62 0 12-5.37 12-12s-5.38-11.92-12-11.92Zm0 21.82h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.92-9.92 9.92Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 640;

/* ── message parts ─────────────────────────────────────────────────── */

function Bubble({ msg, onChip, onNavigate }) {
  const bot = msg.role !== 'user';
  return (
    <div className={`bot-msg ${bot ? 'bot-msg--bot' : 'bot-msg--user'}`}>
      {bot && <span className="bot-msg__avatar"><BotMark size={15} /></span>}
      <div className="bot-msg__stack">
        <div className="bot-msg__bubble">
          {msg.content.split('\n').map((line, i) =>
            line.trim() ? <p key={i}>{line}</p> : <span key={i} className="bot-msg__gap" />
          )}
        </div>

        {msg.products?.length > 0 && (
          <div className="bot-cards">
            {msg.products.map((p) => (
              <Link key={p.slug} to={`/product/${p.slug}`} className="bot-card" onClick={onNavigate}>
                <span className="bot-card__plate">{p.motif}</span>
                <span className="bot-card__meta">
                  <span className="bot-card__name">{p.name}</span>
                  <span className="bot-card__sub">
                    {p.category}{p.priceText ? ` · ${p.priceText}` : ''}
                  </span>
                </span>
                <span className="bot-card__go" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}

        {msg.links?.length > 0 && (
          <div className="bot-links">
            {msg.links.map((l) => (
              <Link key={l.to + l.label} to={l.to} className="bot-link" onClick={onNavigate}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {msg.handoff && (
          <a
            className="bot-handoff"
            href={whatsappLink('Hello AZRAA — I was chatting with AZRAA Bot and would like to speak to someone.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppGlyph /> Chat on WhatsApp
          </a>
        )}

        {msg.chips?.length > 0 && (
          <div className="bot-chips">
            {msg.chips.map((c) => (
              <button key={c.label} className="bot-chip" onClick={() => onChip(c.send)}>
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── panel ─────────────────────────────────────────────────────────── */

export default function AzraaBot() {
  const { open, setOpen, toggle, thread, send, reset, busy, unread, mode } = useAssistant();
  const [draft, setDraft] = useState('');
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const taRef = useRef(null);

  // keep the transcript pinned to the latest message
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread, busy, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    // lock the page behind the full-screen sheet on phones only
    const lock = isMobile();
    if (lock) document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      if (lock) document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  // auto-grow the composer
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [draft]);

  const submit = (e) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft('');
    send(text);
  };

  const onChip = (text) => {
    if (!busy) send(text);
  };

  const onNavigate = () => {
    if (isMobile()) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`bot-launcher ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close AZRAA Bot' : 'Open AZRAA Bot — shopping assistant'}
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="bot-launcher__icon"><BotMark size={22} /></span>
        {unread > 0 && !open && <span className="bot-launcher__badge">{unread}</span>}
      </button>

      <section
        className={`bot-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-label="AZRAA Bot"
        aria-hidden={!open}
      >
        <header className="bot-panel__head">
          <span className="bot-panel__avatar"><BotMark size={18} /></span>
          <span className="bot-panel__id">
            <span className="bot-panel__name">AZRAA Bot</span>
            <span className="bot-panel__role">
              <span className="bot-panel__dot" /> Shopping assistant
            </span>
          </span>
          <div className="bot-panel__actions">
            {thread.length > 1 && (
              <button type="button" className="bot-panel__reset" onClick={reset} disabled={busy}>
                New chat
              </button>
            )}
            <button
              type="button"
              className="bot-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="bot-panel__body" ref={bodyRef}>
          <div aria-live="polite" aria-atomic="false">
            {thread.map((m) => (
              <Bubble key={m.id} msg={m} onChip={onChip} onNavigate={onNavigate} />
            ))}
          </div>
          {busy && (
            <div className="bot-msg bot-msg--bot">
              <span className="bot-msg__avatar"><BotMark size={15} /></span>
              <div className="bot-typing" aria-label="AZRAA Bot is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        <form className="bot-panel__composer" onSubmit={submit}>
          <textarea
            ref={(el) => { taRef.current = el; inputRef.current = el; }}
            className="bot-composer__input"
            rows={1}
            placeholder="Ask about products, pricing, delivery…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            aria-label="Message AZRAA Bot"
          />
          <button
            type="submit"
            className="bot-composer__send"
            disabled={!draft.trim() || busy}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </form>

        <p className="bot-panel__fine">
          AZRAA Bot {mode === 'model' ? 'is AI-assisted' : 'answers from AZRAA’s own product and policy information'} — check important details before ordering.
        </p>
      </section>
    </>
  );
}
