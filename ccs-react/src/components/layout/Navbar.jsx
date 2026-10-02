export default function Navbar() {
  return (
    <>
    <nav className="nav" id="nav" aria-label="Main">
      <a className="logo" href="#top" aria-label="Car Culture Sikkim, back to top"><img src="assets/logo.png" width="900" height="378" alt="CCS" /></a>
      <ul id="navLinks">
        <li><a href="#culture">The culture</a></li>
        <li><a href="#drives">Drives</a></li>
        <li><a href="#crew">Crew</a></li>
        <li><a href="#faq">Questions</a></li>
        <li className="nav-ind" id="navInd" aria-hidden="true"></li>
      </ul>
      <a className="btn" href="#join">Join the next meet</a>
      <div className="alt" aria-hidden="true"><span className="alt-bar"><i id="altFill" /></span><span className="alt-txt"><small>Altitude</small><b><i id="altv">2,900</i> m</b></span></div>
      <button className="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span /><span /></button>
    </nav>
    </>
  );
}
