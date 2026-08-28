import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initSmoothScroll, scrollToTop } from '../../lib/smoothScroll.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

export default function ScrollManager() {
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    initSmoothScroll({ enabled: !reduced });
  }, [reduced]);

  useEffect(() => {
    // let the new route paint, then jump to top
    const id = requestAnimationFrame(() => scrollToTop(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
