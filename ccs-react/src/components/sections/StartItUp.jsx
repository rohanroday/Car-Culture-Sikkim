export default function StartItUp() {
  return (
    <>
    {/* 03 start it up: the one interactive moment */}
    <section className="rev pad" id="rev" data-reveal data-live>
      <div className="wrap grid">
        <div className="gauge-col rv">
          <svg className="gauge" viewBox="0 0 300 300" role="img" aria-label="Rev counter">
            <path className="base" d="M66.56 233.44A118 118 0 1 1 233.44 233.44" />
            <path className="red" d="M265.73 173.02A118 118 0 0 1 233.44 233.44" />
            <path className="fill" pathLength="1" d="M66.56 233.44A118 118 0 1 1 233.44 233.44" />
            <g id="ticks" />
            <text className="rpm" x="150" y="212" id="rpm">0</text>
            <text className="unit" x="150" y="234">RPM</text>
            <g className="needle-idle"><g className="needle"><line x1="150" y1="164" x2="150" y2="80" /></g></g>
            <circle className="hub" cx="150" cy="150" r="13" />
          </svg>
          <button className="start" id="start" type="button">Hold to start</button>
          <p className="mono hint" id="hint" aria-live="polite">Press and hold. Do not let go early.</p>
        </div>
        <div>
          <span className="mono rv"><b>03</b> / Start it up</span>
          <h2 className="display rv" data-split="h" style={{ '--n': '1', marginTop: '16px' }}>The crew code.</h2>
          <p className="lede rv" style={{ '--n': '2', marginTop: '18px' }}>Three lines. Everyone who parks up with us drives by them.</p>
          <ol className="code rv" style={{ '--n': '3' }}>
            <li><span className="no">01</span><div><strong>Respect the road.</strong><span className="t">No racing on public streets. Ever.</span></div></li>
            <li><span className="no">02</span><div><strong>Every build is welcome.</strong><span className="t">Stock, tuned or still in progress.</span></div></li>
            <li><span className="no">03</span><div><strong>Leave the spot clean.</strong><span className="t">We want to be invited back.</span></div></li>
          </ol>
        </div>
      </div>
    </section>
    </>
  );
}
