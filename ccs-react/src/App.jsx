import SkipLink from './components/layout/SkipLink.jsx';
import Intro from './components/layout/Intro.jsx';
import Environment from './components/layout/Environment.jsx';
import Navbar from './components/layout/Navbar.jsx';
import MobileMenu from './components/layout/MobileMenu.jsx';
import AltitudeRail from './components/layout/AltitudeRail.jsx';
import JoinBar from './components/layout/JoinBar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrubHero from './components/hero/ScrubHero.jsx';
import StaticHero from './components/hero/StaticHero.jsx';
import FlagLine from './components/sections/FlagLine.jsx';
import Culture from './components/sections/Culture.jsx';
import Marquee from './components/sections/Marquee.jsx';
import RoadDivider from './components/sections/RoadDivider.jsx';
import Drives from './components/sections/Drives.jsx';
import StartItUp from './components/sections/StartItUp.jsx';
import Crew from './components/sections/Crew.jsx';
import Faq from './components/sections/Faq.jsx';
import Join from './components/sections/Join.jsx';
import { useSiteEngine } from './hooks/useSiteEngine.js';

export default function App() {
  useSiteEngine();

  return (
    <>
      <SkipLink />
      <Intro />
      <Environment />
      <Navbar />
      <MobileMenu />
      <AltitudeRail />
      <JoinBar />

      <main id="main" tabIndex="-1">
        <ScrubHero />
        <StaticHero />
        <FlagLine />
        <Culture />
        <Marquee />
        <RoadDivider maskId="rm1" />
        <Drives />
        <StartItUp />
        <RoadDivider maskId="rm2" flip />
        <Crew />
        <Faq />
        <Join />
      </main>

      <Footer />
    </>
  );
}
