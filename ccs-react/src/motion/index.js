import { buildRailTicks, buildDecorations } from './decor.js';
import { splitText } from './splitText.js';
import { startEngine } from './engine.js';
import { initFaq } from '../interactions/faq.js';
import { initJoinForm } from '../interactions/joinForm.js';
import { initNavPill } from '../interactions/navPill.js';
import { initMobileMenu } from '../interactions/mobileMenu.js';
import { initJoinBar } from '../interactions/joinBar.js';
import { initSwipeDots } from '../interactions/swipeDots.js';
import { initHeroLoop } from '../interactions/heroLoop.js';

/* Boot order matters: drawn decorations and split text must exist before the engine measures the page. */
export function initSite() {
  const railTicks = buildRailTicks();
  initFaq();
  initJoinForm();
  splitText();
  buildDecorations();
  initNavPill();
  initMobileMenu();
  initJoinBar();
  initSwipeDots();
  initHeroLoop();
  startEngine(railTicks);
}
