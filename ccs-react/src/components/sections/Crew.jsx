export default function Crew() {
  return (
    <>
    {/* 04 the crew */}
    <section className="crew pad" id="crew" data-reveal>
      <div className="wrap grid">
        <div className="collage rv">
          <figure className="a"><img src="assets/crew-2.jpg" width="1094" height="730" loading="lazy" decoding="async" alt="Four CCS crew members in black CCS tees with a cruiser motorcycle and a 4x4 in a garage" /></figure>
          <figure className="b"><img src="assets/crew-1.jpg" width="1094" height="730" loading="lazy" decoding="async" alt="Two CCS crew members sitting on the bonnet of an SUV in black CCS tees" /></figure>
        </div>
        <div>
          <span className="mono rv"><b>04</b> / The crew</span>
          <h2 className="display rv" data-split="h" style={{ '--n': '1', marginTop: '16px' }}>The people behind the wheel.</h2>
          <p className="lede rv" style={{ '--n': '2', marginTop: '18px' }}>CCS runs on its crew. Drivers, tuners, riders and the ones holding the camera. Spot the black tee at any meet and say hello.</p>
          <div className="merch rv" style={{ '--n': '3' }}>
            <div><strong>Shirts restocked</strong><span>The CCS tee is back. DM us to grab one.</span></div>
            <a className="btn ghost" href="https://www.instagram.com/car_culture_sikkim_/" target="_blank" rel="noopener">See it on Instagram</a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
