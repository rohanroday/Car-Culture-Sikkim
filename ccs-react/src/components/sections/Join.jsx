export default function Join() {
  return (
    <>
    {/* 06 join: the one call to action */}
    <section className="join pad" id="join" data-reveal data-live>
      <div className="wrap">
        <div className="panel-box">
          <div className="grid">
            <div>
              <span className="mono rv"><b>06</b> / Join</span>
              <h2 className="display rv" data-split="h" style={{ '--n': '1', marginTop: '16px' }}>Pull up to the next meet.</h2>
              <p className="lede rv" style={{ '--n': '2', marginTop: '18px' }}>Tell us who you are and what you drive. We will take it from there.</p>
            </div>
            <div className="rv" style={{ '--n': '2' }} id="formBox">
              <form id="joinForm" noValidate>
                <div className="field"><label htmlFor="f-name">Your name</label><input id="f-name" name="name" autoComplete="name" placeholder="Tenzing" required /><span className="err" id="e-name" aria-live="polite" /></div>
                <div className="field"><label htmlFor="f-ig">Instagram handle</label><input id="f-ig" name="ig" autoComplete="off" placeholder="@yourhandle" required /><span className="err" id="e-ig" aria-live="polite" /></div>
                <div className="field full"><label htmlFor="f-ride">What do you drive or ride?</label><input id="f-ride" name="ride" autoComplete="off" placeholder="Polo GT, Thar, Duke 390, still saving up" /></div>
                <div className="field full"><label htmlFor="f-why">I want to</label>
                  <select id="f-why" name="why">
                    <option>Come to the next meet</option>
                    <option>Show my build</option>
                    <option>Shoot or film a meet</option>
                    <option>Talk about a brand or shop collab</option>
                  </select>
                </div>
                <button className="btn" type="submit">Write my message <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></button>
                <p className="fine">Nothing is stored here. This writes your message, copies it, and opens our Instagram DMs so you can send it to the crew.</p>
              </form>
              <div className="success" id="success" tabIndex="-1">
                <h3 id="successTitle">Message copied. One tap left.</h3>
                <pre id="msg" />
                <div className="row">
                  <a className="btn" href="https://ig.me/m/car_culture_sikkim_" target="_blank" rel="noopener">Open Instagram DM <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></a>
                  <button className="btn ghost" type="button" id="again">Edit my details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
