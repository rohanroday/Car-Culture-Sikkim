export default function Marquee() {
  return (
    <>
    <div className="marquee" data-live aria-hidden="true">
      <div className="track" id="track" />
    </div>
    </>
  );
}
