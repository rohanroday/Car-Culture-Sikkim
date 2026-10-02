# Car Culture Sikkim (React)

The same website as `../site`, rebuilt as a React + Vite project. The rendered page is identical: same markup, same styles, same animation code.

## Commands

```bash
npm install        # first time only
npm run dev        # local development at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

Upload the contents of `dist/` to the host.

## Folder structure

```
ccs-react/
├─ index.html                  page head: meta tags, fonts, favicon, the no-flash class script
├─ public/assets/              videos, photos, logo (served as-is)
└─ src/
   ├─ main.jsx                 mounts <App /> into #root
   ├─ App.jsx                  page order: layout pieces, the two heroes, the six sections, footer
   ├─ components/
   │  ├─ layout/               SkipLink, Intro, Environment, Navbar, MobileMenu, AltitudeRail, JoinBar, Footer
   │  ├─ hero/                 ScrubHero (laptops), StaticHero (phones, tablets, reduced motion)
   │  ├─ sections/             FlagLine, Culture, Marquee, RoadDivider, Drives, StartItUp, Crew, Faq, Join
   │  └─ ui/                   SilentVideo (a muted <video>)
   ├─ hooks/useSiteEngine.js   starts the interactions and the animation engine once, after render
   ├─ config/site.js           media files, altitude range, the five "still hero" screen conditions
   ├─ lib/dom.js               small DOM and maths helpers
   ├─ interactions/            FAQ, join form, nav pill, phone menu, sticky join bar, swipe dots, phone hero loop
   ├─ motion/
   │  ├─ index.js              boot order
   │  ├─ decor.js              drawn decorations: contour lines, prayer flags, marquee, gauge and rail ticks
   │  ├─ splitText.js          splits headlines into words and letters for their entrances
   │  └─ engine.js             Lenis, GSAP ScrollTrigger, the scroll film, both three.js layers, altimeter, reduced motion
   └─ styles/
      ├─ index.css             imports every file below in cascade order
      ├─ tokens-base.css, environment.css, intro.css, nav.css, hero.css, footer.css, altitude-rail.css
      ├─ sections/             one file per section
      ├─ mobile.css            phone layout (kept late so it overrides)
      └─ motion-states.css     paused tabs and reduced motion
```

## Notes

- **The engine runs once.** React renders the page, then `useSiteEngine` starts the animation code, which works on the rendered elements directly. There is no StrictMode, because it would start the engine twice in development. Editing a file in dev mode reloads the whole page for the same reason.
- **Pinned library versions:** gsap 3.12.5, lenis 1.1.20 and three 0.128.0, the same versions the static site loaded from CDNs. They are now bundled, so the site no longer depends on those CDNs.
- **Bundler:** this machine's Windows application control policy blocks Rollup's native module, so `package.json` maps `rollup` to its WebAssembly build (`@rollup/wasm-node`). Builds are slightly slower but identical. On a machine without that policy the override can be removed.
- **The still hero conditions** in `config/site.js` must match the media query in `styles/hero.css` exactly.
- **Before going live,** replace the two `example.com` addresses in `index.html` (marked `DEPLOY STEP`) with the live address.
