export default function AltitudeRail() {
  return (
    <>
    <aside className="altrail" id="altrail" aria-hidden="true">
      <span className="cap"><small>The pass</small>4,310 m</span>
      <div className="scale" id="altScale">
        <i className="line" /><i className="fill" id="railFill" />
        <div className="mark" id="railMark"><span className="tag"><b id="railV">2,900</b> m</span><i className="dot" /></div>
      </div>
      <span className="cap">1,650 m<small>Gangtok</small></span>
    </aside>
    </>
  );
}
