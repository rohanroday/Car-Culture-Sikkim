/* Site settings in one place: media files, the altitude range, and the screens that get the still hero. */
export const CONFIG = {
  heroVideo: 'assets/hero-scrub.mp4',
  heroBytes: 18619755,
  convoyVideo: 'assets/convoy-loop.mp4',
  loopVideo: 'assets/hero-loop.mp4',   // small square cut that loops on phones and tablets
  poster: 'assets/hero-poster.jpg',
  ending: 'assets/hero-ending.jpg',     // full-resolution last frame, shown once the film comes to rest
  altTop: 2900, altPass: 4310, altTown: 1650
};

/* The five conditions that switch the scroll film for the looping hero.
   They must match the media query in styles/hero.css character for character. */
export const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];

export const RM = matchMedia('(prefers-reduced-motion: reduce)');
export const FINE = matchMedia('(pointer: fine)');
export const gated = function(){ return GATES.some(function(q){ return matchMedia(q).matches; }); };
