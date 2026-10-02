import SilentVideo from '../ui/SilentVideo.jsx';

export default function StaticHero() {
  return (
    <>
    {/* static hero: phones, portrait tablets, reduced motion */}
    <section className="hero-static" id="heroStatic" aria-label="Car Culture Sikkim">
      <SilentVideo id="loopVideo" loop playsInline preload="none" aria-hidden="true" tabIndex="-1" />
      <div className="inner">
        <span className="chip"><b>CCS</b> &nbsp;Gangtok, Sikkim</span>
        <h1 className="display">Car Culture Sikkim</h1>
        <p className="lede" style={{ color: 'var(--text-primary)' }}>A platform for the auto enthusiasts of Sikkim. Meets, drives and the people behind the wheel.</p>
        <div className="row">
          <a className="btn" href="#join">Join the next meet</a>
          <a className="btn ghost" href="#drives">See the drives</a>
        </div>
      </div>
    </section>
    </>
  );
}
