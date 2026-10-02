import SilentVideo from '../ui/SilentVideo.jsx';

export default function ScrubHero() {
  return (
    <>
    {/* scrub hero: laptops and desktops */}
    <section className="hero" id="top" aria-label="Car Culture Sikkim">
      <div className="stage" id="stage">
        <div className="poster" id="poster" aria-hidden="true" />
        <SilentVideo id="heroVideo" preload="none" playsInline aria-hidden="true" tabIndex="-1" />
        <div className="ending" id="ending" aria-hidden="true" />
        <canvas id="fx" aria-hidden="true" />
        <div className="scrim" aria-hidden="true" />

        <div className="band side fx-rise" data-a="0" data-b="0.12">
          <span className="chip"><b>01</b> &nbsp;The climb</span>
          <p className="hl display" data-split="w">Every road here goes up.</p>
        </div>
        <div className="band side fx-snap" data-a="0.17" data-b="0.31" data-spread="0.5">
          <span className="chip"><b>02</b> &nbsp;The road</span>
          <p className="hl display" data-split="c">Hairpins. Thin air. No shortcuts.</p>
        </div>
        <div className="band side fx-mist" data-a="0.42" data-b="0.56" data-ramp="0.03">
          <span className="chip"><b>03</b> &nbsp;The tunnel</span>
          <p className="hl display mist"><span className="sharp">Windows down. Let it echo.</span></p>
        </div>
        <div className="band side fx-rise" data-a="0.66" data-b="0.79">
          <span className="chip"><b>04</b> &nbsp;Into the light</span>
          <p className="hl display" data-split="w">Where Sikkim's petrolheads meet.</p>
        </div>
        <div className="band fx-rise settle" data-a="0.86" data-b="1">
          <span className="chip"><b>05</b> &nbsp;The pass, 4,310 m</span>
          <h1 className="hl display" data-split="w">Car Culture Sikkim</h1>
          <p className="sub">A platform for the auto enthusiasts of Sikkim. Meets, drives and the people behind the wheel.</p>
          <div className="row">
            <a className="btn" href="#join">Join the next meet <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></a>
            <a className="btn ghost" href="#drives">See the drives</a>
          </div>
        </div>

        <div className="cue" id="cue" aria-hidden="true">Scroll to drive<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7l5 5 5-5" /></svg></div>
        <svg className="ring" id="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="126" style={{ strokeDashoffset: 'var(--ld,126)' }} /></svg>
      </div>
    </section>
    </>
  );
}
