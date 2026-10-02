import { useEffect } from 'react';
import { initSite } from '../motion/index.js';

let started = false;

/* Starts the interactions and the animation engine once, after the page has rendered. */
export function useSiteEngine() {
  useEffect(() => {
    if (started) return;
    started = true;
    initSite();
  }, []);
}

// The engine holds references to the rendered elements, so a hot update reloads the page.
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => window.location.reload());
}
