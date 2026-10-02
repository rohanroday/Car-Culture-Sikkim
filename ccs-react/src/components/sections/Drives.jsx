import SilentVideo from '../ui/SilentVideo.jsx';

export default function Drives() {
  return (
    <>
    {/* 02 the drives */}
    <section className="drives pad" id="drives" data-reveal>
      <div className="wrap">
        <div className="head">
          <div>
            <span className="mono rv"><b>02</b> / The drives</span>
            <h2 className="display rv" data-split="h" style={{ '--n': '1', marginTop: '16px' }}>Every event has a story.</h2>
          </div>
          <p className="lede rv" style={{ '--n': '2' }}>These are the ones we have collected along the way. Every one of them is on film, so pick a road and watch.</p>
        </div>

        <div className="drive-row" id="driveRow">
        <article className="card feature rv" style={{ '--n': '2' }}>
          <div className="media" id="convoyMedia">
            <img src="assets/drive-convoy.jpg" width="1200" height="600" loading="lazy" decoding="async" alt="A line of yellow and red sports cars on a mountain road in Sikkim with snow peaks behind" />
            <SilentVideo id="convoyVideo" loop playsInline preload="none" aria-hidden="true" tabIndex="-1" />
          </div>
          <div className="body">
            <span className="mono"><b>December 2025</b> / Nathu La, Cho La, Zuluk</span>
            <h3>Supercar Drive</h3>
            <p>Seventeen supercars. One Silk Route. Lamborghinis and Porsches climbed from Rangpo to the passes at over 4,000 metres, the loudest week these roads have heard.</p>
            <div className="trio" aria-hidden="true">
              <img src="assets/drive-flagoff.jpg" width="1170" height="540" loading="lazy" decoding="async" alt="" />
              <img src="assets/drive-nathula.jpg" width="1094" height="730" loading="lazy" decoding="async" alt="" />
              <img src="assets/drive-hairpin.jpg" width="1094" height="730" loading="lazy" decoding="async" alt="" />
            </div>
            <a className="watch" href="https://youtu.be/KcLLReTHZY4" target="_blank" rel="noopener">Watch the coverage <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 11l8-8M5 3h6v6" /></svg></a>
          </div>
        </article>

        <div className="pair">
          <article className="card rv" style={{ '--n': '3' }}>
            <div className="body">
              <div className="bigno" aria-hidden="true">1ST</div>
              <span className="mono"><b>The first one</b> / Sikkim</span>
              <h3>1st Sikkim Superbike and Car Meet</h3>
              <p>The first car and superbike meet in the state, organised by CCS. Tuned hatches, 4x4s and litre bikes, parked side by side.</p>
              <a className="watch" href="https://youtu.be/SP5CkiSRRHg" target="_blank" rel="noopener">Watch the coverage <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 11l8-8M5 3h6v6" /></svg></a>
            </div>
          </article>
          <article className="card rv" style={{ '--n': '4' }}>
            <div className="body">
              <div className="bigno" aria-hidden="true">18.06</div>
              <span className="mono"><b>June 2023</b> / Rey Khola</span>
              <h3>Rey Khola Car Meet</h3>
              <p>Engines off, hoods up. A meet made for talking builds until the light runs out.</p>
              <a className="watch" href="https://youtu.be/q0uEbgTxZEI" target="_blank" rel="noopener">Watch the coverage <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 11l8-8M5 3h6v6" /></svg></a>
            </div>
          </article>
        </div>
        </div>
        <div className="swipe-hint" aria-hidden="true"><span className="mono">Swipe for more</span><span className="dots" id="driveDots"><i className="on" /><i /><i /></span></div>
      </div>
    </section>
    </>
  );
}
