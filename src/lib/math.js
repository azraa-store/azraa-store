export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;

// Frame-rate independent damping. `lambda` ~ higher = snappier.
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

// Remap x from [inMin,inMax] to [outMin,outMax], clamped.
export const mapRange = (x, inMin, inMax, outMin, outMax) => {
  const t = clamp((x - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * t;
};

// Smooth 0..1 ramp with ease-in-out, active only across [start,end].
export const ramp = (x, start, end) => {
  if (end <= start) return x >= end ? 1 : 0;
  const t = clamp((x - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
