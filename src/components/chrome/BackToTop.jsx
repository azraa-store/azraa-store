import { useEffect, useState } from 'react';
import { scrollStore } from '../../lib/scrollStore.js';
import { scrollToTop } from '../../lib/smoothScroll.js';

const SHOW_AFTER_PX = 640;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(scrollStore.get().raw > SHOW_AFTER_PX);
    return scrollStore.subscribe((s) => setVisible(s.raw > SHOW_AFTER_PX));
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-in' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label="Back to top"
      onClick={() => scrollToTop(false)}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
