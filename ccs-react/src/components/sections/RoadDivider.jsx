/* The four lines of the logo drawn as a hairpin. `flip` mirrors it, `maskId` keeps each copy's mask unique. */
export default function RoadDivider({ maskId, flip = false }) {
  return (
    <svg className={flip ? 'road flip' : 'road'} viewBox="0 0 1200 210" aria-hidden="true" data-draw>
      <defs><mask id={maskId} maskUnits="userSpaceOnUse" x="-30" y="0" width="1260" height="210">
        <path className="rl" pathLength="1" d="M-20 40H1010A65 65 0 0 1 1010 170H-20" stroke="#fff" strokeWidth="21" />
        <path className="rl" pathLength="1" d="M-20 40H1010A65 65 0 0 1 1010 170H-20" stroke="#000" strokeWidth="15" />
        <path className="rl" pathLength="1" d="M-20 40H1010A65 65 0 0 1 1010 170H-20" stroke="#fff" strokeWidth="9" />
        <path className="rl" pathLength="1" d="M-20 40H1010A65 65 0 0 1 1010 170H-20" stroke="#000" strokeWidth="3" />
      </mask></defs>
      <rect x="-30" width="1260" height="210" fill="currentColor" mask={`url(#${maskId})`} />
      <g className="chev" transform="translate(1128 105)"><rect x="-17" y="-17" width="34" height="34" rx="4" fill="#ffd21f" /><path d="M5-9-5 0 5 9" fill="none" stroke="#0c1016" strokeWidth="5" /></g>
    </svg>
  );
}
