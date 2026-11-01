/**
 * Three faint guide lines behind everything: a centre vertical, and two
 * diagonals from just under the top corners meeting it at the bottom centre.
 */
export default function GuideLines() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      <g stroke="var(--color-hairline)" strokeWidth="1" fill="none">
        <line x1="50" y1="0" x2="50" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="2" y1="4.3" x2="50" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="98" y1="4.3" x2="50" y2="100" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
