export default function Footer() {
  return (
    <>
    <footer>
      <div className="wrap">
        <div className="top">
          <a className="logo" href="#top" aria-label="Car Culture Sikkim, back to top"><img src="assets/logo.png" width="900" height="378" loading="lazy" decoding="async" alt="CCS" /></a>
          <ul>
            <li><a href="https://www.instagram.com/car_culture_sikkim_/" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="https://msha.ke/carculturesikkim" target="_blank" rel="noopener">Event films</a></li>
            <li><a href="#join">Join the next meet</a></li>
          </ul>
        </div>
        <div className="base">
          <span className="mono">Engine off at 1,650 m. Gangtok, Sikkim.</span>
          <span>Hero film made with AI. Photos: Car Culture Sikkim and Raj Chhetri Photography.</span>
          <span>&copy; <span id="yr">{new Date().getFullYear()}</span> Car Culture Sikkim</span>
        </div>
      </div>
    </footer>
    </>
  );
}
