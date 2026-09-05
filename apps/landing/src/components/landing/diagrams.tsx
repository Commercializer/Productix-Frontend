export function NetworkDiagram({ className = "" }: { className?: string }) {
  const nodes = [
    [24, 12],
    [50, 30],
    [12, 44],
    [40, 56],
    [58, 14],
  ];
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none">
      {nodes.slice(1).map((n, i) => (
        <line
          key={i}
          x1={nodes[0]?.[0]}
          y1={nodes[0]?.[1]}
          x2={n[0]}
          y2={n[1]}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n[0]}
          cy={n[1]}
          r={i === 0 ? 5 : 3.2}
          fill={i === 0 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}

export function CubeDiagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M35 8 L60 21 V47 L35 60 L10 47 V21 Z" />
      <path d="M10 21 L35 34 L60 21" />
      <path d="M35 34 V60" />
    </svg>
  );
}

export function ConcentricDiagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="35" cy="35" r="26" opacity="0.35" />
      <circle cx="35" cy="35" r="17" opacity="0.6" />
      <circle cx="35" cy="35" r="8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VennDiagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="28" cy="32" r="18" />
      <circle cx="44" cy="40" r="18" opacity="0.6" />
    </svg>
  );
}
