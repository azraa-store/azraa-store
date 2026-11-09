import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab/Shift+Tab inside the returned ref's element while `active`,
 * focuses its first focusable child on activation, and restores focus to
 * whatever was focused before on deactivation. The ref'd element should
 * carry `tabIndex={-1}` as a fallback focus target if it has no focusable
 * children yet (e.g. still loading).
 */
export function useFocusTrap(active) {
  const ref = useRef(null);
  const prevFocus = useRef(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    prevFocus.current = document.activeElement;

    const focusables = () =>
      Array.from(el.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null);

    const first = focusables()[0];
    (first || el).focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const firstEl = nodes[0];
      const lastEl = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    el.addEventListener('keydown', onKeyDown);
    return () => {
      el.removeEventListener('keydown', onKeyDown);
      if (prevFocus.current && typeof prevFocus.current.focus === 'function') {
        prevFocus.current.focus({ preventScroll: true });
      }
    };
  }, [active]);

  return ref;
}
