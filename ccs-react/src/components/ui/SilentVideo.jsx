/* A muted <video>. React sets `muted` only as a property, so this also writes the
   attribute, which keeps the markup the same as hand-written HTML. */
export default function SilentVideo(props) {
  return <video ref={(el) => { if (el) el.setAttribute('muted', ''); }} muted {...props} />;
}
