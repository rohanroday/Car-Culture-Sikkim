/* Small DOM and maths helpers shared by the interactions and the animation engine. */
export const root = document.documentElement;
export const $ = function(s, r){ return (r || document).querySelector(s); };
export const $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
export const clamp = function(v, lo, hi){ return Math.min(hi, Math.max(lo, v)); };
export const smoothstep = function(p, e0, e1){ var t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
export function rng(seed){ var s = seed >>> 0; return function(){ return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }; }
