import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegion } from './RegionContext.jsx';
import { useCart } from './CartContext.jsx';
import { askAssistant, greeting, assistantMode } from '../services/assistant.js';

const AssistantContext = createContext(null);
const THREAD_KEY = 'azraa.bot.thread';
const MAX_TURNS = 40; // keep the stored transcript bounded

let seq = 0;
const uid = () => `m${Date.now().toString(36)}${(seq++).toString(36)}`;

function loadThread() {
  try {
    const raw = localStorage.getItem(THREAD_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

export function AssistantProvider({ children }) {
  const { countryCode, country, currency, locale, rates } = useRegion();
  const { count } = useCart();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(0);
  const [thread, setThread] = useState(() => loadThread() || []);
  const openRef = useRef(open);
  openRef.current = open;

  // context handed to every assistant turn (also the shape a real backend gets)
  const ctxRef = useRef({});
  ctxRef.current = {
    countryCode,
    country: country?.name,
    currency,
    locale,
    rates,
    cartCount: count,
    path: pathname,
  };

  // seed the opening message the first time the panel is opened
  useEffect(() => {
    if (open && thread.length === 0) {
      setThread([{ id: uid(), ...greeting(ctxRef.current) }]);
    }
  }, [open, thread.length]);

  // persist (trimmed)
  useEffect(() => {
    try {
      if (thread.length) localStorage.setItem(THREAD_KEY, JSON.stringify(thread.slice(-MAX_TURNS)));
      else localStorage.removeItem(THREAD_KEY);
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [thread]);

  const send = useCallback(
    async (text) => {
      const content = String(text || '').trim();
      if (!content || busy) return;

      const userMsg = { id: uid(), role: 'user', content };
      setThread((t) => [...t, userMsg]);
      setBusy(true);

      // history the engine/backend sees (roles + content only)
      const history = [...thread, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const reply = await askAssistant({ messages: history, context: ctxRef.current });
        setThread((t) => [...t, { id: uid(), ...reply }]);
        if (!openRef.current) setUnread((n) => n + 1);
      } catch {
        setThread((t) => [
          ...t,
          {
            id: uid(),
            role: 'assistant',
            content:
              "Something went wrong on my end. Please try again, or reach us on WhatsApp or the contact form.",
            chips: [],
            products: [],
            links: [{ label: 'Contact us', to: '/contact' }],
            handoff: true,
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [thread, busy]
  );

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const openPanel = useCallback((prompt) => {
    setOpen(true);
    if (prompt) send(prompt);
  }, [send]);
  const reset = useCallback(() => {
    setThread([{ id: uid(), ...greeting(ctxRef.current) }]);
  }, []);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // reflect open state on <html> so the WhatsApp FAB can step aside
  useEffect(() => {
    const el = document.documentElement;
    if (open) el.setAttribute('data-bot-open', '');
    else el.removeAttribute('data-bot-open');
    return () => el.removeAttribute('data-bot-open');
  }, [open]);

  const value = useMemo(
    () => ({ open, setOpen, toggle, openPanel, thread, send, reset, busy, unread, mode: assistantMode }),
    [open, toggle, openPanel, thread, send, reset, busy, unread]
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export const useAssistant = () => {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
};
