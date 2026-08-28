// A tiny framework-agnostic store for normalized scroll progress (0..1).
// Lenis writes here on every scroll tick; the R3F render loop reads it in useFrame,
// and React components can subscribe for cheap derived UI state.

const state = {
  progress: 0, // 0..1 across the cinematic hero (written by HomeHero)
  pageProgress: 0, // 0..1 across the whole document (written by the scroll manager)
  velocity: 0, // signed, normalized-ish
  raw: 0, // pixels
};

const listeners = new Set();

export const scrollStore = {
  get: () => state,
  set: (patch) => {
    Object.assign(state, patch);
    listeners.forEach((fn) => fn(state));
  },
  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
