// Singleton Lenis manager so smooth scroll survives route changes and the
// router can reset scroll position cleanly.

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { scrollStore } from './scrollStore.js';
import { clamp } from './math.js';

let lenis = null;
let rafId = null;

export function initSmoothScroll({ enabled = true } = {}) {
  if (lenis) return lenis;

  if (!enabled) {
    const publish = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      scrollStore.set({
        raw: window.scrollY,
        pageProgress: clamp(max > 0 ? window.scrollY / max : 0),
      });
    };
    window.addEventListener('scroll', publish, { passive: true });
    publish();
    return null;
  }

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.1,
  });

  lenis.on('scroll', (e) => {
    scrollStore.set({ raw: e.scroll, pageProgress: clamp(e.progress), velocity: e.velocity });
  });

  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  rafId = raf;

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

export function destroySmoothScroll() {
  if (rafId) gsap.ticker.remove(rafId);
  if (lenis) lenis.destroy();
  lenis = null;
  rafId = null;
}
