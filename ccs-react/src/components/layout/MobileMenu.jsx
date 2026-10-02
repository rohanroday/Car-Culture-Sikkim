export default function MobileMenu() {
  return (
    <>
    <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
      <ul>
        <li><a href="#culture" style={{ '--n': '0' }}><i>01</i>The culture</a></li>
        <li><a href="#drives" style={{ '--n': '1' }}><i>02</i>The drives</a></li>
        <li><a href="#rev" style={{ '--n': '2' }}><i>03</i>Start it up</a></li>
        <li><a href="#crew" style={{ '--n': '3' }}><i>04</i>The crew</a></li>
        <li><a href="#faq" style={{ '--n': '4' }}><i>05</i>Questions</a></li>
        <li><a href="#join" style={{ '--n': '5' }}><i>06</i>Join the next meet</a></li>
      </ul>
      <div className="foot">
        <a className="btn ghost" href="https://www.instagram.com/car_culture_sikkim_/" target="_blank" rel="noopener">Instagram</a>
        <span className="mono">Gangtok, Sikkim</span>
      </div>
    </div>
    </>
  );
}
